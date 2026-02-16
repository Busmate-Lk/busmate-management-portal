"use client";

import { Bar } from "react-chartjs-2";
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

interface JourneyDetailsProps {
    data: any;
}

export function JourneyDetails({ data }: JourneyDetailsProps) {
    const [journeyData, setJourneyData] = useState<any>(null);

    useEffect(() => {
        if (data) {
            setJourneyData(data.busAndJourneyDetails);
        }
    }, [data]);

    if (!journeyData) {
        return <div className="text-center py-10">Loading journey information...</div>;
    }

    // Bus Departure Times Distribution
    const departureTimesData = {
        labels: journeyData.departureTimesDistribution.map((item: any) => item.timeSlot),
        datasets: [
            {
                label: "Number of Departures",
                data: journeyData.departureTimesDistribution.map((item: any) => item.count),
                backgroundColor: "rgba(255, 159, 64, 0.8)",
                borderColor: "rgb(255, 159, 64)",
                borderWidth: 1,
            },
        ],
    };

    // Route Distance Categories
    const routeDistanceCategories = [
        { range: "< 20 km", count: journeyData.routeDistanceRanges?.lessThan20 || 0 },
        { range: "20-100 km", count: journeyData.routeDistanceRanges?.between20And100 || 0 },
        { range: "100-200 km", count: journeyData.routeDistanceRanges?.between100And200 || 0 },
        { range: "> 200 km", count: journeyData.routeDistanceRanges?.moreThan200 || 0 }
    ];

    const routeDistanceCategoriesData = {
        labels: routeDistanceCategories.map(item => item.range),
        datasets: [
            {
                label: "Number of Routes",
                data: routeDistanceCategories.map(item => item.count),
                backgroundColor: "rgba(75, 192, 192, 0.8)",
                borderColor: "rgb(75, 192, 192)",
                borderWidth: 1,
            },
        ],
    };

    // Road Type Distribution
    const roadTypeData = {
        labels: journeyData.roadTypeDistribution?.map((item: any) => item.roadType) || [],
        datasets: [
            {
                label: "Number of Routes",
                data: journeyData.roadTypeDistribution?.map((item: any) => item.count) || [],
                backgroundColor: "rgba(153, 102, 255, 0.8)",
                borderColor: "rgb(153, 102, 255)",
                borderWidth: 1,
            },
        ],
    };

    // Late Buses (over 20 minutes delay in the last day)
    const lateBuses = journeyData.lateBuses || [];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Journey Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bus Departure Times */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Bus Departure Times Distribution</h3>
                    <div className="h-64">
                        <Bar
                            data={departureTimesData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Route Distance Categories */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Route Distance Categories</h3>
                    <div className="h-64">
                        <Bar
                            data={routeDistanceCategoriesData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: "Number of Routes"
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Road Type Distribution */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Road Type Distribution</h3>
                    <div className="h-64">
                        <Bar
                            data={roadTypeData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: "Number of Routes"
                                        }
                                    },
                                    x: {
                                        ticks: {
                                            autoSkip: false,
                                            maxRotation: 45,
                                            minRotation: 45
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Late Buses Table */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Buses Late by 20+ Minutes (Last 24 Hours)</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Bus ID</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Route</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Scheduled Time</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actual Time</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Delay (min)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {lateBuses.length > 0 ? (
                                    lateBuses.map((bus: any, index: number) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="px-4 py-2 text-sm text-gray-900">{bus.busId}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">{bus.routeName}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">{bus.scheduledTime}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">{bus.actualTime}</td>
                                            <td className="px-4 py-2 text-sm font-medium text-red-600">{bus.delayMinutes}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-4 text-sm text-center text-gray-500">
                                            No buses were late by 20+ minutes in the last 24 hours
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
