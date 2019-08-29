import React from 'react';
import styled from 'styled-components';

const Input = ({ placeholder, leftComponent, rightComponent }) => {
  return (
    <InputWrapper>
      <LeftComponentWrapper>{leftComponent}</LeftComponentWrapper>
      <InputElement placeholder={placeholder} type='text' />
      <RightComponentWrapper>{rightComponent}</RightComponentWrapper>
    </InputWrapper>
  );
};

const InputWrapper = styled.div`
  display: flex;
  height: 50px;
  border-radius: 5px;
  height: 64px;
  width: 400px;
  border: 1px solid ${props => props.theme.colorStyles.borders};
  background-color: ${props => props.theme.colorStyles.panelButton};
  inner-shadow: 0px 5px 10px 5px ${props => props.theme.colorStyles.shadow1};
  align-items: center;
  justify-content: center;
  margin: auto;
`;

const LeftComponentWrapper = styled.div`
  height: 100%;
  border-right: 1px solid ${props => props.theme.colorStyles.borders};
  background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: auto;
  padding: 16px 24px;
`;

const RightComponentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  padding: 16px;
`;

const InputElement = styled.input`
  width: 100%;
  height: 100%;
  padding: 16px;
  border: none;
  background-color: ${props => props.theme.colorStyles.panelButton};
  outline: none;

  font-size: 24px;
  color: ${props => props.theme.colorStyles.heading};
`;

export default Input;
