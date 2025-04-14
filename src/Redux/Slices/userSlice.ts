import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface User {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface UserState {
  users: User[];
  currentUser: User | null;
  rememberMe: boolean;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  rememberMe: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: state => {
      state.currentUser = null;
    },
    setRememberMe: (state, action: PayloadAction<boolean>) => {
      state.rememberMe = action.payload;
    },
  },
});

export const {addUser, setCurrentUser, clearCurrentUser, setRememberMe} =
  userSlice.actions;

export default userSlice.reducer;
