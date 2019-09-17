/* eslint-disable */
import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import styled, { keyframes } from 'styled-components';

import { PLarge } from '../Typography';

import { withTranslation } from 'react-i18next';

const getSynthList = (synths, search) => {
  if (!search) return synths;
  return synths.filter(synth =>
    synth.name.toLowerCase().includes(search.toLowerCase())
  );
};

const Input = ({
  t,
  placeholder,
  rightComponent,
  onChange,
  value,
  currentSynth,
  synths,
  singleSynth = false,
  onSynthChange,
  isDisabled = false,
}) => {
  const [listIsOpen, toggleList] = useState(false);
  const [currentSearch, updateCurrentSearch] = useState('');
  const synthList = getSynthList(synths, currentSearch);

  return (
    <OutsideClickHandler onOutsideClick={() => toggleList(false)}>
      <InputWrapper disabled={isDisabled}>
        <InputInner>
          <Dropdown
            singleSynth={singleSynth}
            synth={currentSynth && currentSynth.name}
            onClick={() => toggleList(!listIsOpen)}
          />
          <InputElement
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type='text'
          />
          <RightComponentWrapper>{rightComponent}</RightComponentWrapper>
        </InputInner>
        {listIsOpen ? (
          <List>
            <ListInputWrapper>
              <ListInputIcon src='/images/search.svg' />
              <ListInput
                value={currentSearch}
                onChange={e => updateCurrentSearch(e.target.value)}
                placeholder={t('input.list.placeholder')}
                type='text'
              />
              <ListInputIcon
                onClick={() => updateCurrentSearch('')}
                style={{ cursor: 'pointer' }}
                src='/images/close.svg'
              />
            </ListInputWrapper>
            <SynthList>
              {synthList &&
                synthList.map(synth => {
                  return (
                    <SynthListElement
                      key={synth.name}
                      onClick={() => {
                        onSynthChange(synth);
                        toggleList(false);
                      }}
                    >
                      <CurrencyIcon
                        src={`/images/currencies/${synth.name}.svg`}
                      />
                      <PLarge>{synth.name}</PLarge>
                    </SynthListElement>
                  );
                })}
            </SynthList>
          </List>
        ) : null}
      </InputWrapper>
    </OutsideClickHandler>
  );
};

const Dropdown = ({ onClick, synth, singleSynth }) => {
  const synthName = singleSynth || synth || 'sUSD';
  return (
    <Button disabled={singleSynth} onClick={onClick}>
      <CurrencyIcon src={`/images/currencies/${synthName}.svg`} />
      <PLarge>{synthName}</PLarge>
      <CaretDownIcon isHidden={singleSynth} src='/images/caret-down.svg' />
    </Button>
  );
};

export const SimpleInput = ({ value, onChange, placeholder }) => {
  return (
    <InputWrapper>
      <InputInner>
        <InputElement
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          type='text'
        />
      </InputInner>
    </InputWrapper>
  );
};

const Button = styled.button`
  cursor: pointer;
  max-width: 120px;
  z-index: 10;
  display: flex;
  align-items: center;
  text-align: center;
  padding: 0 16px;
  height: 100%;
  border: none;
  border-right: 1px solid ${props => props.theme.colorStyles.borders};
  justify-content: space-between;
  background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
`;

const CurrencyIcon = styled.img`
  height: 28px;
  width: 28px;
  margin-right: 8px;
`;

const CaretDownIcon = styled.img`
  height: 12px;
  width: 12px;
  margin-left: 8px;
  visibility: ${props => (props.isHidden ? 'hidden' : 'visible')};
`;

const InputWrapper = styled.div`
  position: relative;
  width: 400px;
  margin: 0 auto;
  opacity: ${props => (props.disabled ? '0.6' : 1)};
`;

const InputInner = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  border-radius: 5px;
  height: 64px;
  border: 1px solid ${props => props.theme.colorStyles.borders};
  background-color: ${props => props.theme.colorStyles.panelButton};
  inner-shadow: 0px 5px 10px 5px ${props => props.theme.colorStyles.shadow1};
  align-items: center;
  justify-content: center;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const List = styled.div`
  z-index: 11;
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  width: 100%;
  animation: ${fadeIn} 0.25s ease-in-out both;
  background-color: ${props => props.theme.colorStyles.panelButton};
  border: 1px solid ${props => props.theme.colorStyles.borders};
  padding: 16px;
  border-radius: 5px;
`;

const RightComponentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  padding: 16px;
`;

const InputElement = styled.input`
  width: 100%;
  height: 100%;
  padding: 16px;
  border: none;
  background-color: ${props => props.theme.colorStyles.panelButton};
  outline: none;
  font-size: 24px;
  color: ${props => props.theme.colorStyles.heading};
`;

const ListInputWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
  & > img:first-child {
    left 16px;
  }
  & > img:last-child {
    right: 16px;
  }
`;

const ListInputIcon = styled.img`
  width: 16px;
  height: 16px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;

const ListInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 16px 48px;
  background-color: ${props => props.theme.colorStyles.panelButton};
  outline: none;
  font-size: 16px;
  color: ${props => props.theme.colorStyles.heading};
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 5px;
`;

const SynthList = styled.ul`
  list-style: none;
  padding: 0;
  height: 150px;
  overflow: auto;
`;

const SynthListElement = styled.li`
  text-align: left;
  padding: 10px 16px;
  height: 45px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${props =>
      props.theme.colorStyles.paginatorButtonBackgroundHover};
  }
`;

export default withTranslation()(Input);
