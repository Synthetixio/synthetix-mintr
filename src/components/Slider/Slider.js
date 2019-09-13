import React from 'react';
import Slider, { Handle } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import './Slider.css';

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

const SliderComponent = ({ min, max, defaultValue }) => {
  return (
    <Slider min={min} max={max} defaultValue={defaultValue} handle={handle} />
  );
};

export default SliderComponent;
