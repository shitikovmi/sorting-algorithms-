const initialState = {
    inProgress: false,
    sortingSpeed: 1,
    activeElements: [],
    sortedElements: [],
    auxiliaryElements: []
};

const reducer = (state = initialState, { type, value }) => {
    switch (type) {
        case 'COMPARISON/RESET':
            return { ...initialState, sortingSpeed: state.sortingSpeed };
        case 'COMPARISON/TOGGLE_SORT':
            return { ...state, inProgress: value };
        case 'COMPARISON/SET_SORTING_SPEED':
            return { ...state, sortingSpeed: value };
        case 'COMPARISON/SET_ACTIVE_ELEMENTS':
            return { ...state, activeElements: value };
        case 'COMPARISON/SET_AUXILIARY_ELEMENTS':
            return { ...state, auxiliaryElements: value };
        case 'COMPARISON/SET_SORTED_ELEMENTS':
            return { ...state, sortedElements: value };
        default:
            return state;
    }
};

export default reducer;