import React, { useState } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';

import { SlidePage } from '../../../components/Slider';
import { ButtonTertiaryLabel, PLarge } from '../../../components/Typography';
import { ButtonPrimary } from '../../../components/Button';
import CsvLoader from '../CsvLoader';

import { getAirdropper } from '../hooks';

import addresses from '../contracts/addresses.json';

const CancelButton = ({ children, onClick }) => {
  return (
    <Button onClick={onClick}>
      <ButtonTertiaryLabel>{children}</ButtonTertiaryLabel>
    </Button>
  );
};

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
      <MainContainerWrapper>
        <Column>
          <CancelButton onClick={goHome}>Cancel</CancelButton>
          <CsvLoader onDataLoaded={onDataLoaded} />
          {match === false && <PLarge>Not match</PLarge>}
          <br />
          <ButtonPrimary onClick={() => onConfirm()}>
            or sign without uploading
          </ButtonPrimary>
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
