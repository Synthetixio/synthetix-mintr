/* eslint-disable */
import React, { useState } from 'react';
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';

import { ButtonTertiaryLabel, DataLarge } from '../Typography';

const DropdownSelect = ({ data = [], onSelect }) => {
	return (
		<SelectContainer>
			<List>
				{data.map(element => {
					return (
						<ListElement onClick={() => onSelect(element)}>
							<ListElementInner>
								<input type="checkbox"></input>
								<ListElementIcon src={element.icon}></ListElementIcon>
								<DataLarge>{element.label}</DataLarge>
							</ListElementInner>
						</ListElement>
					);
				})}
			</List>
		</SelectContainer>
	);
};

const Dropdown = ({ type, data, onSelect }) => {
	const props = { data, onSelect };
	switch (type) {
		case 'select':
			return <DropdownSelect {...props} />;
		case 'calendar':
			return null;
		case 'input':
			return null;
	}
};

const Select = ({ placeholder, type = 'select', data = null }) => {
	const [selected, setSelected] = useState([]);
	const [dropdownVisible, setDropdownVisible] = useState(false);
	console.log(selected);
	return (
		<OutsideClickHandler onOutsideClick={() => setDropdownVisible(false)}>
			<Container>
				<Button onClick={() => setDropdownVisible(!dropdownVisible)}>
					<ButtonInner>
						<ButtonTertiaryLabel>{placeholder}</ButtonTertiaryLabel>
						<ButtonImage src={'/images/caret-down.svg'}></ButtonImage>
					</ButtonInner>
				</Button>
				{dropdownVisible ? (
					<Dropdown
						type={type}
						data={data}
						onSelect={element => setSelected([element, ...selected])}
					></Dropdown>
				) : null}
			</Container>
		</OutsideClickHandler>
	);
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
	position: absolute;
	top: calc(100% + 10px);
	left: 0;
	width: 100%;
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

const ListElementIcon = styled.img`
	margin-right: 10px;
`;

export default Select;
