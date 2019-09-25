import React, { useContext } from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { shortenAddress } from '../../helpers/formatters';
import { Store } from '../../store';
// import { ThemeContext } from 'styled-components';

import { WalletStatusButton } from '../Button';
import { HeaderButton } from '../Button';
import ThemeSwitcher from '../ThemeSwitcher';

import { updateCurrentPage } from '../../ducks/ui';
// import { Globe } from '../Icons';

const Header = ({ t, currentWallet }) => {
  // const theme = useContext(ThemeContext);

  const {
    state: {
      ui: { themeIsDark },
    },
    dispatch,
  } = useContext(Store);
  return (
    <HeaderWrapper>
      <Logo src={`/images/mintr-logo-${themeIsDark ? 'light' : 'dark'}.svg`} />
      <WalletStatusButton
        onClick={() => updateCurrentPage('walletSelection', dispatch)}
      >
        {shortenAddress(currentWallet)}
      </WalletStatusButton>
      <HeaderButton>{t('dashboard.header.support')}</HeaderButton>
      {/* <GlobeButton>
        <Globe theme={theme} />
      </GlobeButton> */}
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

// const GlobeButton = styled.button`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border-radius: 30px;
//   height: 40px;
//   border: 1px solid ${props => props.theme.colorStyles.borders};
//   background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
// `;

export default withTranslation()(Header);
