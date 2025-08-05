'use client'

import { useState } from 'react'
import QuickLog from '@/components/QuickLog'
import DetailedLog from '@/components/DetailedLog'

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('quick')

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl">
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
                {activeTab === 'quick' ? <QuickLog /> : <DetailedLog />}
            </div>
        </div>
    )
}
