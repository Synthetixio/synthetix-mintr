import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { formatCurrency } from '../../../helpers/formatters';
import { SlidePage } from '../../../components/ScreenSlider';

import { ButtonPrimary, ButtonTertiary } from '../../../components/Button';
import { PLarge, H1, Subtext } from '../../../components/Typography';

const Action = ({ t, onDestroy, onWithdraw, amountAvailable }) => {
  return (
    <SlidePage>
      <Container>
        <Navigation>
          <ButtonTertiary onClick={onDestroy}>
            {t('withdraw.action.buttons.cancel')}
          </ButtonTertiary>
        </Navigation>
        <Top>
          <Intro>
            <ActionImage src='/images/actions/withdraw.svg' />
            <H1>{t('withdraw.action.intro.h')}</H1>
            <PLarge>{t('withdraw.action.intro.p')}</PLarge>
            <Amount>{formatCurrency(amountAvailable)}sUSD</Amount>
          </Intro>
        </Top>
        <Bottom>
          <Subtext marginBottom='32px'>
            {t('withdraw.action.fees.p')} <Highlighted>EDIT</Highlighted>
          </Subtext>
          <ButtonPrimary onClick={() => onWithdraw()} margin='auto'>
            {t('withdraw.action.buttons.withdraw')}
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
  margin-bottom: 80px;
`;

const Bottom = styled.div`
  height: auto;
  margin-bottom: 40px;
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
  height: 48px;
  width: 48px;
  margin-bottom: 8px;
`;

const Amount = styled.span`
  color: ${props => props.theme.colorStyles.body};
  font-family: 'apercu-medium';
  font-size: 24px;
  margin: 8px 0px 0px 0px;
`;

const Highlighted = styled.span`
  font-family: 'apercu-bold';
  color: ${props => props.theme.colorStyles.hyperlink};
`;

export default withTranslation()(Action);
