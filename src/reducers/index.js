import array from "./array";
import comparison from "./comparison";
import {combineReducers} from "redux";

const reducers = combineReducers({
    array,
    comparison
});

export default reducers;