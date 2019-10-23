import React from 'react';
import styled from 'styled-components';

import { PLarge } from '../Typography';

const LanguageDropdown = () => {
	return (
		<Wrapper>
			<Languages>
				{['English'].map(language => {
					return (
						<LanguageElement key={language} onClick={() => console.log(language)}>
							<LanguageImage src={`/images/languages/${language}.svg`}></LanguageImage>
							<PLarge>{language}</PLarge>
						</LanguageElement>
					);
				})}
			</Languages>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	margin-top: 16px;
	padding: 16px;
	background-color: ${props => props.theme.colorStyles.panels};
	border: 1px solid ${props => props.theme.colorStyles.borders};
	box-shadow: 0px 5px 10px 5px ${props => props.theme.colorStyles.shadow1};
	border-radius: 5px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	position: absolute;
	z-index: 1;
`;

const Languages = styled.ul`
	padding: 0;
	margin: 0;
`;

const LanguageElement = styled.li`
	padding: 16px;
	display: flex;
	align-items: center;
	border-radius: 2px;
	cursor: pointer;
	&:hover {
		background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
		color: ${props => props.theme.colorStyles.buttonPrimaryText};
	}
`;

const LanguageImage = styled.img`
	height: 24px;
	margin-right: 16px;
`;

export default LanguageDropdown;
