/*eslint-disable */
import React, { useContext } from 'react';
import styled from 'styled-components';
import { SlidePage, SliderContext } from '../../../components/Slider';
import {
  ButtonPrimary,
  ButtonTertiary,
  ButtonMax,
} from '../../../components/Button';
import {
  PLarge,
  H1,
  H5,
  ButtonPrimaryLabel,
  Subtext,
  InputTextLarge,
  DataHeaderLarge,
} from '../../../components/Typography';
import Input from '../../../components/Input';

const Action = ({ onDestroy }) => {
  const { handleNext } = useContext(SliderContext);
  return (
    <SlidePage>
      <Container>
        <Navigation>
          <ButtonTertiary onClick={onDestroy}>Cancel</ButtonTertiary>
          <ButtonTertiary>Claim History ↗</ButtonTertiary>
        </Navigation>
        <Top>
          <Intro>
            <ActionImage src='/images/actions/claim.svg' big />
            <H1>CLAIM</H1>
            <PLarge>
              If you have locked your SNX and minted sUSD, you are eligible to
              collect two kinds of rewards: SNX staking rewards, and sUSD
              trading rewards generated on Synthetix.Exchange (sX).
            </PLarge>
          </Intro>
          <Middle>
            <Table>
              <H5>Claimable periods:</H5>
            </Table>
            <Details>
              <Box>
                <DataHeaderLarge>
                  Your available sUSD trading rewards:
                </DataHeaderLarge>
                <Amount>5,000.00 sUSD</Amount>
              </Box>
              <Box>
                <DataHeaderLarge>
                  Your available SNX staking rewards:
                </DataHeaderLarge>
                <Amount>5,000.00 SNX</Amount>
              </Box>
            </Details>
          </Middle>
        </Top>
        <Bottom>
          <Fees>
            <Subtext>
              GAS: $0.083 / SPEED: ~5:24 mins <Highlighted>EDIT</Highlighted>
            </Subtext>
          </Fees>
          <ButtonPrimary onClick={handleNext} margin='auto'>
            CLAIM NOW
          </ButtonPrimary>
          <Note>
            <Subtext>
              Note: if not collected in the current period it will be forfeited
              and rolled over into the fee pool for the next fee period.
            </Subtext>
          </Note>
        </Bottom>
      </Container>
    </SlidePage>
  );
};

const Container = styled.div`
  width: 100%;
  height: 850px;
  max-width: 720px;
  margin: 0 auto;
  overflow: hidden;
  background-color: ${props => props.theme.colorStyles.panels};
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 5px;
  box-shadow: 0px 5px 10px 5px ${props => props.theme.colorStyles.shadow1};
  margin-bottom: 20px;
  padding: 40px 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: space-around;
`;

const Top = styled.div`
  height: auto;
  margin: auto;
`;

const Middle = styled.div`
  height: auto;
  margin: auto;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Bottom = styled.div`
  height: auto;
  margin-bottom: 32px;
`;

const Navigation = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Intro = styled.div`
  max-width: 480px;
  margin-bottom: 48px;
  margin: 0px auto 24px auto;
`;

const ActionImage = styled.img`
  height: ${props => (props.big ? '64px' : '48px')};
  width: ${props => (props.big ? '64px' : '48px')};
  margin-bottom: 8px;
`;

const Table = styled.div`
  border: 1px solid ${props => props.theme.colorStyles.borders};
  height: auto;
  width: 55%;
  margin: 8px 16px;
  padding: 16px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
`;

const Box = styled.div`
  height: auto;
  width: auto;
  padding: 24px 16px;
  margin: 8px 0px;
  border: 1px solid ${props => props.theme.colorStyles.borders};
  border-radius: 2px;
  display: flex;
  flex-direction: column;
`;

const Amount = styled.span`
  color: ${props => props.theme.colorStyles.hyperlink};
  font-family: 'apercu-medium';
  font-size: 24px;
  margin: 16px 0px 0px 0px;
`;

const Highlighted = styled.span`
  font-family: 'apercu-bold';
  color: ${props => props.theme.colorStyles.hyperlink};
`;

const Fees = styled.div`
  margin-bottom: 32px;
`;

const Note = styled.div`
  margin-top: 24px;
  max-width: 420px;
`;

export default Action;
