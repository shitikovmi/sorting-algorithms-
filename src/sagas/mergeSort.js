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
function* mergeSortHelper() {
    const array = yield select(({ array }) => array.array);

    yield startSorting();

    // для главного и вспомогательного массива создаём две копии исходного
    const mainArray = array.slice();
    const auxiliaryArray = array.slice();

    // гонка для возможности прерывания процесса сортировки
    const { success } = yield race({
        success: mergeSort(mainArray, auxiliaryArray, 0, array.length - 1),
        canceled: take('COMPARISON/RESET')
    });

    // при успешном выполнении запускаем соответствующую сагу
    if(success) {
        yield afterSuccessSorting();
    }
}

function* mergeSort(
    mainArray,
    auxiliaryArray,
    startIdx,
    endIdx
) {
    if (startIdx === endIdx) return;

    // находим середину массива
    const middleIdx = Math.floor((startIdx + endIdx) / 2);

    // рекурсивный вызов для левой части
    yield mergeSort(auxiliaryArray, mainArray, startIdx, middleIdx);

    // рекурсивный вызов для правой части
    yield mergeSort(auxiliaryArray, mainArray, middleIdx + 1, endIdx);

    // выполняем сортировку отдельной части массива
    yield sort(mainArray, auxiliaryArray, startIdx, middleIdx, endIdx);

    return true;
}

function* sort(
    mainArray,
    auxiliaryArray,
    startIdx,
    middleIdx,
    endIdx
) {

    // индекс в главном массиве
    let k = startIdx;

    // начало левой части
    let i = startIdx;

    // начало правой части
    let j = middleIdx + 1;

    // идём одновременно по левой и правой частям массива
    while (i <= middleIdx && j <= endIdx) {

        // в качестве активных выделяем индексы элементов,
        // которые сравниваются между собой в данный момент
        yield put({ type: 'COMPARISON/SET_ACTIVE_ELEMENTS', value: [i,j] });
        yield setPause(SPEED_MULTIPLIER);

        // сравниваем и устанавливаем соответствующие элементы
        // после установки элементов увеличиваем индексы на единицу
        if (auxiliaryArray[i] <= auxiliaryArray[j]) {
            yield setNewParams({ [k]: auxiliaryArray[i] });
            mainArray[k++] = auxiliaryArray[i++];
        } else {
            yield setNewParams({ [k]: auxiliaryArray[j] });
            mainArray[k++] = auxiliaryArray[j++];
        }
    }

    // если в левой или правой частях массива остались незатронутые элементы
    // устанавливаем их на свои места в главном массиве
    while (i <= middleIdx) {
        yield put({ type: 'COMPARISON/SET_ACTIVE_ELEMENTS', value: [i] });
        yield setPause(SPEED_MULTIPLIER);
        yield setNewParams({ [k]: auxiliaryArray[i] });
        mainArray[k++] = auxiliaryArray[i++];
    }

    while (j <= endIdx) {
        yield put({ type: 'COMPARISON/SET_ACTIVE_ELEMENTS', value: [j] });
        yield setPause(SPEED_MULTIPLIER);
        yield setNewParams({ [k]: auxiliaryArray[j] });
        mainArray[k++] = auxiliaryArray[j++];
    }
}

// запускаем mergeSortHelper при отправленном действии SORTING/MERGE_SORT
export default [
    takeLatest('SORTING/MERGE_SORT', mergeSortHelper),
];