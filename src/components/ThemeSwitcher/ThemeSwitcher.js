import React, { useContext } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Switch from 'react-switch';
import { ThemeContext } from 'styled-components';
import { toggleTheme, getCurrentTheme } from '../../ducks/ui';
import { isLightTheme } from '../../styles/themes';

const ThemeSwitcher = ({ currentTheme, toggleTheme }) => {
	const theme = useContext(ThemeContext);
	return (
		<Switch
			className={isLightTheme(currentTheme) ? 'light' : 'dark'}
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
			onChange={() => toggleTheme()}
			checked={!isLightTheme(currentTheme)}
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

const mapStateToProps = state => ({
	currentTheme: getCurrentTheme(state),
});

const mapDispatchToProps = {
	toggleTheme,
};

export default connect(mapStateToProps, mapDispatchToProps)(ThemeSwitcher);
