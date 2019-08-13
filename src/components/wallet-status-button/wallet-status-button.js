import React from 'react';
import styled from 'styled-components';
import COLORS from '../../styles/colors';

const WalletStatusButton = ({ children }) => {
  return (
    <Button>
      <GreenDot />
      {children}
    </Button>
  );
};

const Button = styled.button`
  background-color: white;
  width: 161px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 12px;
  justify-content: space-between;
  font-family: 'apercu-regular';
  font-size: 14px;
`;

const GreenDot = styled.div`
  border-radius: 50%;
  width: 16px;
  height: 16px;
  background-color: ${COLORS.green};
`;

export default WalletStatusButton;
