import React from 'react';
import styled from 'styled-components';
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

const TooltipContent = () => {
  return <TooltipInner>this is the tooltip content</TooltipInner>;
};

const SliderComponent = ({ min, max, defaultValue }) => {
  return (
    <CustomSlider
      min={min}
      max={max}
      defaultValue={defaultValue}
      handle={handle}
      tipFormatter={TooltipContent}
    />
  );
};

const TooltipInner = styled.div``;
export default SliderComponent;
