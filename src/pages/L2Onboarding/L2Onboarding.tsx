import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { ReactComponent as CloseIcon } from '../../assets/images/close-icon.svg';
import DashboardHeaderButton from '../../components/Button/HeaderButton';
import { setCurrentPage, getCurrentTheme } from '../../ducks/ui';
import { PAGES_BY_KEY } from 'constants/ui';
import { connect } from 'react-redux';
import { l2darkTheme, l2lightTheme, isDarkTheme } from '../../styles/l2';

interface L2OnboardingProps {
	setCurrentPage: Function;
	currentTheme: 'dark' | 'light';
}

export const L2Onboarding: React.FC<L2OnboardingProps> = ({ setCurrentPage, currentTheme }) => {
	const themeStyle = isDarkTheme(currentTheme) ? l2darkTheme : l2lightTheme;
	const [step, setStep] = useState<number>(0);
	return (
		<ThemeProvider theme={themeStyle}>
			<ContainerPage>
				<StyledHeaderRow>
					<StyledCloseIcon onClick={() => setCurrentPage(PAGES_BY_KEY.MAIN)} />
					<DashboardHeaderButton onClick={() => {}}>READ THE BLOG POST</DashboardHeaderButton>
				</StyledHeaderRow>
			</ContainerPage>
		</ThemeProvider>
	);
};

const ContainerPage = styled.div`
	width: 100%;
	padding: 48px;
`;

const StyledCloseIcon = styled(CloseIcon)`
	width: 48px;
	cursor: pointer;
`;

const StyledHeaderRow = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
`;

const mapStateToProps = (state: any) => ({
	currentTheme: getCurrentTheme(state),
});

const mapDispatchToProps = {
	setCurrentPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(L2Onboarding);
