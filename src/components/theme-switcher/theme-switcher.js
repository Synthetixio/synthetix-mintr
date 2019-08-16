import React, { useContext } from 'react';
import styled from 'styled-components';
import Switch from 'react-switch';
import { useTheme } from '../../contexts/themeContext';
import { ThemeContext } from 'styled-components';

const ThemeSwitcher = ({ props, onLabel, offLabel }) => {
  const { dark, toggle } = useTheme();
  const theme = useContext(ThemeContext);
  return (
    <Switch
      height={40}
      width={96}
      checkedIcon={<Label>{onLabel}</Label>}
      uncheckedIcon={<Label>{offLabel}</Label>}
      handleDiameter={24}
      onChange={toggle}
      checked={dark}
      offColor={theme.colorStyles.themeToggleBackgroundColor}
      onColor={theme.colorStyles.themeToggleBackgroundColor}
      onHandleColor={theme.colorStyles.themeToggleHandleColor}
      offHandleColor={theme.colorStyles.themeToggleHandleColor}
    />
  );
};

const Label = styled.span`
  text-transform: uppercase;
  display: flex;
  align-items: center;
  height: 100%;
	justify-content: center;
	font-family: 'apercu-medium';
	color: ${props => props.theme.colorStyles.themeToggleFontColor}
  font-size: 14px;
`;

export default ThemeSwitcher;
