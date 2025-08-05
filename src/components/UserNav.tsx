'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UserNav() {
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            setUser(user)
        }

        fetchUser()
    }, [supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="absolute top-4 right-4 flex items-center space-x-4">
            {user && (
                <>
                    <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                        {user.email}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Logout
                    </button>
                </>
            )}
        </div>
    )
}
