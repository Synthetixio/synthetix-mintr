import React from 'react';
import styled from 'styled-components';

const Input = ({ placeholder, leftComponent, rightComponent }) => {
  return (
    <InputWrapper>
      <LeftComponentWrapper>{leftComponent}</LeftComponentWrapper>
      <InputElement placeholder={placeholder} type="text" />
      <RightComponentWrapper>{rightComponent}</RightComponentWrapper>
    </InputWrapper>
  );
};

const InputWrapper = styled.div`
  display: flex;
  height: 50px;
  border: 1px solid black;
`;

const LeftComponentWrapper = styled.div``;

const RightComponentWrapper = styled.div``;

const InputElement = styled.input`
  width: 100%;
  height: 100%;
  padding: 16px;
  border: none;
  border-top: 1px solid black;
`;

export default Input;
