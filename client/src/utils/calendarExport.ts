import type { Plan } from "../stores/plan.store.ts";
type Slots = Plan["slots"];

export function downloadCalendarFile(slots: Slots) {
  let calendarContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AlmaSpot//Student Plan//IT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  slots.forEach((slot) => {
    const start = slot.from.replace(/[-:]/g, "").split(".")[0];
    const end = slot.to.replace(/[-:]/g, "").split(".")[0];

    const event = [
      "BEGIN:VEVENT",
      `SUMMARY:Studio in ${slot.name}`,
      `DESCRIPTION:Piano studio nel Campus di ${slot.campus}`,
      `LOCATION:${slot.address}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"}`,
      "UID:" + crypto.randomUUID(),
      "STATUS:CONFIRMED",
      "END:VEVENT",
    ];
    calendarContent = calendarContent.concat(event);
  });

  calendarContent.push("END:VCALENDAR");
  const fileContent = calendarContent.join("\r\n");
  const blob = new Blob([fileContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "almaspot_plan.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
