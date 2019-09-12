import React from 'react';
import styled from 'styled-components';
import { Cross } from '../Icons';

const Popup = ({ children }) => {
  return (
    <PopupWrapper>
      <Nav>
        <Cross />
      </Nav>
      {children}
    </PopupWrapper>
  );
};

const PopupWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const Nav = styled.div`
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  top: 80px;
  right: 40px;
`;

export default Popup;
