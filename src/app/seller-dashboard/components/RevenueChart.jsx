import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function RevenueChart({ data }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Revenue Overview</h3>
        <p className="text-sm text-muted-foreground mt-1">Monthly revenue trends for the past 6 months</p>
      </div>
      <div className="w-full h-80" aria-label="Monthly Revenue Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-popover)', 
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
              formatter={(value) => [`$${value?.toLocaleString()}`, 'Revenue']}
            />
            <Legend />
            <Bar dataKey="revenue" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

RevenueChart.propTypes = {
  data: PropTypes?.arrayOf(
    PropTypes?.shape({
      month: PropTypes?.string?.isRequired,
      revenue: PropTypes?.number?.isRequired
    })
  )?.isRequired
};