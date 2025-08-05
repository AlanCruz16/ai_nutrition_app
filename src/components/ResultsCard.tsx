'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

interface NutritionData {
    calories: number
    protein: number
    carbs: number
    fat: number
}

interface ResultsCardProps {
    data: NutritionData
    description: string
}

export default function ResultsCard({ data, description }: ResultsCardProps) {
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleLogMeal = async () => {
        setLoading(true)
        setError(null)
        setSuccess(false)

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            setError('You must be logged in to log a meal.')
            setLoading(false)
            return
        }

        try {
            const { error } = await supabase.from('meal_logs').insert([
                {
                    user_id: user.id,
                    description,
                    ...data,
                },
            ])

            if (error) {
                throw error
            }

            setSuccess(true)
        } catch (err: any) {
            setError(err.message)
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
