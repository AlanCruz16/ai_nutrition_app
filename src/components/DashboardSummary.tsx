'use client'

import { useMemo } from 'react'

interface MealLog {
    id: string
    description: string
    calories: number
    protein: number
    carbs: number
    fat: number
    created_at: string
}

interface DashboardSummaryProps {
    mealLogs: MealLog[]
}

export default function DashboardSummary({ mealLogs }: DashboardSummaryProps) {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())

    const dailySummary = useMemo(() => {
        return mealLogs
            .filter((log) => {
                const logDate = new Date(log.created_at)
                return logDate.toDateString() === today.toDateString()
            })
            .reduce(
                (acc, log) => {
                    acc.calories += log.calories
                    acc.protein += log.protein
                    acc.carbs += log.carbs
                    acc.fat += log.fat
                    return acc
                },
                { calories: 0, protein: 0, carbs: 0, fat: 0 }
            )
    }, [mealLogs, today])

    const weeklySummary = useMemo(() => {
        return mealLogs
            .filter((log) => {
                const logDate = new Date(log.created_at)
                return logDate >= startOfWeek
            })
            .reduce(
                (acc, log) => {
                    acc.calories += log.calories
                    acc.protein += log.protein
                    acc.carbs += log.carbs
                    acc.fat += log.fat
                    return acc
                },
                { calories: 0, protein: 0, carbs: 0, fat: 0 }
            )
    }, [mealLogs, startOfWeek])

    return (
        <div className="p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center">Your Summary</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                    <h3 className="text-xl font-bold">Today</h3>
                    <p>Calories: {dailySummary.calories}</p>
                    <p>Protein: {dailySummary.protein}g</p>
                    <p>Carbs: {dailySummary.carbs}g</p>
                    <p>Fat: {dailySummary.fat}g</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold">This Week</h3>
                    <p>Calories: {weeklySummary.calories}</p>
                    <p>Protein: {weeklySummary.protein}g</p>
                    <p>Carbs: {weeklySummary.carbs}g</p>
                    <p>Fat: {weeklySummary.fat}g</p>
                </div>
            </div>
        </div>
    )
}
