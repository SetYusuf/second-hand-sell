import { getStoredAuthToken, getStoredUserId } from './auth-storage'

export function getCurrentUserIdFromStorage(): string {
  if (typeof window === 'undefined') {
    return ''
  }

  return getStoredUserId()
}

export function getProfileRouteForUser(currentUserId: string | null | undefined, profileUserId: string | null | undefined): string {
  const currentId = currentUserId?.trim()
  const profileId = profileUserId?.trim()

  if (!currentId || !profileId) {
    return '/user-intetface/profile'
  }

  return currentId === profileId
    ? '/user-intetface/profile'
    : `/user-intetface/seller-profile/${profileId}`
}

export interface ChatParticipant {
  id: string
  name: string
  avatar?: string | null
}

export async function openChatWithUser(args: {
  router: { push: (url: string) => void }
  participant: ChatParticipant
  initialMessage?: string
}): Promise<void> {
  const { router, participant, initialMessage = '' } = args

  const token = typeof window !== 'undefined' ? getStoredAuthToken() : ''
  if (!token) {
    router.push('/login')
    return
  }

  try {
    const res = await fetch('/api/messages/conversations', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()

    if (data?.success) {
      const existingConversation = data.conversations?.find(
        (conversation: { participant?: { id?: string } }) => conversation.participant?.id === participant.id
      )

      if (existingConversation?._id) {
        const params = new URLSearchParams()
        params.set('conversationId', existingConversation._id)
        params.set('userId', participant.id)
        params.set('name', participant.name)
        params.set('avatar', participant.avatar || '/notification-image/lina.png')
        router.push(`/user-intetface/inside-chat?${params.toString()}`)
        return
      }
    }
  } catch (error) {
    console.error('Failed to look up conversations:', error)
  }

  const params = new URLSearchParams()
  params.set('userId', participant.id)
  params.set('name', participant.name)
  params.set('avatar', participant.avatar || '/notification-image/lina.png')
  if (initialMessage) {
    params.set('msg', initialMessage)
  }

  router.push(`/user-intetface/inside-chat?${params.toString()}`)
}
