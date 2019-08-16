import React, { useContext } from 'react';
import DynamicComponent from './dynamic-component';
import { ThemeContext } from 'styled-components';

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