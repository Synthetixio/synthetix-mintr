import React from 'react';
// import styled from 'styled-components';
import Slider, { Handle, createSliderWithTooltip } from 'rc-slider';
import Tooltip from 'rc-tooltip';

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import './Slider.css';

const CustomSlider = createSliderWithTooltip(Slider);

export const handle = ({ value, dragging, index, ...restProps }) => {
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

// const TooltipContent = value => {
//   return (
//     <TooltipInner>
//       <TooltipValue>{value} ETH</TooltipValue>
//       <TooltipValue>{value} GWEI</TooltipValue>
//       <TooltipValue>{value} mins</TooltipValue>
//     </TooltipInner>
//   );
// };

const SliderComponent = ({ min, max, defaultValue, tooltipRenderer }) => {
  return (
    <CustomSlider
      min={min}
      max={max}
      defaultValue={defaultValue}
      handle={handle}
      tipFormatter={tooltipRenderer}
    />
  );
};

// const TooltipInner = styled.div`
//   padding: 8px 12px;
// `;
// const TooltipValue = styled.div`
//   margin-bottom: 4px;
// `;

export default SliderComponent;
