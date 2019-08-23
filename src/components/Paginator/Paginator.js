import React from 'react';
import styled from 'styled-components';

import { Arrow } from '../Icons';

const renderPageNumberButtons = () => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => (
    <Button key={index} active={index === 1}>
      {index}
    </Button>
  ));
};
const Paginator = () => {
  return (
    <Wrapper>
      <Button>
        <Arrow direction="left" />
      </Button>
      {renderPageNumberButtons()}
      <Button>
        <Arrow direction="right" />
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  margin: 40px 0;
  display: flex;
  justify-content: center;
  & > :first-child,
  & > :last-child {
    margin: 0 20px;
  }
`;

const Button = styled.button`
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 5px;
  background-color: ${props =>
    props.active
      ? props.theme.colorStyles.paginatorButtonBackgroundActive
      : props.theme.colorStyles.paginatorButtonBackground};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0 5px;
  font-family: 'apercu-medium';
  font-size: 14px;
  line-height: 25px;
  font-weight: 500;
  color: ${props =>
    props.active
      ? props.theme.colorStyles.buttonPrimaryText
      : props.theme.colorStyles.tableHeading};
  :hover {
    background-color: ${props =>
      props.theme.colorStyles.paginatorButtonBackgroundHover};
  }
`;

export default Paginator;
