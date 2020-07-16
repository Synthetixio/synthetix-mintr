import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { DataLarge, Figure } from 'components/Typography';
import { FlexDivCentered } from 'styles/common';
import Box from './Box';

const CollRatios = ({ debtStatusData = {} }) => {
	const { t } = useTranslation();
	return (
		<StyledFlexDivCentered>
			<Box>
				<Figure>
					{debtStatusData?.currentCRatio ? Math.round(100 / debtStatusData.currentCRatio) : 0}%
				</Figure>

				<DataLarge>{t('dashboard.ratio.current')}</DataLarge>
			</Box>
			<Box>
				<Figure>
					{debtStatusData?.targetCRatio ? Math.round(100 / debtStatusData.targetCRatio) : 0}%
				</Figure>
				<DataLarge>{t('dashboard.ratio.target')}</DataLarge>
			</Box>
		</StyledFlexDivCentered>
	);
};

const StyledFlexDivCentered = styled(FlexDivCentered)`
	margin: 0 0 22px 0;
	justify-content: space-between;
`;

export default CollRatios;
