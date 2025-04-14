import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Event} from '../../types/event';
interface EventState {
  events: Event[];
  filter: string;
}

const initialState: EventState = {
  events: [],
  filter: 'Today',
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent(state, action: PayloadAction<Event>) {
      state.events.push(action.payload);
    },
    deleteEvent(state, action: PayloadAction<string>) {
      state.events = state.events.filter(e => e.id !== action.payload);
    },
    updateEvent(state, action: PayloadAction<Event>) {
      const index = state.events.findIndex(e => e.id === action.payload.id);
      if (index !== -1) state.events[index] = action.payload;
    },
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
    },
  },
});

export const {addEvent, deleteEvent, updateEvent, setFilter} =
  eventSlice.actions;
export default eventSlice.reducer;
