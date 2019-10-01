import React from 'react';
import styled from 'styled-components';

import { PLarge } from '../Typography';

const LanguagePopup = () => {
  return (
    <Wrapper>
      <Languages>
        {['English', 'French'].map(language => {
          return (
            <Option key={language} onClick={() => console.log(language)}>
              <LanguageImage
                src={`/images/languages/${language}.svg`}
              ></LanguageImage>
              <PLarge>{language}</PLarge>
            </Option>
          );
        })}
      </Languages>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 16px;
  padding: 16px;
  height: auto;
  width: auto;
  background-color: ${props => props.theme.colorStyles.panels};
  border: 1px solid ${props => props.theme.colorStyles.borders};
  box-shadow: 0px 5px 10px 5px ${props => props.theme.colorStyles.shadow1};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  z-index: 1;
`;

const Languages = styled.ul`
  height: auto;
  padding: 0;
  margin: 0;
`;

const Option = styled.li`
  padding: 16px;
  display: flex;
  align-items: center;
  border-radius: 2px;
  cursor: pointer;
  &:hover {
    background-color: ${props =>
      props.theme.colorStyles.paginatorButtonBackgroundHover};
    color: ${props => props.theme.colorStyles.buttonPrimaryText};
  }
`;

const LanguageImage = styled.img`
  height: 24px;
  margin-right: 16px;
`;

export default LanguagePopup;
