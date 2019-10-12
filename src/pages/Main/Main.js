import React, { useEffect, useContext } from 'react';
import styled from 'styled-components';

import snxJSConnector from '../../helpers/snxJSConnector';
import { getNetworkInfo } from '../../helpers/networkHelper';
import { bytesFormatter, bigNumberFormatter } from '../../helpers/formatters';
import { updateNetworkInfo } from '../../ducks/network';
import { Store } from '../../store';

import Dashboard from '../../screens/Dashboard';
import MintrPanel from '../../screens/MintrPanel';
import SETHPoolRewardDistribution from '../../screens/SETHPoolRewardDistribution';

const Main = () => {
  const { dispatch } = useContext(Store);
  useEffect(() => {
    const fetchNetworkInfo = async () => {
      try {
        const [networkInfo, ethPrice] = await Promise.all([
          getNetworkInfo(),
          snxJSConnector.snxJS.ExchangeRates.rateForCurrency(
            bytesFormatter('ETH')
          ),
        ]);
        updateNetworkInfo(networkInfo, bigNumberFormatter(ethPrice), dispatch);
      } catch (e) {
        console.log('Error while trying to fetch network data', e);
      }
    };
    const fetchLoop = setInterval(fetchNetworkInfo, 5 * 60 * 1000);
    fetchNetworkInfo();
    return () => clearInterval(fetchLoop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainWrapper>
      <Dashboard />
      {window.location.pathname === '/multisig' ? (
        <SETHPoolRewardDistribution />
      ) : (
        <MintrPanel />
      )}
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  display: flex;
  width: 100%;
`;

export default Main;
