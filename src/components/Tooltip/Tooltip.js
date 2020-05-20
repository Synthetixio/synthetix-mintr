import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const StyledTooltip = withStyles(() => ({
	tooltip: {
		fontSize: 14,
	},
}))(Tooltip);

export default StyledTooltip;
