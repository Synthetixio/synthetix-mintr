import React from 'react';
import styled from 'styled-components';
import Header from '../../components/header';

const Dashboard = () => {
  return (
    <DashboardWrapper>
      <Header />
      <Content>this is the Dashboard</Content>
    </DashboardWrapper>
  );
};

const DashboardWrapper = styled('div')`
  background: ${props => props.theme.background};
  width: 623px;
  h1 {
    color: ${props => props.theme.body};
    margin: 0;
  }
  transition: all ease-out 0.5s;
  flex-shrink: 0;
`;

const Content = styled('div')`
  margin-top: 100px;
`;

export default Dashboard;
