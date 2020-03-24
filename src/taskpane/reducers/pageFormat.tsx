import { TOGGLE_AUTO_INIT_PRINT_AREA } from "../constants/actions";
const INITIAL_STATE = {
    pageSize: "A4",
    orientation: "portrait",
    autoInit: false
};

const pageFormat = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TOGGLE_AUTO_INIT_PRINT_AREA:
            return {
                ...state,
                autoInit: action.autoInit,
            }
        default:
            return state
    }
}

export default pageFormat