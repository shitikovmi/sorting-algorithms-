import {
    select,
    put,
    race,
    take,
    takeLatest
} from 'redux-saga/effects';

import {
    startSorting,
    setNewParams,
    setPause,
    afterSuccessSorting
} from "./sorting";

// множитель скорости сортировки
const SPEED_MULTIPLIER = 100;

// функция-помощник запускает процесс сортировки
// и следит за результатом его выполнения
function* quickSortHelper() {
    const { array, arrayLength } = yield select(({ array }) => ({
        array: array.array,
        arrayLength: array.arrayLength
    }));

    yield startSorting();

    // гонка для возможности прерывания процесса сортировки
    const { success } = yield race({
        success: quickSort(array, 0, arrayLength - 1),
        canceled: take('COMPARISON/RESET')
    });

    // при успешном выполнении запускаем соответствующую сагу
    if(success) {
        yield afterSuccessSorting();
    }
}

// вспомогательная функция для свапа элементов
function* swap(items, firstIndex, secondIndex){
    const params = {
        [firstIndex]: items[secondIndex],
        [secondIndex]: items[firstIndex]
    };

    let temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;

    yield setNewParams(params);
    yield setPause(SPEED_MULTIPLIER);
}

// функция разделения массива
function* partition(items, left, right, pivot) {

    // указатели на левый и правый конец массива
    let i = left;
    let j = right;

    while (i <= j) {

        // слева-направо
        // если элемент в левой части меньше опорного, то пропускаем его и сдвигаем указатель
        while (items[i] < pivot) {
            i++;
        }

        // справа-налево
        // если элемент в правой части больше опорного, то пропускаем его и сдвигаем указатель
        while (items[j] > pivot) {
            j--;
        }

        // меняем местами элементы, если условие выполняется
        if (i <= j) {

            // выделяем индексы элементов в качестве активных
            yield put({ type: 'COMPARISON/SET_ACTIVE_ELEMENTS', value: [i,j] });

            yield setPause(SPEED_MULTIPLIER);
            yield swap(items, i, j);
            yield setPause(SPEED_MULTIPLIER);

            i++;
            j--;
        }
    }

    // возвращаем индекс, по которому массив разделяется на два подмассива
    return i;
}

// рекурсивная функция быстрой сортировки
function* quickSort(items, left, right) {

    // берём средний элемент массива как опорный
    const pivotIndex = Math.floor((right + left) / 2);
    const pivot = items[pivotIndex];

    // выделяем опорный элемент дополнительным цветом
    yield put({ type: 'COMPARISON/SET_AUXILIARY_ELEMENTS', value: [pivotIndex] });

    // индекс, по которому массив разделяется на два подмассива
    const index = yield partition(items, left, right, pivot);

    // рекурсивно запускаем процедуру для левой части
    if (left < index - 1) {
        yield quickSort(items, left, index - 1);
    }

    // рекурсивно запускаем процедуру для правой части
    if (index < right) {
        yield quickSort(items, index, right);
    }

    return items;
}

// запускаем quickSortHelper при отправленном действии SORTING/QUICK_SORT
export default [
    takeLatest('SORTING/QUICK_SORT', quickSortHelper),
];