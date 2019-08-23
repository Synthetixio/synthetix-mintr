import React from 'react';
import styled from 'styled-components';

const Arrow = ({ direction = 'up' }) => {
  return (
    <Wrapper direction={direction}>
      <svg width="10" height="6" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 5l5-4 5 4"
          stroke="#6F6E98"
          fill="none"
          fill-rule="evenodd"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </Wrapper>
  );
};

const getDirectionAngle = direction => {
  switch (direction) {
    case 'up':
    default:
      return 0;
    case 'left':
      return -Math.PI / 2;
    case 'down':
      return Math.PI;
    case 'right':
      return Math.PI / 2;
  }
};

const Wrapper = styled.div`
  width: 10px;
  height: 6px;
  display: flex;
  transform: ${props =>
    'rotate(' + getDirectionAngle(props.direction) + 'rad)'};
`;

export default Arrow;
