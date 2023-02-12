import {
    select,
    put,
    race,
    take,
    takeLatest
} from 'redux-saga/effects';

import { startSorting, setNewParams, setPause } from "./sorting";

// множитель скорости сортировки
const SPEED_MULTIPLIER = 80;

// функция-помощник запускает процесс сортировки
// и следит за результатом его выполнения
function* bubbleSortHelper() {
    const { array, arrayLength } = yield select(({ array }) => ({
        array: array.array,
        arrayLength: array.arrayLength
    }));

    yield startSorting();

    // гонка для возможности прерывания процесса сортировки
    const { success } = yield race({
        success: bubbleSort(array, arrayLength),
        canceled: take('COMPARISON/RESET')
    });

    // завершаем при успешном выполнении
    if(success) {
        yield put({ type: 'COMPARISON/TOGGLE_SORT', value: false });
    }
}

// основная функция метода сортировки
function* bubbleSort(array, arrayLength) {

    // массив для индексов отсортированных элементов
    const completedElements = [];

    for(let step = 0; step < arrayLength - 1; step++) {
        for(let compareIndex = 0; compareIndex < arrayLength - 1 - step; compareIndex++) {

            // в качестве активных выделяем индексы элементов,
            // которые сравниваются между собой в данный момент
            yield put({ type: 'COMPARISON/SET_ACTIVE_ELEMENTS', value: [compareIndex, compareIndex + 1] });

            // добавляем задержку для восприятия анимации
            yield setPause(SPEED_MULTIPLIER);

            const left = array[compareIndex];
            const right = array[compareIndex + 1];

            if(left  > right) {
                const params = {
                    [compareIndex]:  right,
                    [compareIndex + 1]: left
                };

                array[compareIndex] = right;
                array[compareIndex + 1] = left;

                // изменяем состояние массива в хранилище путём перестановки элементов
                yield setNewParams(params);

                // добавляем задержку для восприятия анимации
                yield setPause(SPEED_MULTIPLIER);
            }
        }

        // в конце цикла сравнений добавляем новый элемент в список
        completedElements.push(arrayLength - 1 - step);

        // добавляем отсортированные элементы в хранилище
        yield put({ type: 'COMPARISON/SET_SORTED_ELEMENTS', value: completedElements });
    }

    // в конце всего цикла добавляем нулевой элемент к отсортированным
    yield put({ type: 'COMPARISON/SET_SORTED_ELEMENTS', value: [0, ...completedElements] });

    // возвращаем true чтобы зафиксировать успешное завершение всего цикла
    return true
}

// запускаем bubbleSortHelper при отправленном действии SORTING/BUBBLE_SORT
export default [
    takeLatest('SORTING/BUBBLE_SORT', bubbleSortHelper),
];