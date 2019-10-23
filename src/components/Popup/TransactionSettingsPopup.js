import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { withTranslation, useTranslation } from 'react-i18next';

import { Store } from '../../store';
import { formatCurrency } from '../../helpers/formatters';
import { getTransactionPrice } from '../../helpers/networkHelper';

import { updateGasPrice } from '../../ducks/network';
import { toggleTransactionSettingsPopup } from '../../ducks/ui';

import PopupContainer from './PopupContainer';
import { PageTitle, PLarge, DataHeaderLarge, DataLarge } from '../Typography';
import { ButtonPrimary } from '../Button';
import Slider from '../Slider';

const RatesData = ({ gasInfo }) => {
	const { t } = useTranslation();
	return (
		<RatesDataWrapper>
			<Range>
				{gasInfo.map((gas, i) => {
					return (
						<Rates key={i}>
							<DataHeaderLarge marginBottom="8px" style={{ textTransform: 'capitalize' }}>
								{gas.speed}
							</DataHeaderLarge>
							<DataLarge marginBottom="4px">${formatCurrency(gas.price)}</DataLarge>
							<DataLarge marginBottom="4px">{gas.gwei} GWEI</DataLarge>
							<DataLarge marginBottom="4px">
								{gas.time} {t('transactionSettings.minutes')}
							</DataLarge>
						</Rates>
					);
				})}
			</Range>
		</RatesDataWrapper>
	);
};

const renderTooltipContent = ({ gasPrice, usdPrice }) => {
	return (
		<TooltipInner>
			<TooltipValue>{gasPrice} GWEI</TooltipValue>
			<TooltipValue>${formatCurrency(usdPrice)}</TooltipValue>
		</TooltipInner>
	);
};

const TransactionSettingsPopup = ({ t }) => {
	const {
		state: {
			network: {
				gasStation,
				ethPrice,
				settings: { gasPrice, gasLimit },
			},
		},
		dispatch,
	} = useContext(Store);

	const [currentTransactionSettings, setTransactionSettings] = useState({
		gasPrice,
		usdPrice: getTransactionPrice(gasPrice, gasLimit, ethPrice),
	});

	const gasInfo = gasStation
		? Object.keys(gasStation).map(speed => {
				return {
					...gasStation[speed],
					speed,
					price: gasStation[speed].getPrice(gasLimit, ethPrice),
				};
		  })
		: [];
	return (
		<PopupContainer margin="auto">
			<Wrapper>
				<Intro>
					<PageTitle>{t('transactionSettings.pageTitle')}</PageTitle>
					<PLarge>{t('transactionSettings.pageSubtitle')}</PLarge>
				</Intro>
				<SliderWrapper>
					<Slider
						min={0}
						max={50}
						defaultValue={currentTransactionSettings.gasPrice}
						tooltipRenderer={() => renderTooltipContent(currentTransactionSettings)}
						onChange={newPrice =>
							setTransactionSettings({
								gasPrice: newPrice,
								usdPrice: getTransactionPrice(newPrice, gasLimit, ethPrice),
							})
						}
					/>
					{gasStation ? <RatesData gasInfo={gasInfo} /> : null}
				</SliderWrapper>
				<ButtonWrapper>
					<ButtonPrimary
						onClick={() => {
							updateGasPrice(currentTransactionSettings.gasPrice, dispatch);
							toggleTransactionSettingsPopup(false, dispatch);
						}}
					>
						{t('transactionSettings.button.submit')}
					</ButtonPrimary>
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
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
`;

const Intro = styled.div`
	width: 400px;
	text-align: center;
	margin-bottom: 88px;
`;

const SliderWrapper = styled.div`
	width: 480px;
	margin: 8px auto 32px auto;
`;

const ButtonWrapper = styled.div`
	margin: 16px auto 32px auto;
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

const TooltipInner = styled.div`
	padding: 8px 12px;
`;
const TooltipValue = styled.div`
	margin-bottom: 4px;
`;

export default withTranslation()(TransactionSettingsPopup);
