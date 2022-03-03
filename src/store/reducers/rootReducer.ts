import { combineReducers } from "redux";
import authReducer, { AuthState } from "./authReducer";

export interface RootState {
  authState: AuthState;
}

const rootReducer = combineReducers({
  authState: authReducer,
});

export default rootReducer;
