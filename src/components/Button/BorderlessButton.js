import React from 'react';
import styled from 'styled-components';

import { HyperlinkSmall } from '../../components/Typography';

const BorderlessButton = ({
  children,
  onClick,
  as = 'button',
  href = undefined,
  target = undefined,
}) => {
  return (
    <Button href={href} as={as} target={target} onClick={onClick}>
      <HyperlinkSmall>{children}</HyperlinkSmall>
    </Button>
  );
};

const Button = styled.button`
  font-family: 'apercu-bold';
  text-transform: uppercase;
  border: none;
  background-color: transparent;
  text-decoration: none;
  font-size: 15px;
  cursor: pointer;
  color: ${props => props.theme.colorStyles.hyperlink};
  :hover {
    text-decoration: underline;
  }
`;

export default BorderlessButton;
