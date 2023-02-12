import styled from "styled-components";

const Title = styled.div`
    font-family: monospace;
    color: #fff;
    text-transform: uppercase;
`

const RangeInput = ({
                        value,
                        title,
                        min,
                        max,
                        disabled,
                        onValueChange
                    }) => {
    const onInput = (value) => {
        if (disabled) {
            return
        }

        onValueChange(value);
    };

    return(
        <div>
            { title && <Title>{ title }</Title> }
            <input
                type='range'
                value={ value }
                min={ min }
                max={ max }
                onInput={ (event) => onInput(Number(event.target.value)) }
            />
        </div>
    );
};

export default RangeInput;