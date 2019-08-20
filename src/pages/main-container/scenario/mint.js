import React, { useContext } from 'react';
import styled from 'styled-components';
import SliderContext from '../../../components/slider/context';
import Slider from '../../../components/slider';

const Page = ({ children, onDestroy }) => {
  const { elementRef, handleNext } = useContext(SliderContext);
  return (
    <PageWrapper ref={elementRef}>
      <button onClick={() => handleNext()}>NEXT</button>
      <button onClick={() => onDestroy()}>CLOSE</button>
      <div>{children}</div>
    </PageWrapper>
  );
};

const Mint = ({ onDestroy }) => {
  return (
    <Slider>
      <Page onDestroy={onDestroy}>
        <h1>Page 1</h1>
      </Page>
      <Page onDestroy={onDestroy}>
        <h1>Page 2</h1>
      </Page>
      <Page onDestroy={onDestroy}>
        <h1>Page 3</h1>
      </Page>
    </Slider>
  );
};

const PageWrapper = styled.div`
  width: 100%;
  flex-shrink: 0;
  background-color: white;
`;

export default Mint;
