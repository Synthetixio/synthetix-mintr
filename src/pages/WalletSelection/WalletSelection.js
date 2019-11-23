import React, { useContext, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import snxJSConnector from '../../helpers/snxJSConnector';
import { withTranslation, useTranslation, Trans } from 'react-i18next';

import { bigNumberFormatter, formatCurrency } from '../../helpers/formatters';

import { Store } from '../../store';
import { updateCurrentPage } from '../../ducks/ui';
import {
	updateWalletStatus,
	updateWalletPaginatorIndex,
	derivationPathChange,
} from '../../ducks/wallet';

import { SimpleInput } from '../../components/Input';
import Spinner from '../../components/Spinner';
import SimpleSelect from '../../components/SimpleSelect';

import {
	List,
	ListHead,
	ListBody,
	ListHeaderRow,
	ListBodyRow,
	ListCell,
	ListHeaderCell,
} from '../../components/List';
import WalletPaginator from '../../components/WalletPaginator';
import OnBoardingPageContainer from '../../components/OnBoardingPageContainer';

import { H1, PMega, TableHeaderMedium, TableDataMedium } from '../../components/Typography';
import { ButtonPrimaryMedium } from '../../components/Button';

const WALLET_PAGE_SIZE = 5;
const LEDGER_DERIVATION_PATHS = [
	{ value: "44'/60'/0'/", label: "Ethereum - m/44'/60'/0'" },
	{ value: "44'/60'/", label: "Ethereum - Ledger Live - m/44'/60'" },
];
const useGetWallets = (paginatorIndex, derivationPath) => {
	const {
		state: {
			wallet: { availableWallets = [] },
		},
		dispatch,
	} = useContext(Store);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	useEffect(() => {
		const walletIndex = paginatorIndex * WALLET_PAGE_SIZE;
		if (availableWallets[walletIndex]) return;
		setIsLoading(true);
		const getWallets = async () => {
			try {
				const results = await snxJSConnector.signer.getNextAddresses(walletIndex, WALLET_PAGE_SIZE);
				if (!results) throw new Error('Could not get addresses from wallet');
				const nextWallets = results.map(address => {
					return {
						address,
						balances: [],
					};
				});
				updateWalletStatus(
					{ unlocked: true, availableWallets: [...availableWallets, ...nextWallets] },
					dispatch
				);
				setIsLoading(false);
				const balances = await Promise.all(
					nextWallets.map(async wallet => {
						return {
							snxBalance: await snxJSConnector.snxJS.Synthetix.collateral(wallet.address),
							sUSDBalance: await snxJSConnector.snxJS.sUSD.balanceOf(wallet.address),
							ethBalance: await snxJSConnector.provider.getBalance(wallet.address),
						};
					})
				);
				nextWallets.forEach((wallet, index) => {
					wallet.balances = {
						snxBalance: bigNumberFormatter(balances[index].snxBalance),
						sUSDBalance: bigNumberFormatter(balances[index].sUSDBalance),
						ethBalance: bigNumberFormatter(balances[index].ethBalance),
					};
				});

				updateWalletStatus({ availableWallets: [...availableWallets, ...nextWallets] }, dispatch);
			} catch (e) {
				console.log(e);
				setError(e.message);
				updateWalletStatus(
					{
						unlocked: false,
						unlockReason: 'ErrorWhileConnectingToHardwareWallet',
						unlockMessage: e,
					},
					dispatch
				);
			}
		};
		getWallets();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paginatorIndex, derivationPath]);
	return { isLoading, error };
};

const Heading = ({ hasLoaded, error }) => {
	const {
		state: {
			wallet: { walletType },
		},
	} = useContext(Store);
	const { t } = useTranslation();
	if (error) {
		return (
			<HeadingContent>
				<ErrorHeading>
					<ErrorImg src="/images/failure.svg" />
					<WalletConnectionH1>{t('onboarding.walletSelection.error.title')}</WalletConnectionH1>
				</ErrorHeading>
				<WalletConnectionPMega>
					{t('onboarding.walletSelection.error.subtitle')}
				</WalletConnectionPMega>
			</HeadingContent>
		);
	} else
		return hasLoaded ? (
			<HeadingContent>
				<WalletConnectionH1>{t('onboarding.walletSelection.success.title')}</WalletConnectionH1>
				<WalletConnectionPMega>
					{t('onboarding.walletSelection.success.subtitle')}
				</WalletConnectionPMega>
			</HeadingContent>
		) : (
			<HeadingContent>
				<WalletConnectionH1>
					<Trans i18nKey="onboarding.walletSelection.loading.connectVia">
						Connect via {{ walletType }}
					</Trans>
				</WalletConnectionH1>
				<WalletConnectionPMega>
					{t('onboarding.walletSelection.loading.connectInstructions')}
				</WalletConnectionPMega>
			</HeadingContent>
		);
};

const WalletConnection = ({ t }) => {
	const {
		state: {
			wallet: {
				derivationPath,
				walletType,
				walletPaginatorIndex = 0,
				availableWallets = [],
				networkName,
				networkId,
			},
		},
		dispatch,
	} = useContext(Store);
	const { isLoading, error } = useGetWallets(walletPaginatorIndex, derivationPath);
	const isHardwareWallet = ['Ledger', 'Trezor'].includes(walletType);
	const isLedger = walletType === 'Ledger';
	const selectedDerivationPath = derivationPath
		? LEDGER_DERIVATION_PATHS.find(path => path.value === derivationPath)
		: LEDGER_DERIVATION_PATHS[0];
	return (
		<OnBoardingPageContainer>
			<Content>
				<Heading hasLoaded={availableWallets.length > 0} error={error}></Heading>
				{error ? (
					<ErrorContainer>
						<PMega>{error}</PMega>
						<ButtonPrimaryMedium onClick={() => updateCurrentPage('landing', dispatch)}>
							{t('onboarding.walletSelection.error.retry')}
						</ButtonPrimaryMedium>
					</ErrorContainer>
				) : (
					<BodyContent>
						{isLedger && (
							<SelectWrapper>
								<SimpleSelect
									isDisabled={isLoading}
									searchable={false}
									options={LEDGER_DERIVATION_PATHS}
									value={selectedDerivationPath}
									onChange={option => {
										if (option.value === derivationPath) return;
										const signerOptions = {
											type: 'Ledger',
											networkId,
											derivationPath: option.value,
										};
										derivationPathChange(signerOptions, option.value, dispatch);
									}}
								></SimpleSelect>
							</SelectWrapper>
						)}
						<ListContainer>
							{!isLoading ? (
								<ListInner>
									<List cellSpacing={0}>
										<ListHead>
											<ListHeaderRow>
												{['Address', 'SNX', 'sUSD', 'ETH', ''].map((headerElement, i) => {
													return (
														<ListHeaderCell
															style={{ textAlign: i > 0 ? 'right' : 'left' }}
															key={headerElement}
														>
															<TableHeaderMedium>{headerElement}</TableHeaderMedium>
														</ListHeaderCell>
													);
												})}
											</ListHeaderRow>
										</ListHead>
										<ListBody>
											{availableWallets
												.slice(
													walletPaginatorIndex * WALLET_PAGE_SIZE,
													walletPaginatorIndex * WALLET_PAGE_SIZE + WALLET_PAGE_SIZE
												)
												.map((wallet, i) => {
													return (
														<ListBodyRow
															key={wallet.address}
															onClick={() => {
																const walletIndex = walletPaginatorIndex * WALLET_PAGE_SIZE + i;
																if (isHardwareWallet) {
																	snxJSConnector.signer.setAddressIndex(walletIndex);
																}
																updateWalletStatus({ currentWallet: wallet.address }, dispatch);
																updateCurrentPage('main', dispatch);
															}}
														>
															<ListCell>
																<TableDataMedium>{wallet.address}</TableDataMedium>
															</ListCell>
															<ListCell style={{ textAlign: 'right' }}>
																<TableDataMedium>
																	{formatCurrency(wallet.balances.snxBalance) || 0}
																</TableDataMedium>
															</ListCell>
															<ListCell style={{ textAlign: 'right' }}>
																<TableDataMedium>
																	{formatCurrency(wallet.balances.sUSDBalance) || 0}
																</TableDataMedium>
															</ListCell>
															<ListCell style={{ textAlign: 'right' }}>
																<TableDataMedium>
																	{formatCurrency(wallet.balances.ethBalance) || 0}
																</TableDataMedium>
															</ListCell>
															<ListCell
																style={{ textAlign: 'right' }}
																onClick={e => {
																	e.stopPropagation();
																}}
															>
																<Link
																	href={`https://${
																		networkName === 'mainnet' ? '' : networkName + '.'
																	}etherscan.io/address/${wallet.address}`}
																	target="_blank"
																>
																	<LinkImg width="20" src="/images/etherscan-logo.png" />
																</Link>
															</ListCell>
														</ListBodyRow>
													);
												})}
										</ListBody>
									</List>
									{location.href.includes('walletAddress') && (
										<AddWalletForm
											onSubmit={e => {
												e.preventDefault();
												const walletAddress = e.target.walletAddress.value;
												updateWalletStatus({ currentWallet: walletAddress }, dispatch);
												updateCurrentPage('main', dispatch);
											}}
										>
											<AddWalletInput
												name={'walletAddress'}
												required
												placeholder={t('onboarding.walletSelection.addWallet.placeholder')}
											/>
											<ButtonPrimaryMedium type="submit">
												{t('onboarding.walletSelection.addWallet.buttonText')}
											</ButtonPrimaryMedium>
										</AddWalletForm>
									)}
								</ListInner>
							) : (
								<Spinner />
							)}
						</ListContainer>
						{availableWallets.length > 0 ? (
							<WalletPaginator
								disabled={isLoading || !isHardwareWallet}
								currentIndex={walletPaginatorIndex}
								onIndexChange={index => updateWalletPaginatorIndex(index, dispatch)}
							/>
						) : null}
					</BodyContent>
				)}
			</Content>
		</OnBoardingPageContainer>
	);
};

const SelectWrapper = styled.div`
	width: 400px;
`;

const HeadingContent = styled.div`
	width: 50%;
	max-width: 600px;
	margin: 0 auto;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
`;

const BodyContent = styled.div`
	margin: 50px auto 0 auto;
	max-width: 1400px;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
`;

const ErrorContainer = styled.div`
	height: 350px;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: space-around;
`;

const ErrorImg = styled.img`
	margin-right: 20px;
`;

const ErrorHeading = styled.div`
	display: flex;
`;

const AddWalletForm = styled.form`
	margin-top: 10px;
	display: flex;
	align-items: center;
`;
const AddWalletInput = styled(SimpleInput)`
	margin-right: 10px;
	flex-grow: 1;
	& > div {
		height: 48px;
		margin: 0;
	}
`;

const Content = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 50px;
`;

const WalletConnectionH1 = styled(H1)`
	text-transform: none;
	font-size: 48px;
`;

const WalletConnectionPMega = styled(PMega)`
	font-size: 22px;
	font-family: 'apercu-medium', sans-serif;
	text-align: center;
	line-height: 32px;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ListContainer = styled.div`
	height: 350px;
	width: 100%;
	display: flex;
	align-items: center;
`;

const ListInner = styled.div`
	animation: ${fadeIn} 0.2s linear both;
	width: 100%;
`;

const Link = styled.a`
	display: flex;
	align-items: center;
	justify-content: flex-end;
`;

const LinkImg = styled.img`
	width: 20px;
	height: 20px;
`;

export default withTranslation()(WalletConnection);
