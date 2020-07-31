import React, { useEffect, useMemo, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { setCurrentGasPrice, getNetworkPrices, getCurrentGasPrice } from '../../ducks/network';
import ErrorMessage from '../../components/ErrorMessage';

const MAX_GAS_MULTIPLE = 1.5;

const GasMenu = ({ networkPrices, setCurrentGasPrice, currentGasPrice }) => {
	const { t } = useTranslation();
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const [customGasPrice, setCustomGasPrice] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);

	const fastPrice = networkPrices?.FAST?.price ?? 0;

	const gasPriceLimit = useMemo(() => {
		return fastPrice > 0 ? Math.floor(fastPrice * MAX_GAS_MULTIPLE) : 0;
	}, [fastPrice]);

	useEffect(() => {
		if (customGasPrice != null) {
			const exceedsLimit = customGasPrice > gasPriceLimit;
			const newGasPrice = exceedsLimit ? gasPriceLimit : customGasPrice;
			setCurrentGasPrice({ gasPrice: newGasPrice });
			setErrorMessage(
				exceedsLimit
					? t('transactionSettings.gas-exceeds-limit', { gasPrice: gasPriceLimit })
					: null
			);
		}
	}, [setCurrentGasPrice, customGasPrice, setErrorMessage, gasPriceLimit, t]);

	return (
		<OutsideClickHandler onOutsideClick={() => setDropdownVisible(false)}>
			<GasMenuWrapper>
				{dropdownVisible ? (
					<SelectContainer hasErrorMessage={errorMessage != null}>
						<List>
							<ListElement>
								<Input
									type="number"
									step=".01"
									placeholder={t('transactionSettings.placeholder')}
									onChange={e => {
										const newPrice = Number(e.target.value) || 0;
										setCustomGasPrice(newPrice);
									}}
									value={customGasPrice}
								/>
							</ListElement>
							{errorMessage && <StyledErrorMessage message={errorMessage} />}
							{networkPrices && networkPrices.SLOW ? (
								<>
									<HoverListElement
										isActive={networkPrices.SLOW.price === currentGasPrice.price}
										onClick={() => {
											setCurrentGasPrice({ gasPrice: networkPrices.SLOW.price });
											setDropdownVisible(false);
										}}
									>
										<div>{t('transactionSettings.speed.slow')}</div>
										<div>{networkPrices.SLOW.price}</div>
									</HoverListElement>
									<HoverListElement
										isActive={networkPrices.AVERAGE.price === currentGasPrice.price}
										onClick={() => {
											setCurrentGasPrice({ gasPrice: networkPrices.AVERAGE.price });
											setDropdownVisible(false);
										}}
									>
										<div>{t('transactionSettings.speed.average')}</div>
										<div>{networkPrices.AVERAGE.price}</div>
									</HoverListElement>
									<HoverListElement
										isActive={networkPrices.FAST.price === currentGasPrice.price}
										onClick={() => {
											setCurrentGasPrice({ gasPrice: networkPrices.FAST.price });
											setDropdownVisible(false);
										}}
									>
										<div>{t('transactionSettings.speed.fast')}</div>
										<div>{networkPrices.FAST.price}</div>
									</HoverListElement>
								</>
							) : null}
						</List>
					</SelectContainer>
				) : null}
				<EditText onClick={() => setDropdownVisible(!dropdownVisible)}>{t('button.edit')}</EditText>
			</GasMenuWrapper>
		</OutsideClickHandler>
	);
};

const GasMenuWrapper = styled.div`
	width: 100%;
	display: flex;
	position: relative;
	align-items: center;
	margin-right: 16px;
`;

const EditText = styled.div`
	padding-top: 16px;
	padding-left: 10px;
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

const SelectContainer = styled.div`
	z-index: 10;
	position: absolute;
	${props => (props.hasErrorMessage ? 'top: calc(100% - 297px)' : 'top: calc(100% - 235px)')};
	left: -20px;
	width: 160px;
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 5px;
	background-color: ${props => props.theme.colorStyles.panels};
`;

const Input = styled.input`
	height: 40px;
	padding: 10px;
	font-size: 14px;
	border-radius: 5px;
	border: 1px solid ${props => props.theme.colorStyles.borders};
	background-color: ${props => props.theme.colorStyles.panels};
	color: ${props => props.theme.colorStyles.subtext};
	width: 100%;
	appearance: textfield;
	&:focus {
		outline: none;
	}
	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		appearance: none;
		margin: 0;
	}
`;

const List = styled.ul`
	list-style: none;
	margin: 0;
	padding: 10px;
`;

const ListElement = styled.li`
	padding: 10px 0;
	display: flex;
	justify-content: space-around;
	cursor: pointer;
	color: ${props => props.theme.colorStyles.subtext};
	background-color: ${props =>
		props.isActive ? props.theme.colorStyles.accentDark : props.theme.colorStyles.panels};
`;
const HoverListElement = styled(ListElement)`
	&:hover {
		background-color: ${props => props.theme.colorStyles.accentLight};
	}
`;

const StyledErrorMessage = styled(ErrorMessage)`
	height: 30px;
`;

const mapStateToProps = state => ({
	networkPrices: getNetworkPrices(state),
	currentGasPrice: getCurrentGasPrice(state),
});

const mapDispatchToProps = {
	setCurrentGasPrice,
};

export default connect(mapStateToProps, mapDispatchToProps)(GasMenu);
