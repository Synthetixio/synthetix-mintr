import React from 'react';
import styled, { keyframes } from 'styled-components';

const Spinner = () => {
  return (
    <Wrapper>
      <Inner>
        {[0, 1, 2, 3].map(i => {
          return <Circle key={i} />;
        })}
      </Inner>
    </Wrapper>
  );
};

export const MicroSpinner = () => {
  return (
    <MicroWrapper>
      <Inner isMicro={true}>
        {[0, 1, 2, 3].map(i => {
          return <MicroCircle key={i} />;
        })}
      </Inner>
    </MicroWrapper>
  );
};

export const NotificationSpinner = () => {
  return (
    <NotificationSpinnerWrapper>
      <Inner isSmall={true}>
        {[0, 1, 2, 3].map(i => {
          return <NotificationSpinnerCircle key={i} />;
        })}
      </Inner>
    </NotificationSpinnerWrapper>
  );
};

const NotificationSpinnerWrapper = styled.div`
  width: 40px;
  height: 40px;
  transition: all 0.3s ease-out;
  z-index: 3;
  background-color: ${props => props.theme.colorStyles.brandBlue};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 60px;
  height: 60px;
  margin: 40px auto;
  transition: all 0.3s ease-out;
  z-index: 3;
`;

const MicroWrapper = styled.div`
  width: 20px;
  height: 20px;
  transition: all 0.3s ease-out;
  z-index: 3;
  margin: 0 20px;
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

const moveSmall = keyframes`
0%   { ${direction(0, 12)} }
10%  { ${direction(Math.PI / 5, 12)}; }
20%  { ${direction((2 * Math.PI) / 5, 12)}; }
30%  { ${direction((3 * Math.PI) / 5, 12)}; }
40%  { ${direction((4 * Math.PI) / 5, 12)}; }
50%  { ${direction(Math.PI, 12)}; }
60%  { ${direction((6 * Math.PI) / 5, 12)}; }
70%  { ${direction((7 * Math.PI) / 5, 12)}; }
80%  { ${direction((8 * Math.PI) / 5, 12)}; }
90%  { ${direction((9 * Math.PI) / 5, 12)}; }
100% { ${direction(0, 12)}; }
`;

const moveMicro = keyframes`
0%   { ${direction(0, 8)} }
10%  { ${direction(Math.PI / 5, 8)}; }
20%  { ${direction((2 * Math.PI) / 5, 8)}; }
30%  { ${direction((3 * Math.PI) / 5, 8)}; }
40%  { ${direction((4 * Math.PI) / 5, 8)}; }
50%  { ${direction(Math.PI, 8)}; }
60%  { ${direction((6 * Math.PI) / 5, 8)}; }
70%  { ${direction((7 * Math.PI) / 5, 8)}; }
80%  { ${direction((8 * Math.PI) / 5, 8)}; }
90%  { ${direction((9 * Math.PI) / 5, 8)}; }
100% { ${direction(0, 8)}; }
`;

const Inner = styled.div`
  width: ${props => (props.isSmall ? '30px' : props.isMicro ? '20px' : '60px')};
  height: ${props =>
    props.isSmall ? '30px' : props.isMicro ? '20px' : '60px'};
  border-radius: 50%;
  position: relative;
  & :nth-child(1) {
    animation: ${props =>
        props.isSmall ? moveSmall : props.isMicro ? moveMicro : move}
      0.6s infinite;
    animation-timing-function: linear;
  }
  & :nth-child(2) {
    animation: ${props =>
        props.isSmall ? moveSmall : props.isMicro ? moveMicro : move}
      0.8s infinite;
    animation-timing-function: linear;
  }
  & :nth-child(3) {
    animation: ${props =>
        props.isSmall ? moveSmall : props.isMicro ? moveMicro : move}
      1.2s infinite;
    animation-timing-function: linear;
  }
  & :nth-child(4) {
    animation: ${props =>
        props.isSmall ? moveSmall : props.isMicro ? moveMicro : move}
      2.4s infinite;
    animation-timing-function: linear;
  }
`;

const Circle = styled.div`
  background-color: ${props => props.theme.colorStyles.hyperlink};
  width: ${props => (props.isSmall ? '10px' : '12px')};
  height: ${props => (props.isSmall ? '10px' : '12px')};
  border-radius: 50%;
  position: absolute;
  top: 30px;
  left: 60px;
`;

const NotificationSpinnerCircle = styled(Circle)`
  background-color: #ffffff;
  width: 5px;
  height: 5px;
  top: 20px;
  left: 0;
`;

const MicroCircle = styled(Circle)`
  background-color: ${props => props.theme.colorStyles.hyperlink};
  width: 5px;
  height: 5px;
  top: 20px;
  left: 0;
`;

export default Spinner;
