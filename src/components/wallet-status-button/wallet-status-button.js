import React from 'react';
import styled from 'styled-components';
import DashboardHeaderButton from '../dashboard-header-button';
import COLORS from '../../styles/colors';

const WalletStatusButton = ({ children }) => {
  return (
    <DashboardHeaderButton>
      <ButtonInner>
        <GreenDot />
        {children}
      </ButtonInner>
    </DashboardHeaderButton>
  );
};

const ButtonInner = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  font-family: 'apercu-regular';
  font-size: 14px;
`;

const GreenDot = styled.div`
  border-radius: 50%;
  width: 16px;
  height: 16px;
  margin-right: 12px;
  background-color: ${COLORS.brandGreen};
`;

export default WalletStatusButton;
