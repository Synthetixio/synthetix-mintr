import React, { useContext } from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import snxJSConnector, { connectToWallet } from '../../helpers/snxJSConnector';
import { hasWeb3, SUPPORTED_WALLETS, onMetamaskAccountChange } from '../../helpers/networkHelper';

import { Store } from '../../store';
import { updateCurrentPage } from '../../ducks/ui';
import { updateWalletStatus } from '../../ducks/wallet';

import { ButtonPrimaryMedium } from '../../components/Button';
import { H1, H2, PMega, PLarge } from '../../components/Typography';
import OnBoardingPageContainer from '../../components/OnBoardingPageContainer';

const onWalletClick = (wallet, dispatch) => {
	return async () => {
		const walletStatus = await connectToWallet(wallet);

		updateWalletStatus(walletStatus, dispatch);
		if (walletStatus && walletStatus.unlocked && walletStatus.currentWallet) {
			if (walletStatus.walletType === 'Metamask') {
				onMetamaskAccountChange(async () => {
					const address = await snxJSConnector.signer.getNextAddresses();
					const signer = new snxJSConnector.signers['Metamask']({});
					snxJSConnector.setContractSettings({
						networkId: walletStatus.networkId,
						signer,
					});
					if (address && address[0]) {
						updateWalletStatus({ currentWallet: address[0] }, dispatch);
					}
				});
			}
			updateCurrentPage('main', dispatch);
		} else updateCurrentPage('walletSelection', dispatch);
	};
};

const renderWalletButtons = dispatch => {
	return SUPPORTED_WALLETS.map(wallet => {
		const noMetamask = wallet === 'metamask' && !hasWeb3();
		const walletName = wallet === 'Coinbase' ? 'Coinbase Wallet' : wallet;
		return (
			<Wallet disabled={noMetamask} key={wallet}>
				<Icon src={`images/wallets/${wallet}.svg`} />
				<WalletTitle>
					<WalletConnectionH2>{walletName}</WalletConnectionH2>
					<PLarge mt={0}>{noMetamask ? '(not installed)' : ''}</PLarge>
				</WalletTitle>
				<ButtonPrimaryMedium disabled={noMetamask} onClick={onWalletClick(wallet, dispatch)}>
					Connect
				</ButtonPrimaryMedium>
			</Wallet>
		);
	});
};

const WalletConnection = ({ t }) => {
	const { dispatch } = useContext(Store);
	return (
		<OnBoardingPageContainer>
			<Content>
				<HeadingContent>
					<WalletConnectionH1>{t('walletConnection.intro.pageTitle')}</WalletConnectionH1>
					<WalletConnectionPMega>{t('walletConnection.intro.pageSubtitle')}</WalletConnectionPMega>
				</HeadingContent>
				<BodyContent>{renderWalletButtons(dispatch)}</BodyContent>
			</Content>
		</OnBoardingPageContainer>
	);
};

const HeadingContent = styled.div`
	width: 50%;
	max-width: 600px;
	margin: 0 auto;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
`;

const BodyContent = styled.div`
	width: 100%;
	margin: 100px auto 100px auto;
	max-width: 1400px;
	text-align: center;
	display: flex;
	justify-content: space-between;
`;

const Content = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const WalletConnectionH1 = styled(H1)`
	text-transform: capitalize;
	font-size: 48px;
`;

const WalletConnectionH2 = styled(H2)`
	text-transform: capitalize;
	font-size: 22px;
	margin: 40px 0 0 0;
`;

const WalletConnectionPMega = styled(PMega)`
	font-size: 22px;
	font-family: 'apercu-regular';
	text-align: center;
	line-height: 32px;
`;

const Wallet = styled.div`
	background-color: ${props => props.theme.colorStyles.panels};
	display: flex;
	width: 300px;
	height: 400px;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-radius: 2px;
	text-align: center;
	border: 1px solid ${props => props.theme.colorStyles.borders};
	opacity: ${props => (props.disabled ? '0.4' : 1)};
`;

const Icon = styled.img`
	width: 80px;
	height: 80px;
`;

const WalletTitle = styled.div`
	height: 120px;
`;

export default withTranslation()(WalletConnection);
