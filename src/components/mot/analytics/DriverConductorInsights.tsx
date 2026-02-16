"use client";

import { Bar, Line, Doughnut } from "react-chartjs-2";
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
import { useEffect, useState } from "react";

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

interface DriverOperationalInsightsProps {
    data: any;
}

export function DriverOperationalInsights({ data }: DriverOperationalInsightsProps) {
    const [operationalData, setOperationalData] = useState<any>(null);

    useEffect(() => {
        if (data) {
            setOperationalData(data.driverAndOperationalInsights);
        }
    }, [data]);

    if (!operationalData) {
        return <div className="text-center py-10">Loading driver & operational insights...</div>;
    }

    // Drivers per Route Group
    const driversPerRouteGroupData = {
        labels: operationalData.driversPerRouteGroup.map((item: any) => item.group),
        datasets: [
            {
                label: "Number of Drivers",
                data: operationalData.driversPerRouteGroup.map((item: any) => item.driverCount),
                backgroundColor: "rgba(54, 162, 235, 0.8)",
                borderColor: "rgb(54, 162, 235)",
                borderWidth: 1,
            },
        ],
    };

    // Driver Availability per Day
    const driverAvailabilityData = {
        labels: operationalData.driverAvailabilityPerDay.map((item: any) => item.day),
        datasets: [
            {
                label: "Available Drivers",
                data: operationalData.driverAvailabilityPerDay.map((item: any) => item.availableDrivers),
                backgroundColor: "rgba(75, 192, 192, 0.8)",
                borderColor: "rgb(75, 192, 192)",
                borderWidth: 1,
            },
            {
                label: "Total Drivers",
                data: operationalData.driverAvailabilityPerDay.map((item: any) => item.totalDrivers),
                backgroundColor: "rgba(153, 102, 255, 0.8)",
                borderColor: "rgb(153, 102, 255)",
                borderWidth: 1,
            },
        ],
    };

    // Ticket Sale Trends
    const ticketSaleTrendsData = {
        labels: operationalData.ticketSaleTrends.map((item: any) => item.week),
        datasets: [
            {
                label: "Ticket Sales",
                data: operationalData.ticketSaleTrends.map((item: any) => item.sales),
                fill: false,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.8)",
                tension: 0.1,
            },
        ],
    };

    // Route Popularity
    // const routePopularityData = {
    //     labels: operationalData.routePopularity.map((item: any) => item.routeName),
    //     datasets: [
    //         {
    //             label: "Tickets Sold",
    //             data: operationalData.routePopularity.map((item: any) => item.ticketsSold),
    //             backgroundColor: "rgba(255, 159, 64, 0.8)",
    //             borderColor: "rgb(255, 159, 64)",
    //             borderWidth: 1,
    //         },
    //     ],
    // };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Driver & Conductor Insights</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Drivers per Route Group */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Number of Drivers per Route Group</h3>
                    <div className="h-64">
                        <Bar
                            data={driversPerRouteGroupData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: "Number of Drivers"
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Driver Availability per Day */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Driver Availability per Day</h3>
                    <div className="h-64">
                        <Bar
                            data={driverAvailabilityData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: "Number of Drivers"
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Ticket Sale Trends */}
                {/* <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Ticket Sale Trends</h3>
                    <div className="h-64">
                        <Line
                            data={ticketSaleTrendsData}
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
                </div> */}

                {/* Route Popularity */}
                {/* <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Route Popularity Based on Ticket Sales</h3>
                    <div className="h-64">
                        <Bar
                            data={routePopularityData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: "Tickets Sold"
                                        }
                                    },
                                    x: {
                                        ticks: {
                                            autoSkip: false,
                                            maxRotation: 90,
                                            minRotation: 45
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div> */}
            </div>
        </div>
    );
}
