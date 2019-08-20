import React, { useContext } from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { Store } from '../../store';
import WalletStatusButton from '../wallet-status-button';
import DashboardHeaderButton from '../dashboard-header-button';
import ThemeSwitcher from '../theme-switcher';
import { ThemeContext } from 'styled-components';
import { Globe } from '../icons';

const Header = ({ t }) => {
  const theme = useContext(ThemeContext);
  const { state } = useContext(Store);
  return (
    <HeaderWrapper>
      <Logo
        src={`/images/mintr-logo-${
          state.ui.themeIsDark ? 'light' : 'dark'
        }.svg`}
      />
      <WalletStatusButton>0x3e...bAe0</WalletStatusButton>
      <DashboardHeaderButton>
        {t('dashboard.header.support')}
      </DashboardHeaderButton>
      <GlobeButton>
        <Globe theme={theme} />
      </GlobeButton>
      <ThemeSwitcher
        onLabel={t('dashboard.header.onLabel')}
        offLabel={t('dashboard.header.offLabel')}
      />
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

const Logo = styled.img`
  width: 104px;
  margin-right: 18px;
`;

const GlobeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  height: 40px;
  border: 1px solid ${props => props.theme.colorStyles.borders};
  background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
`;

export default withTranslation()(Header);
