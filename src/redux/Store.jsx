import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { userTestDataReducer } from "./userTestData/userTestDataReducer";
import { signupReducer } from "./signUp/signup_Reducer";

const rootReducer = combineReducers({
  userTestDataReducer: userTestDataReducer,
  signupReducer: signupReducer,
});

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
