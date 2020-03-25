import { CHANGE_PAGE_SIZE, CHANGE_ORIENTATION, TOGGLE_AUTO_INIT_PRINT_AREA, CHANGE_BLACK_ANĐ_WHITE } from "../constants/actions";
const INITIAL_STATE = {
    pageSize: "a4",
    orientation: "portrait",
    autoInit: false,
    blackAndWhite: true
};

const pageFormat = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TOGGLE_AUTO_INIT_PRINT_AREA:
            return {
                ...state,
                autoInit: action.autoInit,
            }
        case CHANGE_PAGE_SIZE:
            return {
                ...state,
                pageSize: action.pageSize,
            }
        case CHANGE_ORIENTATION:
            return {
                ...state,
                orientation: action.orientation,
            }
        case CHANGE_BLACK_ANĐ_WHITE:
            return {
                ...state,
                blackAndWhite: action.blackAndWhite,
            }
        default:
            return state
    }
}

export default pageFormat