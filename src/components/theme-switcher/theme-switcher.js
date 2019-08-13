import React, { useContext } from 'react';
import styled from 'styled-components';
import Switch from 'react-switch';
import { useTheme } from '../../contexts/themeContext';
import { ThemeContext } from 'styled-components';

const ThemeSwitcher = ({ props }) => {
  const { dark, toggle } = useTheme();
  const theme = useContext(ThemeContext);
  return (
    <Switch
      height={40}
      width={96}
      checkedIcon={<Label>Dark</Label>}
      uncheckedIcon={<Label>Light</Label>}
      handleDiameter={24}
      onChange={toggle}
      checked={dark}
      offColor={theme.themeToggleBackgroundColor}
      onColor={theme.themeToggleBackgroundColor}
      onHandleColor={theme.themeToggleHandleColor}
      offHandleColor={theme.themeToggleHandleColor}
    />
  );
};

const Label = styled.span`
  text-transform: uppercase;
  display: flex;
  align-items: center;
  height: 100%;
	justify-content: center;
	color: ${props => props.theme.themeToggleFontColor}
  font-size: 14px;
`;

export default ThemeSwitcher;
