import React from 'react';
import styled from 'styled-components';
import { ButtonPrimaryLabelSmall } from '../Typography';
import { withTranslation } from 'react-i18next';

const ButtonMax = ({ onClick, t }) => {
  return (
    <Button onClick={onClick}>
      <ButtonPrimaryLabelSmall>{t('button.max')}</ButtonPrimaryLabelSmall>
    </Button>
  );
};

const Button = styled.button`
  background-color: ${props => props.theme.colorStyles.buttonPrimaryBg};
  font-size: 14px;
  height: 32px;
  width: 56px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  border: transparent;
  border-radius: 3px;
  cursor: pointer;
  transition: all ease-in 0.1s;
  text-transform: uppercase;
  &:hover {
    background-color: ${props => props.theme.colorStyles.buttonPrimaryBgFocus};
  }
`;

export default withTranslation()(ButtonMax);
