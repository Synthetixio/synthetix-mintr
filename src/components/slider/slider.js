import React from 'react';
import styled from 'styled-components';

const Slider = ({ children }) => {
  return <SliderWrapper>{children}</SliderWrapper>;
};

const SliderWrapper = styled.div`
  background: ${props => props.theme.colorStyles.panels};
  position: absolute;
  width: 100%;
  height: 90vh;
`;

export default Slider;
