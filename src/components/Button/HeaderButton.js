import React from 'react';
import styled from 'styled-components';
import { ButtonTertiaryLabel } from '../Typography';

const DashboardHeaderButton = ({ children }) => {
  return (
    <Button>
      <ButtonTertiaryLabel>{children}</ButtonTertiaryLabel>
    </Button>
  );
};

const Button = styled.button`
  background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
  border: 1px solid ${props => props.theme.colorStyles.borders}
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 12px;
  justify-content: space-between;
  font-size: 14px;
  text-transform: uppercase;
`;

export default DashboardHeaderButton;
