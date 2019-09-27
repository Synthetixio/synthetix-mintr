import React, { useContext } from 'react';
import styled from 'styled-components';
import { Store } from '../../store';

import { toggleLanguagePopup } from '../../ducks/ui';

import PopupContainer from './PopupContainer';
import { DataHeaderLarge } from '../Typography';

const LanguagePopup = () => {
  const { dispatch } = useContext(Store);

  return (
    <PopupContainer margin='auto'>
      <Wrapper>
        <DataHeaderLarge
          onCLick={() => {
            toggleLanguagePopup(false, dispatch);
          }}
        >
          English
        </DataHeaderLarge>
        <DataHeaderLarge
          onCLick={() => {
            toggleLanguagePopup(false, dispatch);
          }}
        >
          Chinese
        </DataHeaderLarge>
        <DataHeaderLarge
          onCLick={() => {
            toggleLanguagePopup(false, dispatch);
          }}
        >
          French
        </DataHeaderLarge>
        <DataHeaderLarge
          onCLick={() => {
            toggleLanguagePopup(false, dispatch);
          }}
        >
          German
        </DataHeaderLarge>
      </Wrapper>
    </PopupContainer>
  );
};

const Wrapper = styled.div`
  margin: 24px auto;
  padding: 24px 16px;
  height: 180px;
  width: 240px;
  background-color: ${props => props.theme.colorStyles.panels};
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: absolute;
`;

export default LanguagePopup;
