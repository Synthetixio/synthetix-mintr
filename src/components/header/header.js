import React from 'react';
import { withTranslation } from 'react-i18next';

const Header = ({ t }) => {
  return (
    <div>
      <h1>{t('header.title')}</h1>
    </div>
  );
};

export default withTranslation()(Header);
