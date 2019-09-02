import React from 'react';
import styled from 'styled-components';
import { ButtonSecondaryLabel } from '../Typography';

const ButtonSecondary = ({
  children,
  onClick,
  as = 'button',
  href = undefined,
  target = undefined,
}) => {
  return (
    <Button target={target} href={href} as={as} onClick={onClick}>
      <ButtonSecondaryLabel>{children}</ButtonSecondaryLabel>
    </Button>
  );
};

const Button = styled.button`
  width: ${props => (props.width ? props.width + 'px' : '400px')};
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 72px;
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
