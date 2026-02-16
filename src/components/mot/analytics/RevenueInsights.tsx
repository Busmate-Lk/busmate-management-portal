"use client";

import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from "chart.js";
import { useEffect, useState, useRef } from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

// Define types for our filters
type RevenueType = 'All' | 'CTB' | 'Private';
type RouteCategory = 'All' | 'Urban' | 'Rural' | 'Highway' | 'Intercity';
type TimeFilter = 'All' | 'Last 7 Days' | 'Last 30 Days' | 'Last 3 Months' | 'Last 6 Months' | 'Last Year' | 'Custom';

interface Filters {
    revenueType: RevenueType;
    routeCategory: RouteCategory;
    route: string;
    operator: string;
    time: TimeFilter;
}

type GraphType = 'revenueOverview' | 'transactionAnalysis' | 'sectorComparison' | 'revenuePerRoute' | 'revenuePerOperator';

interface RevenueInsightsProps {
    data: any;
}

export function RevenueInsights({ data }: RevenueInsightsProps) {
    // Ref for popup graph container
    const popupRef = useRef<HTMLDivElement>(null);

    const [revenueData, setRevenueData] = useState<any>(null);
    const [filters, setFilters] = useState<Filters>({
        revenueType: 'All',
        routeCategory: 'All',
        route: 'All',
        operator: 'All',
        time: 'All',
    });

    // Popup state
    const [popupVisible, setPopupVisible] = useState<boolean>(false);
    const [activeGraph, setActiveGraph] = useState<GraphType | null>(null);
    const [popupFilters, setPopupFilters] = useState<Filters>({
        revenueType: 'All',
        routeCategory: 'All',
        route: 'All',
        operator: 'All',
        time: 'All',
    });

    // Custom date range
    const [dateRange, setDateRange] = useState({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 30 days ago
        to: new Date().toISOString().split('T')[0], // Today
    });

    // State for revenue view mode
    const [revenueViewMode, setRevenueViewMode] = useState<'monthly' | 'yearly'>('monthly');

    // Routes and operators lists for dropdowns
    const [routes, setRoutes] = useState<string[]>([]);
    const [operators, setOperators] = useState<string[]>([]);
    const [routeCategories, setRouteCategories] = useState<string[]>(['Urban', 'Rural', 'Highway', 'Intercity']);

    useEffect(() => {
        if (data) {
            // In real application, extract data from the actual API response
            setRevenueData(data.revenueInformation || mockRevenueData);

            // Extract unique routes and operators for dropdowns
            if (data.revenueInformation) {
                const mockRoutes = data.revenueInformation.revenuePerRoute?.labels || [];
                setRoutes(mockRoutes);

                const mockOperators = data.revenueInformation.revenuePerOperator?.labels || [];
                setOperators(mockOperators);
            } else {
                const mockRoutes = ['Colombo-Kandy', 'Colombo-Galle', 'Kandy-Nuwara Eliya', 'Colombo-Jaffna', 'Galle-Matara'];
                setRoutes(mockRoutes);

                const mockOperators = ['CTB', 'Sathsara Travels', 'Senanayake Travels', 'Gemunu Travels', 'Ruwan Travels'];
                setOperators(mockOperators);
            }
        }
    }, [data]);

    // Close popup when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setPopupVisible(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Function to open popup with specific graph
    const openPopup = (graphType: GraphType) => {
        setActiveGraph(graphType);
        setPopupFilters(filters); // Initialize popup filters with current filters
        setPopupVisible(true);
    };

    // Handle filter changes
    const handleFilterChange = (filterKey: keyof Filters, value: string) => {
        setFilters({
            ...filters,
            [filterKey]: value,
        });
    };

    // Handle popup filter changes
    const handlePopupFilterChange = (filterKey: keyof Filters, value: string) => {
        setPopupFilters({
            ...popupFilters,
            [filterKey]: value,
        });
    };

    // Chart options
    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Revenue (LKR)"
                }
            },
            x: {
                title: {
                    display: true,
                    text: "Period"
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Revenue Distribution',
            },
        },
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Revenue (LKR)"
                }
            },
            x: {
                title: {
                    display: true,
                    text: "Route"
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Revenue Trends',
            },
        },
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Revenue Sector Comparison',
            },
        },
    };

    // Mocked data for presentation
    const mockRevenueData = {
        revenueOverview: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Revenue (Rs. Millions)',
                    data: [2.4, 2.8, 3.1, 2.9, 3.5, 3.8, 4.2, 4.0, 4.5, 4.8, 5.1, 5.3],
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                }
            ]
        },
        transactionAnalysis: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Transactions',
                    data: [24000, 28000, 31000, 29000, 35000, 38000, 42000, 40000, 45000, 48000, 51000, 53000],
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                }
            ]
        },
        sectorComparison: {
            labels: ['CTB', 'Private Sector'],
            datasets: [
                {
                    label: 'Revenue Distribution',
                    data: [42, 58],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                    ],
                    borderWidth: 1,
                }
            ]
        },
        revenuePerRoute: {
            labels: ['Colombo-Kandy', 'Colombo-Galle', 'Colombo-Jaffna', 'Kandy-Nuwara Eliya', 'Colombo-Negombo', 'Galle-Matara', 'Colombo-Matara', 'Colombo-Kurunegala', 'Colombo-Anuradhapura', 'Kandy-Colombo'],
            datasets: [
                {
                    label: 'Revenue (Rs. Millions)',
                    data: [1.5, 1.2, 0.95, 0.85, 0.78, 0.72, 0.65, 0.58, 0.52, 0.48],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }
            ]
        },
        revenuePerOperator: {
            labels: ['CTB', 'Sathsara Travels', 'Senanayake Travels', 'Gemunu Travels', 'Ruwan Travels'],
            datasets: [
                {
                    label: 'Revenue (Rs. Millions)',
                    data: [2.2, 0.8, 1.2, 0.7, 0.5],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1,
                }
            ]
        },
        yearlyTrends: {
            labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
            datasets: [
                {
                    label: 'Revenue (Rs. Millions)',
                    data: [25, 32, 38, 42, 48, 54],
                    backgroundColor: 'rgba(255, 159, 64, 0.6)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1,
                }
            ]
        }
    };

    // Guard for missing data
    if (!revenueData) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No revenue data available.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            <h2 className="text-2xl font-bold text-gray-800">Revenue Insights</h2>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Average Revenue per Passenger */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Avg. Revenue per Passenger</h3>
                            <p className="text-2xl font-semibold text-gray-800 mt-2">Rs. 125.50</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-2 flex items-center">
                        <span className="text-xs font-medium text-green-500 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            4.3%
                        </span>
                        <span className="text-xs text-gray-500 ml-1">vs last month</span>
                    </div>
                </div>

                {/* Average Revenue per Ticket */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Avg. Revenue per Ticket</h3>
                            <p className="text-2xl font-semibold text-gray-800 mt-2">Rs. 142.75</p>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-2 flex items-center">
                        <span className="text-xs font-medium text-green-500 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            2.7%
                        </span>
                        <span className="text-xs text-gray-500 ml-1">vs last month</span>
                    </div>
                </div>

                {/* Yesterday's Total Revenue */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Yesterday's Total Revenue</h3>
                            <p className="text-2xl font-semibold text-gray-800 mt-2">Rs. 578,450</p>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-2 flex items-center">
                        <span className="text-xs font-medium text-red-500 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                            1.2%
                        </span>
                        <span className="text-xs text-gray-500 ml-1">vs day before</span>
                    </div>
                </div>

                {/* Monthly Growth Rate */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Monthly Growth Rate</h3>
                            <p className="text-2xl font-semibold text-gray-800 mt-2">3.8%</p>
                        </div>
                        <div className="p-2 bg-yellow-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-2 flex items-center">
                        <span className="text-xs font-medium text-green-500 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            0.5%
                        </span>
                        <span className="text-xs text-gray-500 ml-1">vs last month</span>
                    </div>
                </div>
            </div>

            {/* Revenue Overview Chart */}
            <div className="grid grid-cols-1 gap-6">
                {/* Main Revenue Overview Chart */}
                <div className="bg-white p-4 rounded-lg shadow cursor-pointer" onClick={() => openPopup('revenueOverview')}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Revenue Overview</h3>
                    </div>
                    <div className="p-4 h-80">
                        {revenueViewMode === 'monthly' ? (
                            <Bar
                                data={revenueData.revenueOverview}
                                options={{
                                    ...barOptions,
                                    plugins: {
                                        ...barOptions.plugins,
                                        title: {
                                            ...barOptions.plugins.title,
                                            text: 'Monthly Revenue Distribution',
                                        },
                                    },
                                }}
                            />
                        ) : (
                            <Bar
                                data={revenueData.yearlyTrends}
                                options={{
                                    ...barOptions,
                                    plugins: {
                                        ...barOptions.plugins,
                                        title: {
                                            ...barOptions.plugins.title,
                                            text: 'Yearly Revenue Distribution',
                                        },
                                    },
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Secondary Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">

            </div>

            {/* Secondary Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Time-of-Day Revenue Distribution */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Revenue by Time of Day</h3>
                    <div className="h-80">
                        <Bar
                            data={{
                                labels: ['Morning (6AM-12PM)', 'Afternoon (12PM-4PM)', 'Evening (4PM-8PM)', 'Night (8PM-6AM)'],
                                datasets: [
                                    {
                                        label: 'Average Revenue (Rs. Thousands)',
                                        data: [245, 185, 320, 150],
                                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                                        borderColor: 'rgba(54, 162, 235, 1)',
                                        borderWidth: 1,
                                    }
                                ]
                            }}
                            options={{
                                ...barOptions,
                                plugins: {
                                    ...barOptions.plugins,
                                    title: {
                                        ...barOptions.plugins.title,
                                        text: 'Average Revenue by Time of Day',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Top Routes by Revenue */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Top 10 Routes by Revenue</h3>
                    <div className="h-64">
                        <Bar
                            data={revenueData.revenuePerRoute}
                            options={{
                                ...barOptions,
                                indexAxis: 'y', // Horizontal bar chart
                                plugins: {
                                    ...barOptions.plugins,
                                    title: {
                                        ...barOptions.plugins.title,
                                        text: 'Route Revenue Distribution',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Pie charts row - Top Operators and Sector Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Top Operators by Revenue */}
                <div className="bg-white p-0 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-800 px-2 pt-2 mb-0">Top Bus Operators by Revenue</h3>
                    <div className="h-80 items-center justify-center">
                        <div className="h-64 mt-8">
                            <Doughnut
                                data={revenueData.revenuePerOperator}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'right',
                                            labels: {
                                                font: {
                                                    size: 14
                                                }
                                            }
                                        },
                                        title: {
                                            display: false,
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Sector Comparison */}
                <div className="bg-white p-0 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-800 px-2 pt-2 mb-0">Sector Comparison</h3>
                    <div className="h-80 items-center justify-center">
                        <div className="h-64 mt-8">
                            <Doughnut
                                data={revenueData.sectorComparison}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'right',
                                            labels: {
                                                font: {
                                                    size: 14
                                                }
                                            }
                                        },
                                        title: {
                                            display: false,
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup for detailed view */}
            {popupVisible && activeGraph === 'revenueOverview' && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div ref={popupRef} className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-xl font-medium text-gray-800">Revenue Overview</h3>
                            <button
                                onClick={() => setPopupVisible(false)}
                                className="p-1 rounded-full hover:bg-gray-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Revenue Type
                                    </label>
                                    <select
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={popupFilters.revenueType}
                                        onChange={(e) => handlePopupFilterChange("revenueType", e.target.value as RevenueType)}
                                    >
                                        <option value="All">All Types</option>
                                        <option value="CTB">CTB</option>
                                        <option value="Private">Private Sector</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        View Mode
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            className={`px-3 py-1 text-sm rounded-md w-full ${revenueViewMode === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                            onClick={() => setRevenueViewMode('monthly')}
                                        >
                                            Monthly
                                        </button>
                                        <button
                                            className={`px-3 py-1 text-sm rounded-md w-full ${revenueViewMode === 'yearly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                            onClick={() => setRevenueViewMode('yearly')}
                                        >
                                            Yearly
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Time Period
                                    </label>
                                    <select
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={popupFilters.time}
                                        onChange={(e) => handlePopupFilterChange("time", e.target.value as TimeFilter)}
                                    >
                                        <option value="All">All Time</option>
                                        <option value="Last 7 Days">Last 7 Days</option>
                                        <option value="Last 30 Days">Last 30 Days</option>
                                        <option value="Last 3 Months">Last 3 Months</option>
                                        <option value="Last 6 Months">Last 6 Months</option>
                                        <option value="Last Year">Last Year</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Custom Date Range
                                </label>
                                <div className="flex space-x-4">
                                    <div className="w-1/2">
                                        <label className="block text-xs text-gray-500 mb-1">From</label>
                                        <input
                                            type="date"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={dateRange.from}
                                            onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-xs text-gray-500 mb-1">To</label>
                                        <input
                                            type="date"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={dateRange.to}
                                            onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="h-80 mt-6">
                                {revenueViewMode === 'monthly' ? (
                                    <Bar
                                        data={revenueData.revenueOverview}
                                        options={barOptions}
                                    />
                                ) : (
                                    <Bar
                                        data={revenueData.yearlyTrends}
                                        options={barOptions}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
