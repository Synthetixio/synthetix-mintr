import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { PageTitle, PageSubtitle } from '../../../../components/typography';

const Home = () => {
  const { colorStyles } = useContext(ThemeContext);
  return (
    <HomeWrapper>
      <Container>
        {/* <Canon color={colorStyles.subtext}>
          THIS IS THE CANON TITLE{' '}
        </Canon>
        <Trafalgar>This is the Trafalgar subtitle </Trafalgar> */}
        <PageTitle>What would you like to do?</PageTitle>
        <PageSubtitle>
          Click any button to view more info, confirm or change the amount
          before submitting.
        </PageSubtitle>
        <ButtonRow margin="30px 0 40px 0">
          <Button big>
            <ButtonContainer>
              <ActionImage src="/images/actions/mint.svg" big />
              <H1>Mint</H1>
              <H6>lock SNX to mint sUSD</H6>
            </ButtonContainer>
          </Button>
          <Button big>
            <ButtonContainer>
              <ActionImage src="/images/actions/burn.svg" big />
              <H1>Burn</H1>
              <H6>burn sUSD to unlock SNX</H6>
            </ButtonContainer>
          </Button>
        </ButtonRow>
        <ButtonRow margin="0 0 40px 0">
          <Button>
            <ButtonContainer>
              <ActionImage src="/images/actions/claim.svg" />
              <H2>Claim</H2>
              <P>sUSD and SNX staking rewards</P>
            </ButtonContainer>
          </Button>
          <Button>
            <ButtonContainer>
              <ActionImage src="/images/actions/trade.svg" />
              <H2>Trade</H2>
              <P>Synths on the Synthetix.Exchange</P>
            </ButtonContainer>
          </Button>
          <Button>
            <ButtonContainer>
              <ActionImage src="/images/actions/send.svg" />
              <H2>Send</H2>
              <P>sUSD or SNX to another wallet</P>
            </ButtonContainer>
          </Button>
        </ButtonRow>
      </Container>
    </HomeWrapper>
  );
};

const HomeWrapper = styled.div`
  padding: 40px 48px 0 48px;
`;

const Container = styled.div`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
`;

const Button = styled.button`
  flex: 1;
  cursor: pointer;
  height: 352px;
  max-width: ${props => (props.big ? '336px' : '216px')};
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
  max-width: 140px;
  margin: 0 auto;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${props => (props.margin ? props.margin : 0)};
`;

const ActionImage = styled.img`
  height: ${props => (props.big ? '64px' : '48px')};
  width: ${props => (props.big ? '64px' : '48px')};
`;

const H1 = styled.h1`
  margin: 30px 0;
`;

const H2 = styled.h2`
  margin: 30px 0;
`;

const H4 = styled.h4`
  margin: 18px 0;
`;

const H6 = styled.h6`
  line-height: 30px;
`;

const P = styled.p`
  font-family: 'apercu-medium';
  font-size: 16px;
  margin: 10px 0;
  line-height: 20px;
`;

export default Home;
