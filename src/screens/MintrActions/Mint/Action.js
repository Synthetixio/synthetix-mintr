/*eslint-disable */
import React, { useContext } from 'react';
import styled from 'styled-components';
import { SlidePage, SliderContext } from '../../../components/Slider';
import { ButtonTertiary } from '../../../components/Button';
import {
  PLarge,
  H1,
  ButtonPrimaryLabel,
  ButtonPrimaryLabelSmall,
  Subtext,
} from '../../../components/Typography';
import Input from '../../../components/Input';

const Action = ({ onDestroy }) => {
  const { handleNext } = useContext(SliderContext);
  return (
    <SlidePage>
      <Container>
        <ButtonTertiary onClick={onDestroy} alignSelf="flex-start">
          Cancel
        </ButtonTertiary>
        <ButtonTertiary onClick={handleNext} alignSelf="flex-start">
          Next
        </ButtonTertiary>
        <Intro>
          <ActionImage src="/images/actions/mint.svg" big />
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
            placeholder="enter an amout"
            leftComponent={<div>left</div>}
            rightComponent={<button>my button</button>}
          />
        </Form>
        <Subtext>
          GAS: $0.083 / SPEED: ~5:24 mins <Highlighted>EDIT</Highlighted>
        </Subtext>
        <ButtonPrimary>
          <ButtonPrimaryLabel margin="auto">MINT NOW</ButtonPrimaryLabel>
        </ButtonPrimary>
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
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 5px;
  box-shadow: 0px 5px 10px 5px ${props => props.theme.colorStyles.shadow1};
  margin-bottom: 20px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: space-around;
`;

const Intro = styled.div`
  max-width: 400px;
`;

const ActionImage = styled.img`
  height: ${props => (props.big ? '64px' : '48px')};
  width: ${props => (props.big ? '64px' : '48px')};
`;

const Form = styled.div`
  margin: 0px 0px 80px 0px;
`;

const InputField = styled.div`
  background-color: ${props => props.theme.colorStyles.panelButton};
  border: 1px solid ${props => props.theme.colorStyles.borders};
  inner-shadow: 0px 5px 10px 5px ${props => props.theme.colorStyles.shadow1};
  border-radius: 5px;
  height: 64px;
  width: 320px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const InputText = styled.span`
  font-size: 24px;
  display: flex;
  color: ${props => props.theme.colorStyles.heading};
`;

const Placeholder = styled.span`
  font-size: 24px;
  color: ${props => props.theme.colorStyles.subtext};
`;

const ButtonMax = styled.div`
  background-color: ${props => props.theme.colorStyles.buttonPrimaryBg};
  font-size: 14px;
  height: 32px;
  width: 56px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  border-radius: 3px;
  cursor: pointer;
  transition: transform ease-in 0.1s;
  &:hover {
    background-color: ${props => props.theme.colorStyles.buttonPrimaryBgFocus};
  }
`;

const Highlighted = styled.span`
  font-family: 'apercu-bold';
  color: ${props => props.theme.colorStyles.hyperlink};
`;

const ButtonPrimary = styled.div`
  width: 320px;
  height: 64px;
  margin-bottom: 64px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  text-align: center;
  background-color: ${props => props.theme.colorStyles.buttonPrimaryBg};
  transition: transform ease-in 0.1s;
  &:hover {
    background-color: ${props => props.theme.colorStyles.buttonPrimaryBgFocus};
    transform: translateY(-2px);
  }
`;

export default Action;
