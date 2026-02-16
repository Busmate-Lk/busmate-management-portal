"use client";

import { Bar, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { useEffect, useState, useRef } from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

// Define types for our filters
type Gender = 'All' | 'Male' | 'Female';
type Permit = 'All' | 'Luxury' | 'Semi Luxury' | 'Normal' | 'Highway';
type Age = 'All' | '18-35' | '36-50' | '51-65' | '65+';
type TimeFilter = 'All' | 'Last 7 Days' | 'Last 30 Days' | 'Last 3 Months' | 'Last 6 Months' | 'Last Year' | 'Custom';

interface Filters {
    gender: Gender;
    permit: Permit;
    age: Age;
    route: string;
    bus: string;
    time: TimeFilter;
}

type GraphType = 'totalPassengers' | 'gender' | 'permit' | 'age' | 'route' | 'bus' | 'busType';

interface PassengerInformationProps {
    data: any;
}

export function PassengerInformation({ data }: PassengerInformationProps) {
    // Ref for popup graph container
    const popupRef = useRef<HTMLDivElement>(null);

    const [passengerData, setPassengerData] = useState<any>(null);
    const [filters, setFilters] = useState<Filters>({
        gender: 'All',
        permit: 'All',
        age: 'All',
        route: 'All',
        bus: 'All',
        time: 'All',
    });

    // Popup state
    const [popupVisible, setPopupVisible] = useState<boolean>(false);
    const [activeGraph, setActiveGraph] = useState<GraphType | null>(null);
    const [popupFilters, setPopupFilters] = useState<Filters>({
        gender: 'All',
        permit: 'All',
        age: 'All',
        route: 'All',
        bus: 'All',
        time: 'All',
    });

    // Custom date range
    const [dateRange, setDateRange] = useState({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 30 days ago
        to: new Date().toISOString().split('T')[0], // Today
    });

    // State for total passengers view mode
    const [totalPassengersViewMode, setTotalPassengersViewMode] = useState<'monthly' | 'yearly'>('monthly');

    // Routes and buses lists for dropdowns
    const [routes, setRoutes] = useState<string[]>([]);
    const [buses, setBuses] = useState<string[]>([]);
    const [permitTypes, setPermitTypes] = useState<string[]>(['Luxury', 'Semi Luxury', 'Normal', 'Highway']);

    useEffect(() => {
        if (data) {
            setPassengerData(data.passengerInformation);

            // Extract unique routes and buses for dropdowns
            if (data.passengerInformation) {
                const uniqueRoutes = [...new Set(
                    data.passengerInformation.passengerCountPerRoute.map((item: any) => item.routeName)
                )] as string[];
                setRoutes(uniqueRoutes);

                const uniqueBuses = [...new Set(
                    data.passengerInformation.passengersPerBus.map((item: any) => item.busName)
                )] as string[];
                setBuses(uniqueBuses);
            }
        }
    }, [data]);

    // Handle filter changes
    const handleFilterChange = (filterType: keyof Filters, value: string) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    // Handle popup filter changes
    const handlePopupFilterChange = (filterType: keyof Filters, value: string) => {
        setPopupFilters(prev => ({ ...prev, [filterType]: value }));
    };

    // Open popup with specific graph
    const openPopup = (graphType: GraphType) => {
        setActiveGraph(graphType);
        // Set initial popup filters based on main filters
        setPopupFilters({ ...filters });
        setPopupVisible(true);
    };

    // Close popup
    const closePopup = () => {
        setPopupVisible(false);
        setActiveGraph(null);
    };

    // Filter data based on current filters (for main dashboard)
    const filterData = (dataToFilter: any, filtersToApply: Filters = filters) => {
        // This is a simplified implementation. In a real application, you'd filter the data based on all filters

        // Example of how to handle time range filters
        let filteredData = { ...dataToFilter };

        // Apply time filter
        if (filtersToApply.time !== 'All') {
            // Calculate date range based on selected time filter
            let fromDate = new Date();

            switch (filtersToApply.time) {
                case 'Last 7 Days':
                    fromDate.setDate(fromDate.getDate() - 7);
                    break;
                case 'Last 30 Days':
                    fromDate.setDate(fromDate.getDate() - 30);
                    break;
                case 'Last 3 Months':
                    fromDate.setMonth(fromDate.getMonth() - 3);
                    break;
                case 'Last 6 Months':
                    fromDate.setMonth(fromDate.getMonth() - 6);
                    break;
                case 'Last Year':
                    fromDate.setFullYear(fromDate.getFullYear() - 1);
                    break;
                case 'Custom':
                    // Use the custom date range
                    fromDate = new Date(dateRange.from);
                    const toDate = new Date(dateRange.to);

                    // Filter data between fromDate and toDate
                    // In a real implementation, you would apply this filter to your data
                    break;
            }

            // In a real implementation, you would filter the data based on the calculated date range
            // filteredData = filterDataByDateRange(filteredData, fromDate, new Date());
        }

        return filteredData;
    };

    if (!passengerData) {
        return <div className="text-center py-10">Loading passenger information...</div>;
    }

    // Prepare chart data with applied filters
    // Gender data for bar chart (converted from doughnut)
    const prepareGenderData = (filtersToApply: Filters = filters) => {
        // Here you would apply the actual filters to the data
        // This is a simplified implementation
        return {
            labels: ['Male', 'Female'],
            datasets: [
                {
                    label: "Passenger Count",
                    data: passengerData.genderDistribution.map((item: any) => item.count),
                    backgroundColor: ["rgba(54, 162, 235, 0.8)", "rgba(255, 99, 132, 0.8)"],
                    borderColor: ["rgb(54, 162, 235)", "rgb(255, 99, 132)"],
                    borderWidth: 1,
                }
            ],
        };
    };

    // Permit data for bar chart (new)
    const preparePermitData = (filtersToApply: Filters = filters) => {
        // In a real implementation, you'd filter the data based on the provided filters
        return {
            labels: permitTypes,
            datasets: [
                {
                    label: "Passenger Count",
                    // This is sample data - in a real implementation this would come from filtered backend data
                    data: [120, 85, 150, 90],
                    backgroundColor: "rgba(255, 159, 64, 0.8)",
                    borderColor: "rgb(255, 159, 64)",
                    borderWidth: 1,
                }
            ],
        };
    };

    // Age group data for bar chart (converted from doughnut)
    const prepareAgeData = (filtersToApply: Filters = filters) => {
        return {
            labels: passengerData.ageGroupDistribution.map((item: any) => item.ageGroup),
            datasets: [
                {
                    label: "Passenger Count",
                    data: passengerData.ageGroupDistribution.map((item: any) => item.count),
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.8)",
                        "rgba(54, 162, 235, 0.8)",
                        "rgba(255, 206, 86, 0.8)",
                        "rgba(75, 192, 192, 0.8)"
                    ],
                    borderColor: [
                        "rgb(255, 99, 132)",
                        "rgb(54, 162, 235)",
                        "rgb(255, 206, 86)",
                        "rgb(75, 192, 192)"
                    ],
                    borderWidth: 1,
                }
            ],
        };
    };

    // Route data for bar chart
    const prepareRouteData = (filtersToApply: Filters = filters, showAll: boolean = false) => {
        // Get top 5 routes by passenger count
        const sortedRoutes = [...passengerData.passengerCountPerRoute].sort((a, b) =>
            b.passengerCount - a.passengerCount
        );

        // Take only top 5 if not showing all
        const routesToShow = showAll ? sortedRoutes : sortedRoutes.slice(0, 5);

        return {
            labels: routesToShow.map((item: any) => item.routeName),
            datasets: [
                {
                    label: "Passenger Count",
                    data: routesToShow.map((item: any) => item.passengerCount),
                    backgroundColor: "rgba(153, 102, 255, 0.8)",
                    borderColor: "rgb(153, 102, 255)",
                    borderWidth: 1,
                }
            ],
        };
    };

    // Bus data for bar chart
    const prepareBusData = (filtersToApply: Filters = filters, showAll: boolean = false) => {
        // Get top 5 buses by passenger count
        const sortedBuses = [...passengerData.passengersPerBus].sort((a, b) =>
            b.passengerCount - a.passengerCount
        );

        // Take only top 5 if not showing all
        const busesToShow = showAll ? sortedBuses : sortedBuses.slice(0, 5);

        return {
            labels: busesToShow.map((item: any) => item.busName),
            datasets: [
                {
                    label: "Passenger Count",
                    data: busesToShow.map((item: any) => item.passengerCount),
                    backgroundColor: "rgba(75, 192, 192, 0.8)",
                    borderColor: "rgb(75, 192, 192)",
                    borderWidth: 1,
                }
            ],
        };
    };

    // Bus type data for pie chart (CTB vs Private)
    const prepareBusTypeData = (filtersToApply: Filters = filters) => {
        // In a real implementation, this would come from filtered backend data
        // For now using sample data
        return {
            labels: ['CTB Buses', 'Private Buses'],
            datasets: [
                {
                    data: [8500, 13000], // Sample data: CTB passenger count, Private passenger count
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.8)", // Red for CTB
                        "rgba(54, 162, 235, 0.8)"  // Blue for Private
                    ],
                    borderColor: [
                        "rgb(255, 99, 132)",
                        "rgb(54, 162, 235)"
                    ],
                    borderWidth: 1,
                }
            ],
        };
    };

    // Prepare total passengers data by time period (new)
    const prepareTotalPassengersData = (filtersToApply: Filters = filters, viewMode: 'monthly' | 'yearly' = 'monthly') => {
        // Sample data - in a real implementation this would come from backend data
        let labels: string[] = [];
        let data: number[] = [];

        if (viewMode === 'monthly') {
            // Monthly data for the current year
            labels = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            // Sample monthly passenger counts
            data = [1250, 1320, 1450, 1380, 1510, 1620, 1750, 1830, 1670, 1590, 1480, 1550];
        } else {
            // Yearly data for the last 10 years
            const currentYear = new Date().getFullYear();
            for (let i = 9; i >= 0; i--) {
                labels.push((currentYear - i).toString());
            }
            // Sample yearly passenger counts with an increasing trend
            data = [10200, 11500, 12800, 14300, 15100, 16400, 17800, 18900, 20100, 21500];
        }

        return {
            labels,
            datasets: [
                {
                    label: "Total Passengers",
                    data,
                    backgroundColor: "rgba(75, 192, 192, 0.8)",
                    borderColor: "rgb(75, 192, 192)",
                    borderWidth: 1,
                }
            ]
        };
    };

    // Prepare chart data based on applied filters
    const totalPassengersData = prepareTotalPassengersData(filters, totalPassengersViewMode);
    const genderData = prepareGenderData();
    const permitData = preparePermitData();
    const ageData = prepareAgeData();
    const routeData = prepareRouteData();
    const busData = prepareBusData();
    const busTypeData = prepareBusTypeData();

    // Prepare popup chart data when active
    const getPopupChartData = () => {
        if (!activeGraph) {
            // Return a default empty chart data structure if no active graph
            return {
                labels: [],
                datasets: [{
                    label: "No Data",
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1
                }]
            };
        }

        switch (activeGraph) {
            case 'totalPassengers':
                return prepareTotalPassengersData(popupFilters, totalPassengersViewMode);
            case 'gender':
                return prepareGenderData(popupFilters);
            case 'permit':
                return preparePermitData(popupFilters);
            case 'age':
                return prepareAgeData(popupFilters);
            case 'route':
                return prepareRouteData(popupFilters, true); // Show all routes in popup
            case 'bus':
                return prepareBusData(popupFilters, true); // Show all buses in popup
            case 'busType':
                return prepareBusTypeData(popupFilters); // Show bus type distribution
            default:
                // Return a default empty chart data structure for unsupported graph types
                return {
                    labels: [],
                    datasets: [{
                        label: "No Data",
                        data: [],
                        backgroundColor: [],
                        borderColor: [],
                        borderWidth: 1
                    }]
                };
        }
    };

    return (
        <div className="space-y-6 relative">
            <h2 className="text-2xl font-bold text-gray-800">Passenger Information</h2>

            <div className="grid grid-cols-1 gap-6">
                {/* Total Passengers Chart */}
                <div className="bg-white p-4 rounded-lg shadow cursor-pointer" onClick={() => openPopup('totalPassengers')}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Total Passenger Count</h3>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setTotalPassengersViewMode('monthly');
                                }}
                                className={`px-3 py-1 rounded text-sm ${totalPassengersViewMode === 'monthly'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700'
                                    }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setTotalPassengersViewMode('yearly');
                                }}
                                className={`px-3 py-1 rounded text-sm ${totalPassengersViewMode === 'yearly'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700'
                                    }`}
                            >
                                Yearly
                            </button>
                        </div>
                    </div>
                    <div className="h-64">
                        <Bar
                            data={totalPassengersData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: "Number of Passengers"
                                        }
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: totalPassengersViewMode === 'monthly' ? "Month" : "Year"
                                        },
                                        ticks: {
                                            maxRotation: 45,
                                            minRotation: 45
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Gender Distribution Chart */}
                <div className="bg-white p-4 rounded-lg shadow cursor-pointer" onClick={() => openPopup('gender')}>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Distribution by Gender</h3>
                    <div className="h-64">
                        <Bar
                            data={genderData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: "Number of Passengers"
                                        }
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: "Gender"
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Permit Distribution Chart */}
                <div className="bg-white p-4 rounded-lg shadow cursor-pointer" onClick={() => openPopup('permit')}>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Distribution by Permit Type</h3>
                    <div className="h-64">
                        <Bar
                            data={permitData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: "Number of Passengers"
                                        }
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: "Permit Type"
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Age Group Distribution Chart */}
                <div className="bg-white p-4 rounded-lg shadow cursor-pointer" onClick={() => openPopup('age')}>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Distribution by Age Group</h3>
                    <div className="h-64">
                        <Bar
                            data={ageData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: "Number of Passengers"
                                        }
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: "Age Group"
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Route Distribution Chart */}
                <div className="bg-white p-4 rounded-lg shadow cursor-pointer" onClick={() => openPopup('route')}>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Top 5 Routes by Passenger Count</h3>
                    <div className="h-64">
                        <Bar
                            data={routeData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: "Number of Passengers"
                                        }
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: "Route Name"
                                        },
                                        ticks: {
                                            maxRotation: 45,
                                            minRotation: 45
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* CTB vs Private Bus Distribution Chart */}
                <div className="bg-white p-4 rounded-lg shadow cursor-pointer" onClick={() => openPopup('busType')}>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Passenger Count by Bus Type</h3>
                    <div className="h-64">
                        <Doughnut
                            data={busTypeData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'right',
                                        labels: {
                                            font: {
                                                size: 12
                                            }
                                        }
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function (context) {
                                                const label = context.label || '';
                                                const value = context.raw as number || 0;
                                                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                                const percentage = Math.round((value / total) * 100);
                                                return `${label}: ${value} passengers (${percentage}%)`;
                                            }
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Popup for enlarged graph */}
            {popupVisible && (
                <div className="absolute inset-0 z-50 flex items-center justify-center">
                    <div ref={popupRef} className="bg-white rounded-lg shadow-xl p-6 w-4/5 h-4/5 max-w-6xl max-h-[85vh] overflow-auto border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">
                                {activeGraph === 'totalPassengers' && "Total Passenger Count"}
                                {activeGraph === 'gender' && "Gender Distribution"}
                                {activeGraph === 'permit' && "Permit Type Distribution"}
                                {activeGraph === 'age' && "Age Group Distribution"}
                                {activeGraph === 'route' && "Passenger Count by Route"}
                                {activeGraph === 'bus' && "Passenger Count by Bus"}
                                {activeGraph === 'busType' && "CTB vs Private Bus Passenger Count"}
                            </h3>
                            <button
                                onClick={closePopup}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        {/* Relevant filters for the current graph */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {/* Total Passengers view mode - only shown for total passengers graph */}
                            {activeGraph === 'totalPassengers' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">View Mode</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setTotalPassengersViewMode('monthly')}
                                            className={`flex-1 py-2 rounded ${totalPassengersViewMode === 'monthly'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 text-gray-700'
                                                }`}
                                        >
                                            Monthly
                                        </button>
                                        <button
                                            onClick={() => setTotalPassengersViewMode('yearly')}
                                            className={`flex-1 py-2 rounded ${totalPassengersViewMode === 'yearly'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 text-gray-700'
                                                }`}
                                        >
                                            Yearly
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Gender filter - only shown for gender graph */}
                            {/* {activeGraph === 'gender' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        value={popupFilters.gender}
                                        onChange={(e) => handlePopupFilterChange('gender', e.target.value)}
                                    >
                                        <option value="All">All</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            )} */}

                            {/* Permit filter - only shown for permit graph */}
                            {/* {activeGraph === 'permit' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Permit</label>
                                    <select
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        value={popupFilters.permit}
                                        onChange={(e) => handlePopupFilterChange('permit', e.target.value)}
                                    >
                                        <option value="All">All</option>
                                        {permitTypes.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            )} */}

                            {/* Age filter - only shown for age graph */}
                            {/* {activeGraph === 'age' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                    <select
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        value={popupFilters.age}
                                        onChange={(e) => handlePopupFilterChange('age', e.target.value)}
                                    >
                                        <option value="All">All</option>
                                        <option value="18-35">18-35</option>
                                        <option value="36-50">36-50</option>
                                        <option value="51-65">51-65</option>
                                        <option value="65+">65+</option>
                                    </select>
                                </div>
                            )} */}

                            {/* Route filter - only shown for route graph */}
                            {activeGraph === 'route' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                                    <select
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        value={popupFilters.route}
                                        onChange={(e) => handlePopupFilterChange('route', e.target.value)}
                                    >
                                        <option value="All">All</option>
                                        {routes.map((route) => (
                                            <option key={route} value={route}>{route}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Bus filter - only shown for bus graph */}
                            {activeGraph === 'bus' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bus</label>
                                    <select
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        value={popupFilters.bus}
                                        onChange={(e) => handlePopupFilterChange('bus', e.target.value)}
                                    >
                                        <option value="All">All</option>
                                        {buses.map((bus) => (
                                            <option key={bus} value={bus}>{bus}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Time filter - shown for all graphs */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
                                <select
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={popupFilters.time}
                                    onChange={(e) => handlePopupFilterChange('time', e.target.value as TimeFilter)}
                                >
                                    <option value="All">All Time</option>
                                    <option value="Last 7 Days">Last 7 Days</option>
                                    <option value="Last 30 Days">Last 30 Days</option>
                                    <option value="Last 3 Months">Last 3 Months</option>
                                    <option value="Last 6 Months">Last 6 Months</option>
                                    <option value="Last Year">Last Year</option>
                                    <option value="Custom">Custom Range</option>
                                </select>
                                {popupFilters.time === 'Custom' && (
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
                                            <input
                                                type="date"
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                value={dateRange.from}
                                                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                                                max={dateRange.to}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
                                            <input
                                                type="date"
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                value={dateRange.to}
                                                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                                                min={dateRange.from}
                                                max={new Date().toISOString().split('T')[0]} // Today as max
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Enlarged graph */}
                        <div className="h-[calc(100%-150px)]">
                            {activeGraph && activeGraph === 'busType' ? (
                                <Doughnut
                                    data={getPopupChartData()}
                                    options={{
                                        maintainAspectRatio: false,
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'right',
                                                labels: {
                                                    font: {
                                                        size: 14
                                                    }
                                                }
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: function (context) {
                                                        const label = context.label || '';
                                                        const value = context.raw as number || 0;
                                                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                                        const percentage = Math.round((value / total) * 100);
                                                        return `${label}: ${value} passengers (${percentage}%)`;
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                            ) : (
                                <Bar
                                    data={getPopupChartData()}
                                    options={{
                                        maintainAspectRatio: false,
                                        responsive: true,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                title: {
                                                    display: true,
                                                    text: "Number of Passengers",
                                                    font: {
                                                        size: 14,
                                                        weight: 'bold'
                                                    }
                                                }
                                            },
                                            x: {
                                                title: {
                                                    display: true,
                                                    text: activeGraph === 'totalPassengers' ? (totalPassengersViewMode === 'monthly' ? "Month" : "Year") :
                                                        activeGraph === 'gender' ? "Gender" :
                                                            activeGraph === 'permit' ? "Permit Type" :
                                                                activeGraph === 'age' ? "Age Group" :
                                                                    activeGraph === 'route' ? "Route Name" : "Bus Number",
                                                    font: {
                                                        size: 14,
                                                        weight: 'bold'
                                                    }
                                                },
                                                ticks: {
                                                    maxRotation: activeGraph === 'route' ? 45 : 0,
                                                    minRotation: activeGraph === 'route' ? 45 : 0,
                                                    font: {
                                                        size: 12
                                                    }
                                                }
                                            }
                                        },
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                                labels: {
                                                    font: {
                                                        size: 14
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
