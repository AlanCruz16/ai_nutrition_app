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

interface MealLogListProps {
    mealLogs: MealLog[]
    loading: boolean
    error: string | null
}

export default function MealLogList({
    mealLogs,
    loading,
    error,
}: MealLogListProps) {

    if (loading) {
        return <p>Loading meal logs...</p>
    }

    if (error) {
        return <p className="text-red-500">{error}</p>
    }

    return (
        <div className="p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center">Your Meal Logs</h2>
            {mealLogs.length === 0 ? (
                <p className="text-center">You haven't logged any meals yet.</p>
            ) : (
                <ul className="space-y-4">
                    {mealLogs.map((log) => (
                        <li key={log.id} className="p-4 bg-gray-100 rounded-md">
                            <p className="font-bold">{log.description}</p>
                            <p>Calories: {log.calories}</p>
                            <p>Protein: {log.protein}g</p>
                            <p>Carbs: {log.carbs}g</p>
                            <p>Fat: {log.fat}g</p>
                            <p className="text-sm text-gray-500">
                                Logged at: {new Date(log.created_at).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
