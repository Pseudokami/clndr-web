// src/components/Calendar.jsx
import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'; // must before plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // needed for interaction
import timeGridPlugin from '@fullcalendar/timegrid';
import { supabase } from '../supabase';


export default function Calendar({ username }) {
  const [events, setEvents] = useState([]);


  const [isEditable, setIsEditable] = useState(false);
  const calendarRef = useRef(null);
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [popupMessage, setPopupMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
  const fetchEvents = async () => {
    if (username === 'Guest') {
      setEvents([]);
      return;
    }
    const { data, error } = await supabase
      .from('events')
      .select()
      .eq('username', username);

    if (error) {
      console.error('Failed to fetch events:', error);
    } else {
      // Ensure allDay is included or fallback to guessing
      const processedEvents = data.map((event) => ({
        ...event,
        allDay: event.allDay ?? event.date.endsWith('T00:00:00Z')
      }));

      setEvents(processedEvents);
    }
  };

  fetchEvents();
}, [username]);


  const MAY_2025_START = new Date('2025-05-01T00:00:00');
  const MAY_2025_END = new Date('2025-05-31T23:59:59');

  // Add event on date click
  const handleDateClick = async (arg) => {
  if (!isEditable || username === 'Guest') return;

  const title = prompt('Enter event title:');
  if (title) {
    const isTimedView = currentView === 'timeGridWeek' || currentView === 'timeGridDay';

    const newEvent = {
      title,
      date: arg.date.toISOString(),   // saves full ISO string with time
      username,
      allDay: !isTimedView            // true for month view, false for week/day views
    };

    const { data, error } = await supabase.from('events').insert(newEvent).select();

    if (error) {
      console.error('Insert error:', error);
      alert('Failed to save event: ' + error.message);
    } else {
      console.log('Insert success:', data);
      setEvents([...events, { ...newEvent, id: data[0].id }]);
    }
  }
};


  // Remove event on event click (confirm before deleting)
  const handleEventClick = async (clickInfo) => {
    if (!isEditable || username === 'Guest') return;

    if (
      window.confirm(
        `Delete event '${clickInfo.event.title}' on ${clickInfo.event.startStr}?`
      )
    ) {
      const id = clickInfo.event.id;

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Failed to delete event');
        console.error(error);
      } else {
        setEvents(events.filter((e) => e.id !== id));
      }
    }
  };

    const toggleEditable = () => {
    const newState = !isEditable;
    setIsEditable(newState);

    const message = newState ? 'Calendar is now editable' : 'Calendar is now locked';
    setPopupMessage(message);
    setShowPopup(true);

    // Hide popup after 2.5 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 2500);
  };

  const handleCustomPrevDay = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate();
      const prevDay = new Date(currentDate);
      prevDay.setDate(currentDate.getDate() - 1);

      // Limits previous day to May 1st
      if (prevDay >= MAY_2025_START) {
        calendarApi.gotoDate(prevDay);
      } else {
        alert("Cannot go before May 1, 2025.");
      }
    }
  };

  const handleCustomNextDay = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate();
      const nextDay = new Date(currentDate);
      nextDay.setDate(currentDate.getDate() + 1);

      // Limits next day to May 31st
      if (nextDay <= MAY_2025_END) {
        calendarApi.gotoDate(nextDay);
      } else {
        alert("Cannot go beyond May 31, 2025.");
      }
    }
  };

  // Handler for going to the previous week (constrained to May 2025)
  const handleCustomPrevWeek = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate();
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(currentDate.getDate() - 7); // Go back one week

      // Ensures the target date (prevWeek) is not before May 1st
      if (prevWeek >= MAY_2025_START) {
        calendarApi.gotoDate(prevWeek);
      } else {
        alert("Cannot go before May 1, 2025.");
      }
    }
  };

  // Handler for going to the next week (constrained to May 2025)
  const handleCustomNextWeek = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate();
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(currentDate.getDate() + 7); // Go forward one week

      // Ensures the target date (nextWeek) is not after May 31st
      if (nextWeek <= MAY_2025_END) {
        calendarApi.gotoDate(nextWeek);
      } else {
        alert("Cannot go beyond May 31, 2025.");
      }
    }
  };

  const rightToolbarContent =
    currentView === 'timeGridDay'
      ? 'customPrevDay,customNextDay'
      : currentView === 'timeGridWeek'
      ? 'customPrevWeek,customNextWeek'
      : '';

  return (
    <>
      <div className="calendar-container">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate="2025-05-01"
          fixedWeekCount={true}
          headerToolbar={{
            left: 'title',
            center: 'dayGridMonth,timeGridWeek,timeGridDay',
            right: rightToolbarContent
          }}
          customButtons={{
            customPrevDay: {
              text: '<',
              click: handleCustomPrevDay,
            },
            customNextDay: {
              text: '>',
              click: handleCustomNextDay,
            },
            customPrevWeek: {
              text: '<',
              click: handleCustomPrevWeek,
            },
            customNextWeek: {
              text: '>',
              click: handleCustomNextWeek,
            },
          }}
          height="695px"
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          scrollTime="08:00:00"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          selectable={true}
          editable={isEditable}
          datesSet={(info) => {
            setCurrentView(info.view.type);
          }}
          dayHeaderContent={(args) => {
            if (args.view.type === 'timeGridWeek' || args.view.type === 'timeGridDay') {
              return (
                <div className="fc-custom-header">
                  <div className="fc-header-weekday">
                    {args.date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="fc-header-day">
                    {args.date.getDate()}
                  </div>
                </div>
              );
            }
            return args.date.toLocaleDateString('en-US', { weekday: 'short' });
          }}
        />
      </div>

      <div className="edit-button-container">
        <button onClick={toggleEditable}>
          <i className="fa-solid fa-pen-to-square"></i>Edit
        </button>
      </div>
      
      {showPopup && (
        <div className="calendar-popup">
          {popupMessage}
        </div>
      )}
    </>
  );
}