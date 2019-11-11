/* eslint-disable */
import React, { useState } from 'react';
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';
import { useTranslation } from 'react-i18next';
import Calendar from 'react-calendar';
import { format } from 'date-fns';

import { formatCurrency } from '../../helpers/formatters';

import { ButtonTertiaryLabel, InputTextSmall, InputLabelSmall, DataLarge } from '../Typography';
const DropdownSelect = ({ data = [], onSelect, selected = [] }) => {
	const { t } = useTranslation();
	const handleSelect = element => {
		if (selected.includes(element.key)) {
			return onSelect(selected.filter(s => s !== element.key));
		} else {
			return onSelect([element.key, ...selected]);
		}
	};
	return (
		<SelectContainer autoWidth>
			<List>
				{data.map(element => {
					return (
						<ListElement onClick={() => handleSelect(element)}>
							<ListElementInner>
								<input type="checkbox" checked={selected.includes(element.key)}></input>
								<ListElementIcon src={`/images/actions/${element.icon}`}></ListElementIcon>
								<ListElementLabel style={{ whiteSpace: 'nowrap' }}>
									{t(element.label)}
								</ListElementLabel>
							</ListElementInner>
						</ListElement>
					);
				})}
			</List>
		</SelectContainer>
	);
};

const CalendarFilter = ({ data = [], onSelect, selected }) => {
	return (
		<SelectContainer autoWidth>
			<Calendar
				returnValue="range"
				selectRange={true}
				onChange={([from, to]) => onSelect({ from, to })}
			/>
		</SelectContainer>
	);
};

const RangeFilter = ({ data = [], onSelect, selected }) => {
	const { t } = useTranslation();
	const [filters, setFilters] = useState(selected);
	let updateTimeout;

	const onChange = e => {
		const { value, name } = e.target;
		setFilters({ ...filters, ...{ [name]: value } });
	};

	const handleKey = e => {
		if (e.key === 'Enter') {
			update();
		}
	};

	const update = () => {
		clearTimeout(updateTimeout);
		if (filters.from !== selected.from || filters.to !== selected.to) {
			onSelect(filters);
		}
	};

	return (
		<SelectContainer>
			<RangeContainer>
				<InputLabelSmall htmlFor="from">{t('transactions.inputs.from')}</InputLabelSmall>
				<Input
					name="from"
					type="number"
					onChange={onChange}
					onBlur={update}
					onKeyDown={handleKey}
					value={filters.from}
				/>
				<InputLabelSmall htmlFor="to">{t('transactions.inputs.to')}</InputLabelSmall>
				<Input
					name="to"
					type="number"
					onChange={onChange}
					onBlur={update}
					onKeyDown={handleKey}
					value={filters.to}
				/>
			</RangeContainer>
		</SelectContainer>
	);
};

const Dropdown = ({ type, data, onSelect, selected }) => {
	const props = { data, onSelect, selected };
	switch (type) {
		case 'select':
			return <DropdownSelect {...props} />;
		case 'calendar':
			return <CalendarFilter {...props} />;
		case 'range':
			return <RangeFilter {...props} />;
	}
};

const Select = ({ placeholder, type = 'select', data = null, onSelect, selected }) => {
	const [dropdownVisible, setDropdownVisible] = useState(false);
	return (
		<OutsideClickHandler onOutsideClick={() => setDropdownVisible(false)}>
			<Container>
				<Button onClick={() => setDropdownVisible(!dropdownVisible)}>
					<ButtonInner>
						{selected.length || selected.from ? (
							<SelectedValue type={type} selected={selected} data={data} />
						) : (
							<ButtonTertiaryLabel>{placeholder}</ButtonTertiaryLabel>
						)}
						<ButtonImage src={'/images/caret-down.svg'}></ButtonImage>
					</ButtonInner>
				</Button>
				{dropdownVisible ? (
					<Dropdown type={type} data={data} onSelect={onSelect} selected={selected}></Dropdown>
				) : null}
			</Container>
		</OutsideClickHandler>
	);
};

const SelectedValue = ({ type, data, selected }) => {
	let text;
	switch (type) {
		case 'select':
			const elements = data.filter(d => selected.includes(d.key));
			return (
				<span>
					{elements.map(e => (
						<ListElementIcon src={`/images/actions/${e.icon}`} key={e.label}></ListElementIcon>
					))}
				</span>
			);

		case 'calendar':
			text = `${format(new Date(selected.from), 'dd-MM-yy')} → ${format(
				new Date(selected.to),
				'dd-MM-yy'
			)}`;
			return <ButtonTertiaryLabel>{text}</ButtonTertiaryLabel>;
		case 'range':
			text = `${formatCurrency(selected.from)} → ${formatCurrency(selected.to)}`;
			return <ButtonTertiaryLabel>{text}</ButtonTertiaryLabel>;
	}
};

const Container = styled.div`
	width: 100%;
	display: flex;
	position: relative;
	align-items: center;
	margin-right: 16px;
`;

const Button = styled.button`
	border: 1px solid ${props => props.theme.colorStyles.borders};
	height: 40px;
	background: transparent;
	border-radius: 5px;
	width: 100%;
	cursor: pointer;
	&:hover {
		background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
	}
`;

const ButtonInner = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	text-transform: uppercase;
`;

const ButtonImage = styled.img``;

const SelectContainer = styled.div`
	z-index: 10;
	position: absolute;
	top: calc(100% + 10px);
	left: 0;
	width: ${props => (props.autoWidth ? 'auto' : '100%')};
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 5px;
	background-color: ${props => props.theme.colorStyles.panels};
`;

const List = styled.ul`
	list-style: none;
	margin: 0;
	padding: 10px;
`;

const ListElement = styled.li`
	padding: 10px 0;
	cursor: pointer;
	&:hover {
		background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
	}
`;

const ListElementInner = styled.li`
	display: flex;
	align-items: center;
`;

const ListElementLabel = styled(DataLarge)`
	width: 100%;
	overflow: hidden;
`;

const ListElementIcon = styled.img`
	margin: 0 5px;
	vertical-align: text-bottom;
	width: 16px;
`;

const RangeContainer = styled.div`
	height: 178px;
	padding: 16px 24px;
`;

const Label = styled.label``;

const Input = styled.input`
	height: 32px;
	margin: 8px 0 25px 0;
	padding: 0 10px;
	border-radius: 5px;
	border: 1px solid ${props => props.theme.colorStyles.borders};
	background-color: ${props => props.theme.colorStyles.panels};
	color: ${props => props.theme.colorStyles.heading};
	width: 100%;
	-moz-appearance: textfield;
	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
`;

export default Select;
