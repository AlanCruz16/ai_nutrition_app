'use client'

import { useState } from 'react'

interface NutritionData {
    calories: number
    protein: number
    carbs: number
    fat: number
}

export default function QuickLog() {
    const [description, setDescription] = useState('')
    const [nutritionData, setNutritionData] = useState<NutritionData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleAnalyze = async () => {
        setLoading(true)
        setError(null)
        setNutritionData(null)

        try {
            const response = await fetch('/api/analyze-meal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description }),
            })

            if (!response.ok) {
                throw new Error('Failed to analyze meal')
            }

            const data = await response.json()
            setNutritionData(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center">Quick Log</h2>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., A bowl of oatmeal with a scoop of protein powder, a banana, and a handful of almonds"
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={4}
            />
            <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? 'Analyzing...' : 'Analyze Meal'}
            </button>

            {error && <p className="text-red-500">{error}</p>}

            {nutritionData && (
                <div className="p-4 mt-4 bg-gray-100 rounded-md">
                    <h3 className="text-xl font-bold">Nutritional Information</h3>
                    <p>Calories: {nutritionData.calories}</p>
                    <p>Protein: {nutritionData.protein}g</p>
                    <p>Carbs: {nutritionData.carbs}g</p>
                    <p>Fat: {nutritionData.fat}g</p>
                </div>
            )}
        </div>
    )
}
