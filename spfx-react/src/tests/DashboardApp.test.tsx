/* eslint-disable @typescript-eslint/no-explicit-any */
describe('Dashboard', () => {
    let events: any = []

    /* Function tests: */
    function getEvents(events: any[]): any {
      console.log('Events: ', events)
      /* Dashboard displays the upcoming and recent events */

      /* Get today's date */
      const today = new Date().getTime();

      /* Filtered list of 3 events max. past today's date */
      let eventsBefore = events.filter((event: any) => new Date(event.StartDate).getTime() < today);
      console.log('EB before slice is...', eventsBefore)
      eventsBefore = eventsBefore.slice(0, 3)

      /* Filtered list of 3 events max. after today's date */
      let eventsAfter: any = events.filter((event: any) => !(new Date(event.StartDate).getTime() < today));
      console.log('Before EA: ', eventsAfter)
      eventsAfter = eventsAfter.slice((eventsAfter.length - 3), eventsAfter.length)

      /* Format the dates of the recent and upcoming events */
      for (let i = 0; i < eventsBefore.length; i++) {
        eventsBefore[i].StartDate = new Date(eventsBefore[i].StartDate)
      }
      for (let i = 0; i < eventsAfter.length; i++) {
        eventsAfter[i].StartDate = new Date(eventsAfter[i].StartDate)
      }

      console.log('EB, EA, ', eventsBefore, eventsAfter)
      return [eventsBefore, eventsAfter]
    }

    interface Event {
      StartDate: any,
      EndDate: any
    }
  
    beforeEach(() => {
      events = []
    });

    it('Confirm length of no events', () => {
      const recentEvents = getEvents([])[0]
      const upcomingEvents = getEvents([])[1]
      expect(recentEvents.length).toBe(0)
      expect(upcomingEvents.length).toBe(0)
    });


    it('Confirm length of recent and upcoming events: non-empty list of events', () => {

      /* Create test events with start dates before and after the current date */
      function randomDate(start: any, end: any): any {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      }

      const currentYear = new Date().getFullYear();

      const E1: Event = {
        StartDate: randomDate(new Date(2018, 0, 1), new Date()),
        EndDate: randomDate(new Date(2018, 0, 1), new Date())
      }

      const E2: Event = {
        StartDate: randomDate(new Date(2018, 0, 1), new Date()),
        EndDate: randomDate(new Date(2018, 0, 1), new Date())
      }
      const E3: Event = {
        StartDate: randomDate(new Date(2018, 0, 1), new Date()),
        EndDate: randomDate(new Date(2018, 0, 1), new Date())
      }
      const E4: Event = {
        StartDate: randomDate(new Date(2018, 0, 1), new Date()),
        EndDate:randomDate(new Date(2018, 0, 1), new Date())
      }
      const E5: Event = {
        StartDate: randomDate(new Date(currentYear + 1, 0, 1), new Date()),
        EndDate: randomDate(new Date(currentYear + 1, 0, 1), new Date())
      }
      const E6: Event = {
        StartDate: randomDate(new Date(currentYear + 1, 0, 1), new Date()),
        EndDate: randomDate(new Date(currentYear + 1, 0, 1), new Date())
      }
      const E7: Event = {
        StartDate: randomDate(new Date(currentYear + 1, 0, 1), new Date()),
        EndDate: randomDate(new Date(currentYear + 1, 0, 1), new Date())
      }
      const E8: Event = {
        StartDate: randomDate(new Date(currentYear + 1, 0, 1), new Date()),
        EndDate: randomDate(new Date(currentYear + 1, 0, 1), new Date())
      }

      /* Push test events into 'events */
      events.push(E1)
      events.push(E2)
      events.push(E3)
      events.push(E4)
      events.push(E5)
      events.push(E6)
      events.push(E7)
      events.push(E8)
  
      const displayedEvents = getEvents(events)
      const recentEvents = displayedEvents[0]
      const upcomingEvents = displayedEvents[1]

      expect(recentEvents.length).toBe(3)
      expect(upcomingEvents.length).toBe(3)
    });
  });
  