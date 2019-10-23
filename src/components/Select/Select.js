/* eslint-disable */
import React, { useState } from 'react';
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';
import Calendar from 'react-calendar'

import { ButtonTertiaryLabel, DataLarge } from '../Typography';

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

const CalendarFilter = ({ data = [], onSelect, selected = [] }) => {
  return (
    <SelectContainer autoWidth>
      <Calendar
       returnValue="range"
       selectRange={true}
       onChange={([from, to]) => onSelect({from, to})} />
    </SelectContainer>
  )
};

const RangeFilter = ({ data = [], onSelect, selected = [] }) => {
  return (
    <SelectContainer>
      <Label for="from">From:</Label>
      <Input name="from" type="number"></Input>
      <Label for="to">To:</Label>
      <Input name="to" type="number"></Input>
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
            <ButtonTertiaryLabel>{placeholder}</ButtonTertiaryLabel>
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
  margin-right: 10px;
`;

const Label = styled.label`
  
`

const Input = styled.input``

export default Select;
