import styled from "styled-components";

const Column = styled.div`
      height: ${props => props.height}px;
      width: ${props => props.width}px;
      background-color: ${props => props.color};
      border: .1rem solid #44475a;
    `

const Bar = ({width, height, color}) => {

    return <Column width={width}
                   height={height}
                   color={color}/>;
}

export default Bar;