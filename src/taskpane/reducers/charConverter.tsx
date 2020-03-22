import { CHANGE_SRC_KEY, CHANGE_DESC_KEY } from "../constants/actions";
const INITIAL_STATE = {
    srcKey: 'VNI-WIN',
    descKey: 'UNICODE'
};

const charConverter = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CHANGE_SRC_KEY:
            return {
                ...state,
                srcKey: action.srcKey,
            }
        case CHANGE_DESC_KEY:
            return {
                ...state,
                descKey: action.selectedKey,
            }
        default:
            return state
    }
}

export default charConverter