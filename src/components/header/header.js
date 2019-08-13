import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/themeContext';

const Header = ({ t }) => {
  const themeState = useTheme();
  return (
    <HeaderWrapper>
      <h1>{t('header.title')}</h1>
      <div>
        <button onClick={() => themeState.toggle()}>
          {themeState.dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled('div')`
  display: flex;
`;

export default withTranslation()(Header);
