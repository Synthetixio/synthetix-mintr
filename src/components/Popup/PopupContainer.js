import React from 'react';
import styled from 'styled-components';

const Popup = ({ children }) => {
  return <PopupWrapper>{children}</PopupWrapper>;
};

const PopupWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export default Popup;
