'use client'

import { useState, useEffect } from 'react'
import QuickLog from '@/components/QuickLog'
import DetailedLog from '@/components/DetailedLog'
import MealLogList from '@/components/MealLogList'
import DashboardSummary from '@/components/DashboardSummary'
import UserNav from '@/components/UserNav'
import { createClient } from '@/lib/supabase/client'

interface MealLog {
    id: string
    description: string
    calories: number
    protein: number
    carbs: number
    fat: number
    created_at: string
}

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('quick')
    const [mealLogs, setMealLogs] = useState<MealLog[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

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
                    .order('created_at', { ascending: false })

                if (error) {
                    throw error
                }

                setMealLogs(data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        } else {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMealLogs()
    }, [supabase])

    return (
        <div className="relative flex flex-col items-center min-h-screen bg-gray-100 py-12">
            <UserNav />
            <div className="w-full max-w-2xl space-y-8">
                <DashboardSummary mealLogs={mealLogs} />
                <div>
                    <div className="flex justify-center mb-4 border-b">
                        <button
                            onClick={() => setActiveTab('quick')}
                            className={`px-4 py-2 font-semibold ${activeTab === 'quick'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500'
                                }`}
                        >
                            Quick Log
                        </button>
                        <button
                            onClick={() => setActiveTab('detailed')}
                            className={`px-4 py-2 font-semibold ${activeTab === 'detailed'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500'
                                }`}
                        >
                            Detailed Log
                        </button>
                    </div>
                    {activeTab === 'quick' ? (
                        <QuickLog onMealLogged={fetchMealLogs} />
                    ) : (
                        <DetailedLog onMealLogged={fetchMealLogs} />
                    )}
                </div>
                <MealLogList
                    mealLogs={mealLogs}
                    loading={loading}
                    error={error}
                    onMealDeleted={fetchMealLogs}
                    supabase={supabase}
                />
            </div>
        </div>
    )
}
