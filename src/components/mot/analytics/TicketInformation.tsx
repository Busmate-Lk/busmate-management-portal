"use client";

import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement,
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
    LineElement,
    PointElement
);

// Define types for our date filters
type DateFilter = 'All' | 'Last 7 Days' | 'Last 30 Days' | 'Last 3 Months' | 'Last 6 Months' | 'Last Year' | 'Custom';

interface TicketInformationProps {
    data: any;
}

export function TicketInformation({ data }: TicketInformationProps) {
    // Reference for popup container
    const popupRef = useRef<HTMLDivElement>(null);

    const [ticketData, setTicketData] = useState<any>(null);

    // States for popup
    const [popupVisible, setPopupVisible] = useState<boolean>(false);
    const [currentDateFilter, setCurrentDateFilter] = useState<DateFilter>('All');

    // Custom date range
    const [dateRange, setDateRange] = useState({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 30 days ago
        to: new Date().toISOString().split('T')[0], // Today
    });

    useEffect(() => {
        if (data) {
            setTicketData(data.ticketInformation);
        }
    }, [data]);

    // Function to open popup
    const openPopup = () => {
        setPopupVisible(true);
    };

    // Function to close popup
    const closePopup = () => {
        setPopupVisible(false);
    };

    // Function to handle filter change
    const handleFilterChange = (value: DateFilter) => {
        setCurrentDateFilter(value);
    };

    if (!ticketData) {
        return <div className="text-center py-10">Loading ticket information...</div>;
    }

    // Function to filter travel date data based on selected filter
    const filterTravelDateData = () => {
        if (!ticketData || !ticketData.travelDateDistribution) {
            return [];
        }

        // If no filter is applied, return all data
        if (currentDateFilter === 'All') {
            return ticketData.travelDateDistribution;
        }

        const today = new Date();
        let filterDate = new Date();

        // Calculate the filter date based on selected filter
        switch (currentDateFilter) {
            case 'Last 7 Days':
                filterDate.setDate(today.getDate() - 7);
                break;
            case 'Last 30 Days':
                filterDate.setDate(today.getDate() - 30);
                break;
            case 'Last 3 Months':
                filterDate.setMonth(today.getMonth() - 3);
                break;
            case 'Last 6 Months':
                filterDate.setMonth(today.getMonth() - 6);
                break;
            case 'Last Year':
                filterDate.setFullYear(today.getFullYear() - 1);
                break;
            case 'Custom':
                // For custom range, use the from date
                filterDate = new Date(dateRange.from);
                const toDate = new Date(dateRange.to);

                // Filter data between fromDate and toDate
                return ticketData.travelDateDistribution.filter((item: any) => {
                    const itemDate = new Date(item.date);
                    return itemDate >= filterDate && itemDate <= toDate;
                });
            default:
                return ticketData.travelDateDistribution;
        }

        // For non-custom filters, return data after the filter date
        return ticketData.travelDateDistribution.filter((item: any) => {
            const itemDate = new Date(item.date);
            return itemDate >= filterDate;
        });
    };

    // Travel Date Distribution with applied filters
    const filteredTravelDateData = filterTravelDateData();

    // Travel Date Distribution
    const travelDateData = {
        labels: filteredTravelDateData.map((item: any) => {
            // Format date to be more readable (e.g., Aug 1)
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [
            {
                label: "Ticket Count",
                data: filteredTravelDateData.map((item: any) => item.count),
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.8)",
                tension: 0.1,
            },
        ],
    };

    // Seat Occupancy
    const seatOccupancyData = {
        labels: ticketData.seatOccupancy.map((item: any) => item.status),
        datasets: [
            {
                data: ticketData.seatOccupancy.map((item: any) => item.count),
                backgroundColor: [
                    "rgba(255, 99, 132, 0.8)",
                    "rgba(54, 162, 235, 0.8)",
                ],
                borderColor: [
                    "rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                ],
                borderWidth: 1,
            },
        ],
    };

    // Travel Time Distribution
    const travelTimeData = {
        labels: ticketData.travelTimeDistribution.map((item: any) => item.timeSlot),
        datasets: [
            {
                label: "Ticket Count",
                data: ticketData.travelTimeDistribution.map((item: any) => item.count),
                backgroundColor: "rgba(153, 102, 255, 0.8)",
                borderColor: "rgb(153, 102, 255)",
                borderWidth: 1,
            },
        ],
    };

    // Price Distribution
    const priceDistributionData = {
        labels: ticketData.priceDistribution.map((item: any) => item.priceRange),
        datasets: [
            {
                label: "Ticket Count",
                data: ticketData.priceDistribution.map((item: any) => item.count),
                backgroundColor: "rgba(255, 159, 64, 0.8)",
                borderColor: "rgb(255, 159, 64)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Ticket Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Travel Date Distribution */}
                <div className="bg-white p-4 rounded-lg shadow cursor-pointer" onClick={openPopup}>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Distribution of Tickets by Travel Date</h3>
                    <div className="h-64">
                        <Line
                            data={travelDateData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: "Number of Tickets"
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Seat Occupancy */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Ticket Count by Seat Occupancy</h3>
                    <div className="h-64">
                        <Doughnut
                            data={seatOccupancyData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: "bottom"
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Travel Time Distribution */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Ticket Distribution by Travel Time</h3>
                    <div className="h-64">
                        <Bar
                            data={travelTimeData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: "Number of Tickets"
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Price Distribution */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Price Distribution Across Tickets</h3>
                    <div className="h-64">
                        <Bar
                            data={priceDistributionData}
                            options={{
                                maintainAspectRatio: false,
                                indexAxis: 'y',
                                scales: {
                                    x: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: "Number of Tickets"
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Popup for enlarged travel date graph */}
            {popupVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
                    <div
                        ref={popupRef}
                        className="bg-white rounded-lg shadow-xl p-6 w-4/5 h-4/5 max-w-6xl max-h-[85vh] overflow-auto"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Distribution of Tickets by Travel Date</h3>
                            <button
                                onClick={closePopup}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        {/* Date filters */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Time Range</label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleFilterChange('All')}
                                    className={`px-3 py-1 rounded text-sm ${currentDateFilter === 'All'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    All Time
                                </button>
                                <button
                                    onClick={() => handleFilterChange('Last 7 Days')}
                                    className={`px-3 py-1 rounded text-sm ${currentDateFilter === 'Last 7 Days'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    Last 7 Days
                                </button>
                                <button
                                    onClick={() => handleFilterChange('Last 30 Days')}
                                    className={`px-3 py-1 rounded text-sm ${currentDateFilter === 'Last 30 Days'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    Last 30 Days
                                </button>
                                <button
                                    onClick={() => handleFilterChange('Last 3 Months')}
                                    className={`px-3 py-1 rounded text-sm ${currentDateFilter === 'Last 3 Months'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    Last 3 Months
                                </button>
                                <button
                                    onClick={() => handleFilterChange('Last 6 Months')}
                                    className={`px-3 py-1 rounded text-sm ${currentDateFilter === 'Last 6 Months'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    Last 6 Months
                                </button>
                                <button
                                    onClick={() => handleFilterChange('Last Year')}
                                    className={`px-3 py-1 rounded text-sm ${currentDateFilter === 'Last Year'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    Last Year
                                </button>
                                <button
                                    onClick={() => handleFilterChange('Custom')}
                                    className={`px-3 py-1 rounded text-sm ${currentDateFilter === 'Custom'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    Custom Range
                                </button>
                            </div>

                            {/* Custom date range inputs */}
                            {currentDateFilter === 'Custom' && (
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                                        <input
                                            type="date"
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            value={dateRange.from}
                                            onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                                            max={dateRange.to}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
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

                        {/* Enlarged travel date chart */}
                        <div className="h-[calc(100%-180px)]">
                            <Line
                                data={travelDateData}
                                options={{
                                    maintainAspectRatio: false,
                                    responsive: true,
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            title: {
                                                display: true,
                                                text: "Number of Tickets",
                                                font: {
                                                    size: 14,
                                                    weight: 'bold'
                                                }
                                            }
                                        },
                                        x: {
                                            title: {
                                                display: true,
                                                text: "Travel Date",
                                                font: {
                                                    size: 14,
                                                    weight: 'bold'
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
                                        },
                                        tooltip: {
                                            callbacks: {
                                                title: function (tooltipItems) {
                                                    // Format the date for tooltip title
                                                    if (tooltipItems.length > 0) {
                                                        return tooltipItems[0].label;
                                                    }
                                                    return '';
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
