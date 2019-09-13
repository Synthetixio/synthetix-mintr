import React, { useContext } from 'react';
import styled from 'styled-components';

import { toggleTransactionSettingPopup } from '../../ducks/ui';
import { Store } from '../../store';

const Button = () => {
  const { dispatch } = useContext(Store);
  return (
    <ButtonWrapper
      onClick={() => toggleTransactionSettingPopup(true, dispatch)}
    >
      EDIT
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled.button`
  font-family: 'apercu-bold';
  border: none;
  font-size: 14px;
  cursor: pointer;
  color: ${props => props.theme.colorStyles.hyperlink};
`;

export default Button;
