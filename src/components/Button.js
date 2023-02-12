import styled from "styled-components";

const StyledButton = styled.button`
  padding: 10px 15px;
  font-weight: 600;
  background-color: #fff;
  border: 1px solid #44475a;
  border-radius: 5px;
  font-family: monospace;
  text-transform: uppercase;
  transition: all .1s linear;
  cursor: pointer;
      &:active,
      &:hover {
        background-color: #ffb86c
      }
  `

const Button = ({ text, handler }) => {
    return (
        <StyledButton onClick={handler}>{text}</StyledButton>
    )
};

export default Button;