import React, { useContext } from 'react';
import DynamicComponent from './dynamic-component';
import { ThemeContext } from 'styled-components';
import { system } from 'styled-system';

export const ButtonTertiary = props => {
  const { buttonTertiary } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...buttonTertiary} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

export const ChartData = props => {
  const { chartData } = useContext(ThemeContext).textStyles;
  return (
    <DynamicComponent {...chartData} {...props}>
      {props.children}
    </DynamicComponent>
  );
};

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

export const Figure = props => {
    const { figure } = useContext(ThemeContext).textStyles;
    return (
        <DynamicComponent {...figure} {...props}>
        {props.children}
        </DynamicComponent>
    );
};