"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Profile() {
    const weeklyStats = useQuery(api.stats.getWeeklyStats);

    // Calculate totals for the Pie Chart (aggregate of the week)
    const totalMacros = weeklyStats?.reduce(
        (acc, day) => ({
            protein: acc.protein + day.protein,
            carbs: acc.carbs + day.carbs,
            fat: acc.fat + day.fat,
        }),
        { protein: 0, carbs: 0, fat: 0 }
    );

    const pieData = totalMacros
        ? [
            { name: "Protein", value: totalMacros.protein },
            { name: "Carbs", value: totalMacros.carbs },
            { name: "Fat", value: totalMacros.fat },
        ]
        : [];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
                >
                    &larr; Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Your Weekly Nutrition Profile</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Calendar/Daily Trend (Calories) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Weekly Calorie Trend</h2>
                        <div className="h-[300px] w-full">
                            {weeklyStats ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={weeklyStats}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="calories" fill="#3b82f6" name="Calories" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">Loading stats...</div>
                            )}
                        </div>
                    </div>

                    {/* Macro Distribution */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Weekly Macro Dist.</h2>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            {weeklyStats && pieData.length > 0 && pieData.some(d => d.value > 0) ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-gray-400">No data available for this week</div>
                            )}
                        </div>
                    </div>

                    {/* Protein Trend */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Weekly Protein Intake</h2>
                        <div className="h-[300px] w-full">
                            {weeklyStats ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={weeklyStats}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="protein" fill="#0088FE" name="Protein (g)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">Loading stats...</div>
                            )}
                        </div>
                    </div>

                    {/* Carb Trend */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Weekly Carb Intake</h2>
                        <div className="h-[300px] w-full">
                            {weeklyStats ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={weeklyStats}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="carbs" fill="#00C49F" name="Carbs (g)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">Loading stats...</div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
