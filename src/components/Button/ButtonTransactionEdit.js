import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { toggleTransactionSettingsPopup } from '../../ducks/ui';

const Button = ({ toggleTransactionSettingsPopup }) => {
	const { t } = useTranslation();
	return (
		<ButtonWrapper onClick={() => toggleTransactionSettingsPopup(true)}>
			{t('button.edit')}
		</ButtonWrapper>
	);
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
	toggleTransactionSettingsPopup,
};

export default connect(null, mapDispatchToProps)(Button);
