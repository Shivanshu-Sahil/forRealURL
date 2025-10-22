import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Smartphone, Monitor, Tablet, Globe } from "lucide-react";

const DeviceStats = ({ stats }) => {
  if (!stats || !stats.length) return null;

  // Count devices
  const deviceCounts = stats.reduce((acc, click) => {
    const device = click.device_type?.toLowerCase() || "unknown";
    
    if (device.includes("mobile")) {
      acc.mobile = (acc.mobile || 0) + 1;
    } else if (device.includes("tablet")) {
      acc.tablet = (acc.tablet || 0) + 1;
    } else if (device.includes("desktop")) {
      acc.desktop = (acc.desktop || 0) + 1;
    } else {
      acc.unknown = (acc.unknown || 0) + 1;
    }
    return acc;
  }, {});

  // Count browsers
  const browserCounts = stats.reduce((acc, click) => {
    const browser = click.browser || "Unknown";
    acc[browser] = (acc[browser] || 0) + 1;
    return acc;
  }, {});

  // Transform data for chart
  const deviceData = Object.entries(deviceCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const browserData = Object.entries(browserCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Colors that match our theme
  const COLORS = ["#f97316", "#3b82f6", "#10b981", "#6366f1", "#8b5cf6", "#ec4899"];

  // Get device icon
  const getDeviceIcon = (name) => {
    switch(name.toLowerCase()) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Device Type */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Monitor className="h-4 w-4 text-orange-400" />
          <h3 className="text-sm font-medium text-gray-300">Device Types</h3>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="w-[140px] h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937',
                    borderColor: '#374151',
                    borderRadius: '0.375rem',
                    color: 'white',
                    fontSize: '12px'
                  }}
                  formatter={(value, name) => [`${value} clicks`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex-1 space-y-2">
            {Object.entries(deviceCounts).map(([device, count], index) => (
              <div key={device} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  {getDeviceIcon(device)}
                  <span className="text-gray-300">{device.charAt(0).toUpperCase() + device.slice(1)}</span>
                </div>
                <span className="text-gray-400 font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Browser Stats */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-medium text-gray-300">Browsers</h3>
        </div>
        
        <div className="space-y-2">
          {browserData.map((browser, index) => {
            const percentage = Math.round((browser.value / stats.length) * 100);
            return (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-300">{browser.name}</span>
                  <span className="text-xs text-gray-400">{browser.value} ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DeviceStats;

/* eslint-disable react/prop-types
import {PieChart, Pie, Cell, ResponsiveContainer} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function App({stats}) {
  const deviceCount = stats.reduce((acc, item) => {
    if (!acc[item.device]) {
      acc[item.device] = 0;
    }
    acc[item.device]++;
    return acc;
  }, {});

  const result = Object.keys(deviceCount).map((device) => ({
    device,
    count: deviceCount[device],
  }));

  return (
    <div style={{width: "100%", height: 300}}>
      <ResponsiveContainer>
        <PieChart width={700} height={400}>
          <Pie
            data={result}
            labelLine={false}
            label={({device, percent}) =>
              `${device}: ${(percent * 100).toFixed(0)}%`
            }
            dataKey="count"
          >
            {result.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
} 
*/