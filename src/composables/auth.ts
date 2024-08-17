import type { User } from '@/types'

export const useCheckRoles = (roles: User.Role[]) => {
  const authStore = useAuthStore()
  return authStore.profile?.roles.some((role) => roles.includes(role)) ?? false
}

export function useValidUser() {
  const listUserBlacklist = useEnv<string[]>('VITE_BLACKLIST_USERS') ?? []
  const listUserWhitelist = useEnv<string[]>('VITE_WHITELIST_USERS') ?? []
  function isUserBlackListed() {
    const { profile } = useAuthStore()
    return (
      listUserBlacklist.includes(profile?.email || '') ||
      listUserBlacklist.includes(profile?.username || '')
    )
  }

  function isUserWhiteListed() {
    const { profile } = useAuthStore()
    return (
      listUserWhitelist.includes(profile?.email || '') ||
      listUserWhitelist.includes(profile?.username || '')
    )
  }

  return {
    listUserBlacklist,
    listUserWhitelist,
    isUserBlackListed,
    isUserWhiteListed
  }
}
