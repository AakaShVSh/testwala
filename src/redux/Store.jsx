import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { userTestDataReducer } from "./userTestData/userTestDataReducer";
import { signupReducer } from "./signUp/signup_Reducer";
import { signInReducer } from "./signIn/signInReducer";
import { forgotPasswordReducer } from "./forgotPassword/forgotPasswordReducer";

const rootReducer = combineReducers({
  userTestDataReducer: userTestDataReducer,
  signupReducer: signupReducer,
  signInReducer:signInReducer,
  forgotPasswordReducer:forgotPasswordReducer
});

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
