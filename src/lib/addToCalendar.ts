import { saveAs } from "file-saver";

export function addToCalendar(event: {
  name: string;
  location: string;
  startDate: string;
  endDate: string;
}) {
  const start = new Date(event.startDate).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = new Date(event.endDate).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NFCtron//Event//EN
BEGIN:VEVENT
UID:${new Date().getTime()}@nfctron.com
DTSTAMP:${start}
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.name}
LOCATION:${event.location}
DESCRIPTION:Přidej si tuto akci do svého kalendáře!
END:VEVENT
END:VCALENDAR
  `.trim();

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  saveAs(blob, `${event.name.replace(/\s+/g, "_")}.ics`);
}
