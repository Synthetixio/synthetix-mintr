import React, { useContext } from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { shortenAddress } from '../../helpers/formatters';
import { Store } from '../../store';

import { WalletStatusButton } from '../Button';
import ThemeSwitcher from '../ThemeSwitcher';

import { updateCurrentPage } from '../../ducks/ui';
import { Globe, SupportBubble } from '../Icons';

const Header = ({ t, currentWallet }) => {
  const {
    state: {
      ui: { themeIsDark },
      wallet: { networkName },
    },
    dispatch,
  } = useContext(Store);
  return (
    <HeaderWrapper>
      <HeaderBlock>
        <Logo
          src={`/images/mintr-logo-${themeIsDark ? 'light' : 'dark'}.svg`}
        />
        <Network>{networkName}</Network>
      </HeaderBlock>
      <HeaderBlock>
        <WalletStatusButton
          onClick={() => updateCurrentPage('walletSelection', dispatch)}
        >
          {shortenAddress(currentWallet)}
        </WalletStatusButton>
        <RoundButton>
          <SupportBubble />
        </RoundButton>
        <RoundButton>
          <Globe />
        </RoundButton>
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

const Logo = styled.img`
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
