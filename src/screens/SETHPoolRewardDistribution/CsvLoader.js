import React from 'react';
import papaparse from 'papaparse';
import styled from 'styled-components';

import { ButtonSecondaryLabel } from '../../components/Typography';

export default ({ onDataLoaded }) => {
  const onFileChange = event => {
    const fileReader = new FileReader();
    fileReader.onloadend = e => {
      const data = papaparse.parse(
        e.target.result,
        { delimiter: ',', header: false, skipEmptyLines: true }
      ).data;
      onDataLoaded(data);
    }
    if (event.target.files[0]) {
      fileReader.readAsText(event.target.files[0]);
    }
  }
  return (
    <div>
      <Input type="file" name="file" accept=".csv" onChange={onFileChange} id="file" />
      <Label htmlFor="file"><ButtonSecondaryLabel>browse files</ButtonSecondaryLabel></Label>
    </div>
  );
}

const Input = styled.input`
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
`;

const Label = styled.label`
  width: ${props => (props.width ? props.width + 'px' : '400px')};
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 72px;
  border-radius: 5px;
  text-transform: uppercase;
  border: 2px solid ${props => props.theme.colorStyles.buttonPrimaryBg};
  cursor: pointer;
  background-color: transparent;
  transition: all ease-in 0.1s;
  &:hover {
    background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
  }
`;
