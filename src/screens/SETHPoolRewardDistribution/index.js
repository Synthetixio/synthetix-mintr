import React, { useState } from 'react';
import styled from 'styled-components';

import PageContainer from '../../components/PageContainer';
import Slider from '../../components/Slider';
import Create from './Create';
import List from './List';

const getComponent = page => {
  switch (page) {
    case 'create':
      return Create;
    default:
      return null;
  }
};

const SETHPoolRewardDistribution = () => {
  const [page, setPage] = useState(null);
  let slider = null;
  if (page) {
    const PageComponent = getComponent(page);
    slider =
      <Slider>
        <PageComponent goHome={() => setPage(null)} />
      </Slider>;
  }
  return (
    <MainContainerWrapper>
      <PageContainer>
        {slider}
        <List setPage={setPage} />
      </PageContainer>
    </MainContainerWrapper>
  );
};

const MainContainerWrapper = styled('div')`
  width: 100%;
  background-color: ${props => props.theme.colorStyles.background};
`;

export default SETHPoolRewardDistribution;
