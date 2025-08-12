'use client'

interface MealLog {
    id: string
    description: string
    calories: number
    protein: number
    carbs: number
    fat: number
    created_at: string
}

import { SupabaseClient } from '@supabase/supabase-js'

interface MealLogListProps {
    mealLogs: MealLog[]
    loading: boolean
    error: string | null
    onMealDeleted: () => void
    supabase: SupabaseClient
}

export default function MealLogList({
    mealLogs,
    loading,
    error,
    onMealDeleted,
    supabase,
}: MealLogListProps) {
    const today = new Date()
    const todaysLogs = mealLogs.filter((log) => {
        const logDate = new Date(log.created_at)
        return logDate.toDateString() === today.toDateString()
    })

    if (loading) {
        return <p>Loading meal logs...</p>
    }

    if (error) {
        return <p className="text-red-500">{error}</p>
    }

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase.from('meal_logs').delete().eq('id', id)

            if (error) {
                throw error
            }

            onMealDeleted()
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message)
            }
        }
    }

    return (
        <div className="p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-center text-gray-800">Today's Meals</h2>
            {todaysLogs.length === 0 ? (
                <p className="text-center">You haven't logged any meals today.</p>
            ) : (
                <ul className="space-y-4">
                    {todaysLogs.map((log) => (
                        <li key={log.id} className="p-4 bg-gray-100 rounded-md relative">
                            <div>
                                <p className="font-bold">{log.description}</p>
                                <p>Calories: {log.calories}</p>
                                <p>Protein: {log.protein}g</p>
                                <p>Carbs: {log.carbs}g</p>
                                <p>Fat: {log.fat}g</p>
                                <p className="text-sm text-gray-500">
                                    Logged at: {new Date(
                                        log.created_at
                                    ).toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDelete(log.id)}
                                className="absolute bottom-4 right-4 p-2 text-white bg-red-600 rounded-full hover:bg-red-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
