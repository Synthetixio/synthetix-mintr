/*eslint-disable */
import React, { useContext } from 'react';
import styled from 'styled-components';
import { SlidePage, SliderContext } from '../../../components/Slider';
import {
  ButtonPrimary,
  ButtonTertiary,
  ButtonMax,
} from '../../../components/Button';
import {
  PLarge,
  H1,
  ButtonPrimaryLabel,
  Subtext,
  InputTextLarge,
} from '../../../components/Typography';
import Input from '../../../components/Input';

const Action = ({ onDestroy }) => {
  const { handleNext } = useContext(SliderContext);
  return (
    <SlidePage>
      <Container>
        <Navigation>
          <ButtonTertiary onClick={onDestroy}>Cancel</ButtonTertiary>
          <ButtonTertiary>Open in sX ↗</ButtonTertiary>
        </Navigation>
        <Top>
          <Intro>
            <ActionImage src='/images/actions/trade.svg' big />
            <H1>TRADE</H1>
            <PLarge>
              Trade your sUSD and Synths on the Synthetix.Exchange. Use this
              window for a quick transfer, or click the ‘Open in sX ↗’ button
              above for more detail.
            </PLarge>
          </Intro>
          <Form>
            <Input
              placeholder='0.00'
              leftComponent={
                <Type>
                  <img
                    src='/images/sUSD-icon.svg'
                    height='24px'
                    style={{ marginRight: '8px' }}
                  />
                  <PLarge>sUSD</PLarge>
                </Type>
              }
              rightComponent={<ButtonMax />}
            />
            <Input
              placeholder='0.00'
              leftComponent={
                <Type>
                  <img
                    src='/images/sUSD-icon.svg'
                    height='24px'
                    style={{ marginRight: '8px' }}
                  />
                  <PLarge>sUSD</PLarge>
                </Type>
              }
              rightComponent={<ButtonMax />}
            />
          </Form>
        </Top>
        <Bottom>
          <Fees>
            <Subtext>TRADING FEE: 0.3%</Subtext>
            <Subtext>RATE: 1.00 sUSD = 0.00004 sBTC </Subtext>
            <Subtext>
              GAS: $0.083 / SPEED: ~5:24 mins <Highlighted>EDIT</Highlighted>
            </Subtext>
          </Fees>
          <ButtonPrimary onClick={handleNext} margin='auto'>
            TRADE NOW
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
  margin-bottom: 48px;
`;

const ActionImage = styled.img`
  height: ${props => (props.big ? '64px' : '48px')};
  width: ${props => (props.big ? '64px' : '48px')};
  margin-bottom: 8px;
`;

const Form = styled.div`
  margin: 0px 0px 24px 0px;
  height: 160px;
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
  color: ${props => props.theme.colorStyles.hyperlink};
`;

const Fees = styled.div`
  margin-bottom: 32px;
`;

export default Action;
