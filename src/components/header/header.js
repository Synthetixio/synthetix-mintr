import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import WalletStatusButton from '../wallet-status-button';
import DashboardHeaderButton from '../dashboard-header-button';
import ThemeSwitcher from '../theme-switcher';

const Header = ({ t }) => {
  return (
    <HeaderWrapper>
      <Logo src="/images/mintr-logo.svg" />
      <WalletStatusButton>1111dfljhsdfdf111</WalletStatusButton>
      <DashboardHeaderButton>SUPPORT</DashboardHeaderButton>
      <GlobeButton>
        <GlobeIcon src="/images/globe.svg" />
      </GlobeButton>
      <ThemeSwitcher />
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
`;

const GlobeIcon = styled.img`
  width: 25x;
  height: 24px;
`;

export default withTranslation()(Header);
