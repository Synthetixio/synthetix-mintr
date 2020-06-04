import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { formatCurrency } from '../../helpers/formatters';
import { getTransactionPrice } from '../../helpers/networkHelper';

import { setCurrentGasPrice, getNetworkPrices, getCurrentGasPrice } from '../../ducks/network';
import { hideModal } from '../../ducks/modal';
import { getEthRate } from '../../ducks/rates';

import ModalContainer from './ModalContainer';
import { PageTitle, PLarge, DataHeaderLarge, DataLarge } from '../Typography';
import { ButtonPrimary } from '../Button';
import Slider from '../Slider';
import { SimpleInput } from '../Input';

const RatesData = ({ gasInfo }) => {
	const { t } = useTranslation();
	return (
		<RatesDataWrapper>
			<Range>
				{gasInfo.map((gas, i) => {
					return (
						<Rates key={i}>
							<DataHeaderLarge marginBottom="8px" style={{ textTransform: 'capitalize' }}>
								{t(`transactionSettings.speed.${gas.speed.toLowerCase()}`)}
							</DataHeaderLarge>
							<DataLarge marginBottom="4px">${formatCurrency(gas.transactionPrice)}</DataLarge>
							<DataLarge marginBottom="4px">{`${gas.price} GWEI`}</DataLarge>
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

const renderTooltipContent = (gasPrice, transactionPrice) => {
	return (
		<TooltipInner>
			<TooltipValue>{gasPrice} GWEI</TooltipValue>
			<TooltipValue>${formatCurrency(transactionPrice)}</TooltipValue>
		</TooltipInner>
	);
};

const GweiModal = ({
	networkPrices,
	setCurrentGasPrice,
	hideModal,
	currentGasPrice,
	gasLimit,
	ethRate,
}) => {
	const { t } = useTranslation();
	const [gasPriceSettings, setGasPriceSettings] = useState(
		currentGasPrice ? currentGasPrice.price : null
	);
	const gasInfo = networkPrices
		? Object.keys(networkPrices).map(speed => {
				const price = networkPrices[speed].price || 0;
				return {
					...networkPrices[speed],
					speed,
					transactionPrice: getTransactionPrice(price, gasLimit, ethRate),
				};
		  })
		: [];
	return (
		<ModalContainer margin="auto">
			<Wrapper>
				<Intro>
					<PageTitle>{t('transactionSettings.title')}</PageTitle>
					<PLarge>{t('transactionSettings.subtitle')}</PLarge>
				</Intro>
				<Input
					type="number"
					step={0.1}
					placeholder={t('transactionSettings.placeholder')}
					onChange={e => {
						const newPrice = e.target.value;
						setGasPriceSettings(newPrice);
					}}
					value={gasPriceSettings}
				/>
				<SliderWrapper>
					<Slider
						min={0}
						max={50}
						value={gasPriceSettings}
						tooltipRenderer={() =>
							renderTooltipContent(
								gasPriceSettings,
								getTransactionPrice(gasPriceSettings, gasLimit, ethRate)
							)
						}
						onChange={newPrice => setGasPriceSettings(newPrice)}
					/>
					{networkPrices ? <RatesData gasInfo={gasInfo} /> : null}
				</SliderWrapper>
				<ButtonWrapper>
					<ButtonPrimary
						onClick={() => {
							setCurrentGasPrice({ gasPrice: gasPriceSettings });
							hideModal();
						}}
					>
						{t('transactionSettings.button.submit')}
					</ButtonPrimary>
				</ButtonWrapper>
			</Wrapper>
		</ModalContainer>
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

const Input = styled(SimpleInput)`
	margin-bottom: 10px;
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		appearance: none;
	}
`;

const Intro = styled.div`
	width: 400px;
	text-align: center;
	margin-bottom: 50px;
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

const mapStateToProps = state => ({
	networkPrices: getNetworkPrices(state),
	currentGasPrice: getCurrentGasPrice(state),
	ethRate: getEthRate(state),
});

const mapDispatchToProps = {
	setCurrentGasPrice,
	hideModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(GweiModal);
