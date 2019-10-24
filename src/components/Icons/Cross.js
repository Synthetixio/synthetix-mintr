import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';

const Cross = () => {
	const theme = useContext(ThemeContext);
	return (
		<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M12 10.586l7.071-7.071a1 1 0 0 1 1.414 1.414L13.415 12l7.07 7.071a1 1 0 0 1-1.414 1.414L12 13.415l-7.071 7.07a1 1 0 0 1-1.414-1.414L10.585 12l-7.07-7.071a1 1 0 0 1 1.414-1.414L12 10.585z"
				fill={theme.colorStyles.subtext}
				fillRule="evenodd"
			/>
		</svg>
	);
};

export default Cross;
