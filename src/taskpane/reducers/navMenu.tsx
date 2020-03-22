const INITIAL_STATE = {
    name: 'Luat',
    age: 18,
    selectedKey: "about"
};

const navMenu = (state = INITIAL_STATE, action) => {
    console.log(action);
    
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

export default navMenu