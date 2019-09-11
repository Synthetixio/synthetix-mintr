import React, { useState } from 'react';
import styled from 'styled-components';

import { formatCurrency } from '../../../helpers/formatters';
import { SlidePage } from '../../../components/Slider';
import {
  ButtonPrimary,
  ButtonTertiary,
  ButtonMax,
} from '../../../components/Button';
import {
  PLarge,
  H1,
  Subtext,
  DataHeaderLarge,
} from '../../../components/Typography';
import Input from '../../../components/Input';

const Action = ({ onDestroy, onSend, transferableSNX }) => {
  const [amount, setAmount] = useState('');
  const [destinationWallet, setDestinationWallet] = useState('');
  return (
    <SlidePage>
      <Container>
        <Navigation>
          <ButtonTertiary onClick={onDestroy}>Cancel</ButtonTertiary>
        </Navigation>
        <Top>
          <Intro>
            <ActionImage src="/images/actions/send.svg" big />
            <H1>SEND</H1>
            <PLarge>Transfer your ETH, SNX or Synths to another wallet.</PLarge>
          </Intro>
          <Details>
            <Box>
              <DataHeaderLarge>TRANSFERABLE AMOUNT:</DataHeaderLarge>
              <Amount>{formatCurrency(transferableSNX)} SNX</Amount>
            </Box>
          </Details>
        </Top>
        <Middle>
          <Form>
            <PLarge>Enter amount or select max available:</PLarge>
            <Input
              onChange={e => setAmount(e.target.value)}
              value={amount}
              placeholder="0.00"
              leftComponent={
                <Type>
                  <img
                    src="/images/currencies/sUSD.svg"
                    height="24px"
                    style={{ marginRight: '8px' }}
                  />
                  <PLarge>sUSD</PLarge>
                </Type>
              }
              rightComponent={
                <ButtonMax onClick={() => setAmount(transferableSNX)} />
              }
            />
            <PLarge marginTop="32px">
              Enter wallet address to send funds to:
            </PLarge>
            <Input
              onChange={e => setDestinationWallet(e.target.value)}
              value={destinationWallet}
              placeholder="e.g. 0x3b18a4..."
            />
          </Form>
        </Middle>
        <Bottom>
          <Subtext marginBottom="32px">
            GAS: $0.083 / SPEED: ~5:24 mins <Highlighted>EDIT</Highlighted>
          </Subtext>
          <ButtonPrimary
            disabled={!destinationWallet || !amount}
            onClick={() => onSend(amount, destinationWallet)}
            margin="auto"
          >
            SEND NOW
          </ButtonPrimary>
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

const Top = styled.div`
  height: auto;
  margin-bottom: -16px;
`;

const Middle = styled.div`
  height: auto;
  margin: 0px auto 16px auto;
`;

const Bottom = styled.div`
  height: auto;
  margin-bottom: 32px;
`;

const Navigation = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Intro = styled.div`
  max-width: 530px;
  margin-bottom: 24px;
`;

const ActionImage = styled.img`
  height: ${props => (props.big ? '64px' : '48px')};
  width: ${props => (props.big ? '64px' : '48px')};
`;

const Details = styled.div`
  display: flex;
  margin-bottom: 32px;
`;

const Box = styled.div`
  height: auto;
  width: auto;
  padding: 16px 24px;
  margin: auto;
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Amount = styled.span`
  color: ${props => props.theme.colorStyles.hyperlink};
  font-family: 'apercu-medium';
  font-size: 16px;
  margin-left: 16px;
`;

const Form = styled.div`
  margin: 0px 0px 24px 0px;
  height: auto;
  display: flex;
  flex-direction: column;
`;

const Type = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  width: 100%;
  justify-content: space-between;
`;

const Highlighted = styled.span`
  font-family: 'apercu-bold';
  margin-left: 8px;
  color: ${props => props.theme.colorStyles.hyperlink};
`;

export default Action;
