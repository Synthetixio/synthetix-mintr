import React from 'react';
import styled from 'styled-components';
import { ButtonTertiaryLabel } from '../Typography';

const ButtonTertiary = ({ children, onClick }) => {
  return (
    <Button onClick={onClick}>
      <ButtonTertiaryLabel>{children}</ButtonTertiaryLabel>
    </Button>
  );
};

const Button = styled.button`
  background-color: transparent;
  border: 1px solid ${props => props.theme.colorStyles.borders};
  height: 40px;
  padding: 2px 20px 0 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  text-transform: uppercase;
  transition: transform ease-in 0.2s;
  &:hover,
  &:focus {
    background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
  }
`;

export default ButtonTertiary;
