import React, { useState } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';

import { SlidePage } from '../../../components/Slider';
import { PLarge, PageTitle } from '../../../components/Typography';
import { ButtonPrimary, ButtonTertiary } from '../../../components/Button';
import CsvLoader from '../CsvLoader';

import { getAirdropper } from '../hooks';

import addresses from '../contracts/addresses.json';

const MainContainer = ({ goHome, onConfirm, multisendTx }) => {
  const [match, setMatch] = useState(null);
  const onDataLoaded = recipientsData => {
    const airdropper = getAirdropper();
    const recipientsAddresses = [];
    const recipientsShares = [];
    recipientsData.forEach(item => {
      recipientsAddresses.push(item[0]);
      recipientsShares.push(ethers.utils.parseEther(Number(item[1]).toFixed(6)).toString());
    });
    const transactionData = airdropper.functions.multisend.encode([addresses.token, recipientsAddresses, recipientsShares]);
    if (transactionData === multisendTx.data) {
      onConfirm();
    }
    setMatch(transactionData === multisendTx.data);
  }
  return (
    <SlidePage>
      <Container>
        <Navigation>
          <ButtonTertiary onClick={goHome}>Cancel</ButtonTertiary>
        </Navigation>
        <PageTitle fontSize={32} marginTop={50}>
          How do you like to confirm?
        </PageTitle>
        <CsvLoaderContainer>
          <CsvLoader onDataLoaded={onDataLoaded} />
          {match === false && <PLarge>Not match</PLarge>}
        </CsvLoaderContainer>
        <ConfirmButtonContainer>
          <ButtonPrimary onClick={() => onConfirm()}>
            or sign without uploading
          </ButtonPrimary>
        </ConfirmButtonContainer>
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
  margin-bottom: 20px;
  width: 100%;
`;

const ConfirmButtonContainer = styled.div`
  margin-top: auto;
  margin-bottom: 80px;
`;

export default MainContainer;
