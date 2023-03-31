// import { createStore, applyMiddleware } from "redux";
// import thunk from "redux-thunk";
// import reducer from "./root.reduxer";

// const store = createStore(reducer, applyMiddleware(thunk));

// export default store;

import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from './reduxer/auth'

const store = configureStore({
  reducer: {
    auth:authSlice.reducer
  }
})

export default store