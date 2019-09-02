import { useState, useRef, useLayoutEffect } from 'react';

const useSliding = () => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const containerWidth = containerRef.current.clientWidth;
    setContainerWidth(containerWidth);
    setDistance(-containerWidth);
  }, []);

  const handlePrev = count => {
    setDistance(distance + count * containerWidth);
  };

  const handleNext = count => {
    setDistance(distance - count * containerWidth);
  };

  const slideProps = {
    style: { transform: `translate3d(${distance}px, 0, 0)` },
  };

  return { handlePrev, handleNext, slideProps, containerRef };
};

export default useSliding;
