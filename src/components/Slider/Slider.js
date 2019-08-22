import React from 'react';
import styled, { keyframes } from 'styled-components';

import SliderContext from './Context';
import useSizeElement from './useSizeElement';
import useSliding from './useSliding';

const Slider = ({ children, isVisible }) => {
  const { width, elementRef } = useSizeElement();
  const { slideProps, containerRef, handleNext, handlePrev } = useSliding(
    width,
    React.Children.count(children)
  );
  const contextValue = {
    elementRef,
    handleNext,
    handlePrev,
  };
  return (
    <SliderContext.Provider value={contextValue}>
      <SliderWrapper isVisible={isVisible} ref={containerRef} {...slideProps}>
        {children}
      </SliderWrapper>
    </SliderContext.Provider>
  );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const SliderWrapper = styled.div`
  background: ${props => props.theme.colorStyles.background};
  transition: opacity ease-in 0.2s, transform ease-in 0.2s;
  position: absolute;
  animation: ${fadeIn} 0.25s linear both;
  height: 100%;
  left: 0;
  width: 100%;
  display: flex;
  z-index: 100;
`;

export default Slider;
