import React, { useContext } from 'react';
import DynamicComponent from './dynamic-component';
import { ThemeContext } from 'styled-components';

export const Canon = props => {
  const { canon } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...canon} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const Trafalgar = props => {
  const { trafalgar } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...trafalgar} {...props}>
      {props.children}
    </DynamicComponent>
  );
};
