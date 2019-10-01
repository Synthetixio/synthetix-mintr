import React, { useState } from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { SlidePage } from '../../../components/ScreenSlider';
import { formatCurrency } from '../../../helpers/formatters';

import {
  ButtonPrimary,
  ButtonTertiary,
  ButtonMax,
} from '../../../components/Button';
import { PLarge, H1, Subtext } from '../../../components/Typography';
import Input from '../../../components/Input';

const Action = ({ t, onDestroy, onDeposit, sUSDBalance }) => {
  const [amount, setAmount] = useState('');
  return (
    <SlidePage>
      <Container>
        <Navigation>
          <ButtonTertiary onClick={onDestroy}>
            {t('button.navigation.back')}
          </ButtonTertiary>
        </Navigation>
        <Top>
          <Intro>
            <ActionImage src='/images/actions/deposit.svg' />
            <H1>{t('deposit.action.intro.pageTitle')}</H1>
            <PLarge>{t('deposit.action.intro.amountSubtitle')}</PLarge>
            <Amount>${formatCurrency(sUSDBalance)}</Amount>
          </Intro>
          <Form>
            <PLarge>{t('deposit.action.instruction')}</PLarge>
            <Input
              onChange={e => setAmount(e.target.value)}
              value={amount}
              placeholder='0.00'
              leftComponent={
                <Type>
                  <img
                    src='/images/currencies/sUSD.svg'
                    height='24px'
                    style={{ marginRight: '8px' }}
                  />
                  <PLarge>sUSD</PLarge>
                </Type>
              }
              rightComponent={
                <ButtonMax
                  onClick={() => {
                    setAmount(sUSDBalance);
                  }}
                />
              }
            />
          </Form>
        </Top>
        <Bottom>
          <Subtext marginBottom='32px'>
            {t('network.gas')} <Highlighted>EDIT</Highlighted>
          </Subtext>
          <ButtonPrimary onClick={() => onDeposit(amount)} margin='auto'>
            {t('deposit.action.buttons.deposit')}
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
  margin-bottom: 64px;
`;

const Navigation = styled.div`
  width: 100%;
  display: flex;
  text-align: left;
`;

const Intro = styled.div`
  max-width: 380px;
  margin-bottom: 64px;
`;

const ActionImage = styled.img`
  height: 64px;
  width: 64px;
  margin-bottom: 8px;
`;

const Amount = styled.span`
  color: ${props => props.theme.colorStyles.body};
  font-family: 'apercu-medium';
  font-size: 24px;
  margin: 8px 0px 0px 0px;
`;

const Form = styled.div`
  margin: 0px 0px 80px 0px;
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

export default withTranslation()(Action);
