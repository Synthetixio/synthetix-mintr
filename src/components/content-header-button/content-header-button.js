import React from 'react';
import styled from 'styled-components';

const ContentHeaderButton = ({ children, isSelected, onClick }) => {
  return (
    <Button onClick={onClick} isSelected={isSelected}>
      {children}
    </Button>
  );
};

const Button = styled.button`
  cursor: pointer;
  height: 85px;
  outline: none;
  padding-top: 8px;
  border: none;
  flex: 1;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: ${props => (props.isSelected ? 'apercu-bold' : 'apercu-medium')};
  background-color: ${props =>
    props.isSelected ? props.theme.accentDark : props.theme.accentLight};
  border-bottom: 8px solid
    ${props =>
      props.isSelected ? props.theme.purple4 : props.theme.accentLight};
  color: ${props => props.theme.subtext};
  &:hover,
  &:focus {
    background-color: ${props => props.theme.accentDark};
    border-bottom: 8px solid
      ${props =>
        props.isSelected ? props.theme.purple4 : props.theme.accentDark};
  }
`;

export default ContentHeaderButton;
