import React, { useContext } from 'react';
import styled from 'styled-components';
import { SlidePage, SliderContext } from '../../../components/Slider';
import { ButtonPrimary, ButtonSecondary } from '../../../components/Button';
import {
  PLarge,
  PageTitle,
  DataHeaderLarge,
} from '../../../components/Typography';

const Complete = () => {
  const { handleNext } = useContext(SliderContext);
  return (
    <SlidePage>
      <Container>
        <Top>
          <Intro>
            <ActionImage src='/images/success.svg' big />
            <PageTitle>Trading in progress!</PageTitle>
            <PLarge>
              Sent to the Ethereum network and will be available in your wallet
              shortly. You may close this window as the transaction completes in
              the background.
            </PLarge>
          </Intro>
          <Details>
            <Box>
              <DataHeaderLarge>TRADED:</DataHeaderLarge>
              <Amount>5,000.00 sUSD</Amount>
            </Box>
            <Box>
              <DataHeaderLarge>RECEIVED:</DataHeaderLarge>
              <Amount>5,000.00 SNX</Amount>
            </Box>
          </Details>
        </Top>
        <Bottom>
          <Buttons>
            <ButtonSecondary>VIEW ON ETHERSCAN</ButtonSecondary>
            <ButtonPrimary onClick={handleNext}>
              FINISH & RETURN HOME
            </ButtonPrimary>
          </Buttons>
        </Bottom>
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

const Intro = styled.div`
  max-width: 530px;
  margin-top: 24px;
  margin-bottom: 48px;
`;

const ActionImage = styled.img`
  height: ${props => (props.big ? '64px' : '48px')};
  width: ${props => (props.big ? '64px' : '48px')};
  margin-bottom: 24px;
`;

const Details = styled.div`
  display: flex;
  margin-bottom: 48px;
`;

const Box = styled.div`
  height: auto;
  width: auto;
  padding: 24px 40px;
  margin: 0px 16px;
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 2px;
  display: flex;
  flex-direction: column;
`;

const Amount = styled.span`
  color: ${props => props.theme.colorStyles.hyperlink};
  font-family: 'apercu-medium';
  font-size: 24px;
  margin: 16px 0px 0px 0px;
`;

const Buttons = styled.div`
  height: auto;
  & :first-child {
    margin-bottom: 24px;
  }
`;

const Top = styled.div`
  height: auto;
`;

const Bottom = styled.div`
  height: auto;
  margin-bottom: 32px;
`;

export default Complete;
