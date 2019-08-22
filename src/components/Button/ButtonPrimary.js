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
  border-radius: 5px;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  background-color: ${props => props.theme.colorStyles.buttonPrimaryBg};
  transition: transform ease-in 0.1s;
  &:hover {
    background-color: ${props => props.theme.colorStyles.buttonPrimaryBgFocus};
  }
`;

export default ButtonPrimary;
