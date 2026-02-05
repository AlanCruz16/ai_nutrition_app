'use client'

import { useState } from 'react'
import QuickLog from '@/components/QuickLog'
import DetailedLog from '@/components/DetailedLog'
import MealLogList from '@/components/MealLogList'
import DashboardSummary from '@/components/DashboardSummary'
import UserNav from '@/components/UserNav'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useUser } from '@clerk/nextjs'

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('quick')

    // Convex automatically handles loading/auth states
    const mealLogs = useQuery(api.meals.getMeals)
    const { isLoaded, isSignedIn } = useUser();

    // While loading auth or data, show loading state
    if (!isLoaded || mealLogs === undefined) {
        return <div className="p-12 text-center">Loading...</div>
    }

    if (!isSignedIn) {
        // Middleware should handle this, but safe fallback
        return <div>Please log in</div>
    }

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
                        <QuickLog />
                    ) : (
                        <DetailedLog />
                    )}
                </div>
                <MealLogList mealLogs={mealLogs} />
            </div>
        </div>
    )
}
