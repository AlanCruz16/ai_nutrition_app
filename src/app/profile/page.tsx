import { UserProfile } from '@clerk/nextjs'
import Link from 'next/link'

export default function Profile() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Link href="/dashboard" className="mb-4 inline-block text-blue-600 hover:underline">
                &larr; Back to Dashboard
            </Link>
            <div className="flex justify-center">
                <UserProfile routing="hash" />
            </div>
        </div>
    )
}
