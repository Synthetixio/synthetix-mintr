/* eslint-disable */
import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { ButtonPrimary } from '../../../components/Button';
import PageContainer from '../../../components/PageContainer';
const UniPool = () => {
	const [hasAllowance, setAllowance] = useState(false);
	return (
		<PageContainer>
			<ButtonContainer>
				{hasAllowance ? (
					<ButtonPrimary>Unlock</ButtonPrimary>
				) : (
					<>
						<ButtonRow>
							test
							<ButtonPrimary>Stake</ButtonPrimary>
						</ButtonRow>
						<ButtonRow>
							test
							<ButtonPrimary>Get Rewards</ButtonPrimary>
						</ButtonRow>
						<ButtonRow>
							test
							<ButtonPrimary>Withdraw</ButtonPrimary>
						</ButtonRow>
						<ButtonRow>
							test
							<ButtonPrimary>Exit</ButtonPrimary>
						</ButtonRow>
					</>
				)}
			</ButtonContainer>
		</PageContainer>
	);
};

const ButtonContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

const ButtonRow = styled.div`
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
	margin-top: 20px;
	& > button {
		margin-left: 40px;
	}
`;

export default UniPool;
