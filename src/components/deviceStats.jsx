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

  // Neobrutalism colors
  const COLORS = ["#FACC15", "#EC4899", "#10B981", "#3B82F6", "#A855F7", "#F97316"];

  // Get device icon
  const getDeviceIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Device Type */}
      <div className="bg-neo-white border-3 border-foreground shadow-neo p-4">
        <div className="flex items-center gap-2 mb-3">
          <Monitor className="h-4 w-4 text-foreground" />
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Device Types</h3>
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
                  stroke="#000"
                  strokeWidth={2}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
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
                  formatter={(value, name) => [`${value} clicks`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-2">
            {Object.entries(deviceCounts).map(([device, count], index) => (
              <div key={device} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 border-2 border-foreground" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  {getDeviceIcon(device)}
                  <span className="text-foreground font-bold">{device.charAt(0).toUpperCase() + device.slice(1)}</span>
                </div>
                <span className="text-foreground font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Browser Stats */}
      <div className="bg-neo-white border-3 border-foreground shadow-neo p-4">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="h-4 w-4 text-foreground" />
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Browsers</h3>
        </div>

        <div className="space-y-2">
          {browserData.map((browser, index) => {
            const percentage = Math.round((browser.value / stats.length) * 100);
            return (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-foreground">{browser.name}</span>
                  <span className="text-xs text-foreground font-bold">{browser.value} ({percentage}%)</span>
                </div>
                <div className="w-full bg-muted border-2 border-foreground h-2">
                  <div
                    className="h-full transition-all duration-300"
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