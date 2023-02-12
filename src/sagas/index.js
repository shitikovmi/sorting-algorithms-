import { all } from 'redux-saga/effects';

import controls from './controls'
import bubbleSort from "./bubbleSort";
import shakerSort from "./shakerSort";
import mergeSort from "./mergeSort";
import quickSort from "./quickSort";

export default function* rootSaga() {
    yield all([
        ...controls,
        ...bubbleSort,
        ...shakerSort,
        ...mergeSort,
        ...quickSort
    ]);
};