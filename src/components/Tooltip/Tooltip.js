import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import COLORS from 'styles/colors';

const commonStyle = {
	fontSize: 14,
	fontFamily: 'apercu-regular',
	borderRadius: '5px',
	padding: '15px',
};

const LightTooltip = withStyles(() => ({
	tooltip: {
		...commonStyle,
		backgroundColor: COLORS.white,
		border: `1px solid ${COLORS.light5}`,
		color: COLORS.light2,
	},
}))(Tooltip);

const DarkTooltip = withStyles(() => ({
	tooltip: {
		...commonStyle,
		backgroundColor: COLORS.dark2,
		border: `1px solid ${COLORS.dark4}`,
		color: COLORS.dark6,
	},
}))(Tooltip);

const StyledTooltip = ({ mode, title, children, placement }) => {
	const TooltipComponent = mode === 'light' ? LightTooltip : DarkTooltip;
	return (
		<TooltipComponent title={title} placement={placement}>
			{children}
		</TooltipComponent>
	);
};

export default StyledTooltip;
