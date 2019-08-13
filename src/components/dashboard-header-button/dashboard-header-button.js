import React from 'react';
import styled from 'styled-components';
import COLORS from '../../styles/colors';

const DashboardHeaderButton = ({ children }) => {
  return <Button>{children}</Button>;
};

const Button = styled.button`
  background-color: white;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 12px;
  justify-content: space-between;
  font-family: 'apercu-regular';
  font-size: 14px;
`;

export default DashboardHeaderButton;
