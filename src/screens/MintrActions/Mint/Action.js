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
        </Navigation>
        <Top>
          <Intro>
            <ActionImage src='/images/actions/mint.svg' big />
            <H1>MINT</H1>
            <PLarge>
              Minting sUSD will lock your SNX, increasing your collateralization
              ratio, and will allow you to begin earning fees if you choose to
              sell your sUSD.
            </PLarge>
          </Intro>
          <Form>
            <PLarge>Confirm or enter amount to mint:</PLarge>
            <Input
              placeholder='0.00'
              leftComponent={<div>sUSD</div>}
              rightComponent={<ButtonMax />}
            />
          </Form>
        </Top>
        <Bottom>
          <Subtext marginBottom='32px'>
            GAS: $0.083 / SPEED: ~5:24 mins <Highlighted>EDIT</Highlighted>
          </Subtext>
          <ButtonPrimary onClick={handleNext} margin='auto'>
            MINT NOW
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
  height: ${props => (props.big ? '64px' : '48px')};
  width: ${props => (props.big ? '64px' : '48px')};
  margin-bottom: 8px;
`;

const Form = styled.div`
  margin: 0px 0px 80px 0px;
`;

const Highlighted = styled.span`
  font-family: 'apercu-bold';
  color: ${props => props.theme.colorStyles.hyperlink};
`;

export default Action;
