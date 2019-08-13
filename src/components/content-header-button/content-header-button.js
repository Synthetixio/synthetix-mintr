import React from 'react';
import styled from 'styled-components';

const ContentHeaderButton = ({children, isSelected}) => {
    return (
        <Button isSelected={isSelected}>{children}</Button>
    );
}

const Button = styled.button`
    background-color: ${props => props.isSelected ? props.theme.accentDark : props.theme.accentLight};
    border: none;
    border-bottom: 8px solid ${props => props.isSelected ? props.theme.purple4 : props.theme.accentLight};
    flex: 1;

    font-size: 16px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: ${props => props.theme.subFont};
`;

export default ContentHeaderButton;