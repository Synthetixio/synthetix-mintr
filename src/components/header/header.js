import React from 'react';
import { withTranslation } from 'react-i18next';

const Header = ({ t }) => {
  return <h1>{t('header.title')}</h1>;
};

export default withTranslation()(Header);
