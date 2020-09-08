import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';

import { ButtonPrimaryLabelSmall } from '../Typography';

const ButtonMax = ({ t, onClick }) => {
	return (
		<Button onClick={onClick}>
			<ButtonPrimaryLabelSmall>{t('button.max')}</ButtonPrimaryLabelSmall>
		</Button>
	);
};

const Button = styled.button`
	background: linear-gradient(130.52deg, #f49e25 -8.54%, #b252e9 101.04%);
	font-size: 14px;
	height: 32px;
	width: 56px;
	display: flex;
	align-items: center;
	text-align: center;
	justify-content: center;
	border: transparent;
	border-radius: 3px;
	cursor: pointer;
	transition: all ease-in 0.1s;
	text-transform: uppercase;
	&:hover {
		background: linear-gradient(130.52deg, #f4c625 -8.54%, #e652e9 101.04%);
	}
`;

export default withTranslation()(ButtonMax);
