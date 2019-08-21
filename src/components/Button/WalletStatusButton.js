import React from 'react';
import styled from 'styled-components';
import { HeaderButton } from '../Button';
import COLORS from '../../styles/colors';

const WalletStatusButton = ({ children }) => {
  return (
    <HeaderButton>
      <ButtonInner>
        <GreenDot />
        {children}
      </ButtonInner>
    </HeaderButton>
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
