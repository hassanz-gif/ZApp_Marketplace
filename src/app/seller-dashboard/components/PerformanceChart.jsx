import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PerformanceChart({ data }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Performance Metrics</h3>
        <p className="text-sm text-muted-foreground mt-1">Views and orders comparison over time</p>
      </div>
      <div className="w-full h-80" aria-label="Performance Metrics Line Chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-popover)', 
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="views" 
              stroke="var(--color-primary)" 
              strokeWidth={2}
              dot={{ fill: 'var(--color-primary)', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="var(--color-success)" 
              strokeWidth={2}
              dot={{ fill: 'var(--color-success)', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

PerformanceChart.propTypes = {
  data: PropTypes?.arrayOf(
    PropTypes?.shape({
      date: PropTypes?.string?.isRequired,
      views: PropTypes?.number?.isRequired,
      orders: PropTypes?.number?.isRequired
    })
  )?.isRequired
};