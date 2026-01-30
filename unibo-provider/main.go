package main

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"
	_ "time/tzdata"

	"github.com/cartabinaria/unibo-go/ckan"
	"github.com/cartabinaria/unibo-go/timetable"

	"github.com/gin-gonic/gin"
	"github.com/patrickmn/go-cache"

	"github.com/VaiTon/unibocalendar/unibo_integ"
)

const (
	openDataUrl   = "https://dati.unibo.it"
	packageId     = "degree-programmes"
	resourceAlias = "corsi_latest_it"
)

type ActivityCache struct {
	sync.RWMutex
	Data map[string]map[string][]ActivityResponse
}

var (
	courseStore = cache.New(24*time.Hour, 1*time.Hour)

	activityStore = ActivityCache{
		Data: make(map[string]map[string][]ActivityResponse),
	}

	concurrencyLimit = make(chan struct{}, 20)

	romeLocation, _ = time.LoadLocation("Europe/Rome")
)

type RoomResponse struct {
	RoomCode string `json:"room_code"`
	Address  string `json:"address"`
}

type ActivityResponse struct {
	Title      string   `json:"title"`
	Start      string   `json:"start"`
	End        string   `json:"end"`
	RoomCode   string   `json:"room_code"`
	Professors []string `json:"professors"`
	CourseId   string   `json:"course_id"`
}

func main() {
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	api := r.Group("/api/v1")
	{
		api.GET("/rooms-discovery", getRoomsDiscoveryHandler)
		api.GET("/activities", getActivitiesHandler)
	}

	go func() {
		performDailyUpdate()
	}()

	go func() {
		for {
			now := time.Now()
			nextRun := time.Date(now.Year(), now.Month(), now.Day(), 4, 0, 0, 0, now.Location())
			if nextRun.Before(now) {
				nextRun = nextRun.Add(24 * time.Hour)
			}
			time.Sleep(nextRun.Sub(now))
			performDailyUpdate()
		}
	}()

	err := r.Run(":8080")
	if err != nil {
		return
	}
}

func getRoomsDiscoveryHandler(c *gin.Context) {
	campus := c.Query("campus")
	dateStr := c.Query("date")

	if campus == "" || dateStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "campus and date parameters are required"})
		return
	}

	startDate, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date format, use YYYY-MM-DD"})
		return
	}

	courses, err := getCourses()
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "failed to fetch courses"})
		return
	}

	endDate := startDate.Add(28 * 24 * time.Hour)
	interval := &timetable.Interval{Start: startDate, End: endDate}

	uniqueRooms := make(map[string]RoomResponse)

	for _, course := range courses {
		if !strings.Contains(strings.ToLower(course.Campus), strings.ToLower(campus)) {
			continue
		}

		curricula, err := course.GetAllCurricula()
		if err != nil {
			continue
		}

		for year, currList := range curricula {
			for _, curr := range currList {
				tt, err := course.GetTimetable(year, curr, interval)
				if err != nil {
					continue
				}

				for _, event := range tt {
					if len(event.Classrooms) == 0 {
						continue
					}

					for _, room := range event.Classrooms {
						if _, exists := uniqueRooms[room.ResourceDesc]; !exists {
							uniqueRooms[room.ResourceDesc] = RoomResponse{
								RoomCode: room.ResourceDesc,
								Address:  room.AddressDesc,
							}
						}
					}
				}
			}
		}
	}

	var results []RoomResponse
	for _, r := range uniqueRooms {
		results = append(results, r)
	}

	c.JSON(http.StatusOK, results)
}

func getActivitiesHandler(c *gin.Context) {
	campus := c.Query("campus")
	dateStr := c.Query("date")

	if campus == "" || dateStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "campus and date parameters are required"})
		return
	}

	targetDate, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date format, use YYYY-MM-DD"})
		return
	}

	activityStore.RLock()
	campusCache, okCampus := activityStore.Data[campus]
	var activities []ActivityResponse
	var okDate bool
	if okCampus {
		activities, okDate = campusCache[dateStr]
	}
	activityStore.RUnlock()
	if okCampus && okDate {
		c.JSON(http.StatusOK, activities)
		return
	}

	if err := updateCacheForInterval(campus, targetDate, 2); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch activities"})
		return
	}

	activityStore.RLock()
	if activityStore.Data[campus] != nil {
		activities = activityStore.Data[campus][dateStr]
	}
	activityStore.RUnlock()

	if activities == nil {
		activities = []ActivityResponse{}
	}

	c.JSON(http.StatusOK, activities)
}

func getCourses() ([]unibo_integ.Course, error) {
	if x, found := courseStore.Get("courses"); found {
		return x.([]unibo_integ.Course), nil
	}

	client := ckan.NewClient(openDataUrl)
	pack, err := client.GetPackage(packageId)
	if err != nil {
		return nil, err
	}

	resource, found := ckan.GetByAlias(pack.Resources, resourceAlias)
	if !found {
		return nil, fmt.Errorf("resource not found")
	}

	courses, err := unibo_integ.DownloadResource(resource)
	if err != nil {
		return nil, err
	}

	actualYear := time.Now().Year()
	prevYear := actualYear - 1

	strActual := strconv.Itoa(actualYear)
	strPrev := strconv.Itoa(prevYear)

	var activeCourses []unibo_integ.Course
	for _, c := range courses {
		if strings.Contains(c.AnnoAccademico, strActual) || strings.Contains(c.AnnoAccademico, strPrev) {
			activeCourses = append(activeCourses, c)
		}
	}

	courseStore.Set("courses", activeCourses, cache.DefaultExpiration)
	return activeCourses, nil
}

func performDailyUpdate() {
	courses, err := getCourses()
	if err != nil {
		fmt.Printf("Error fetching courses for daily update: %v\n", err)
		return
	}
	if len(courses) == 0 {
		return
	}

	campusSet := make(map[string]bool)
	for _, c := range courses {
		if c.Campus != "" {
			campusSet[strings.ToLower(c.Campus)] = true
		}
	}

	today := time.Now()
	var wg sync.WaitGroup

	for campus := range campusSet {
		wg.Add(1)
		go func(camp string) {
			defer wg.Done()
			err := updateCacheForInterval(camp, today, 2)
			if err != nil {
				fmt.Printf("Error updating cache for campus %s: %v\n", camp, err)
				return
			}
		}(campus)
	}
	wg.Wait()
}

func updateCacheForInterval(campusFilter string, startDate time.Time, days int) error {
	allCourses, err := getCourses()
	if err != nil {
		return err
	}

	var targetCourses []unibo_integ.Course
	for _, c := range allCourses {
		if strings.Contains(strings.ToLower(c.Campus), strings.ToLower(campusFilter)) {
			targetCourses = append(targetCourses, c)
		}
	}

	startInterval := time.Date(startDate.Year(), startDate.Month(), startDate.Day(), 0, 0, 0, 0, time.Local)
	endInterval := startInterval.Add(time.Duration(days) * 24 * time.Hour)
	interval := &timetable.Interval{Start: startInterval, End: endInterval}

	tempResults := make(map[string][]ActivityResponse)
	var mutex sync.Mutex
	var wg sync.WaitGroup

	for _, course := range targetCourses {
		wg.Add(1)
		go func(c unibo_integ.Course) {
			defer wg.Done()
			concurrencyLimit <- struct{}{}
			defer func() { <-concurrencyLimit }()

			curricula, err := c.GetAllCurricula()
			if err != nil {
				fmt.Printf("Error fetching curricula for course %d: %v\n", c.Codice, err)
				return
			}

			for year, currList := range curricula {
				for _, curr := range currList {
					tt, err := c.GetTimetable(year, curr, interval)
					if err != nil {
						fmt.Printf("Error fetching timetable for course %d, year %d, curriculum %v: %v\n", c.Codice, year, curr, err)
						continue
					}

					for _, event := range tt {
						if len(event.Classrooms) == 0 {
							continue
						}

						for _, room := range event.Classrooms {
							dto := ActivityResponse{
								Title:      event.Title,
								Start:      event.Start.Format(time.RFC3339),
								End:        event.End.Format(time.RFC3339),
								RoomCode:   room.ResourceDesc,
								Professors: []string{event.Teacher},
								CourseId:   strconv.Itoa(c.Codice),
							}

							eventDateKey := event.Start.Format("2006-01-02")

							mutex.Lock()
							tempResults[eventDateKey] = append(tempResults[eventDateKey], dto)
							mutex.Unlock()
						}
					}
				}
			}
		}(course)
	}

	wg.Wait()

	activityStore.Lock()
	defer activityStore.Unlock()

	if activityStore.Data[campusFilter] == nil {
		activityStore.Data[campusFilter] = make(map[string][]ActivityResponse)
	}

	current := startInterval
	for current.Before(endInterval) {
		dayKey := current.Format("2006-01-02")

		if val, exists := tempResults[dayKey]; exists {
			activityStore.Data[campusFilter][dayKey] = val
		} else {
			activityStore.Data[campusFilter][dayKey] = []ActivityResponse{}
		}
		current = current.Add(24 * time.Hour)
	}

	return nil
}
