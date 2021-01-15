import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

import { getWalletDetails } from 'ducks/wallet';
import { getDebtStatusData } from 'ducks/debtStatus';

import { PLarge, H2, PageTitle } from 'components/Typography';
import PageContainer from 'components/PageContainer';

import MintrAction from '../../MintrActions';
import { ACTIONS } from 'constants/actions';
import { isMainNet } from 'helpers/networkHelper';
import snxJSConnector from 'helpers/snxJSConnector';

const initialScenario = null;

const actionLabelMapper = {
	mint: { description: 'home.actions.mint.description', title: 'home.actions.mint.title' },
	burn: { description: 'home.actions.burn.description', title: 'home.actions.burn.title' },
	claim: { description: 'home.actions.claim.description', title: 'home.actions.claim.title' },
	withdrawL2: {
		description: 'home.actions.withdraw.description',
		title: 'home.actions.withdraw.title',
	},
	inflate: { description: 'home.actions.inflate.description', title: 'home.actions.inflate.title' },
	close: { description: 'home.actions.close.description', title: 'home.actions.close.title' },
};

const DEFAULT_GAS_LIMIT = 8000000;

const Home = ({ walletDetails: { networkId }, debtData }) => {
	const { t } = useTranslation();
	const [currentScenario, setCurrentScenario] = useState(initialScenario);
	const [isMintSupplyDisabled, setIsMintSupplyDisabled] = useState(true);
	const [isCloseFeePeriodDisabled, setIsCloseFeePeriodDisabled] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const {
				snxJS: { FeePool },
			} = snxJSConnector;
			try {
				const [feePeriodDuration, recentFeePeriods] = await Promise.all([
					FeePool.feePeriodDuration(),
					FeePool.recentFeePeriods(0),
				]);

				const now = Math.ceil(new Date().getTime() / 1000);
				const startTime = Number(recentFeePeriods.startTime);
				const duration = Number(feePeriodDuration);

				setIsCloseFeePeriodDisabled(now <= duration + startTime);
			} catch (e) {
				console.log(e);
				setIsMintSupplyDisabled(true);
				setIsCloseFeePeriodDisabled(true);
			}
		};
		fetchData();
	}, []);

	const onMintSupply = async () => {
		const {
			snxJS: { Synthetix },
		} = snxJSConnector;
		try {
			const tx = await Synthetix.mint({ gasLimit: DEFAULT_GAS_LIMIT, gasPrice: 0 });
			console.log(tx);
		} catch (e) {
			console.log(e);
		}
	};

	const onCloseFeePeriod = async () => {
		const {
			snxJS: { FeePool },
		} = snxJSConnector;
		try {
			const tx = await FeePool.closeCurrentFeePeriod({ gasLimit: DEFAULT_GAS_LIMIT, gasPrice: 0 });
			console.log(tx);
		} catch (e) {
			console.log(e);
		}
	};

	const handleOnButtonClick = action => {
		switch (action) {
			case 'inflate':
				onMintSupply();
				break;
			case 'close':
				onCloseFeePeriod();
				break;
			default:
				setCurrentScenario(action);
		}
	};

	const isActionButtonDisabled = action => {
		switch (action) {
			case 'inflate':
				return isMintSupplyDisabled;
			case 'close':
				return isCloseFeePeriodDisabled;
			case 'track':
				return !isMainNet(networkId);
			case 'withdrawL2':
				return false;
			default:
				return false;
		}
	};

	return (
		<PageContainer>
			<MintrAction action={currentScenario} onDestroy={() => setCurrentScenario(null)} />
			<PageTitle>{t('home.intro.title')}</PageTitle>
			<ButtonRow>
				{ACTIONS.map((action, i) => {
					return (
						<Button
							disabled={isActionButtonDisabled(action)}
							key={action}
							onClick={() => handleOnButtonClick(action)}
							big
						>
							<ButtonContainer>
								<ActionImage src={`/images/actions/${action}.svg`} />
								<StyledH2 small={i > 2}>{t(actionLabelMapper[action].title)}</StyledH2>
								<PLarge>{t(actionLabelMapper[action].description)}</PLarge>
							</ButtonContainer>
						</Button>
					);
				})}
			</ButtonRow>
		</PageContainer>
	);
};

const Button = styled.button`
	flex: 1;
	cursor: pointer;
	height: 352px;
	max-width: ${props => (props.big ? '336px' : '216px')};
	background-color: ${props => props.theme.colorStyles.panelButton};
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 5px;
	box-shadow: 0px 5px 10px 5px ${props => props.theme.colorStyles.shadow1};
	transition: transform ease-in 0.2s;
	&:hover {
		background-color: ${props => props.theme.colorStyles.panelButtonHover};
		box-shadow: 0px 5px 10px 8px ${props => props.theme.colorStyles.shadow1};
		transform: translateY(-2px);
	}
	&:disabled {
		opacity: 0.5;
	}
`;

const StyledH2 = styled(H2)`
	${props =>
		props.small &&
		css`
			font-size: 18px;
			text-transform: none;
		`}
	margin-top: 0;
`;

const ButtonContainer = styled.div`
	padding: 10px;
	margin: 0 auto;
	height: 100%;
`;

const ButtonRow = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 34px;
`;

const ActionImage = styled.img`
	height: 164px;
	width: 164px;
`;

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
	debtData: getDebtStatusData(state),
});

export default connect(mapStateToProps, null)(Home);
