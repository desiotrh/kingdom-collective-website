import { CaseEvent, TimelineExportOptions } from '../case-timeline';

export function generateICSContent(events: CaseEvent[], options: TimelineExportOptions): string {
  const now = new Date().toISOString();
  
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kingdom Stand//Legal Case Timeline//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `DTSTAMP:${formatDateForICS(now)}`,
    ''
  ];

  // Filter events based on options
  let filteredEvents = events;
  
  if (options.dateRange) {
    filteredEvents = filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      const startDate = new Date(options.dateRange!.start);
      const endDate = new Date(options.dateRange!.end);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  if (!options.includeCompleted) {
    filteredEvents = filteredEvents.filter(event => !event.completed);
  }

  // Generate event entries
  filteredEvents.forEach(event => {
    ics.push(...generateEventICS(event, options.includeReminders));
  });

  ics.push('END:VCALENDAR');
  
  return ics.join('\r\n');
}

function generateEventICS(event: CaseEvent, includeReminders: boolean): string[] {
  const ics = [];
  
  // Event start
  ics.push('BEGIN:VEVENT');
  
  // Unique identifier
  ics.push(`UID:${event.id}@kingdomstand.com`);
  
  // Summary (title)
  ics.push(`SUMMARY:${escapeICSValue(event.title)}`);
  
  // Description
  if (event.description) {
    ics.push(`DESCRIPTION:${escapeICSValue(event.description)}`);
  }
  
  // Date and time
  const eventDate = new Date(event.date);
  if (event.time) {
    // Event with specific time
    const [hours, minutes] = event.time.split(':');
    eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    ics.push(`DTSTART:${formatDateForICS(eventDate.toISOString())}`);
    
    // End time (default to 1 hour duration)
    const endDate = new Date(eventDate);
    endDate.setHours(endDate.getHours() + 1);
    ics.push(`DTEND:${formatDateForICS(endDate.toISOString())}`);
  } else {
    // All-day event
    ics.push(`DTSTART;VALUE=DATE:${formatDateForICS(event.date, true)}`);
  }
  
  // Location
  if (event.location) {
    ics.push(`LOCATION:${escapeICSValue(event.location)}`);
  }
  
  // Priority (convert to ICS priority 1-9)
  const priority = convertPriorityToICS(event.priority);
  ics.push(`PRIORITY:${priority}`);
  
  // Categories/tags
  if (event.tags.length > 0) {
    ics.push(`CATEGORIES:${event.tags.join(',')}`);
  }
  
  // Status
  if (event.completed) {
    ics.push('STATUS:COMPLETED');
  }
  
  // Created and modified dates
  ics.push(`CREATED:${formatDateForICS(event.createdAt)}`);
  ics.push(`LAST-MODIFIED:${formatDateForICS(event.updatedAt)}`);
  
  // Reminders (alarms)
  if (includeReminders && event.reminders.length > 0) {
    event.reminders.forEach(reminder => {
      ics.push(...generateReminderICS(reminder, eventDate));
    });
  }
  
  ics.push('END:VEVENT');
  
  return ics;
}

function generateReminderICS(reminder: any, eventDate: Date): string[] {
  const alarmDate = new Date(eventDate);
  alarmDate.setMinutes(alarmDate.getMinutes() - reminder.timeBeforeEvent);
  
  return [
    'BEGIN:VALARM',
    `TRIGGER:-PT${reminder.timeBeforeEvent}M`,
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeICSValue('Case deadline reminder')}`,
    'END:VALARM'
  ];
}

function formatDateForICS(dateString: string, dateOnly: boolean = false): string {
  const date = new Date(dateString);
  
  if (dateOnly) {
    // Format as YYYYMMDD for all-day events
    return date.getFullYear().toString() +
           (date.getMonth() + 1).toString().padStart(2, '0') +
           date.getDate().toString().padStart(2, '0');
  } else {
    // Format as YYYYMMDDTHHMMSSZ for timed events
    return date.getFullYear().toString() +
           (date.getMonth() + 1).toString().padStart(2, '0') +
           date.getDate().toString().padStart(2, '0') + 'T' +
           date.getHours().toString().padStart(2, '0') +
           date.getMinutes().toString().padStart(2, '0') +
           date.getSeconds().toString().padStart(2, '0') + 'Z';
  }
}

function escapeICSValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

function convertPriorityToICS(priority: string): number {
  switch (priority) {
    case 'critical': return 1;
    case 'high': return 3;
    case 'medium': return 5;
    case 'low': return 7;
    default: return 5;
  }
}

export function downloadICSFile(icsContent: string, filename: string = 'case-timeline.ics'): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
