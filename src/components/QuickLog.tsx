'use client'

import { useState } from 'react'
import ResultsCard from './ResultsCard'

interface NutritionData {
    calories: number
    protein: number
    carbs: number
    fat: number
}

interface QuickLogProps {
    onMealLogged: () => void
}

export default function QuickLog({ onMealLogged }: QuickLogProps) {
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

            const result = await response.json()
            const nutrition = result.nutritionalInformation
            const formattedData = {
                calories: nutrition.calories.estimate,
                protein: nutrition.protein.estimate,
                carbs: nutrition.carbohydrates.estimate,
                fat: nutrition.fat.estimate,
            }
            setNutritionData(formattedData)
            onMealLogged()
        } catch (err: any) {
            console.error('Error in handleAnalyze:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-center text-gray-800">Quick Log</h2>
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
                <ResultsCard data={nutritionData} description={description} />
            )}
        </div>
    )
}
