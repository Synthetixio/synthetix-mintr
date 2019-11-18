import React, { useContext } from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { toggleTransactionSettingsPopup } from '../../ducks/ui';
import { Store } from '../../store';

const Button = ({ t }) => {
	const { dispatch } = useContext(Store);
	return (
		<ButtonWrapper onClick={() => toggleTransactionSettingsPopup(true, dispatch)}>
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

export default withTranslation()(Button);
