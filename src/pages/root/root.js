import React from 'react';
import Header from '../../components/header';
import { withTranslation } from 'react-i18next';

const Root = ({ t }) => {
  return (
    <div className="App">
      <Header> </Header>
      <ul>
        <li style={{ display: 'inline', margin: '0 20px' }}>
          {t('menu.home')}
        </li>
        <li style={{ display: 'inline', margin: '0 20px' }}>
          {t('menu.depot')}
        </li>
        <li style={{ display: 'inline', margin: '0 20px' }}>
          {t('menu.transactionHistory')}
        </li>
        <li style={{ display: 'inline', margin: '0 20px' }}>
          {t('menu.escrow')}
        </li>
      </ul>
      <h2>{t('body.title')}</h2>
      <p>{t('body.description')}</p>
    </div>
  );
};

export default withTranslation()(Root);
