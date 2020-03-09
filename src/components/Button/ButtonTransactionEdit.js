import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { toggleGweiPopup } from '../../ducks/ui';

const Button = ({ toggleGweiPopup }) => {
	const { t } = useTranslation();
	return <ButtonWrapper onClick={() => toggleGweiPopup()}>{t('button.edit')}</ButtonWrapper>;
};

const ButtonWrapper = styled.button`
	font-family: 'apercu-bold', sans-serif;
	border: none;
	background-color: transparent;
	font-size: 15px;
	text-transform: uppercase;
	cursor: pointer;
	color: ${props => props.theme.colorStyles.hyperlink};
	:hover {
		text-decoration: underline;
	}
`;

const mapDispatchToProps = {
	toggleGweiPopup,
};

export default connect(null, mapDispatchToProps)(Button);
