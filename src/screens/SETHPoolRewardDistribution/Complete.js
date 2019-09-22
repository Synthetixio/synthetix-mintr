import React, { Fragment } from 'react';
import styled from 'styled-components';
import { SlidePage } from '../../components/ScreenSlider';
import { ButtonPrimary, ButtonSecondary } from '../../components/Button';
import { PLarge, PageTitle, Subtext } from '../../components/Typography';

const Success = ({ goHome, transaction }) => {
  return (
    <Fragment>
      <Top>
        <Intro>
          <ActionImage src="/images/success.svg" big />
          <PageTitle>Success!</PageTitle>
          <PLarge>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </PLarge>
        </Intro>
      </Top>
      <Fees>
        <Subtext>Ethereum network fees (Gas): $0.083 </Subtext>
        <Subtext>Estimated transaction speed: ~5.24 mins</Subtext>
      </Fees>
      <Bottom>
        <Buttons>
          <ButtonSecondary
            onClick={() =>
              window.open(
                `https://etherscan.io/tx/${transaction.hash}`,
                '_blank'
              )
            }
          >
            VERIFY TRANSACTION
          </ButtonSecondary>
          <ButtonPrimary onClick={goHome}>FINISH & RETURN HOME</ButtonPrimary>
        </Buttons>
      </Bottom>
    </Fragment>
  );
};

const Failure = ({ error, goHome }) => {
  return (
    <Fragment>
      <Top>
        <Intro>
          <ActionImage src="/images/failure.svg" big />
          <PageTitle>Something went wrong...</PageTitle>
          {error.code ? <PLarge>Code: {error.code}</PLarge> : null}
          <PLarge>{error.message}</PLarge>
        </Intro>
      </Top>
      <Bottom>
        <Buttons>
          <ButtonPrimary onClick={goHome}>OK</ButtonPrimary>
        </Buttons>
      </Bottom>
    </Fragment>
  );
};

const Complete = props => {
  return (
    <SlidePage>
      <Container>
        {props && props.error ? (
          <Failure {...props}></Failure>
        ) : (
          <Success {...props}></Success>
        )}
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

const Buttons = styled.div`
  height: auto;
  & > :first-child {
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

const Fees = styled.div`
  height: auto;
`;

export default Complete;
