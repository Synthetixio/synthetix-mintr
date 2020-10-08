import React, { FC } from 'react';
import styled from 'styled-components';
import { CTAButton } from 'components/L2Onboarding/component/CTAButton';

type InputProps = {
	currency: string;
	onChange: (e: any) => void;
	value: number | string;
	onMax?: () => void;
	showMax?: boolean;
};

const InputComponent: FC<InputProps> = ({
	currency,
	onChange,
	onMax = () => {},
	value,
	showMax,
}) => {
	return (
		<InputWrapper>
			<InputBlock>
				<Input onChange={onChange} type="number" step="any" placeholder="0" value={value}></Input>
				<Currency>{currency}</Currency>
			</InputBlock>
			{showMax && (
				<InputBlock>
					<ButtonMax onClick={onMax}>Max</ButtonMax>
				</InputBlock>
			)}
		</InputWrapper>
	);
};

const ButtonMax = styled(CTAButton)`
	width: 55px;
	height: 32px;
	& > * {
		font-size: 12px;
		letter-spacing: 0.5px;
		line-height: 14px;
	}
`;

const InputWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border: 2px solid #282862;
	padding: 18px 20px 18px 24px;
	border-radius: 5px;
	background: #0f0f33;
	color: white;
	height: 64px;
	margin-bottom: 18px;
`;

const InputBlock = styled.div`
	display: flex;
	align-items: center;
`;

const Input = styled.input`
	border: none;
	background: #0f0f33;
	width: 120px;
	color: white;
	font-size: 24px;
	padding-right: 16px;
	letter-spacing: 0.5px;
	&:focus {
		outline: none;
	}
	&::placeholder {
		color: white;
	}
`;

const Currency = styled.div`
	color: #908fda;
	font-size: 24px;
	margin-top: -3px;
	letter-spacing: 0.2px;
`;

export default InputComponent;
