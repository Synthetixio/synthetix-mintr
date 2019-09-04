/* eslint-disable */
import React, { useContext, useState, Fragment } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { PageTitle, PLarge, H2, H5 } from '../../../components/Typography';
import PageContainer from '../../../components/PageContainer';
import { ButtonTertiary } from '../../../components/Button';
import { List, THead, TBody, TR, TH, TD } from '../../../components/List';
import { Plus } from '../../../components/Icons';

import DepotAction from '../../DepotActions';

const initialScenario = null;

const renderDepotButtons = setCurrentScenario => {
  const theme = useContext(ThemeContext);
  return (
    <Fragment>
      <PageTitle>The Depot: $206,292.25 sUSD</PageTitle>
      <PLarge>
        Deposit sUSD you’ve freshly minted into a queue to be sold on Uniswap,
        and you’ll receive the proceeds of all sales in ETH. While your sUSD is
        in the queue waiting to be sold, you can withdraw your sUSD back into
        your wallet at any time. Note: minimum deposit is 50 sUSD.
      </PLarge>
      <ButtonRow>
        {['deposit', 'withdraw'].map(action => {
          return (
            <Button key={action} onClick={() => setCurrentScenario(action)}>
              <ButtonContainer>
                <ActionImage src={`/images/actions/${action}.svg`} />
                <H2>{action}</H2>
                <PLarge>Amount available:</PLarge>
                <Amount>4,000.00 sUSD</Amount>
              </ButtonContainer>
            </Button>
          );
        })}
      </ButtonRow>
      <Activity>
        <ActivityHeader>
          <H5 marginTop='10px'>Recent Activity:</H5>
          <MoreButtons>
            <ButtonTertiary>View More</ButtonTertiary>
            <ButtonTertiary>View Contract</ButtonTertiary>
          </MoreButtons>
        </ActivityHeader>
        <List>
          <THead>
            <TH>Type</TH>
            <TH>Amount</TH>
            <TH>Remaining</TH>
            <TH>Date | Time</TH>
            <TH>Details</TH>
          </THead>
          <TBody>
            <TR>
              <TD>
                <TypeImage src='/images/actions/deposit.svg' /> Deposit
              </TD>
              <TD>2,000.00 sUSD</TD>
              <TD>500.00 sUSD</TD>
              <TD>14:00 | 4 Oct 2019</TD>
              <TD>
                <Plus theme={theme} />
              </TD>
            </TR>
            <TR>
              <TD>Deposit</TD>
              <TD>2,000.00 sUSD</TD>
              <TD>500.00 sUSD</TD>
              <TD>14:00 | 4 Oct 2019</TD>
              <TD>
                <Plus theme={theme} />
              </TD>
            </TR>
            <TR>
              <TD>Deposit</TD>
              <TD>2,000.00 sUSD</TD>
              <TD>500.00 sUSD</TD>
              <TD>14:00 | 4 Oct 2019</TD>
              <TD>
                <Plus theme={theme} />
              </TD>
            </TR>
          </TBody>
        </List>
      </Activity>
    </Fragment>
  );
};

const Depot = () => {
  const [currentScenario, setCurrentScenario] = useState(initialScenario);
  return (
    <PageContainer>
      <DepotAction
        action={currentScenario}
        onDestroy={() => setCurrentScenario(null)}
      />
      {renderDepotButtons(setCurrentScenario)}
    </PageContainer>
  );
};

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 32px auto 48px auto;
`;

const Button = styled.button`
  cursor: pointer;
  width: 48%;
  height: 300px;
  background-color: ${props => props.theme.colorStyles.panelButton};
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 5px;
  box-shadow: 0px 5px 10px 5px ${props => props.theme.colorStyles.shadow1};
  transition: transform ease-in 0.2s;
  &:hover {
    background-color: ${props => props.theme.colorStyles.panelButtonHover};
    box-shadow: 0px 5px 10px 8px ${props => props.theme.colorStyles.shadow1};
    transform: translateY(-2px);
  }
`;

const ButtonContainer = styled.div`
  max-width: 300px;
  margin: 0 auto;
`;

const ActionImage = styled.img`
  height: 48px;
  width: 48px;
`;

const Amount = styled.span`
  color: ${props => props.theme.colorStyles.body};
  font-family: 'apercu-medium';
  font-size: 24px;
  margin: 8px 0px 0px 0px;
`;

const Activity = styled.span`
  height: auto;
`;

const ActivityHeader = styled.span`
  height: auto;
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const MoreButtons = styled.span`
  height: auto;
  display: flex;
  & :first-child {
    margin-right: 8px;
  }
`;

const TypeImage = styled.div`
  width: 8px;
`;

export default Depot;
