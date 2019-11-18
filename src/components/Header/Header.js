import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { shortenAddress } from '../../helpers/formatters';
import { Store } from '../../store';

import { WalletStatusButton } from '../Button';
import ThemeSwitcher from '../ThemeSwitcher';

import { updateCurrentPage } from '../../ducks/ui';
import { Globe, SupportBubble } from '../Icons';

import { LanguageDropdown } from '../../components/Dropdown';
import Logo from '../../components/Logo';

const Header = ({ t, currentWallet }) => {
	const {
		state: {
			wallet: { networkName },
		},
		dispatch,
	} = useContext(Store);
	const [flagDropdownIsVisible, setFlagVisibility] = useState(false);
	return (
		<HeaderWrapper>
			<HeaderBlock>
				<SmallLogo />
				<Network>{networkName}</Network>
			</HeaderBlock>
			<HeaderBlock>
				<WalletStatusButton onClick={() => updateCurrentPage('walletSelection', dispatch)}>
					{shortenAddress(currentWallet)}
				</WalletStatusButton>
				<RoundButton as="a" href="https://help.synthetix.io/hc/en-us" target="_blank">
					<SupportBubble />
				</RoundButton>
				<LanguageButtonWrapper>
					<RoundButton onClick={() => setFlagVisibility(true)}>
						<Globe />
					</RoundButton>
					<LanguageDropdown
						isVisible={flagDropdownIsVisible}
						setIsVisible={setFlagVisibility}
						position={{ left: 0 }}
					/>
				</LanguageButtonWrapper>
				<ThemeSwitcher
					onLabel={t('dashboard.header.onLabel')}
					offLabel={t('dashboard.header.offLabel')}
				/>
			</HeaderBlock>
		</HeaderWrapper>
	);
};

const HeaderWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 85px;
	padding: 0 32px;
`;

const HeaderBlock = styled.div`
	display: flex;
`;

const SmallLogo = styled(Logo)`
	width: 104px;
	margin-right: 8px;
`;

const RoundButton = styled.button`
	margin: 0 5px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 30px;
	padding: 0;
	height: 40px;
	width: 40px;
	border: 1px solid ${props => props.theme.colorStyles.borders};
	background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
`;

const LanguageButtonWrapper = styled.div`
	position: relative;
`;

const Network = styled.div`
	margin-top: 4px;
	background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
	display: flex;
	align-items: center;
	text-transform: uppercase;
	color: ${props => props.theme.colorStyles.themeToggleFontColor};
	padding: 5px 10px;
	font-size: 14px;
	border-radius: 2px;
`;

export default withTranslation()(Header);
