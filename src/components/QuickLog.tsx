'use client'

import { useState } from 'react'
import ResultsCard from './ResultsCard'
import SkeletonLoader from './SkeletonLoader'

interface NutritionData {
    calories: number
    protein: number
    carbs: number
    fat: number
}

// onMealLogged removed because Convex updates reactively, or we just pass handleClose logic? 
// Actually ResultsCard calls it. We can just keep it optional or empty function if needed for UI state reset.
// In Dashboard we removed arguments to QuickLog, so no props are passed.
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

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.details || 'Failed to analyze meal')
            }
            const nutrition = result.nutritionalInformation
            const formattedData = {
                calories: Math.round(nutrition.calories.estimate),
                protein: Math.round(nutrition.protein.estimate),
                carbs: Math.round(nutrition.carbohydrates.estimate),
                fat: Math.round(nutrition.fat.estimate),
            }
            setNutritionData(formattedData)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleClear = () => {
        setNutritionData(null);
        setDescription('');
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

            {loading && <SkeletonLoader />}
            {error && <p className="text-red-500">{error}</p>}

            {nutritionData && !loading && (
                <ResultsCard
                    data={nutritionData}
                    description={description}
                    onMealLogged={handleClear}
                />
            )}
        </div>
    )
}
