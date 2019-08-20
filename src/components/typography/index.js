import React, { useContext } from 'react';
import DynamicComponent from './dynamic-component';
import { ThemeContext } from 'styled-components';

export const PageTitle = props => {
  const { pageTitle } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...pageTitle} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const H1 = props => {
  const { h1 } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...h1} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const H2 = props => {
  const { h2 } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...h2} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const H4 = props => {
  const { h4 } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...h4} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const H5 = props => {
  const { h5 } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...h5} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const PMega = props => {
  const { pMega } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...pMega} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const PLarge = props => {
  const { pLarge } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...pLarge} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const PMedium = props => {
  const { pMedium } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...pMedium} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const PSmall = props => {
  const { pSmall } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...pSmall} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const PTiny = props => {
  const { pTiny } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...pTiny} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const Subtext = props => {
  const { subtext } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...subtext} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const Figure = props => {
  const { figure } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...figure} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const DataLarge = props => {
  const { dataLarge } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...dataLarge} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const DataHeaderLarge = props => {
  const { dataHeaderLarge } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...dataHeaderLarge} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const DataHeaderSmall = props => {
  const { dataHeaderSmall } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...dataHeaderSmall} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const DataSmall = props => {
  const { dataSmall } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...dataSmall} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const ButtonPrimaryLabel = props => {
  const { buttonPrimaryLabel } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...buttonPrimaryLabel} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const ButtonPrimaryLabelSmall = props => {
  const { buttonPrimaryLabelSmall } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...buttonPrimaryLabelSmall} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const ButtonSecondaryLabel = props => {
  const { buttonSecondaryLabel } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...buttonSecondaryLabel} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const ButtonTertiaryLabel = props => {
  const { buttonTertiaryLabel } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...buttonTertiaryLabel} {...props}>
      {props.children}
    </DynamicComponent>
  );
};
