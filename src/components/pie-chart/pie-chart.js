import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const Chart = ({}) => {
  const data = [
    { name: 'staking', value: 60, color: '#E8E7FD' },
    { name: 'transferable', value: 40, color: '#F3F3F3' },
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
