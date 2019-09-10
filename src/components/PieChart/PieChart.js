import React, { memo } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import isEqual from 'lodash/isEqual';

const Chart = memo(({ data }) => {
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
}, isEqual);

export default Chart;
