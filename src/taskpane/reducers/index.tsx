import { combineReducers } from 'redux'
import navMenu from './navMenu'
import charConverter from "./charConverter";
import pageFormat from "./pageFormat";

export default combineReducers({
    navMenu,
    charConverter,
    pageFormat,
})
