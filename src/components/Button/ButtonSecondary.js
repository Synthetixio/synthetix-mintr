import React from 'react';
import styled from 'styled-components';
import { ButtonSecondaryLabel } from '../Typography';

export const ButtonSecondary = ({ children, onClick }) => {
  return (
    <Button onClick={onClick}>
      <ButtonSecondaryLabel>{children}</ButtonSecondaryLabel>
    </Button>
  );
};

const Button = styled.button`
  width: ${props => (props.width ? props.width + 'px' : '320px')};
  height: 64px;
  border-radius: 5px;
  text-transform: uppercase;
  border: 2px solid ${props => props.theme.colorStyles.buttonPrimaryBg};
  cursor: pointer;
  background-color: transparent;
  transition: all ease-in 0.1s;
  &:hover {
    background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
  }
`;

export default ButtonSecondary;
