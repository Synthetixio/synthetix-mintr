import React from 'react';
import styled, { keyframes } from 'styled-components';

const Spinner = () => {
  return (
    <Wrapper>
      <Inner>
        <Circle />
        <Circle />
        <Circle />
        <Circle />
      </Inner>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 60px;
  height: 60px;
  margin: 40px auto;
  transition: all 0.3s ease-out;
  z-index: 3;
`;

const direction = (a, r = 24) => {
  return `top: ${(1 - Math.sin(a)) * r}px; left: ${(1 + Math.cos(a)) * r}px`;
};

const move = keyframes`
0%   { ${direction(0)} }
10%  { ${direction(Math.PI / 5)}; }
20%  { ${direction((2 * Math.PI) / 5)}; }
30%  { ${direction((3 * Math.PI) / 5)}; }
40%  { ${direction((4 * Math.PI) / 5)}; }
50%  { ${direction(Math.PI)}; }
60%  { ${direction((6 * Math.PI) / 5)}; }
70%  { ${direction((7 * Math.PI) / 5)}; }
80%  { ${direction((8 * Math.PI) / 5)}; }
90%  { ${direction((9 * Math.PI) / 5)}; }
100% { ${direction(0)}; }
`;

const Inner = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: relative;
  & :nth-child(1) {
    animation: ${move} 0.6s infinite;
    animation-timing-function: linear;
  }
  & :nth-child(2) {
    animation: ${move} 0.8s infinite;
    animation-timing-function: linear;
  }
  & :nth-child(3) {
    animation: ${move} 1.2s infinite;
    animation-timing-function: linear;
  }
  & :nth-child(4) {
    animation: ${move} 2.4s infinite;
    animation-timing-function: linear;
  }
`;

const Circle = styled.div`
  background-color: ${props => props.theme.colorStyles.hyperlink};
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: absolute;
  top: 30px;
  left: 60px;
`;

export default Spinner;
