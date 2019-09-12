import React, { useContext } from 'react';
import styled from 'styled-components';
import ScreenSlider from './Context';

const SlidePage = ({ children }) => {
  const { elementRef } = useContext(ScreenSlider);
  return <Slide ref={elementRef}>{children}</Slide>;
};

const Slide = styled.div`
  width: 100%;
  flex-shrink: 0;
  height: 100%;
  background-color: ${props => props.theme.colorStyles.background};
`;

export default SlidePage;
