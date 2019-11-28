import React, { useContext } from 'react';
import Select from 'react-select';
import { ThemeContext } from 'styled-components';

const IndicatorSeparator = () => {
	return null;
};

export default function SimpleSelect(props) {
	const { colorStyles } = useContext(ThemeContext);

	return (
		<Select
			styles={{
				container: provided => ({
					...provided,
					opacity: props.isDisabled ? 0.4 : 1,
				}),
				singleValue: provided => ({
					...provided,
					color: colorStyles.heading,
					boxShadow: 'none',
					border: 'none',
				}),
				control: provided => ({
					...provided,
					color: colorStyles.heading,
					cursor: 'pointer',
					boxShadow: 'none',
					border: `1px solid ${colorStyles.borders}`,
					outline: 'none',
					background: colorStyles.simpleSelectOption,
					'&:hover': {
						border: `1px solid ${colorStyles.borders}`,
					},
				}),
				menu: provided => ({
					...provided,
					background: 'none',
				}),
				menuList: provided => ({
					...provided,
					border: `1px solid ${colorStyles.borders}`,
					borderRadius: '3px',
					paddingBottom: 0,
					paddingTop: 0,
				}),
				option: (provided, state) => ({
					...provided,
					color: colorStyles.heading,
					cursor: 'pointer',
					background: state.isSelected
						? colorStyles.simpleSelectSelectedOption
						: colorStyles.simpleSelectOption,
					'&:hover': {
						background: state.isSelected
							? colorStyles.simpleSelectSelectedOption
							: colorStyles.simpleSelectHoveredOption,
					},
				}),
			}}
			components={{ IndicatorSeparator }}
			{...props}
		></Select>
	);
}
