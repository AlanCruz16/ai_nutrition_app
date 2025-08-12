'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

export default function UserNav() {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient()
            const {
                data: { user },
            } = await supabase.auth.getUser()
            setUser(user)
        }

        fetchUser()
    }, [])

    return (
        <div className="absolute top-4 right-4 flex items-center space-x-2">
            {user && (
                <Link href="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                    <span>{user.email}</span>
                </Link>
            )}
        </div>
    )
}
