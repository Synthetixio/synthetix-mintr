import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';

const SupportBubble = () => {
	const theme = useContext(ThemeContext);
	return (
		<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
			<g fill="none" fillRule="evenodd">
				<path d="M0 0h32v32H0z" />
				<path
					d="M25.5 22.953a.9.9 0 0 0 .9-.9V7.5a.9.9 0 0 0-.9-.9h-19a.9.9 0 0 0-.9.9v14.553a.9.9 0 0 0 .9.9h1.618v2.472a.6.6 0 0 0 1.071.372l2.249-2.844H25.5zm-16.582-.8H6.5a.1.1 0 0 1-.1-.1V7.5a.1.1 0 0 1 .1-.1h19a.1.1 0 0 1 .1.1v14.553a.1.1 0 0 1-.1.1H11.05L8.919 24.85v-2.696z"
					fill={theme.colorStyles.subtext}
				/>
				<path
					d="M13 12.772C13.056 11.288 14.176 10 16.066 10c1.806 0 2.94 1.106 2.94 2.674 0 2.016-2.38 2.212-2.38 3.906v.518c0 .098-.042.14-.14.14h-.896c-.098 0-.14-.042-.14-.14v-.42c0-2.226 2.38-2.464 2.38-3.99 0-.98-.7-1.568-1.764-1.568-.98 0-1.778.56-1.918 1.652-.014.098-.042.14-.14.14h-.868c-.098 0-.14-.042-.14-.14zm2.478 5.768h1.12c.098 0 .14.042.14.14v1.12c0 .098-.042.14-.14.14h-1.12c-.098 0-.14-.042-.14-.14v-1.12c0-.098.042-.14.14-.14z"
					fill={theme.colorStyles.subtext}
				/>
			</g>
		</svg>
	);
};

export default SupportBubble;
