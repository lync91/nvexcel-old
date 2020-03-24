const INITIAL_STATE = {
    pageSize: "A4",
    orientation: "portrait",
    autoInit: false
};

const pageFormat = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getData':
            return {
                ...state,
                selectedKey: "about",
            }
        case 'CHANGE_LOCATION':
            return {
                ...state,
                selectedKey: action.selectedKey,
            }
        default:
            return state
    }
}

export default pageFormat