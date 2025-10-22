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
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-4 w-4 text-orange-400" />
        <h3 className="text-sm font-medium text-gray-300">Top Cities</h3>
      </div>
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={cityData}
            margin={{ top: 5, right: 10, left: 0, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              tickFormatter={formatAxisTick}
            />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937',
                borderColor: '#374151',
                borderRadius: '0.375rem', 
                color: 'white',
                fontSize: '12px'
              }}
              formatter={(value) => [`${value} clicks`, 'Clicks']}
            />
            <Bar dataKey="value" name="Clicks" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LocationStats;

/* eslint-disable react/prop-types 
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Location({stats = []}) {
  const cityCount = stats.reduce((acc, item) => {
    if (acc[item.city]) {
      acc[item.city] += 1;
    } else {
      acc[item.city] = 1;
    }
    return acc;
  }, {});

  const cities = Object.entries(cityCount).map(([city, count]) => ({
    city,
    count,
  }));

  return (
    <div style={{width: "100%", height: 300}}>
      <ResponsiveContainer>
        <LineChart width={700} height={300} data={cities.slice(0, 5)}>
          <XAxis dataKey="city" />
          <YAxis />
          <Tooltip labelStyle={{color: "green"}} />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
*/ 