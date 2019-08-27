import React from 'react';
import styled from 'styled-components';

const PageContainer = ({ children }) => {
  return (
    <Wrapper>
      <Container>{children}</Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 40px 48px 0 48px;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  overflow: hidden;
`;

export default PageContainer;
