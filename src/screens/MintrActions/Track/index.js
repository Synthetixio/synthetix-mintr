import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { SlidePage, SliderContent } from '../../../components/ScreenSlider';
import { ButtonTertiary } from '../../../components/Button';
import { PLarge, H1, Subtext } from '../../../components/Typography';
import { ExternalLink, BorderedContainer } from '../../../styles/common';
import Table from '../../../components/TableNew';
import { TABLE_PALETTE } from '../../../components/TableNew/constants';

import DebtChart from '../../../components/DebtChart';

import { formatCurrencyWithSign } from '../../../helpers/formatters';

const Track = ({ onDestroy }) => {
	const { t } = useTranslation();
	return (
		<SlidePage>
			<SliderContent>
				<Navigation>
					<ButtonTertiary onClick={onDestroy}>{t('button.navigation.cancel')}</ButtonTertiary>
				</Navigation>
				<Header>
					<ActionImage src="/images/actions/track.svg" />
					<StyledH1>{t('mintrActions.track.action.title')}</StyledH1>
					<PLarge>
						{t('mintrActions.track.action.subtitle')}{' '}
						<StyledExternalLink href="https://www.zapper.fi/">
							Zapper.fi <LinkArrow>↗</LinkArrow>
						</StyledExternalLink>
					</PLarge>
				</Header>
				<Body>
					<Grid>
						<GridColumn>
							<BorderedContainer>
								<StyledSubtext>{t('mintrActions.track.action.data.totalSynths')}</StyledSubtext>
								<Amount>{formatCurrencyWithSign('$', 1000000)}</Amount>
							</BorderedContainer>

							<BorderedContainer>
								<StyledSubtext>{t('mintrActions.track.action.data.synthDebt')}</StyledSubtext>
								<Amount>{formatCurrencyWithSign('$', 1000000)}</Amount>
							</BorderedContainer>

							<BorderedContainer>
								<StyledSubtext>{t('mintrActions.track.action.data.netDebt')}</StyledSubtext>
								<Amount>{formatCurrencyWithSign('$', 1000000)}</Amount>
							</BorderedContainer>
						</GridColumn>
						<GridColumn>
							<ChartBorderedContainer>
								<StyledSubtext>{t('mintrActions.track.action.chart.title')}</StyledSubtext>
								<DebtChart />
							</ChartBorderedContainer>
						</GridColumn>
					</Grid>
					<TableBorderedContainer>
						<Table
							data={[
								{ synth: 'sBTC', balance: 100, value: 100 },
								{ synth: 'sETH', balance: 200, value: 200 },
							]}
							palette={TABLE_PALETTE.STRIPED}
							columns={[
								{
									Header: t('mintrActions.track.action.table.yourSynths'),
									accessor: 'synth',
									// Cell: cellProps => 'test',
									sortable: false,
								},
								{
									Header: t('mintrActions.track.action.table.balance'),
									accessor: 'balance',
									// Cell: cellProps => 'test',
									sortable: true,
								},
								{
									Header: '$ USD',
									accessor: 'value',
									// Cell: cellProps => 'test',
									sortable: true,
								},
							]}
						/>
					</TableBorderedContainer>
				</Body>
			</SliderContent>
		</SlidePage>
	);
};

const Navigation = styled.div`
	width: 100%;
	display: flex;
	text-align: left;
`;

const StyledH1 = styled(H1)`
	margin: 18px 0 8px 0;
`;
const Header = styled.div``;
const Body = styled.div`
	width: 100%;
`;

const ActionImage = styled.img`
	height: 48px;
	width: 48px;
`;

const StyledSubtext = styled(Subtext)`
	text-transform: uppercase;
	color: ${props => props.theme.colorStyles.body};
	font-family: 'apercu-medium';
	margin: 0;
`;

const Amount = styled.span`
	color: ${props => props.theme.colorStyles.hyperlink};
	font-family: 'apercu-medium';
	font-size: 18px;
	margin-top: 4px;
`;

const Grid = styled.div`
	display: grid;
	width: 100%;
	grid-template-columns: 170px 1fr;
	grid-column-gap: 18px;
`;

const GridColumn = styled.div`
	display: grid;
	grid-row-gap: 18px;
`;

const StyledExternalLink = styled(ExternalLink)`
	color: ${props => props.theme.colorStyles.hyperlink};
`;

const LinkArrow = styled.span`
	font-size: 10px;
`;

const ChartBorderedContainer = styled(BorderedContainer)`
	justify-content: flex-start;
	align-items: flex-start;
`;

const TableBorderedContainer = styled(BorderedContainer)`
	margin-top: 18px;
	height: 268px;
`;

export default Track;
