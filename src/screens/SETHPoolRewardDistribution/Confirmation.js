import React, { useContext } from 'react';
import styled from 'styled-components';
import { SlidePage, SliderContext } from '../../components/ScreenSlider';
import { ButtonTertiary } from '../../components/Button';
import { PLarge, PageTitle, Subtext } from '../../components/Typography';
import Spinner from '../../components/Spinner';

const Confirmation = () => {
  const { handlePrev } = useContext(SliderContext);
  return (
    <SlidePage>
      <Container>
        <Navigation>
          <ButtonTertiary onClick={() => handlePrev(1)}>Go Back</ButtonTertiary>
        </Navigation>
        <Top>
          <Intro>
            <ActionImage src="/images/wallets/ledger.svg" big />
            <PageTitle>Please confirm transaction</PageTitle>
            <PLarge>
              To continue, follow the prompts on your Ledger Wallet.
            </PLarge>
          </Intro>
        </Top>
        <Loading>
          <Spinner margin="auto" />
          <Subtext>Waiting for user response...</Subtext>
        </Loading>
        <Bottom>
          <Fees>
            <Subtext>Ethereum network fees (Gas): $0.083 </Subtext>
            <Subtext>Estimated transaction speed: ~5.24 mins</Subtext>
          </Fees>
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
  padding: 48px 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: space-between;
`;

const Navigation = styled.div`
  width: 100%;
  display: flex;
  text-align: left;
`;

const Top = styled.div`
  height: auto;
`;

const Intro = styled.div`
  max-width: 400px;
  margin: 0px auto 48px auto;
`;

const ActionImage = styled.img`
  height: ${props => (props.big ? '64px' : '48px')};
  width: ${props => (props.big ? '64px' : '48px')};
  margin-bottom: 16px;
`;

const Loading = styled.div`
  align-items: center;
`;

const Bottom = styled.div`
  height: auto;
  margin-bottom: 48px;
`;

const Fees = styled.div`
  height: auto;
`;

export default Confirmation;
