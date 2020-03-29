import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getCurrentTheme } from '../../ducks/ui';

const Logo = ({ className, themeIsDark }) => {
	return (
		<Link href="/" className={className}>
			<LogoImg src={`/images/mintr-logo-${themeIsDark ? 'light' : 'dark'}.svg`} />
		</Link>
	);
};

const mapStateToProps = state => ({
	themeIsDark: getCurrentTheme(state),
});

export default connect(mapStateToProps, {})(Logo);

const Link = styled.a`
	width: 120px;
	margin-right: 18px;
`;
const LogoImg = styled.img`
	width: 100%;
`;
