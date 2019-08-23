import React from 'react';
import styled from 'styled-components';
import { ButtonPrimaryLabel, ButtonPrimaryLabelMedium } from '../Typography';

export const ButtonPrimary = ({ children, onClick }) => {
  return (
    <Button onClick={onClick}>
      <ButtonPrimaryLabel>{children}</ButtonPrimaryLabel>
    </Button>
  );
};

export const ButtonPrimaryMedium = ({ children, onClick, disabled }) => {
  return (
    <ButtonMedium disabled={disabled} onClick={onClick}>
      <ButtonPrimaryLabelMedium>{children}</ButtonPrimaryLabelMedium>
    </ButtonMedium>
  );
};

const Button = styled.button`
  width: ${props => (props.width ? props.width + 'px' : '320px')};
  height: 64px;
  border-radius: 5px;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  background-color: ${props => props.theme.colorStyles.buttonPrimaryBg};
  transition: all ease-in 0.1s;
  &:hover {
    background-color: ${props => props.theme.colorStyles.buttonPrimaryBgFocus};
  }
`;

const ButtonMedium = styled(Button)`
  width: 162px;
  height: 40px;
  :disabled {
    opacity: 0.4;
    pointer-events: none;
  }
`;
