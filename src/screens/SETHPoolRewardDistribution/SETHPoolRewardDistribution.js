import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

const MainContainer = () => {
  return (
    <MainContainerWrapper>
      Hello
    </MainContainerWrapper>
  );
};

const MainContainerWrapper = styled('div')`
  width: 100%;
  background-color: ${props => props.theme.colorStyles.background};
  padding: 40px;
`;

export default withTranslation()(MainContainer);
