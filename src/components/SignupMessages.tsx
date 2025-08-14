'use client'

import { useSearchParams } from 'next/navigation'

export default function SignupMessages() {
    const searchParams = useSearchParams()
    const message = searchParams.get('message')

    if (!message) {
        return null
    }

    const isError = message.includes('Could not authenticate user')

    return (
        <div
            className={`p-4 text-center rounded-md border ${isError
                ? 'text-red-800 bg-red-100 border-red-300'
                : 'text-green-800 bg-green-100 border-green-300'
                }`}
        >
            {message}
        </div>
    )
}
