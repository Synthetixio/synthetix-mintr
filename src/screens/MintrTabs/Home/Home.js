import React, { useState, Fragment } from 'react';
import styled from 'styled-components';

import {
  PageTitle,
  PLarge,
  H1,
  H2,
  PMega,
} from '../../../components/Typography';
import PageContainer from '../../../components/PageContainer';

import MintrAction from '../../MintrActions';

const initialScenario = null;

const actionMapper = {
  mint: 'Mint sUSD by locking SNX',
  burn: 'Burn sUSD and unlock SNX',
  claim: 'sUSD and SNX staking rewards',
  trade: 'Trade any synth to sUSD',
  send: 'Send any synth and SNX',
};

const renderHomeButtons = setCurrentScenario => {
  return (
    <Fragment>
      <PageTitle>What would you like to do?</PageTitle>
      <PLarge>
        Click any button below to view more info, confirm or change the amount
        before submitting.
      </PLarge>
      <ButtonRow margin='30px 0 40px 0'>
        {['mint', 'burn'].map(action => {
          return (
            <Button key={action} onClick={() => setCurrentScenario(action)} big>
              <ButtonContainer>
                <ActionImage src={`/images/actions/${action}.svg`} big />
                <H1>{action}</H1>
                <PMega>{actionMapper[action]}</PMega>
              </ButtonContainer>
            </Button>
          );
        })}
      </ButtonRow>
      <ButtonRow margin='0 0 40px 0'>
        {['claim', 'trade', 'send'].map(action => {
          return (
            <Button key={action} onClick={() => setCurrentScenario(action)}>
              <ButtonContainer>
                <ActionImage src={`/images/actions/${action}.svg`} />
                <H2>{action}</H2>
                <PLarge>{actionMapper[action]}</PLarge>
              </ButtonContainer>
            </Button>
          );
        })}
      </ButtonRow>
    </Fragment>
  );
};

const Home = () => {
  const [currentScenario, setCurrentScenario] = useState(initialScenario);
  return (
    <PageContainer>
      <MintrAction
        action={currentScenario}
        onDestroy={() => setCurrentScenario(null)}
      />
      {renderHomeButtons(setCurrentScenario)}
    </PageContainer>
  );
};

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
