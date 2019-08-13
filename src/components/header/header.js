import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/themeContext';

import WalletStatusButton from '../wallet-status-button';

const Header = ({ t }) => {
  const themeState = useTheme();
  return (
    <HeaderWrapper>
      <Logo src="/images/mintr-logo.svg" />
      <WalletStatusButton>1111dfljhsdfdf111</WalletStatusButton>
      <div>
        <button onClick={() => themeState.toggle()}>
          {themeState.dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Logo = styled.img`
  width: 104px;
  margin-right: 18px;
`;

export default withTranslation()(Header);
