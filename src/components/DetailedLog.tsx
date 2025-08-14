'use client'

import { useState, useEffect } from 'react'
import ResultsCard from './ResultsCard'
import { createClient } from '@/lib/supabase/client'
import SkeletonLoader from './SkeletonLoader'

interface NutritionData {
    calories: number
    protein: number
    carbs: number
    fat: number
}

interface Recipe {
    id: string
    name: string
    description: string
}

interface DetailedLogProps {
    onMealLogged: () => void
}

export default function DetailedLog({ onMealLogged }: DetailedLogProps) {
    const [batchDescription, setBatchDescription] = useState('')
    const [portionDescription, setPortionDescription] = useState('')
    const [nutritionData, setNutritionData] = useState<NutritionData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showSaveRecipe, setShowSaveRecipe] = useState(false)
    const [recipeName, setRecipeName] = useState('')
    const [recipes, setRecipes] = useState<Recipe[]>([])

    useEffect(() => {
        const fetchRecipes = async () => {
            const supabase = createClient()
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (user) {
                const { data, error } = await supabase
                    .from('recipes')
                    .select('*')
                    .eq('user_id', user.id)

                if (error) {
                    console.error('Error fetching recipes:', error)
                } else {
                    setRecipes(data)
                }
            }
        }

        fetchRecipes()
    }, [])

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
                calories: Math.round(nutrition.calories.estimate),
                protein: Math.round(nutrition.protein.estimate),
                carbs: Math.round(nutrition.carbohydrates.estimate),
                fat: Math.round(nutrition.fat.estimate),
            }
            setNutritionData(formattedData)
            onMealLogged()
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleSaveRecipe = async () => {
        const supabase = createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (user) {
            try {
                const { data, error } = await supabase
                    .from('recipes')
                    .insert([{ name: recipeName, description: batchDescription, user_id: user.id }])
                    .select()

                if (error) {
                    throw error
                }

                setRecipes([...recipes, data[0]])
                setShowSaveRecipe(false)
                setRecipeName('')
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message)
                }
            }
        }
    }

    return (
        <div className="p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-center text-gray-800">Detailed Log</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Select a saved recipe
                    </label>
                    <select
                        onChange={(e) => {
                            const selectedRecipe = recipes.find(
                                (r) => r.id === e.target.value
                            )
                            if (selectedRecipe) {
                                setBatchDescription(selectedRecipe.description)
                            }
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">-- Select a recipe --</option>
                        {recipes.map((recipe) => (
                            <option key={recipe.id} value={recipe.id}>
                                {recipe.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Or describe the entire batch of food you cooked
                    </label>
                    <textarea
                        value={batchDescription}
                        onChange={(e) => setBatchDescription(e.target.value)}
                        placeholder="e.g., A large pot of chili with ground beef, beans, tomatoes, and various spices"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={4}
                    />
                    <button
                        onClick={() => setShowSaveRecipe(true)}
                        className="w-full px-4 py-2 mt-2 font-bold text-white bg-purple-600 rounded-md hover:bg-purple-700"
                    >
                        Save as Recipe
                    </button>
                    {showSaveRecipe && (
                        <div className="mt-2">
                            <input
                                type="text"
                                value={recipeName}
                                onChange={(e) => setRecipeName(e.target.value)}
                                placeholder="Recipe Name"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            <button
                                onClick={handleSaveRecipe}
                                className="w-full px-4 py-2 mt-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700"
                            >
                                Save
                            </button>
                        </div>
                    )}
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

            {loading && <SkeletonLoader />}

            {nutritionData && !loading && (
                <ResultsCard
                    data={nutritionData}
                    description={`Batch: ${batchDescription}\nMy portion: ${portionDescription}`}
                    onMealLogged={onMealLogged}
                />
            )}
        </div>
    )
}
