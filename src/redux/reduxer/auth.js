// import { USERAUTH } from "../action";

// const initialState = {
//   authLoading: true,
//   access: false,
//   user: null,
//   loggedIn: true,
//   splash: false,
//   loading: false,
// };
// export const authReducer = (state = initialState, action) => {

//   switch (action.type) {
//     case USERAUTH.USERAUTH:
//       return {
//         ...state,
//         user: action.payload,
//         access: true,
//       };
//     case USERAUTH.USERAUTHGLOBAL:
//       return {
//         ...state,
//         ...action.payload,
//       };
//   }
//   return state;
// };
import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authLoading: true,
    access: false,
    user: null,
    loggedIn: true,
    splash: true,
    loading: false,
  },
  reducers: {
    authUserReducers: (state, action) => {
      state.user = action.payload
      state.access = true
      state.splash = false
    },
    authUserSplaceFalse: state => {
      state.splash = false
    },
    authUserButtonTrue: state => {
      state.loading = true
    },
    authUserButtonFalse: state => {
      state.loading = false
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { authUserReducers, authUserButtonTrue, authUserButtonFalse, authUserSplaceFalse } = authSlice.actions

export default authSlice.reducer