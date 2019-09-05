import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';

const Plus = () => {
  const theme = useContext(ThemeContext);
  return (
    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fill-rule="evenodd">
        <circle
          stroke={theme.colorStyles.borders}
          fill={theme.colorStyles.buttonTertiaryBgFocus}
          cx="12"
          cy="12"
          r="11.5"
        />
        <path d="M4 4h16v16H4z" />
        <path
          d="M12 12V7v5H7h5zm0 0v5-5h5-5z"
          stroke={theme.colorStyles.subtext}
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </svg>
  );
};

export default Plus;
