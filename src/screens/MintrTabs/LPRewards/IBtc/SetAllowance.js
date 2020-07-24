import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { createTransaction } from '../../../../ducks/transactions';
import { getCurrentGasPrice } from '../../../../ducks/network';

import snxJSConnector from '../../../../helpers/snxJSConnector';

import { TOKEN_ALLOWANCE_LIMIT } from '../../../../constants/network';

import { PageTitle, PLarge } from '../../../../components/Typography';
import { ButtonPrimary, ButtonTertiary } from '../../../../components/Button';

const GAS_LIMIT_BUFFER = 10000;

const SetAllowance = ({ createTransaction, goBack, currentGasPrice }) => {
	const { t } = useTranslation();
	const [error, setError] = useState(null);

	const onUnlock = async () => {
		const {
			snxJS: { iBTC },
			utils: { parseEther },
			iBtcRewardsContract,
		} = snxJSConnector;
		try {
			setError(null);

			const gasEstimate = await iBTC.contract.estimate.approve(
				iBtcRewardsContract.address,
				parseEther(TOKEN_ALLOWANCE_LIMIT.toString())
			);

			const transaction = await iBTC.approve(
				iBtcRewardsContract.address,
				parseEther(TOKEN_ALLOWANCE_LIMIT.toString()),
				{
					gasLimit: Number(gasEstimate) + GAS_LIMIT_BUFFER,
					gasPrice: currentGasPrice.formattedPrice,
				}
			);
			if (transaction) {
				createTransaction({
					hash: transaction.hash,
					status: 'pending',
					info: t(`ibtc.locked.transaction`),
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
			<Navigation>
				<ButtonTertiary onClick={goBack}>{t('button.navigation.back')}</ButtonTertiary>
			</Navigation>
			<TitleContainer>
				<Logo src="/images/currencies/iBTC.svg" />
				<PageTitle>{t('ibtc.title')}</PageTitle>
				<PLarge>{t('ibtc.locked.subtitle')}</PLarge>
			</TitleContainer>
			<ButtonRow>
				<ButtonPrimary onClick={onUnlock}>{t('lpRewards.shared.buttons.unlock')}</ButtonPrimary>
			</ButtonRow>
			{error ? <Error>{`Error: ${error}`}</Error> : null}
		</>
	);
};

const Logo = styled.img`
	width: 64px;
`;

const Navigation = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 40px;
`;

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
	currentGasPrice: getCurrentGasPrice(state),
});

const mapDispatchToProps = {
	createTransaction,
};

export default connect(mapStateToProps, mapDispatchToProps)(SetAllowance);
