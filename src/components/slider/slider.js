import React from 'react';
import styled from 'styled-components';

const Slider = ({ children }) => {
  return <SliderWrapper>{children}</SliderWrapper>;
};

const SliderWrapper = styled.div`
  background: white;
  position: absolute;
  width: 100%;
  height: 100vh;
`;

export default Slider;
