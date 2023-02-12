import {
    put,
    select,
    takeLatest,
    all
} from 'redux-saga/effects';

import { createArray } from "../utils";

function* resetArray() {
    const arrayLength = yield select(({ array }) => array.arrayLength);

    yield all([
        put({ type: 'COMPARISON/RESET' }),
        put({ type: 'ARRAY/SET_ARRAY', value: createArray(arrayLength) })
    ]);
}

function* setArrayLength({ value }) {
    yield put({ type: 'ARRAY/SET_LENGTH', value })
    yield resetArray();
}

export default [
    takeLatest('CONTROLS/RESET_ARRAY', resetArray),
    takeLatest('CONTROLS/SET_ARRAY_LENGTH', setArrayLength)
];