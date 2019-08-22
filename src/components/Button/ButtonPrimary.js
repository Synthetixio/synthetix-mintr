import React from 'react';
import styled from 'styled-components';
import { ButtonPrimaryLabel } from '../Typography';

const ButtonPrimary = ({ children, onClick }) => {
  return (
    <Button onClick={onClick}>
      <ButtonPrimaryLabel>{children}</ButtonPrimaryLabel>
    </Button>
  );
};

const Button = styled.button`
  width: 320px;
  height: 64px;
  margin-bottom: 64px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  text-align: center;
  background-color: ${props => props.theme.colorStyles.buttonPrimaryBg};
  transition: all ease-in 0.1s;
  &:hover {
    background-color: ${props => props.theme.colorStyles.buttonPrimaryBgFocus};
  }
`;

export default ButtonPrimary;
