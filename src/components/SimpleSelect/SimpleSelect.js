import React, { useContext } from 'react';
import Select from 'react-select';
import { ThemeContext } from 'styled-components';

const IndicatorSeparator = () => {
	return null;
};

export default function SimpleSelect(props) {
	const theme = useContext(ThemeContext);
	return (
		<Select
			theme={selectStandardTheme => ({
				...selectStandardTheme,
				colors: {
					...selectStandardTheme.colors,
					primary: theme.colorStyles.brandBlue,
				},
			})}
			components={{ IndicatorSeparator }}
			{...props}
		></Select>
	);
}
