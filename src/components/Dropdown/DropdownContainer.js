import React from 'react';
import styled from 'styled-components';

const Dropdown = ({ children }) => {
  return <DropdownWrapper>{children}</DropdownWrapper>;
};

const DropdownWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
`;

export default Dropdown;
