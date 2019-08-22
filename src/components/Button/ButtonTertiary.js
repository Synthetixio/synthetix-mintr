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
  background-color: ${props => props.theme.colorStyles.panels};
  border: 1px solid ${props => props.theme.colorStyles.borders};
  height: 40px;
  padding: 0px 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  text-transform: uppercase;
  transition: all ease-in 0.1s;
  &:hover,
  &:focus {
    background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
  }
  cursor: pointer;
`;

export default ButtonTertiary;
