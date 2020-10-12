import React, { FC, useEffect, useState } from 'react';
import { Contract, providers } from 'ethers';
import styled from 'styled-components';
import { ReactComponent as DiagonalArrow } from '../../assets/images/cross.svg';
import { setCurrentPage } from '../../ducks/ui';
import { connect } from 'react-redux';
import { fontFamilies } from 'styles/themes';
import { RootState } from 'ducks/types';
import { getSNXBalance } from 'ducks/balances';
import { getCurrentWallet, getCurrentNetworkId } from 'ducks/wallet';
import snxJSConnector from 'helpers/snxJSConnector';
import { INFURA_JSON_RPC_URLS } from 'helpers/networkHelper';

const GOERLI_NETWORK_ID = 5;
const SYNTHETIX_GOERLI_ADDRESS = '0x50608a26BFf103290a4A47B152395047801E9280';
const STORAGE_ITEM = 'hideBannerGoerliAirdrop';

interface L2BannerProps {
	setCurrentPage: Function;
	walletAddress: string;
	snxBalance: number;
	networkId: number;
}
const L2Banner: FC<L2BannerProps> = ({ setCurrentPage, snxBalance, walletAddress, networkId }) => {
	const [showBanner, setShowBanner] = useState(null);

	useEffect(() => {
		const getBalance = async () => {
			if (localStorage.getItem(`${STORAGE_ITEM}-${walletAddress}`)) return;
			if (networkId === GOERLI_NETWORK_ID) return;
			try {
				const {
					snxJS: { contractSettings },
				} = snxJSConnector;
				const goerliProvider = new providers.JsonRpcProvider(
					INFURA_JSON_RPC_URLS[GOERLI_NETWORK_ID]
				);
				const SynthetixGoerli = new Contract(
					SYNTHETIX_GOERLI_ADDRESS,
					contractSettings.ABIS.Synthetix,
					goerliProvider
				);
				const balanceSNX = await SynthetixGoerli.balanceOf(walletAddress);
				setShowBanner(Number(balanceSNX));
			} catch (e) {
				console.log(e);
				setShowBanner(null);
			}
		};
		getBalance();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [walletAddress]);

	const onCloseButton = () => {
		setShowBanner(false);
		localStorage.setItem(`${STORAGE_ITEM}-${walletAddress}`, JSON.stringify(true));
	};

	return showBanner ? (
		<ContainerBanner>
			<StyledPMedium>
				This wallet is eligible to participate in the Optimistic Ethereum L2 Testnet Trial - Try it
				out now by connecting to the Goerli network!
			</StyledPMedium>
			<CloseButton onClick={onCloseButton}>
				<DiagonalArrow />
			</CloseButton>
		</ContainerBanner>
	) : null;
};

const ContainerBanner = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 2px;
	width: 100%;
	background: linear-gradient(100.67deg, #0885fe 34.26%, #4e3cbd 69.86%);
	color: white;
	position: relative;
`;
const StyledPMedium = styled.p`
	font-size: 14px;
	line-height: 16px;
	font-family: ${fontFamilies.regular};
	color: white;
	text-transform: uppercase;
	margin-right: 4px;
`;

const CloseButton = styled.button`
	position: absolute;
	right: 20px;
	background: none;
	border: none;
	cursor: pointer;
`;

const mapStateToProps = (state: RootState) => ({
	snxBalance: getSNXBalance(state),
	walletAddress: getCurrentWallet(state),
	networkId: getCurrentNetworkId(state),
});

const mapDispatchToProps = {
	setCurrentPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(L2Banner);
