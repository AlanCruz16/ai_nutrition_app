'use client'

import { useState } from 'react'
import ResultsCard from './ResultsCard'

interface NutritionData {
    calories: number
    protein: number
    carbs: number
    fat: number
}

export default function DetailedLog() {
    const [batchDescription, setBatchDescription] = useState('')
    const [portionDescription, setPortionDescription] = useState('')
    const [nutritionData, setNutritionData] = useState<NutritionData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleAnalyze = async () => {
        setLoading(true)
        setError(null)
        setNutritionData(null)

        const fullDescription = `Batch: ${batchDescription}. My portion: ${portionDescription}`

        try {
            const response = await fetch('/api/analyze-meal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description: fullDescription }),
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
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center">Detailed Log</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Describe the entire batch of food you cooked
                    </label>
                    <textarea
                        value={batchDescription}
                        onChange={(e) => setBatchDescription(e.target.value)}
                        placeholder="e.g., A large pot of chili with ground beef, beans, tomatoes, and various spices"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={4}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Describe the portion you ate
                    </label>
                    <textarea
                        value={portionDescription}
                        onChange={(e) => setPortionDescription(e.target.value)}
                        placeholder="e.g., One medium-sized bowl"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={2}
                    />
                </div>
            </div>
            <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? 'Analyzing...' : 'Analyze Meal'}
            </button>

            {error && <p className="text-red-500">{error}</p>}

            {nutritionData && <ResultsCard data={nutritionData} />}
        </div>
    )
}
