import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const Chart = ({ data }) => {
  return (
    <PieChart width={160} height={160}>
      <Pie
        dataKey="value"
        data={data}
        labelLine={false}
        outerRadius={80}
        blendStroke
      >
        {data.map((entry, index) => (
          <Cell key={index} fill={entry.color} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default Chart;
