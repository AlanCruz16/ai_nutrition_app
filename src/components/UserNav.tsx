'use client'

import { UserButton, useUser } from "@clerk/nextjs" // Or just UserButton if auth check not needed

export default function UserNav() {
    const { isSignedIn, user } = useUser();

    if (!isSignedIn) return null;

    return (
        <div className="absolute top-4 right-4 flex items-center space-x-4">
            {/* Optional: Show email manually if UserButton doesn't fit design, 
                 but UserButton is best practice for Clerk */}
            <span className="text-gray-600">{user.primaryEmailAddress?.emailAddress}</span>
            <UserButton afterSignOutUrl="/" />
        </div>
    )
}
