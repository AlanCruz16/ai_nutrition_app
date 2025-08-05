'use client'

interface NutritionData {
    calories: number
    protein: number
    carbs: number
    fat: number
}

interface ResultsCardProps {
    data: NutritionData
}

export default function ResultsCard({ data }: ResultsCardProps) {
    return (
        <div className="p-4 mt-4 bg-gray-100 rounded-md">
            <h3 className="text-xl font-bold">Nutritional Information</h3>
            <p>Calories: {data.calories}</p>
            <p>Protein: {data.protein}g</p>
            <p>Carbs: {data.carbs}g</p>
            <p>Fat: {data.fat}g</p>
        </div>
    )
}
