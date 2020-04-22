import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import zip from 'lodash/zip';
import uniq from 'lodash/uniq';

import { getWalletDetails } from '../../ducks/wallet';
import { getCurrentGasPrice } from '../../ducks/network';

import snxJSConnector from '../../helpers/snxJSConnector';
import { parseBytes32String } from '../../helpers/formatters';

import ModalContainer from './ModalContainer';
import { PageTitle, PLarge, DataHeaderLarge, H5, ButtonTertiaryLabel } from '../Typography';
import { ButtonPrimary } from '../Button';
import { SimpleInput } from '../Input';
import { Table, Thead, Tbody, Th, Td, Tr } from './Table';

const GAS_LIMIT_BUFFER = 0.2;
const APPROVE_ALL_ACTION = 'ApproveAll';
const BLOG_URL = 'https://blog.synthetix.io/a-guide-to-delegation';

const normaliseGasLimit = amount => Number(amount) * (1 + GAS_LIMIT_BUFFER);

const DelegateModal = ({ walletDetails: { currentWallet }, currentGasPrice }) => {
	const { t } = useTranslation();
	const [newAddress, setNewAddress] = useState('');
	const [delegateAddresses, setDelegateAddresses] = useState([]);

	const TABLE_COLUMNS = [
		t('delegation.popup.table.columns.walletAddress'),
		t('delegation.popup.table.columns.actions'),
	];

	const getApprovedAddresses = useCallback(async () => {
		const {
			snxJS: { DelegateApprovals, contractSettings },
		} = snxJSConnector;
		const filter = {
			fromBlock: 0,
			toBlock: 9e9,
			...DelegateApprovals.contract.filters.Approval(currentWallet),
		};
		try {
			const events = await contractSettings.provider.getLogs(filter);
			const delegates = uniq(
				events
					.map(log => DelegateApprovals.contract.interface.parseLog(log))
					.map(event => event.values.delegate)
			);

			const filteredDelegates = zip(
				delegates,
				await Promise.all(delegates.map(addr => DelegateApprovals.approvedAll(currentWallet, addr)))
			)
				.filter(([, val]) => val)
				.map(([addr]) => addr);

			setDelegateAddresses(filteredDelegates);
		} catch (e) {
			console.log(e);
		}
	}, [currentWallet]);

	useEffect(() => {
		getApprovedAddresses();
	}, [getApprovedAddresses]);

	useEffect(() => {
		if (!currentWallet) return;
		const getApprovedAddresses = async () => {};
		getApprovedAddresses();
	}, [currentWallet]);

	useEffect(() => {
		if (!currentWallet) return;
		const {
			snxJS: { DelegateApprovals },
		} = snxJSConnector;
		DelegateApprovals.contract.on('Approval', (authoriser, delegate, action) => {
			if (authoriser === currentWallet && parseBytes32String(action) === APPROVE_ALL_ACTION) {
				getApprovedAddresses();
			}
		});
		DelegateApprovals.contract.on('WithdrawApproval', (authoriser, delegate, action) => {
			if (authoriser === currentWallet && parseBytes32String(action) === APPROVE_ALL_ACTION) {
				getApprovedAddresses();
			}
		});
		return () => {
			if (snxJSConnector.initialized) {
				DelegateApprovals.contract.removeAllListeners('Approval');
				DelegateApprovals.contract.removeAllListeners('WithdrawApproval');
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

	const onSubmit = async () => {
		const {
			snxJS: { DelegateApprovals },
		} = snxJSConnector;
		try {
			const gasEstimate = await DelegateApprovals.contract.estimate.approveAllDelegatePowers(
				newAddress
			);
			await DelegateApprovals.approveAllDelegatePowers(newAddress, {
				gasLimit: normaliseGasLimit(gasEstimate),
				gasPrice: currentGasPrice.formattedPrice,
			});
		} catch (e) {
			console.log(e);
		}
	};

	const onRemove = async addr => {
		const {
			snxJS: { DelegateApprovals },
		} = snxJSConnector;
		try {
			const gasEstimate = await DelegateApprovals.contract.estimate.removeAllDelegatePowers(addr);
			await DelegateApprovals.removeAllDelegatePowers(addr, {
				gasLimit: normaliseGasLimit(gasEstimate),
				gasPrice: currentGasPrice.formattedPrice,
			});
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<ModalContainer>
			<Wrapper>
				<Intro>
					<PageTitle>{t('delegation.popup.title')}</PageTitle>
					<PLarge>
						{t('delegation.popup.description')}{' '}
						<Link href={BLOG_URL} target="_blank">
							<ButtonTertiaryLabel>{t('lpRewards.shared.unlocked.link')}</ButtonTertiaryLabel>
						</Link>
					</PLarge>
				</Intro>

				<Body>
					<PLarge>{t('delegation.popup.input.label')}</PLarge>
					<Input
						type="text"
						step={0.1}
						placeholder={t('input.address.placeholder')}
						onChange={e => setNewAddress(e.target.value)}
						value={newAddress}
					/>
				</Body>
				<ButtonWrapper>
					<ButtonPrimary onClick={onSubmit}>{t('delegation.popup.buttons.add')}</ButtonPrimary>
				</ButtonWrapper>
				<Box>
					<StyledH5>{t('delegation.popup.table.title')}</StyledH5>
					<TableWrapper>
						<Table cellSpacing="0">
							<Thead>
								<Tr>
									{TABLE_COLUMNS.map(column => (
										<Th key={column}>
											<DataHeaderLarge>{column}</DataHeaderLarge>
										</Th>
									))}
								</Tr>
							</Thead>
							<Tbody>
								{delegateAddresses.map((address, i) => {
									return (
										<Tr key={`${address}-${i}`}>
											<Td>{address}</Td>
											<Td>
												<ButtonRemove onClick={() => onRemove(address)}>
													{t('delegation.popup.table.cells.removeAllPowers')}
												</ButtonRemove>
											</Td>
										</Tr>
									);
								})}
							</Tbody>
						</Table>
					</TableWrapper>
				</Box>
			</Wrapper>
		</ModalContainer>
	);
};

const Wrapper = styled.div`
	margin: 24px auto;
	padding: 64px;
	height: auto;
	width: 720px;
	background-color: ${props => props.theme.colorStyles.panels};
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 5px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
`;

const Body = styled.div`
	text-align: center;
`;

const Input = styled(SimpleInput)`
	margin-bottom: 10px;
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		appearance: none;
	}
`;

const Intro = styled.div`
	width: 400px;
	text-align: center;
	margin-bottom: 50px;
`;

const ButtonWrapper = styled.div`
	margin: 16px auto 32px auto;
`;

const Box = styled.div`
	border-radius: 2px;
	border: 1px solid ${props => props.theme.colorStyles.borders};
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 20px;
`;

const StyledH5 = styled(H5)`
	font-size: 16px;
`;

const ButtonRemove = styled.button`
	cursor: pointer;
	font-family: 'apercu-bold', sans-serif;
	font-size: 12px;
	color: ${props => props.theme.colorStyles.brandRed};
	border: none;
	background: transparent;
	text-transform: uppercase;
	padding: 0;
`;

const TableWrapper = styled.div`
	width: 100%;
	height: 150px;
	overflow-y: scroll;
`;

const Link = styled.a`
	text-decoration-color: ${props => props.theme.colorStyles.buttonTertiaryText};
`;

const mapStateToProps = state => ({
	currentGasPrice: getCurrentGasPrice(state),
	walletDetails: getWalletDetails(state),
});

export default connect(mapStateToProps, null)(DelegateModal);
