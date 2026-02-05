import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Page() {
    const { userId } = await auth()

    if (userId) {
        redirect('/dashboard')
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
            <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
                <h1 className="text-6xl font-bold">
                    Welcome to <span className="text-blue-600">Nutrition Tracker</span>
                </h1>

                <p className="mt-3 text-2xl">
                    Track your meals and nutrition with the power of AI
                </p>

                <div className="flex items-center justify-center mt-8 space-x-4">
                    <Link
                        href="/login"
                        className="px-8 py-3 text-lg font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Login
                    </Link>
                    <Link
                        href="/signup"
                        className="px-8 py-3 text-lg font-bold text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-gray-50"
                    >
                        Sign Up
                    </Link>
                </div>
            </main>
        </div>
    )
}
