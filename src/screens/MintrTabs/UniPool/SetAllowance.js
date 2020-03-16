import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { createTransaction } from '../../../ducks/transactions';
import { getNetworkSettings } from '../../../ducks/network';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { GWEI_UNIT } from '../../../constants/network';

import { PageTitle, PLarge } from '../../../components/Typography';
import { ButtonPrimary } from '../../../components/Button';

const ALLOWANCE_LIMIT = 100000000;

const SetAllowance = ({ networkSettings, createTransaction }) => {
	const { t } = useTranslation();
	const [error, setError] = useState(null);
	const { gasPrice } = networkSettings;

	const onUnlock = async () => {
		const { parseEther } = snxJSConnector.utils;
		const { uniswapContract, unipoolContract } = snxJSConnector;
		try {
			setError(null);

			const gasEstimate = await uniswapContract.estimate.approve(
				unipoolContract.address,
				parseEther(ALLOWANCE_LIMIT.toString())
			);
			const transaction = await uniswapContract.approve(
				unipoolContract.address,
				parseEther(ALLOWANCE_LIMIT.toString()),
				{
					gasLimit: Number(gasEstimate) + 10000,
					gasPrice: gasPrice * GWEI_UNIT,
				}
			);
			if (transaction) {
				createTransaction({
					hash: transaction.hash,
					status: 'pending',
					info: `Setting Uni-V1 LP token allowance`,
					hasNotification: true,
				});
			}
		} catch (e) {
			setError(e.message);
			console.log(e);
		}
	};
	return (
		<>
			<TitleContainer>
				<Logo src="/images/uniswap.svg" />
				<PageTitle>{t('unipool.title')}</PageTitle>
				<PLarge>{t('unipool.locked.subtitle')}</PLarge>
			</TitleContainer>
			<ButtonRow>
				<ButtonPrimary onClick={onUnlock}>{t('unipool.buttons.unlock')}</ButtonPrimary>
			</ButtonRow>
			{error ? <Error>{`Error: ${error}`}</Error> : null}
		</>
	);
};

const Logo = styled.img``;

const TitleContainer = styled.div`
	margin-top: 30px;
	text-align: center;
`;

const ButtonRow = styled.div`
	display: flex;
	width: 100%;
	justify-content: center;
	margin-top: 64px;
`;

const Error = styled.div`
	color: ${props => props.theme.colorStyles.brandRed};
	font-size: 16px;
	font-family: 'apercu-medium', sans-serif;
	display: flex;
	justify-content: center;
	margin-top: 40px;
`;

const mapStateToProps = state => ({
	networkSettings: getNetworkSettings(state),
});

const mapDispatchToProps = {
	createTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(SetAllowance);
