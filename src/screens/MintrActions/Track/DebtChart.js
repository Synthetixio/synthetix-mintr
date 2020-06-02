import React, { useContext } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ThemeContext } from 'styled-components';
import numbro from 'numbro';
import {
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ReferenceLine,
} from 'recharts';
import { H5 } from 'components/Typography';
import { formatCurrency } from 'helpers/formatters';

const LEGEND_LABELS = {
	activeDebt: 'mintrActions.track.action.data.activeDebt',
	issuanceDebt: 'mintrActions.track.action.data.issuedDebt',
	// netDebt: 'mintrActions.track.action.chart.legend.netDebt',
};

const CustomTooltip = ({ active, payload, label }) => {
	const { t } = useTranslation();
	if (!active || !label) return null;

	return (
		<TooltipWrapper>
			<StyledH5>{format(new Date(label), 'MMM dd YYY, h:mma')}</StyledH5>
			<Legend>
				{payload.map(({ color, name, value }) => {
					return (
						<LegendRow key={`legend-${name}`}>
							<LegendName>
								<LegendIcon style={{ backgroundColor: color }} />
								<LegendText>{t(LEGEND_LABELS[name])}</LegendText>
							</LegendName>
							<LegendText>{`${formatCurrency(value)} sUSD`}</LegendText>
						</LegendRow>
					);
				})}
			</Legend>
		</TooltipWrapper>
	);
};

const Chart = ({ data }) => {
	const { colorStyles } = useContext(ThemeContext);
	if (!data || data.length === 0) return null;
	return (
		<ResponsiveContainer width="100%" height={270}>
			<LineChart margin={{ left: 0, top: 20, bottom: 0, right: 5 }} data={data}>
				<XAxis
					height={20}
					dataKey="timestamp"
					interval="preserveEnd"
					tick={{ fontSize: 12, fill: colorStyles.subtext, fontFamily: 'apercu-regular' }}
					axisLine={false}
					tickLine={false}
					tickFormatter={tick => format(new Date(tick), 'd MMM yy')}
				/>
				<YAxis
					width={35}
					stroke="#E8E7FD"
					domain={['auto', 'auto']}
					tickLine={false}
					strokeWidth={1}
					tickFormatter={tick => numbro(tick).format({ average: true })}
					tick={{ fontSize: 12, fill: colorStyles.subtext, fontFamily: 'apercu-regular' }}
				/>
				<Tooltip
					cursor={{ stoke: colorStyles.borders }}
					content={<CustomTooltip />}
					contentStyle={{
						backgroundColor: colorStyles.panelButton,
						zIndex: 1000,
						borderColor: colorStyles.borders,
					}}
				/>
				<Line type="monotone" dataKey="issuanceDebt" stroke="#419EF8" strokeWidth={2} dot={false} />
				<Line type="monotone" dataKey="activeDebt" stroke="#5C2AF5" strokeWidth={2} dot={false} />
				{/* <Line type="monotone" dataKey="netDebt" stroke="#5ABC92" strokeWidth={2} dot={false} /> */}
				<ReferenceLine y={0} isFront={false} strokeWidth={1} stroke={colorStyles.borders} />
			</LineChart>
		</ResponsiveContainer>
	);
};

const TooltipWrapper = styled.div`
	width: 250px;
	background-color: ${props => props.theme.colorStyles.panelButton};
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 2px;
	padding: 16px;
	text-align: left;
`;

const StyledH5 = styled(H5)`
	font-size: 14px;
	text-transform: none;
`;

const Legend = styled.div`
	width: 100%;
`;

const LegendRow = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
`;

const LegendName = styled.div`
	display: flex;
	align-items: center;
`;

const LegendIcon = styled.div`
	width: 10px;
	height: 10px;
	background-color: red;
	border-radius: 50%;
	margin-right: 8px;
`;

const LegendText = styled.span`
	font-family: 'apercu-regular';
	font-size: 12px;
	color: ${props => props.theme.colorStyles.body};
`;
export default Chart;
