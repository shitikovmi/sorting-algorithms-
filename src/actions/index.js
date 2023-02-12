export const resetArray = () => ({type: 'CONTROLS/RESET_ARRAY'});

export const setArrayLength = value => ({ type: 'CONTROLS/SET_ARRAY_LENGTH', value });

export const changeSpeed = value => ({ type: 'COMPARISON/SET_SORTING_SPEED', value });

export const bubbleSort = () => ({ type: 'SORTING/BUBBLE_SORT' });

export const mergeSort = () => ({ type: 'SORTING/MERGE_SORT' });

export const shakerSort = () => ({ type: 'SORTING/SHAKER_SORT' });

export const quickSort = () => ({ type: 'SORTING/QUICK_SORT' });
