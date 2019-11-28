import React, { useContext } from 'react';

import { Store } from '../../store';

import styled from 'styled-components';

export default function Logo({ className }) {
	const {
		state: {
			ui: { themeIsDark },
		},
	} = useContext(Store);
	return (
		<Link href="/" className={className}>
			<LogoImg src={`/images/mintr-logo-${themeIsDark ? 'light' : 'dark'}.svg`} />
		</Link>
	);
}

const Link = styled.a`
	width: 120px;
	margin-right: 18px;
`;
const LogoImg = styled.img`
	width: 100%;
`;
