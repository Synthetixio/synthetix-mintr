import React, { useContext } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import styled, { ThemeContext } from 'styled-components';

const Chart = ({}) => {
  const { colorStyles } = useContext(ThemeContext);
  const data = [
    { name: 'staking', value: 60, color: colorStyles.accentLight },
    { name: 'transferable', value: 40, color: colorStyles.accentDark },
  ];
  return (
    <PieChart width={160} height={160}>
      <Pie data={data} labelLine={false} outerRadius={80} blendStroke>
        {data.map((entry, index) => (
          <Cell key={index} fill={entry.color} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default Chart;
