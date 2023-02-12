import Bar from './Bar';
import styled from "styled-components";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {resetArray} from "../actions";

const Container = styled.div`
              width: 100%;
              display: flex;
              align-items: flex-end;
    `

const Array = () => {
    const ACTIVE_COLOR = '#ff5555';
    const SORTED_COLOR = '#4ed26c';
    const AUXILIARY_COLOR = '#bd93f9';
    const DEFAULT_COLOR = '#ffb86c';

    const dispatch = useDispatch();

    const {
        activeElements,
        auxiliaryElements,
        sortedElements
    } = useSelector(({ comparison }) => comparison, shallowEqual);

    const {
        array,
        arrayLength
    } = useSelector(state => state.array)

    useEffect(() => {
        dispatch(resetArray());
    }, []);

    const barWidth = window.screen.width / arrayLength;

    return (
        <Container>
            {
                array.map((height, index) => {

                    const barColor = sortedElements.includes(index) && SORTED_COLOR
                        || activeElements.includes(index) && ACTIVE_COLOR
                        || auxiliaryElements.includes(index) && AUXILIARY_COLOR
                        || DEFAULT_COLOR;
                    return (
                        <Bar
                            key={index}
                            width={barWidth}
                            height={height}
                            color={barColor}
                        />
                    )
                })
            }
        </Container>
    )
};

export default Array;