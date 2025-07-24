
import { useComprehensiveActivityLogger } from './useComprehensiveActivityLogger';

export function useCalendarActivityTracking() {
  const { logCalendarActivity } = useComprehensiveActivityLogger();

  const trackEventCreated = (eventTitle: string, eventDate: string, eventId?: string) => {
    logCalendarActivity(
      'event_created',
      `Created calendar event "${eventTitle}" for ${eventDate}`,
      eventId,
      {
        eventTitle,
        eventDate
      }
    );
  };

  const trackEventUpdated = (eventTitle: string, eventDate: string, eventId?: string, changedFields: string[] = []) => {
    logCalendarActivity(
      'event_updated',
      `Updated calendar event "${eventTitle}" - Modified: ${changedFields.join(', ')}`,
      eventId,
      {
        eventTitle,
        eventDate,
        changedFields
      }
    );
  };

  const trackEventDeleted = (eventTitle: string, eventDate: string, eventId?: string) => {
    logCalendarActivity(
      'event_deleted',
      `Deleted calendar event "${eventTitle}" (${eventDate})`,
      eventId,
      {
        eventTitle,
        eventDate
      }
    );
  };

  const trackEventCompleted = (eventTitle: string, eventId?: string) => {
    logCalendarActivity(
      'event_completed',
      `Completed calendar event "${eventTitle}"`,
      eventId,
      {
        eventTitle
      }
    );
  };

  const trackEventRescheduled = (eventTitle: string, oldDate: string, newDate: string, eventId?: string) => {
    logCalendarActivity(
      'event_rescheduled',
      `Rescheduled "${eventTitle}" from ${oldDate} to ${newDate}`,
      eventId,
      {
        eventTitle,
        oldDate,
        newDate
      }
    );
  };

  return {
    trackEventCreated,
    trackEventUpdated,
    trackEventDeleted,
    trackEventCompleted,
    trackEventRescheduled
  };
}
