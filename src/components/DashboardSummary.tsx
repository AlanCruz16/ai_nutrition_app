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
    const today = useMemo(() => new Date(), [])

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

    return (
        <div className="p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
            <h2 className="text-3xl font-bold text-gray-800">Today&apos;s Summary</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-lg font-semibold">Calories</p>
                    <p className="text-2xl">{dailySummary.calories}</p>
                </div>
                <div>
                    <p className="text-lg font-semibold">Protein</p>
                    <p className="text-2xl">{dailySummary.protein}g</p>
                </div>
                <div>
                    <p className="text-lg font-semibold">Carbs</p>
                    <p className="text-2xl">{dailySummary.carbs}g</p>
                </div>
                <div>
                    <p className="text-lg font-semibold">Fat</p>
                    <p className="text-2xl">{dailySummary.fat}g</p>
                </div>
            </div>
        </div>
    )
}
