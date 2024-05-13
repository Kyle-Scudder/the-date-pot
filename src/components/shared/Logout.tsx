'use client'

import { SignOutButton, SignedIn } from '@clerk/nextjs'
import { IconLogout } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'

export default function Logout(props: { placement: string }) {
  const router = useRouter()
  return (
    <SignedIn>
      <SignOutButton signOutOptions={{ redirectUrl: 'sign-in' }}>
        <div
          className={`flex cursor-pointer gap-4 ${
            props.placement === 'top' && 'lg:hidden'
          }`}
        >
          <IconLogout
            size={24}
            className='text-dark-1 dark:text-light-1'
            stroke={2}
            strokeLinejoin='miter'
          />
          <p className='font-black text-dark-2 dark:text-light-2 max-lg:hidden'>
            Logout
          </p>
        </div>
      </SignOutButton>
    </SignedIn>
  )
}
