import React, { useState } from 'react';
import styled from 'styled-components';
import {
  PageTitle,
  PLarge,
  H1,
  H2,
  PMega,
} from '../../../../components/typography';
import { Mint } from '../../scenario';

const initialScenario = null;

const renderScenario = (currentScenario, setCurrentScenario) => {
  if (!currentScenario) return;
  let ScenarioComponent = null;
  switch (currentScenario) {
    case 'mint':
      ScenarioComponent = Mint;
      break;
    default:
      ScenarioComponent = null;
  }
  return <ScenarioComponent onDestroy={() => setCurrentScenario(null)} />;
};

const Home = () => {
  const [currentScenario, setCurrentScenario] = useState(initialScenario);

  return (
    <HomeWrapper>
      <Container>
        {renderScenario(currentScenario, setCurrentScenario)}
        <PageTitle>What would you like to do?</PageTitle>
        <PLarge>
          Click any button below to view more info, confirm or change the amount
          before submitting.
        </PLarge>
        <ButtonRow margin="30px 0 40px 0">
          <Button onClick={() => setCurrentScenario('mint')} big>
            <ButtonContainer>
              <ActionImage src="/images/actions/mint.svg" big />
              <H1>Mint</H1>
              <PMega>lock SNX to mint sUSD</PMega>
            </ButtonContainer>
          </Button>
          <Button big>
            <ButtonContainer>
              <ActionImage src="/images/actions/burn.svg" big />
              <H1>Burn</H1>
              <PMega>burn sUSD to unlock SNX</PMega>
            </ButtonContainer>
          </Button>
        </ButtonRow>
        <ButtonRow margin="0 0 40px 0">
          <Button>
            <ButtonContainer>
              <ActionImage src="/images/actions/claim.svg" />
              <H2>Claim</H2>
              <PLarge>sUSD and SNX staking rewards</PLarge>
            </ButtonContainer>
          </Button>
          <Button>
            <ButtonContainer>
              <ActionImage src="/images/actions/trade.svg" />
              <H2>Trade</H2>
              <PLarge>Synths on the Synthetix.Exchange</PLarge>
            </ButtonContainer>
          </Button>
          <Button>
            <ButtonContainer>
              <ActionImage src="/images/actions/send.svg" />
              <H2>Send</H2>
              <PLarge>sUSD or SNX to another wallet</PLarge>
            </ButtonContainer>
          </Button>
        </ButtonRow>
      </Container>
    </HomeWrapper>
  );
};

const HomeWrapper = styled.div`
  padding: 40px 48px 0 48px;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  overflow: hidden;
`;

const Button = styled.button`
  flex: 1;
  cursor: pointer;
  height: 352px;
  max-width: ${props => (props.big ? '336px' : '216px')};
  background-color: ${props => props.theme.colorStyles.panelButton};
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 5px;
  box-shadow: 0px 5px 10px 5px ${props => props.theme.colorStyles.shadow1};
  transition: transform ease-in 0.2s;
  &:hover {
    background-color: ${props => props.theme.colorStyles.panelButtonHover};
    box-shadow: 0px 5px 10px 8px ${props => props.theme.colorStyles.shadow1};
    transform: translateY(-2px);
  }
`;

const ButtonContainer = styled.div`
  max-width: 140px;
  margin: 0 auto;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${props => (props.margin ? props.margin : 0)};
`;

const ActionImage = styled.img`
  height: ${props => (props.big ? '64px' : '48px')};
  width: ${props => (props.big ? '64px' : '48px')};
`;

export default Home;
