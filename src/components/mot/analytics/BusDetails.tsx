"use client";

import { Doughnut, Bar } from "react-chartjs-2";
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

interface BusDetailsProps {
    data: any;
}

// Define types for date filter
type DateFilter = 'All' | 'Last 7 Days' | 'Last 30 Days' | 'Last 3 Months' | 'Last 6 Months' | 'Last Year' | 'Custom';

export function BusDetails({ data }: BusDetailsProps) {
    // Ref for popup container
    const popupRef = useRef<HTMLDivElement>(null);

    const [busData, setBusData] = useState<any>(null);
    const [popupVisible, setPopupVisible] = useState<boolean>(false);
    const [activeGraph, setActiveGraph] = useState<'capacity' | null>(null);

    // Date range filter state
    const [dateFilter, setDateFilter] = useState<DateFilter>('All');
    const [dateRange, setDateRange] = useState({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 30 days ago
        to: new Date().toISOString().split('T')[0], // Today
    });

    useEffect(() => {
        if (data) {
            setBusData(data.busAndJourneyDetails);
        }
    }, [data]);

    // Open popup with specific graph
    const openPopup = (graphType: 'capacity') => {
        setActiveGraph(graphType);
        setPopupVisible(true);
    };

    // Close popup
    const closePopup = () => {
        setPopupVisible(false);
        setActiveGraph(null);
    };

    // Filter data by date range (placeholder implementation)
    const filterDataByDateRange = (data: any) => {
        // In a real implementation, you would filter the data based on the selected date range
        // This is just a placeholder that returns the original data

        if (dateFilter === 'All') {
            return data;
        }

        // Example implementation of date filtering logic
        // In a real application, this would be implemented to filter the actual data
        return data;
    };

    if (!busData) {
        return <div className="text-center py-10">Loading bus information...</div>;
    }

    // Bus Status
    const busStatusData = {
        labels: busData.busStatus.map((item: any) => item.status),
        datasets: [
            {
                data: busData.busStatus.map((item: any) => item.count),
                backgroundColor: ["rgba(75, 192, 192, 0.8)", "rgba(255, 99, 132, 0.8)"],
                borderColor: ["rgb(75, 192, 192)", "rgb(255, 99, 132)"],
                borderWidth: 1,
            },
        ],
    };

    // Model Distribution
    const modelDistributionData = {
        labels: busData.modelDistribution.map((item: any) => item.model),
        datasets: [
            {
                data: busData.modelDistribution.map((item: any) => item.count),
                backgroundColor: [
                    "rgba(54, 162, 235, 0.8)",
                    "rgba(255, 99, 132, 0.8)",
                    "rgba(255, 206, 86, 0.8)",
                    "rgba(75, 192, 192, 0.8)",
                    "rgba(153, 102, 255, 0.8)",
                ],
                borderColor: [
                    "rgb(54, 162, 235)",
                    "rgb(255, 99, 132)",
                    "rgb(255, 206, 86)",
                    "rgb(75, 192, 192)",
                    "rgb(153, 102, 255)",
                ],
                borderWidth: 1,
            },
        ],
    };

    // Capacity vs Passenger Count (by permit type)
    const permitTypes = ['Luxury', 'Semi Luxury', 'Normal', 'Highway'];

    // Sample data for capacity vs passenger by permit type
    // In a real implementation, this would come from the API
    const capacityVsPassengerByPermitData = {
        labels: permitTypes,
        datasets: [
            {
                label: "Average Capacity",
                data: [55, 45, 40, 50], // Sample data for each permit type
                backgroundColor: "rgba(54, 162, 235, 0.8)",
                borderColor: "rgb(54, 162, 235)",
                borderWidth: 1,
            },
            {
                label: "Average Passenger Count",
                data: [48, 38, 32, 42], // Sample data for each permit type
                backgroundColor: "rgba(255, 99, 132, 0.8)",
                borderColor: "rgb(255, 99, 132)",
                borderWidth: 1,
            },
        ],
    };

    // Fuel Efficiency by Bus Model
    // Sample data for fuel efficiency (km/liter)
    // In a real implementation, this would come from the API
    const fuelEfficiencyData = {
        labels: busData.modelDistribution.map((item: any) => item.model),
        datasets: [
            {
                label: "Fuel Efficiency (km/liter)",
                data: [4.5, 5.2, 4.8, 6.1, 5.0], // Sample data for each bus model
                backgroundColor: "rgba(75, 192, 192, 0.8)",
                borderColor: "rgb(75, 192, 192)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Bus Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bus Status */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Bus Status (Active vs Inactive)</h3>
                    <div className="h-64">
                        <Doughnut
                            data={busStatusData}
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

                {/* Model Distribution */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Model Distribution of Buses</h3>
                    <div className="h-64">
                        <Doughnut
                            data={modelDistributionData}
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

                {/* Capacity vs Passenger Count by Permit Type - Clickable */}
                <div className="bg-white p-4 rounded-lg shadow md:col-span-2 cursor-pointer" onClick={() => openPopup('capacity')}>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Capacity vs. Passenger Count by Permit Type</h3>
                    <div className="h-96">
                        <Bar
                            data={capacityVsPassengerByPermitData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: "Number of Passengers",
                                            font: {
                                                weight: 'bold'
                                            }
                                        }
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: "Permit Type",
                                            font: {
                                                weight: 'bold'
                                            }
                                        }
                                    }
                                },
                                plugins: {
                                    legend: {
                                        position: 'top'
                                    },
                                    tooltip: {
                                        callbacks: {
                                            footer: (tooltipItems) => {
                                                const datasetIndex = tooltipItems[0].datasetIndex;
                                                const index = tooltipItems[0].dataIndex;
                                                const utilizationRate = Math.round((capacityVsPassengerByPermitData.datasets[1].data[index] /
                                                    capacityVsPassengerByPermitData.datasets[0].data[index]) * 100);
                                                return `Utilization Rate: ${utilizationRate}%`;
                                            }
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Fuel Efficiency by Bus Model - New Graph */}
                <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Fuel Efficiency by Bus Model</h3>
                    <div className="h-80">
                        <Bar
                            data={fuelEfficiencyData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: "Fuel Efficiency (km/liter)",
                                            font: {
                                                weight: 'bold'
                                            }
                                        }
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: "Bus Model",
                                            font: {
                                                weight: 'bold'
                                            }
                                        }
                                    }
                                },
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: function (context) {
                                                return `${context.dataset.label}: ${context.parsed.y} km/liter`;
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
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-opacity-50" onClick={closePopup}></div>
                    <div
                        ref={popupRef}
                        className="relative bg-white rounded-lg shadow-xl p-6 w-4/5 h-4/5 max-w-6xl max-h-[85vh] overflow-auto border border-gray-200 z-10"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">
                                {activeGraph === 'capacity' && "Capacity vs. Passenger Count by Permit Type"}
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

                        {/* Date range filter */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                                <select
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                                >
                                    <option value="All">All Time</option>
                                    <option value="Last 7 Days">Last 7 Days</option>
                                    <option value="Last 30 Days">Last 30 Days</option>
                                    <option value="Last 3 Months">Last 3 Months</option>
                                    <option value="Last 6 Months">Last 6 Months</option>
                                    <option value="Last Year">Last Year</option>
                                    <option value="Custom">Custom Range</option>
                                </select>
                                {dateFilter === 'Custom' && (
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
                            {activeGraph === 'capacity' && (
                                <Bar
                                    data={filterDataByDateRange(capacityVsPassengerByPermitData)}
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
                                                    text: "Permit Type",
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
                                                    footer: (tooltipItems) => {
                                                        const datasetIndex = tooltipItems[0].datasetIndex;
                                                        const index = tooltipItems[0].dataIndex;
                                                        const utilizationRate = Math.round((capacityVsPassengerByPermitData.datasets[1].data[index] /
                                                            capacityVsPassengerByPermitData.datasets[0].data[index]) * 100);
                                                        return `Utilization Rate: ${utilizationRate}%`;
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
