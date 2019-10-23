/* eslint-disable */
import React, { useState } from 'react';
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';
import Calendar from 'react-calendar'
import { format } from 'date-fns';

import { formatCurrency } from '../../helpers/formatters';

import { ButtonTertiaryLabel, InputTextSmall, InputLabelSmall, DataLarge } from '../Typography';
const DropdownSelect = ({ data = [], onSelect, selected = [] }) => {
  const handleSelect = (element) => {
    if (selected.includes(element.label)) {
      return onSelect(selected.filter(s => s !== element.label))
    } else {
      return onSelect([element.label, ...selected])
    }
  }

  return (
    <SelectContainer>
      <List>
        {data.map(element => {
          return (
            <ListElement onClick={() => handleSelect(element)}>
              <ListElementInner>
                <input type="checkbox" checked={selected.includes(element.label)}></input>
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

const CalendarFilter = ({ data = [], onSelect, selected }) => {
  return (
    <SelectContainer autoWidth>
      <Calendar
       returnValue="range"
       selectRange={true}
       onChange={([from, to]) => onSelect({from, to})} />
    </SelectContainer>
  )
};

const RangeFilter = ({ data = [], onSelect, selected }) => {
  const [filters, setFilters] = useState(selected)
  let updateTimeout

  const onChange = (e) => {
    const {value, name} = e.target
    setFilters({...filters, ...{[name]: value}})
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      update()
    }
  }

  const update = () => {
    clearTimeout(updateTimeout)
    if (filters.from !== selected.from || filters.to !== selected.to) {
      onSelect(filters)
    }
  }

  return (
    <SelectContainer>
      <RangeContainer>
        <InputLabelSmall htmlFor="from">From:</InputLabelSmall>
        <Input name="from" type="number" onChange={onChange} onBlur={update} onKeyDown={handleKey} value={filters.from} />
        <InputLabelSmall htmlFor="to">To:</InputLabelSmall>
        <Input name="to" type="number" onChange={onChange} onBlur={update} onKeyDown={handleKey} value={filters.to} />
      </RangeContainer>
    </SelectContainer>
  )
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
            {(selected.length || selected.from) 
              ? <SelectedValue type={type} selected={selected} data={data}/>
              : <ButtonTertiaryLabel>{placeholder}</ButtonTertiaryLabel>
             }
            <ButtonImage src={'/images/caret-down.svg'}></ButtonImage>
          </ButtonInner>
        </Button>
        {dropdownVisible ? (
          <Dropdown
            type={type}
            data={data}
            onSelect={onSelect}
            selected={selected}
          ></Dropdown>
        ) : null}
      </Container>
    </OutsideClickHandler>
  );
};

const SelectedValue = ({ type, data, selected }) => {
  let text
  switch (type) {
    case 'select':
      const elements = data.filter(d => selected.includes(d.label))
      if (elements.length === 1) {
        return (
          <span>
            <ListElementIcon src={elements[0].icon}></ListElementIcon>
            <DataLarge>{elements[0].label}</DataLarge>
          </span>
        ) 
      }

      return (
        <span>
          {elements.map(e => <ListElementIcon src={e.icon} key={e.label}></ListElementIcon>)}
        </span>
      );

    case 'calendar':
      text = `${format(new Date(selected.from), 'dd-MM-yy')} → ${format(new Date(selected.to), 'dd-MM-yy')}`
      return (
        <SelectedValueText>{text}</SelectedValueText>
      )
    case 'range':
      text = `${formatCurrency(selected.from)} → ${formatCurrency(selected.to)}`
      return (
        <SelectedValueText>{text}</SelectedValueText>
      )
  }
}

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
  width: ${props => props.autoWidth ? 'auto' : '100%'};
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
  margin-left: 7px;
  margin-right: 8px;
  vertical-align: text-bottom;
`;

const RangeContainer = styled.div`
  height: 178px;

  padding: 16px 24px;
`

const Label = styled.label`
`

const Input = styled(InputTextSmall)`
  height: 32px;
  margin: 8px 0 25px 0;
  border: 1px solid ${props => props.theme.colorStyles.borders};
  width: 100%;

  -moz-appearance:textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
  }
`

const SelectedValueText = styled(ButtonTertiaryLabel)`
  color: ${props => props.theme.colorStyles.inputTextSmall}
`

export default Select;
