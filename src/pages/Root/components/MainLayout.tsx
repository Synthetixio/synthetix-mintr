import styled from 'styled-components';

import { FlexDiv } from 'styles/common';

const MainLayout = styled(FlexDiv)`
	flex-flow: column;
	width: 100%;
	height: 100vh;
	position: relative;
	background: ${({ theme }) => theme.colorStyles.background};
`;

export default MainLayout;
