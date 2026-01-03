import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { MapPin } from "lucide-react";

const LocationStats = ({ stats }) => {
  if (!stats || !stats.length) return null;

  // Count countries (stored but not displayed)
  const countryCounts = stats.reduce((acc, click) => {
    const country = click.country || "Unknown";
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  // Count cities
  const cityCounts = stats.reduce((acc, click) => {
    const city = click.city || "Unknown";
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  const cityData = Object.entries(cityCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const formatAxisTick = (value) => {
    return value.length > 12 ? value.substring(0, 12) + '...' : value;
  };

  return (
    <div className="bg-neo-green border-3 border-foreground shadow-neo p-4">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-4 w-4 text-foreground" />
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Top Cities</h3>
      </div>
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={cityData}
            margin={{ top: 5, right: 10, left: 0, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#000" strokeWidth={1} />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fill: '#000', fontSize: 11, fontWeight: 'bold' }}
              tickFormatter={formatAxisTick}
              stroke="#000"
              strokeWidth={2}
            />
            <YAxis
              tick={{ fill: '#000', fontSize: 11, fontWeight: 'bold' }}
              stroke="#000"
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderColor: '#000',
                borderWidth: '3px',
                borderRadius: '0',
                color: '#000',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
              formatter={(value) => [`${value} clicks`, 'Clicks']}
            />
            <Bar
              dataKey="value"
              name="Clicks"
              fill="#FACC15"
              stroke="#000"
              strokeWidth={2}
              radius={[0, 0, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LocationStats;