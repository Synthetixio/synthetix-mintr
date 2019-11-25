import React from 'react';
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';

import { PLarge } from '../Typography';
import i18n from 'i18next';

const SUPPORTED_LANGUAGES = ['en', 'es', 'ru', 'zh', 'zh-tw'];

const codeToLang = code => {
	switch (code) {
		case 'en':
			return 'English';
		case 'fr':
			return 'French';
		case 'es':
			return 'Spanish';
		case 'ru':
			return 'Russian';
		case 'zh':
			return 'Chinese';
		case 'zh-tw':
			return 'Chinese (Traditional)';
	}
};

const LanguageDropdown = ({ setIsVisible, isVisible, position }) => {
	if (!isVisible) return null;
	return (
		<OutsideClickHandler onOutsideClick={() => setIsVisible(false)}>
			<Wrapper style={{ ...position }}>
				<Languages>
					{SUPPORTED_LANGUAGES.map(language => {
						return (
							<LanguageElement key={language} onClick={() => i18n.changeLanguage(language)}>
								<LanguageImage src={`/images/languages/${language}.svg`}></LanguageImage>
								<PLarge m={0}>{codeToLang(language)}</PLarge>
							</LanguageElement>
						);
					})}
				</Languages>
			</Wrapper>
		</OutsideClickHandler>
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
	padding: 5px 10px;
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
	height: 18px;
	margin-right: 16px;
`;

export default LanguageDropdown;
