import { delay, put, select } from "redux-saga/effects";

// перестановка элементов в исходном массиве
export function* setNewParams(params) {
    const array = yield select(({ array }) => array.array);


    for (let index in params) {
        array[index] = params[index];
    }

    yield put({ type: 'ARRAY/SET_ARRAY', value: array });
}

// имитация паузы в процессе визуализации для восприятия анимации
export function* setPause(multiplier = 100) {
    const sortingSpeed = yield select(({ comparison }) => comparison.sortingSpeed);

    // длительность задержки зависит от входного параметра и скорости сортировки
    yield delay(multiplier / sortingSpeed);
}

export function* startSorting() {

    // при запуске процесса сбрасывается активное состояние
    yield put({ type: 'COMPARISON/RESET' });
    yield put({ type: 'COMPARISON/TOGGLE_SORT', value: true });
}

export function* afterSuccessSorting() {
    const sortedArrayLength = yield select(({ array }) => array.arrayLength);

    yield put({type: 'COMPARISON/RESET'});

    // цикл по всем элементам массива
    for(let length = 1; length <= sortedArrayLength; length++) {

        // все элементы до текущего индекса помечаются как отсортированные
        yield put({ type: 'COMPARISON/SET_SORTED_ELEMENTS', value: Array.from(Array(length).keys()) });

        // минимальная пауза для анимации
        yield setPause(1);
    }
}