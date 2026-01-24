package main

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

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

var store = cache.New(24*time.Hour, 48*time.Hour)

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
	r := gin.Default()

	r.GET("/api/v1/rooms-discovery", getRoomsDiscoveryHandler)
	r.GET("/api/v1/activities", getActivitiesHandler)

	fmt.Println("Unibo Provider listening on :8080")

	go func() {
		if _, err := getCourses(); err != nil {
			fmt.Printf("Failed to pre-fetch: %v\n\n", err)
		} else {
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

	courses, err := getCourses()
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "failed to fetch courses"})
		return
	}

	startOfDay := time.Date(targetDate.Year(), targetDate.Month(), targetDate.Day(), 0, 0, 0, 0, time.Local)
	endOfDay := startOfDay.Add(24 * time.Hour)
	interval := &timetable.Interval{Start: startOfDay, End: endOfDay}

	var results []ActivityResponse

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
						results = append(results, ActivityResponse{
							Title:      event.Title,
							Start:      event.Start.Format(time.RFC3339),
							End:        event.End.Format(time.RFC3339),
							RoomCode:   room.ResourceDesc,
							Professors: []string{event.Teacher},
							CourseId:   strconv.Itoa(course.Codice),
						})
					}
				}
			}
		}
	}
	c.JSON(http.StatusOK, results)
}

func getCourses() ([]unibo_integ.Course, error) {
	if x, found := store.Get("courses"); found {
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

	store.Set("courses", activeCourses, cache.DefaultExpiration)
	return activeCourses, nil
}
