import React, { useContext } from 'react';
import styled from 'styled-components';
import Switch from 'react-switch';
import { Store } from '../../store';
import { ThemeContext } from 'styled-components';
import { toggleTheme } from '../../ducks/ui';

import './ThemeSwitcher.css';

const ThemeSwitcher = () => {
	const { state, dispatch } = useContext(Store);
	const theme = useContext(ThemeContext);
	return (
		<Switch
			className={state.ui.themeIsDark ? 'dark' : 'light'}
			height={40}
			width={70}
			checkedIcon={
				<IconWrapper>
					<Icon src={'/images/dark-mode.svg'}></Icon>
				</IconWrapper>
			}
			uncheckedIcon={
				<IconWrapper>
					<Icon src={'/images/light-mode.svg'}></Icon>
				</IconWrapper>
			}
			handleDiameter={24}
			onChange={() => toggleTheme(!state.ui.themeIsDark, dispatch)}
			checked={state.ui.themeIsDark}
			offColor={theme.colorStyles.themeToggleBackgroundColor}
			onColor={theme.colorStyles.themeToggleBackgroundColor}
			onHandleColor={theme.colorStyles.themeToggleHandleColor}
			offHandleColor={theme.colorStyles.themeToggleHandleColor}
		/>
	);
};

const IconWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
`;
const Icon = styled.img`
	width: 25px;
`;

export default ThemeSwitcher;
