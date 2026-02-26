import { ref, computed } from 'vue'

export interface Message {
  id: string
  from: 'me' | 'them'
  text: string
  time: string
  status?: 'sent' | 'delivered' | 'read'
}

export interface Chat {
  id: number
  name: string
  avatarSeed: string
  avatarBg: string
  online: boolean
  role: string
  unread: number
  messages: Message[]
}

const uid = (): string => Math.random().toString(36).slice(2, 9)
const now = (): string => new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })

const chats = ref<Chat[]>([
  {
    id: 1, name: 'Amara Osei', avatarSeed: 'amara', avatarBg: '065f46',
    online: true, role: 'Product Designer', unread: 0,
    messages: [
      { id: uid(), from: 'them', text: 'Hey! Can you review the new dashboard mockups?', time: '10:22 AM', status: 'read' },
      { id: uid(), from: 'me',   text: 'Sure, send them over 👀', time: '10:24 AM', status: 'read' },
      { id: uid(), from: 'them', text: 'Just shared the Figma link in the channel.', time: '10:25 AM', status: 'read' },
      { id: uid(), from: 'me',   text: 'Got it, looking now!', time: '10:26 AM', status: 'read' },
      { id: uid(), from: 'them', text: 'The emerald palette turned out really clean 🌿', time: '10:28 AM', status: 'read' },
    ],
  },
  {
    id: 2, name: 'Dev Team', avatarSeed: 'devteam', avatarBg: '065f46',
    online: false, role: 'Group · 5 members', unread: 2,
    messages: [
      { id: uid(), from: 'them', text: "Sprint review is at 3pm today, don't forget!", time: 'Yesterday', status: 'read' },
      { id: uid(), from: 'me',   text: 'On my calendar ✅', time: 'Yesterday', status: 'read' },
      { id: uid(), from: 'them', text: 'CI pipeline is green again 🚀', time: 'Yesterday', status: 'delivered' },
    ],
  },
  {
    id: 3, name: 'Léa Fontaine', avatarSeed: 'lea', avatarBg: '047857',
    online: true, role: 'Frontend Engineer', unread: 0,
    messages: [
      { id: uid(), from: 'them', text: 'The component library PR is ready for review.', time: 'Mon', status: 'read' },
      { id: uid(), from: 'me',   text: "I'll take a look this afternoon.", time: 'Mon', status: 'read' },
      { id: uid(), from: 'them', text: 'No rush, thanks! 🙏', time: 'Mon', status: 'read' },
    ],
  },
  {
    id: 4, name: 'Kwame Asante', avatarSeed: 'kwame', avatarBg: '1f2937',
    online: false, role: 'Engineering Manager', unread: 1,
    messages: [
      { id: uid(), from: 'them', text: 'Can we sync tomorrow about the roadmap?', time: 'Sun', status: 'read' },
      { id: uid(), from: 'me',   text: 'Absolutely, morning works for me.', time: 'Sun', status: 'read' },
      { id: uid(), from: 'them', text: "Perfect. I'll send a calendar invite.", time: 'Sun', status: 'delivered' },
    ],
  },
])

const activeChatId = ref<number | null>(null)
const searchQuery  = ref('')
const isTyping     = ref(false)

const replies = [
  'Got it, thanks!', 'Sounds good!', 'On it!', 'Will do',
  'Perfect, appreciate it!', 'Great, let me check that.', 'Noted!',
  'Makes sense!', "I'll follow up shortly.", 'Copy that',
]

export function useMessages() {
  const filteredChats = computed(() => {
    const q = searchQuery.value.toLowerCase()
    return q
      ? chats.value.filter(c =>
          c.name.toLowerCase().includes(q) ||
          (c.messages.at(-1)?.text ?? '').toLowerCase().includes(q),
        )
      : chats.value
  })

  const activeChat = computed(() =>
    chats.value.find(c => c.id === activeChatId.value) ?? null,
  )

  function openChat(id: number) {
    activeChatId.value = id
    const chat = chats.value.find(c => c.id === id)
    if (chat) chat.unread = 0
  }

  function sendMessage(text: string) {
    const chat = activeChat.value
    if (!text.trim() || !chat) return

    chat.messages.push({ id: uid(), from: 'me', text: text.trim(), time: now(), status: 'sent' })

    setTimeout(() => { if (activeChatId.value === chat.id) isTyping.value = true }, 700)
    setTimeout(() => {
    isTyping.value = false
    chat.messages.push({
        id: uid(),
        from: 'them',
        text: replies[Math.floor(Math.random() * replies.length)] ?? 'Got it!',
        time: now(),
        status: 'delivered',
    })
    }, 2200)   
  }

  return {
    filteredChats,
    activeChat,
    activeChatId,
    searchQuery,
    isTyping,
    openChat,
    sendMessage,
  }
}