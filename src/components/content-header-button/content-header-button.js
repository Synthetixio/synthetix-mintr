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
    props.isSelected ? props.theme.colorStyles.accentDark : props.theme.colorStyles.accentLight};
  border-bottom: 8px solid
    ${props =>
      props.isSelected ? props.theme.colorStyles.purple4 : props.theme.colorStyles.accentLight};
  color: ${props => props.theme.colorStyles.subtext};
  &:hover,
  &:focus {
    background-color: ${props => props.theme.colorStyles.accentDark};
    border-bottom: 8px solid
      ${props =>
        props.isSelected ? props.theme.colorStyles.purple4 : props.theme.colorStyles.accentDark};
  }
`;

export default ContentHeaderButton;
