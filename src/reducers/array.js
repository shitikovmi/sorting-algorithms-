const initialState = {
    array: [],
    arrayLength: 30,
};

const reducer = (state = initialState, { type, value }) => {
    switch (type) {
        case 'ARRAY/SET_ARRAY':
            return { ...state, array: value };
        case 'ARRAY/SET_LENGTH':
            return { ...state, arrayLength: value };
        default:
            return state;
    }
};

export default reducer;