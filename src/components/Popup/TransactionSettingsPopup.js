import React from 'react';
import styled from 'styled-components';
import PopupContainer from './PopupContainer';
import { PageTitle, PLarge, DataHeaderLarge, DataLarge } from '../Typography';
import { ButtonPrimary } from '../Button';

import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

const Handle = Slider.Handle;

const handle = ({ value, dragging, index, ...restProps }) => {
  return (
    <Tooltip
      prefixCls='rc-slider-tooltip'
      overlay={value}
      visible={dragging}
      placement='top'
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

const RatesData = () => {
  const data = [
    {
      speed: 'SLOW',
      eth: '0.063',
      gwei: '0.063',
      mins: '0.063',
    },
    {
      speed: 'MEDIUM',
      eth: '0.063',
      gwei: '0.063',
      mins: '0.063',
    },
    {
      speed: 'FAST',
      eth: '0.063',
      gwei: '0.063',
      mins: '0.063',
    },
  ];
  return (
    <RatesDataWrapper>
      <Range>
        {data.map((dataElement, i) => {
          return (
            <Rates key={i}>
              <DataHeaderLarge marginBottom='8px'>
                {dataElement.speed}
              </DataHeaderLarge>
              <DataLarge marginBottom='4px'>{dataElement.eth} ETH</DataLarge>
              <DataLarge marginBottom='4px'>{dataElement.gwei} GWEI</DataLarge>
              <DataLarge marginBottom='4px'>{dataElement.mins} mins</DataLarge>
            </Rates>
          );
        })}
      </Range>
    </RatesDataWrapper>
  );
};

const TransactionSettingsPopup = () => {
  return (
    <PopupContainer margin='auto'>
      <Wrapper>
        <Intro>
          <PageTitle>Set transaction speed and gas</PageTitle>
          <PLarge>
            Adjust the slider below to set the transaction speed and Ethereum
            Network Fees (Gas) before proceeding.
          </PLarge>
        </Intro>
        <SliderWrapper>
          <Slider min={0} max={20} defaultValue={3} handle={handle} />
          <RatesData />
        </SliderWrapper>
        <ButtonWrapper>
          <ButtonPrimary>SUBMIT</ButtonPrimary>
        </ButtonWrapper>
      </Wrapper>
    </PopupContainer>
  );
};

const Wrapper = styled.div`
  margin: 24px auto;
  padding: 64px;
  height: auto;
  width: 720px;
  background-color: ${props => props.theme.colorStyles.panels};
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 5px;
  box-shadow: 0px 5px 10px 8px ${props => props.theme.colorStyles.shadow1};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const Intro = styled.div`
  width: 400px;
  text-align: center;
  margin-bottom: 72px;
`;

const SliderWrapper = styled.div`
  width: 480px;
  margin: 0 auto 40px auto;
`;

const ButtonWrapper = styled.div`
  margin: 24px auto 32px auto;
`;

const Range = styled.div`
  margin: 24px auto 0 auto;
  display: flex;
  flex-direction: row;
  text-align: center;
`;

const RatesDataWrapper = styled.div``;

const Rates = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
`;

export default TransactionSettingsPopup;
