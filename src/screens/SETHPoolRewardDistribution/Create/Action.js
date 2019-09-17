import React, { useState } from 'react';
import styled from 'styled-components';

import { SlidePage } from '../../../components/Slider';
import { ButtonTertiaryLabel } from '../../../components/Typography';
import { ButtonPrimaryMedium } from '../../../components/Button';
import CsvLoader from '../CsvLoader';

const CancelButton = ({ children, onClick }) => {
  return (
    <Button onClick={onClick}>
      <ButtonTertiaryLabel>{children}</ButtonTertiaryLabel>
    </Button>
  );
};

const MainContainer = ({ cancel, onCreate }) => {
  const [recipientsData, setRecipientsData] = useState([]);
  return (
    <SlidePage>
      <MainContainerWrapper>
        <Column>
          <CancelButton onClick={cancel}>Cancel</CancelButton>
          <CsvLoader onDataLoaded={setRecipientsData} />
          <ButtonPrimaryMedium onClick={() => onCreate(recipientsData)}>
            submit transaction
          </ButtonPrimaryMedium>
        </Column>
      </MainContainerWrapper>
    </SlidePage>
  );
};

const MainContainerWrapper = styled('div')`
  width: 100%;
  background-color: ${props => props.theme.colorStyles.background};
  padding: 40px;
`;

const Column = styled('div')`
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  background-color: transparent;
  border: 1px solid ${props => props.theme.colorStyles.borders};
  height: 32px;
  width: 100px;
  padding: 2px 5px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all ease-in 0.1s;
  &:hover,
  &:focus {
    background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
  }
  cursor: pointer;
  margin-bottom: 40px;
`;

export default MainContainer;
