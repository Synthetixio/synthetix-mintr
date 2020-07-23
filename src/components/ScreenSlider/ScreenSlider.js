import React, { useRef, useState, useLayoutEffect } from 'react';
import styled, { keyframes } from 'styled-components';

import ScreenSliderContext from './Context';
import useComponentSize from '@rehooks/component-size';

const useSliding = containerWidth => {
	const containerRef = useRef(null);
	const [distance, setDistance] = useState(0);
	const [hasLoaded, setHasLoading] = useState(false);

	useLayoutEffect(() => {
		setDistance(-containerWidth);
		setHasLoading(true);
	}, [containerWidth]);

	const handlePrev = count => {
		setDistance(distance + count * containerWidth);
	};

	const handleNext = count => {
		setDistance(distance - count * containerWidth);
	};

	const slideProps = {
		style: { transform: `translate3d(${distance}px, 0, 0)` },
	};

	return {
		handlePrev,
		handleNext,
		slideProps,
		containerRef,
		hasLoaded,
	};
};

const ScreenSlider = ({ children, isVisible }) => {
	const elementRef = useRef(null);
	const size = useComponentSize(elementRef);

	const { slideProps, containerRef, handleNext, handlePrev, hasLoaded } = useSliding(size.width);
	const contextValue = {
		elementRef,
		handleNext,
		handlePrev,
		hasLoaded,
	};
	return (
		<ScreenSliderContext.Provider value={contextValue}>
			<ScreenSliderWrapper isVisible={isVisible} ref={containerRef} {...slideProps}>
				{children}
			</ScreenSliderWrapper>
		</ScreenSliderContext.Provider>
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

const ScreenSliderWrapper = styled.div`
	background: ${props => props.theme.colorStyles.background};
	transition: opacity ease-in 0.2s, transform ease-in 0.2s;
	position: absolute;
	animation: ${fadeIn} 0.25s linear both;
	height: 100%;
	left: 100%;
	width: 100%;
	display: flex;
	z-index: 100;
`;

export default ScreenSlider;
