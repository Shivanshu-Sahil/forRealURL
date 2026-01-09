/**
 * =============================================================================
 * LINKTREE ANALYTICS PAGE
 * =============================================================================
 * Shows analytics for the user's linktree page views.
 * 
 * FEATURES:
 *   - Total views count
 *   - Views over time chart (using Recharts)
 *   - Device breakdown (desktop/mobile/tablet)
 *   - Location breakdown (countries)
 *   - Browser breakdown
 * 
 * This reuses the same chart patterns from your existing link analytics page.
 * =============================================================================
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    BarChart3,
    Monitor,
    Smartphone,
    Tablet,
    Globe,
    ArrowLeft,
    TrendingUp,
    Users,
    Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UrlState } from "@/context";
import useFetch from "@/hooks/use-fetch";

import {
    getLinktree,
    getLinktreeAnalytics,
} from "@/db/apiLinktree";

// Recharts components (already in your project)
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

// Chart colors
const COLORS = ["#FFE500", "#FF6B9D", "#00D4AA", "#00A6FF", "#A855F7", "#FF7F50"];

const LinktreeAnalytics = () => {
    const navigate = useNavigate();
    const { user, loading: userLoading } = UrlState();

    const [linktree, setLinktree] = useState(null);
    const [analytics, setAnalytics] = useState(null);

    const { loading: loadingLinktree, fn: fnGetLinktree } = useFetch(getLinktree);
    const { loading: loadingAnalytics, fn: fnGetAnalytics } = useFetch(getLinktreeAnalytics);

    // ==========================================================================
    // LOAD DATA
    // ==========================================================================

    useEffect(() => {
        if (user?.id) {
            loadData();
        }
    }, [user?.id]);

    const loadData = async () => {
        try {
            const lt = await fnGetLinktree(user.id);
            if (lt) {
                setLinktree(lt);
                const analyticsData = await fnGetAnalytics(lt.id, 30);
                setAnalytics(analyticsData);
            }
        } catch (error) {
            console.error("Error loading analytics:", error);
        }
    };

    // ==========================================================================
    // LOADING STATE
    // ==========================================================================

    if (userLoading || loadingLinktree || loadingAnalytics) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-foreground border-t-primary animate-spin"></div>
            </div>
        );
    }

    // No linktree yet
    if (!linktree) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="bg-card border-3 border-foreground shadow-neo p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-neo-yellow border-3 border-foreground mx-auto mb-4 flex items-center justify-center">
                        <BarChart3 className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        No Linktree Found
                    </h1>
                    <p className="text-muted-foreground mb-4">
                        Create your linktree first to see analytics.
                    </p>
                    <Button
                        onClick={() => navigate("/linktree")}
                        className="neo-button bg-neo-green text-foreground"
                    >
                        Create Linktree
                    </Button>
                </div>
            </div>
        );
    }

    // ==========================================================================
    // PROCESS DATA FOR CHARTS
    // ==========================================================================

    // Views by date for line chart
    const viewsChartData = analytics?.viewsByDate
        ? Object.entries(analytics.viewsByDate).map(([date, count]) => ({
            date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            views: count,
        }))
        : [];

    // Device data for pie chart
    const deviceData = analytics?.viewsByDevice
        ? Object.entries(analytics.viewsByDevice).map(([device, count]) => ({
            name: device.charAt(0).toUpperCase() + device.slice(1),
            value: count,
        }))
        : [];

    // Country data
    const countryData = analytics?.viewsByCountry
        ? Object.entries(analytics.viewsByCountry)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
        : [];

    // Browser data
    const browserData = analytics?.viewsByBrowser
        ? Object.entries(analytics.viewsByBrowser)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
        : [];

    // Get device icon
    const getDeviceIcon = (device) => {
        switch (device.toLowerCase()) {
            case "mobile":
                return <Smartphone className="w-5 h-5" />;
            case "tablet":
                return <Tablet className="w-5 h-5" />;
            default:
                return <Monitor className="w-5 h-5" />;
        }
    };

    // ==========================================================================
    // RENDER
    // ==========================================================================

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => navigate("/linktree")}
                            className="neo-button bg-card text-foreground"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-display text-foreground mb-2">
                                Analytics
                            </h1>
                            <p className="text-muted-foreground font-medium">
                                Linktree views for the last 30 days
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-neo-yellow border-3 border-foreground shadow-neo p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-card border-3 border-foreground flex items-center justify-center">
                                <Eye className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-3xl font-display text-foreground mb-1">
                            {analytics?.totalViews || 0}
                        </p>
                        <p className="text-sm font-bold text-foreground uppercase">Total Views</p>
                    </div>

                    <div className="bg-neo-pink border-3 border-foreground shadow-neo p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-card border-3 border-foreground flex items-center justify-center">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-3xl font-display text-foreground mb-1">
                            {viewsChartData.length > 0
                                ? Math.round(analytics?.totalViews / viewsChartData.length)
                                : 0}
                        </p>
                        <p className="text-sm font-bold text-foreground uppercase">Avg/Day</p>
                    </div>

                    <div className="bg-neo-green border-3 border-foreground shadow-neo p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-card border-3 border-foreground flex items-center justify-center">
                                <Globe className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-3xl font-display text-foreground mb-1">
                            {countryData.length}
                        </p>
                        <p className="text-sm font-bold text-foreground uppercase">Countries</p>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Views Over Time */}
                    <div className="lg:col-span-2 bg-card border-3 border-foreground shadow-neo p-6">
                        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-neo-blue border-2 border-foreground flex items-center justify-center">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                            Views Over Time
                        </h3>
                        {viewsChartData.length > 0 ? (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={viewsChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{
                                                background: "white",
                                                border: "3px solid black",
                                                boxShadow: "4px 4px 0px black",
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="views"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                            dot={{ fill: "#3b82f6", strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-muted-foreground">
                                No view data yet
                            </div>
                        )}
                    </div>

                    {/* Device Breakdown */}
                    <div className="bg-card border-3 border-foreground shadow-neo p-6">
                        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-neo-purple border-2 border-foreground flex items-center justify-center">
                                <Monitor className="w-4 h-4" />
                            </div>
                            Devices
                        </h3>
                        {deviceData.length > 0 ? (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={deviceData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) =>
                                                `${name} ${(percent * 100).toFixed(0)}%`
                                            }
                                        >
                                            {deviceData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                    stroke="black"
                                                    strokeWidth={2}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-muted-foreground">
                                No device data yet
                            </div>
                        )}
                    </div>

                    {/* Location & Browser */}
                    <div className="bg-card border-3 border-foreground shadow-neo p-6">
                        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-neo-coral border-2 border-foreground flex items-center justify-center">
                                <Globe className="w-4 h-4" />
                            </div>
                            Top Locations
                        </h3>
                        {countryData.length > 0 ? (
                            <div className="space-y-3">
                                {countryData.map(([country, count], index) => (
                                    <div
                                        key={country}
                                        className="flex items-center justify-between p-3 border-2 border-foreground"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] + "30" }}
                                    >
                                        <span className="font-bold">{country}</span>
                                        <span className="font-display">{count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-40 flex items-center justify-center text-muted-foreground">
                                No location data yet
                            </div>
                        )}

                        <h3 className="text-xl font-bold text-foreground mt-6 mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-neo-yellow border-2 border-foreground flex items-center justify-center">
                                <Users className="w-4 h-4" />
                            </div>
                            Top Browsers
                        </h3>
                        {browserData.length > 0 ? (
                            <div className="space-y-3">
                                {browserData.map(([browser, count], index) => (
                                    <div
                                        key={browser}
                                        className="flex items-center justify-between p-3 border-2 border-foreground"
                                        style={{ backgroundColor: COLORS[(index + 2) % COLORS.length] + "30" }}
                                    >
                                        <span className="font-bold">{browser}</span>
                                        <span className="font-display">{count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-40 flex items-center justify-center text-muted-foreground">
                                No browser data yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LinktreeAnalytics;
