import React, { useContext } from 'react';
import styled from 'styled-components';
import { SlidePage, SliderContext } from '../../../components/Slider';
import { ButtonTertiary } from '../../../components/Button';
import {
  PLarge,
  PageTitle,
  ButtonPrimaryLabel,
  ButtonSecondaryLabel,
  Subtext,
  DataHeaderLarge,
} from '../../../components/Typography';

const Confirmation = ({ onDestroy }) => {
  const { handlePrev } = useContext(SliderContext);
  return (
    <SlidePage>
      <Container>
        <Navigation>
          <ButtonTertiary margin='8px' onClick={onDestroy}>
            Cancel
          </ButtonTertiary>
          <ButtonTertiary margin='8px' onClick={handlePrev}>
            Go Back
          </ButtonTertiary>
        </Navigation>
        <Intro>
          <ActionImage src='/images/ledger.svg' big />
          <PageTitle>Please confirm transaction</PageTitle>
          <PLarge>
            To continue, follow the prompts on your Ledger Wallet.
          </PLarge>
        </Intro>
        <Details>
          <Box>
            <DataHeaderLarge>MINTING:</DataHeaderLarge>
            <Amount>5,000.00 sUSD</Amount>
          </Box>
          <Box>
            <DataHeaderLarge>BY BURNING:</DataHeaderLarge>
            <Amount>5,000.00 SNX</Amount>
          </Box>
        </Details>
        <Fees>
          <Subtext>Ethereum network fees (Gas): $0.083 </Subtext>
          <Subtext>Estimated transaction speed: ~5.24 mins</Subtext>
        </Fees>
        <ButtonSecondary>
          <ButtonSecondaryLabel margin='auto'>
            VIEW ON ETHERSCAN
          </ButtonSecondaryLabel>
        </ButtonSecondary>
        <ButtonPrimary>
          <ButtonPrimaryLabel margin='auto'>WAITING...</ButtonPrimaryLabel>
        </ButtonPrimary>
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
  justify-content: space-around;
`;

const Navigation = styled.div`
  width: 100%;
  display: flex;
  text-align: left;
`;

const Intro = styled.div`
  max-width: 400px;
`;

const ActionImage = styled.img`
  height: ${props => (props.big ? '64px' : '48px')};
  width: ${props => (props.big ? '64px' : '48px')};
`;

const ButtonPrimary = styled.div`
  width: 320px;
  height: 64px;
  margin-bottom: 64px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  text-align: center;
  background-color: ${props => props.theme.colorStyles.buttonPrimaryBg};
  transition: all ease-in 0.1s;
  &:hover {
    background-color: ${props => props.theme.colorStyles.buttonPrimaryBgFocus};
  }
`;

const ButtonSecondary = styled.div`
  width: 320px;
  height: 64px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  text-align: center;
  border: 2px solid ${props => props.theme.colorStyles.buttonPrimaryBg};
  transition: all ease-in 0.1s;
  &:hover {
    background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
  }
`;

const Details = styled.div`
  display: flex;
`;

const Box = styled.div`
  height: auto;
  width: auto;
  padding: 24px 40px;
  margin: 0px 16px;
  border: 1px solid ${props => props.theme.colorStyles.borders};
  display: flex;
  flex-direction: column;
`;

const Amount = styled.span`
  color: ${props => props.theme.colorStyles.hyperlink};
  font-family: 'apercu-medium';
  font-size: 24px;
  margin: 16px 0px 0px 0px;
`;

const Fees = styled.div`
  height: auto;
`;

export default Confirmation;
