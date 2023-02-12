import styled from "styled-components";
import Button from "./Button";
import {useDispatch, useSelector} from "react-redux";
import {resetArray, bubbleSort, changeSpeed, mergeSort, quickSort, shakerSort} from "../actions";
import RangeInput from "./RangeInput";
import {setArrayLength} from "../actions";

const StyledControls = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const StyledControlsContainer = styled.div`
  margin-bottom: 20px;
  gap: 10px;
  display: flex;
`

const Controls = () => {

    const dispatch = useDispatch();

    const onMergeSort = () => {
        dispatch(mergeSort());
    }

    const onQuickSort = () => {
        dispatch(quickSort());
    }

    const onShakerSort = () => {
        dispatch(shakerSort());
    }

    const onResetArray = () => {
        dispatch(resetArray());
    }

    const onBubbleSort = () => {
        dispatch(bubbleSort());
    }

    const arrayLength = useSelector(({ array }) => array.arrayLength);
    const inProgress = useSelector(({ comparison }) => comparison.inProgress);

    const onChangeLength = length => dispatch(setArrayLength(length));

    const sortingSpeed = useSelector(({ comparison }) => comparison.sortingSpeed);

    const onChangeSpeed = multiplier => dispatch(changeSpeed(multiplier));

    return (
        <StyledControls>
            <StyledControlsContainer>
                <Button
                    text="Reset array"
                    handler={onResetArray}/>
                <Button
                    text="Bubble sort"
                    handler={onBubbleSort}/>
                <Button
                    text="Merge sort"
                    handler={onMergeSort}/>
                <Button
                    text="Quick sort"
                    handler={onQuickSort}/>
                <Button
                    text="Shaker sort"
                    handler={onBubbleSort}/>
            </StyledControlsContainer>
            <StyledControlsContainer>
                <RangeInput
                    value={ arrayLength }
                    title="Array length"
                    min={ 15 }
                    max={ 180 }
                    disabled={ inProgress }
                    onValueChange={ onChangeLength }
                />
                <RangeInput
                    value={ sortingSpeed }
                    title="Sorting speed"
                    min={ 1 }
                    max={ 20 }
                    onValueChange={ onChangeSpeed }
                />
            </StyledControlsContainer>
        </StyledControls>
    );
};

export default Controls;