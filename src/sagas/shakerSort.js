import {
    select,
    put,
    race,
    take,
    takeLatest
} from 'redux-saga/effects';

import { startSorting, setNewParams, setPause } from "./sorting";

// множитель скорости сортировки
const SPEED_MULTIPLIER = 60;

// функция-помощник запускает процесс сортировки
// и следит за результатом его выполнения
function* shakerSortHelper() {
    const { array, arrayLength } = yield select(({ array }) => ({
        array: array.array,
        arrayLength: array.arrayLength
    }));

    yield startSorting();

    // гонка для возможности прерывания процесса сортировки
    const { success } = yield race({
        success: shakerSort(array, arrayLength),
        canceled: take('COMPARISON/RESET')
    });

    // при успешном выполнении завершаем процесс
    if(success) {
        yield put({ type: 'COMPARISON/TOGGLE_SORT', value: false });
    }
}

// вспомогательная функция для свапа элементов
function* swap(array, i, j) {
    const params = {
        [i]: array[j],
        [j]: array[i]
    };

    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;

    yield setNewParams(params);
    yield setPause(SPEED_MULTIPLIER);
}

// основная функция метода сортировки
function* shakerSort(array, arrayLength) {

    // массив для индексов отсортированных элементов
    let completedElements = [];

    // индексы первого и последнего элемента массива
    let left = 0;
    let right = arrayLength - 1;

    // индексы вспомогательных элементов, нужны для оптимизации
    // сначала это крайние элементы массива, а затем - элементы,
    // которые последними за время одной итерации менялись местами со своим соседом
    let leftSwap = 0;
    let rightSwap = arrayLength - 1;

    while (left < right) {
        for (let i = left; i < right; i++) {

            // в качестве активных выделяем индексы элементов,
            // которые сравниваются между собой в данный момент
            yield put({ type: 'COMPARISON/SET_ACTIVE_ELEMENTS', value: [i, i + 1] });
            yield setPause(SPEED_MULTIPLIER);

            if (array[i] > array[i + 1]) {
                yield swap(array, i, i + 1);

                // запоминаем индекс элемента, который только что помеялся местами с соседом справа
                rightSwap = i;
            }
        }

        // если на предыдущей итерации элементы не менялись местами, то массив отсортирован
        if(rightSwap === right) {
            completedElements = Array.from(Array(arrayLength).keys());

            yield put({ type: 'COMPARISON/SET_SORTED_ELEMENTS', value: completedElements });

            return true;
        }

        // начиная с нашего вспомогательного элемента будем двигаться к левому краю массива
        // все элементы правее него считаются отсортированными
        right = rightSwap;

        // все элементы до левого опорного и после правого опорного считаются отсортированными
        completedElements = [...Array.from(Array(left).keys()), ...Array.from(Array(arrayLength).keys()).splice(right + 1)];

        yield put({ type: 'COMPARISON/SET_SORTED_ELEMENTS', value: completedElements });

        // повторяем процедуру, двигаясь к левому краю
        for (let i = right; i > left; i--) {
            yield put({ type: 'COMPARISON/SET_ACTIVE_ELEMENTS', value: [i - 1, i] });
            yield setPause(SPEED_MULTIPLIER);

            if (array[i] < array[i - 1]) {
                yield swap(array, i, i - 1);

                // запоминаем индекс элемента, который только что помеялся местами с соседом слева
                leftSwap = i;
            }
        }

        // начиная с нашего вспомогательного элемента будем двигаться к правому краю массива
        // все элементы левее него считаются отсортированными
        left = leftSwap;

        // все элементы до левого опорного и после правого опорного считаются отсортированными
        completedElements = [...Array.from(Array(left).keys()), ...Array.from(Array(arrayLength).keys()).splice(right + 1)];

        yield put({ type: 'COMPARISON/SET_SORTED_ELEMENTS', value: completedElements });
    }

    // в конце цикла весь массив отсортирован
    yield put({ type: 'COMPARISON/SET_SORTED_ELEMENTS', value: Array.from(Array(arrayLength).keys()) });

    return true;
}

// запускаем shakerSortHelper при отправленном действии SORTING/SHAKER_SORT
export default [
    takeLatest('SORTING/SHAKER_SORT', shakerSortHelper),
];