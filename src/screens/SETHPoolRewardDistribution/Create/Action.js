import React from 'react';
import styled from 'styled-components';

import { SlidePage } from '../../../components/ScreenSlider';
import { ButtonTertiary } from '../../../components/Button';
import { PageTitle } from '../../../components/Typography';
import CsvLoader from '../CsvLoader';

const MainContainer = ({ goHome, onDataLoaded }) => {
  return (
    <SlidePage>
      <Container>
        <Navigation>
          <ButtonTertiary onClick={goHome}>Cancel</ButtonTertiary>
        </Navigation>
        <PageTitle fontSize={32} marginTop={50}>
          Submit a new transaction
        </PageTitle>
        <CsvLoaderContainer>
          <CsvLoader onDataLoaded={onDataLoaded} />
        </CsvLoaderContainer>
      </Container>
    </SlidePage>
  );
};

const Container = styled.div`
  width: 100%;
  height: 850px;
  max-width: 720px;
  margin: 0 auto;
  overflow: hidden;
  background-color: ${props => props.theme.colorStyles.panels};
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 5px;
  box-shadow: 0px 5px 10px 5px ${props => props.theme.colorStyles.shadow1};
  margin-bottom: 20px;
  padding: 40px 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: flex-start;
`;

const Navigation = styled.div`
  width: 100%;
  display: flex;
  text-align: left;
`;

const CsvLoaderContainer = styled('div')`
  margin-top: 40px;
  width: 100%;
`;

export default MainContainer;
