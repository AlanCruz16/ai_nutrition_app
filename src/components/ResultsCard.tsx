'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

interface NutritionData {
    calories: number
    protein: number
    carbs: number
    fat: number
}

interface ResultsCardProps {
    data: NutritionData
    description: string
    onMealLogged: () => void
}

export default function ResultsCard({
    data,
    description,
    onMealLogged,
}: ResultsCardProps) {
    const logMeal = useMutation(api.meals.logMeal)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleLogMeal = async () => {
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            await logMeal({
                description,
                calories: data.calories,
                protein: data.protein,
                carbs: data.carbs,
                fat: data.fat,
            })

            setSuccess(true)
            onMealLogged()
        } catch (err) {
            // "Unauthenticated" error comes from backend if not logged in
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Failed to log meal")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4 mt-4 bg-gray-100 rounded-md">
            <h3 className="text-xl font-bold">Nutritional Information</h3>
            <p>Calories: {data.calories}</p>
            <p>Protein: {data.protein}g</p>
            <p>Carbs: {data.carbs}g</p>
            <p>Fat: {data.fat}g</p>
            <button
                onClick={handleLogMeal}
                disabled={loading || success}
                className="w-full px-4 py-2 mt-4 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
                {success ? 'Logged!' : loading ? 'Logging...' : 'Log this Meal'}
            </button>
            {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
    )
}
