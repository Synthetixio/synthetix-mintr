import React, { useContext } from 'react';
import styled from 'styled-components';

import { toggleTransactionSettingsPopup } from '../../ducks/ui';
import { Store } from '../../store';

const Button = () => {
  const { dispatch } = useContext(Store);
  return (
    <ButtonWrapper
      onClick={() => toggleTransactionSettingsPopup(true, dispatch)}
    >
      EDIT
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled.button`
  font-family: 'apercu-bold';
  border: none;
  background-color: transparent;
  font-size: 15px;
  cursor: pointer;
  color: ${props => props.theme.colorStyles.hyperlink};
  :hover {
    text-decoration: underline;
  }
`;

export default Button;
