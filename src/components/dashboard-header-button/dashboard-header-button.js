import React from 'react';
import styled from 'styled-components';
import COLORS from '../../styles/colors';
import { ButtonTertiary } from '../typography';

const DashboardHeaderButton = ({ children }) => {
  return <Button><ButtonTertiary>{children}</ButtonTertiary></Button>;
};

const Button = styled.button`
  background-color: ${props => props.theme.colorStyles.buttonTertiary};
  border: 1px solid ${props => props.theme.colorStyles.borders}
  color: ${props => props.theme.colorStyles.subtext}
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 12px;
  justify-content: space-between;
  font-family: 'apercu-regular';
  font-size: 14px;
  text-transform: uppercase;
`;

export default DashboardHeaderButton;
