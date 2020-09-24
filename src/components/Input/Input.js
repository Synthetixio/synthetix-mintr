import React from 'react';
import styled from 'styled-components';

import { FlexDiv } from 'styles/common';

import { withTranslation } from 'react-i18next';

const Input = ({
	t,
	placeholder,
	rightComponent,
	onChange,
	value,
	currentSynth,
	synths,
	singleSynth = false,
	onSynthChange,
	isDisabled = false,
	currency = 'sUSD',
}) => {
	return (
		<InputWrapper disabled={isDisabled}>
			<L2InputInner>
				<InputAmount>
					<CurrencyLabel>{currency}</CurrencyLabel>
					<InputElement value={value} onChange={onChange} placeholder={placeholder} type="text" />
				</InputAmount>
				<RightComponentWrapper>{rightComponent}</RightComponentWrapper>
			</L2InputInner>
		</InputWrapper>
	);
};

export const SimpleInput = ({
	value,
	onChange,
	type = 'text',
	step,
	placeholder,
	name,
	className,
}) => {
	return (
		<InputWrapper className={className}>
			<InputInner>
				<InputElement
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					type={type}
					step={step}
					name={name}
				/>
			</InputInner>
		</InputWrapper>
	);
};

const InputWrapper = styled.div`
	position: relative;
	width: 400px;
	margin: 0 auto;
	opacity: ${props => (props.disabled ? '0.6' : 1)};
	& input {
		pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
	}
`;

const L2InputInner = styled(FlexDiv)`
	border: 2px solid ${props => props.theme.colorStyles.borders};
	background-color: ${props => props.theme.colorStyles.panelButton};
	justify-content: space-between;
	align-items: center;
`;

const InputInner = styled.div`
	display: flex;
	width: 100%;
	border-radius: 5px;
	height: 64px;
	border: 2px solid ${props => props.theme.colorStyles.borders};
	background-color: ${props => props.theme.colorStyles.panelButton};
	align-items: center;
	justify-content: center;
`;

const InputAmount = styled.div`
	display: flex;
	align-items: center;
`;

const RightComponentWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px 16px 16px 0;
`;

const InputElement = styled.input`
	height: 100%;
	padding: 16px;
	border-radius: 5px;
	border: none;
	width: 100%;
	background-color: ${props => props.theme.colorStyles.panelButton};
	outline: none;
	font-size: 24px;
	color: ${props => props.theme.colorStyles.heading};
	::placeholder {
		color: #908fda;
		opacity: 0.5;
	}
`;

const CurrencyLabel = styled.div`
	color: #908fda;
	opacity: 0.5;
	font-size: 24px;
	line-height: 30px;
	padding-left: 16px;
`;

export default withTranslation()(Input);
