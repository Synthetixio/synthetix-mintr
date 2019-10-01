import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { SlidePage } from '../../../components/ScreenSlider';
import TransactionPriceIndicator from '../../../components/TransactionPriceIndicator';
import {
  ButtonPrimary,
  ButtonTertiary,
  ButtonMax,
} from '../../../components/Button';
import { PLarge, H1, Subtext } from '../../../components/Typography';
import Input from '../../../components/Input';
import ErrorMessage from '../../../components/ErrorMessage';

const Action = ({
  t,
  onDestroy,
  synthBalances,
  baseSynth,
  onTrade,
  onBaseSynthChange,
  baseAmount,
  quoteAmount,
  setBaseAmount,
  setQuoteAmount,
  isFetchingGasLimit,
  gasEstimateError,
}) => {
  const onBaseAmountChange = amount => {
    setBaseAmount(amount);
    setQuoteAmount(amount ? Number(amount) * Number(baseSynth.rate) : '');
  };

  const onQuoteAmountChange = amount => {
    setQuoteAmount(amount);
    setBaseAmount(amount ? Number(amount) / Number(baseSynth.rate) : '');
  };

  return (
    <SlidePage>
      <Container>
        <Navigation>
          <ButtonTertiary onClick={onDestroy}>
            {t('button.navigation.cancel')}
          </ButtonTertiary>
          <ButtonTertiary>
            {t('mintrActions.trade.action.buttons.exchange')}↗
          </ButtonTertiary>
        </Navigation>
        <Top>
          <Intro>
            <ActionImage src="/images/actions/trade.svg" big />
            <H1>{t('mintrActions.trade.action.pageTitle')}</H1>
            <PLarge>{t('mintrActions.trade.action.pageSubtitle')}</PLarge>
          </Intro>
          <Form>
            <Input
              isDisabled={!synthBalances}
              synths={synthBalances}
              onSynthChange={onBaseSynthChange}
              value={baseAmount}
              onChange={e => onBaseAmountChange(e.target.value)}
              placeholder="0.00"
              currentSynth={baseSynth}
              rightComponent={
                <ButtonMax
                  onClick={() => onBaseAmountChange(baseSynth.balance)}
                />
              }
            />
            <ErrorMessage message={gasEstimateError} />
            <PLarge>↓</PLarge>
            <Input
              isDisabled={!synthBalances}
              singleSynth={'sUSD'}
              placeholder="0.00"
              value={quoteAmount}
              onChange={e => onQuoteAmountChange(e.target.value)}
            />
          </Form>
        </Top>
        <Bottom>
          <Subtext>{t('network.tradingFee')} 0.5%</Subtext>
          {/* <Subtext>RATE: 1.00 sUSD = 0.00004 sBTC </Subtext> */}
          <TransactionPriceIndicator />
          <ButtonPrimary
            disabled={isFetchingGasLimit || gasEstimateError}
            onClick={() => onTrade(baseAmount, quoteAmount)}
            margin="auto"
          >
            {t('mintrActions.trade.action.buttons.trade')}
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
  padding: 0 64px;
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
  padding: 20px 0;
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
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default withTranslation()(Action);
