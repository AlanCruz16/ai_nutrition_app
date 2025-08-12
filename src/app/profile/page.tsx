'use client'

import { useState, useEffect, useMemo } from 'react'
export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/client'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import UserNav from '@/components/UserNav'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface MealLog {
    id: string
    description: string
    calories: number
    protein: number
    carbs: number
    fat: number
    created_at: string
}

export default function Profile() {
    const [mealLogs, setMealLogs] = useState<MealLog[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const fetchMealLogs = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (user) {
                try {
                    const { data, error } = await supabase
                        .from('meal_logs')
                        .select('*')
                        .eq('user_id', user.id)

                    if (error) {
                        throw error
                    }

                    setMealLogs(data)
                } catch (err) {
                    if (err instanceof Error) {
                        setError(err.message)
                    }
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }

        fetchMealLogs()
    }, [supabase])

    const dailySummary = useMemo(() => {
        const today = new Date()
        return mealLogs
            .filter((log) => {
                const logDate = new Date(log.created_at)
                return logDate.toDateString() === today.toDateString()
            })
            .reduce(
                (acc, log) => {
                    acc.calories += log.calories
                    acc.protein += log.protein
                    acc.carbs += log.carbs
                    acc.fat += log.fat
                    return acc
                },
                { calories: 0, protein: 0, carbs: 0, fat: 0 }
            )
    }, [mealLogs])

    const weeklySummary = useMemo(() => {
        const today = new Date()
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        return mealLogs
            .filter((log) => {
                const logDate = new Date(log.created_at)
                return logDate >= startOfWeek
            })
            .reduce(
                (acc, log) => {
                    acc.calories += log.calories
                    acc.protein += log.protein
                    acc.carbs += log.carbs
                    acc.fat += log.fat
                    return acc
                },
                { calories: 0, protein: 0, carbs: 0, fat: 0 }
            )
    }, [mealLogs])

    const macroData = [
        { name: 'Protein', value: dailySummary.protein },
        { name: 'Carbs', value: dailySummary.carbs },
        { name: 'Fat', value: dailySummary.fat },
    ]

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

    if (loading) {
        return <p>Loading profile...</p>
    }

    if (error) {
        return <p className="text-red-500">{error}</p>
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="relative flex flex-col items-center min-h-screen bg-gray-100 py-12">
            <UserNav />
            <div className="w-full max-w-2xl space-y-8">
                <div className="p-8 space-y-6 bg-white rounded-lg shadow-md">
                    <Link href="/dashboard" className="text-blue-500 hover:underline">
                        &larr; Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-center">Your Profile</h1>
                    <div>
                        <h2 className="text-2xl font-bold">Today&apos;s Summary</h2>
                        <p>Calories: {dailySummary.calories}</p>
                        <p>Protein: {dailySummary.protein}g</p>
                        <p>Carbs: {dailySummary.carbs}g</p>
                        <p>Fat: {dailySummary.fat}g</p>
                    </div>
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold">This Week&apos;s Summary</h2>
                        <p>Calories: {weeklySummary.calories}</p>
                        <p>Protein: {weeklySummary.protein}g</p>
                        <p>Carbs: {weeklySummary.carbs}g</p>
                        <p>Fat: {weeklySummary.fat}g</p>
                    </div>
                    <div>
                        <h2 className="mt-8 text-2xl font-bold">Macronutrient Breakdown</h2>
                        <div className="flex justify-center">
                            <PieChart width={400} height={400}>
                                <Pie
                                    data={macroData}
                                    cx={200}
                                    cy={200}
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {macroData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 mt-8 font-bold text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}
