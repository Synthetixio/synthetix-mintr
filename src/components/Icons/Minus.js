import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';

const Plus = () => {
  const theme = useContext(ThemeContext);
  return (
    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd">
        <circle
          stroke={theme.colorStyles.borders}
          fill={theme.colorStyles.buttonTertiaryBgFocus}
          cx="12"
          cy="12"
          r="11.5"
        />
        <path d="M4 4h16v16H4z" />
        <path
          d="M7 12h10"
          stroke={theme.colorStyles.subtext}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default Plus;
