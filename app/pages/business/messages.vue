<script setup lang="ts">
definePageMeta({ layout: "business" });

const {
  filteredChats, activeChat, activeChatId,
  searchQuery, isTyping, openChat, sendMessage,
} = useMessages()

const inputText    = ref('')
const messagesEl   = ref<HTMLElement | null>(null)
const textareaEl   = ref<HTMLTextAreaElement | null>(null)
const showPanel    = ref(false)  // mobile: toggle between sidebar / chat

function selectChat(id: number) {
  openChat(id)
  showPanel.value = true
}

function handleSend() {
  if (!inputText.value.trim()) return
  sendMessage(inputText.value)
  inputText.value = ''
  if (textareaEl.value) textareaEl.value.style.height = 'auto'
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
}

function autoResize(e: Event) {
  const el = e.target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 120)}px`
}

function avatarUrl(seed: string, bg: string) {
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=${bg}`
}

// Scroll to bottom whenever messages or typing state change
watchEffect(async () => {
  const _m = activeChat.value?.messages.length
  const _t = isTyping.value
  await nextTick()
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
})
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-white font-sans text-em-100">

    <!-- ═══════════════════════════════════════════  SIDEBAR ════════════════════════════════════════════ -->
    <aside
      :class="[
        'flex flex-col flex-shrink-0 w-full md:w-80 lg:w-96',
        'bg-white border-r border-em-900/40',
        // mobile: hide sidebar when chat is open
        showPanel ? 'hidden md:flex' : 'flex',
      ]"
    >
      <!-- Header -->
      <div class="flex items-center px-3">
        <div class="flex-1">
          <h1 class="font-semibold mx-5 text-[20px] text-emerald-700">Messages</h1>
        </div>
      </div>

      <!-- Search -->
      <div class="px-4 pb-3">
        <div class="relative">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-em-700 text-xs pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search conversations…"
            class="w-full bg-em-950/60 border border-em-900/50 rounded-xl pl-8 pr-3 py-2.5 text-[13px] text-em-200 placeholder-em-800 focus:outline-none focus:border-emerald-700 transition-colors"
          />
        </div>
      </div>

      <!-- Chat list -->
      <div class="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
        <div
          v-for="chat in filteredChats"
          :key="chat.id"
          :class="[
            'chat-item px-3 py-2.5 flex items-center gap-3',
            activeChatId === chat.id ? 'active' : '',
          ]"
          @click="selectChat(chat.id)"
        >
          <!-- Avatar -->
          <div class="relative flex-shrink-0">
            <img :src="avatarUrl(chat.avatarSeed, chat.avatarBg)" class="w-10 h-10 rounded-full" />
            <span v-if="chat.online" class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-em-400 rounded-full online-dot" />
          </div>
          <!-- Meta -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline gap-2">
              <span class="text-[13px] font-semibold text-em-100 truncate">{{ chat.name }}</span>
              <span class="text-[10px] text-em-700 flex-shrink-0 font-mono">{{ chat.messages.at(-1)?.time }}</span>
            </div>
            <div class="flex items-center justify-between mt-0.5 gap-2">
              <p class="text-[11px] text-em-700 truncate">
                <span v-if="chat.messages.at(-1)?.from === 'me'" class="text-em-600">You: </span>
                {{ chat.messages.at(-1)?.text }}
              </p>
              <span
                v-if="chat.unread > 0"
                class="flex-shrink-0 min-w-[16px] h-4 px-1 rounded-full bg-em-500 flex items-center justify-center text-[9px] font-bold text-white"
              >
                {{ chat.unread }}
              </span>
            </div>
          </div>
        </div>

        <!-- Empty search -->
        <div v-if="filteredChats.length === 0" class="flex flex-col items-center py-12 gap-3">
          <i class="pi pi-inbox text-em-800 text-3xl" />
          <p class="text-em-700 text-sm">No conversations found</p>
        </div>
      </div>

      <!-- My profile -->
      <div class="border-t border-em-900/30 px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="relative">
            <img :src="avatarUrl('me', '065f46')" class="w-7 h-7 rounded-full avatar-ring" />
            <span class="absolute bottom-0 right-0 w-2 h-2 bg-em-400 rounded-full online-dot" />
          </div>
          <div>
            <p class="text-[12px] font-medium text-em-200">User</p>
            <p class="text-[10px] text-em-700">Active now</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- ═══════════════════════════════════════════CHAT PANEL════════════════════════════════════════════ -->
    <template v-if="activeChat">
      <div
        :class="[
          'flex flex-col flex-1 min-w-0 bg-white',
          showPanel ? 'flex' : 'hidden md:flex',
        ]"
      >
        <!-- Chat header -->
        <div class="flex items-center gap-3 px-5 py-4 border-b backdrop-blur-sm flex-shrink-0">
          <button class="md:hidden w-8 h-8 rounded-lg hover:bg-em-800/40 flex items-center justify-center transition-colors" @click="showPanel = false">
            <i class="pi pi-arrow-left text-em-400 text-sm" />
          </button>
          <div class="relative flex-shrink-0">
            <img :src="avatarUrl(activeChat.avatarSeed, activeChat.avatarBg)" class="w-10 h-10 rounded-full" />
            <span v-if="activeChat.online" class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-em-400 rounded-full online-dot" />
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="font-semibold text-[14px] text-slate-600 truncate">{{ activeChat.name }}</h2>
            <p class="text-[11px]" :class="activeChat.online ? 'text-emerald/80' : 'text-emerald/70'">
              {{ activeChat.online ? '● Active now' : activeChat.role }}
            </p>
          </div>
          <div class="flex items-center gap-1">
            <button class="w-8 h-8 rounded-lg hover:bg-em-800/40 flex items-center justify-center transition-colors">
              <i class="pi pi-phone text-black text-sm" />
            </button>
            <button class="w-8 h-8 rounded-lg hover:bg-em-800/40 flex items-center justify-center transition-colors">
              <i class="pi pi-video text-black text-sm" />
            </button>
            <button class="w-8 h-8 rounded-lg hover:bg-em-800/40 flex items-center justify-center transition-colors">
              <i class="pi pi-ellipsis-v text-black text-sm" />
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div ref="messagesEl" class="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-3 min-h-0">
          <!-- Date separator -->
          <div class="flex items-center gap-3 py-2">
            <div class="flex-1 h-px bg-em-900/40" />
            <span class="text-[10px] text-em-800 font-mono px-2">Today</span>
            <div class="flex-1 h-px bg-em-900/40" />
          </div>

          <!-- Message bubbles -->
          <template v-for="msg in activeChat.messages" :key="msg.id">
            <!-- Incoming -->
            <div v-if="msg.from === 'them'" class="flex items-end gap-2 animate-bubble-in">
              <img :src="avatarUrl(activeChat.avatarSeed, activeChat.avatarBg)" class="w-7 h-7 rounded-full flex-shrink-0" />
              <div class="max-w-xs md:max-w-sm lg:max-w-md">
                <div class="bg-[#0d1a14] border border-em-800/25 rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                  <p class="text-[13px] text-white leading-relaxed break-words">{{ msg.text }}</p>
                </div>
                <p class="text-[10px] text-em-800 mt-1 ml-1 font-mono">{{ msg.time }}</p>
              </div>
            </div>

            <!-- Outgoing -->
            <div v-else class="flex items-end justify-end gap-2 animate-bubble-self">
              <div class="max-w-xs md:max-w-sm lg:max-w-md">
                <div class="bg-white rounded-2xl rounded-br-sm px-3.5 py-2.5 shadow-md shadow-em-900/30">
                  <p class="text-[13px] text-black leading-relaxed break-words">{{ msg.text }}</p>
                </div>
                <div class="flex items-center justify-end gap-1 mt-1 mr-1">
                  <p class="text-[10px] text-em-700 font-mono">{{ msg.time }}</p>
                  <i :class="['pi text-[9px]', msg.status === 'read' ? 'pi-check-circle text-em-400' : 'pi-check text-em-700']" />
                </div>
              </div>
            </div>
          </template>

          <!-- Typing indicator -->
          <div v-if="isTyping" class="flex items-end gap-2 animate-bubble-in">
            <img :src="avatarUrl(activeChat.avatarSeed, activeChat.avatarBg)" class="w-7 h-7 rounded-full flex-shrink-0" />
            <div class="bg-white text-black border border-em-800/25 rounded-2xl rounded-bl-sm px-4 py-3">
              <div class="flex items-center gap-1.5 text-black">
                <span class="typing-dot text-black" /><span class="typing-dot text-black" /><span class="typing-dot text-black" />
              </div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="border-t border-em-900/30 px-4 py-3 bg-[#0d1410]/10 backdrop-blur-sm flex-shrink-0">
          <div class="flex items-end gap-2.5">
            <button class="w-9 h-9 rounded-xl hover:bg-em-800/40 flex items-center justify-center transition-colors flex-shrink-0 mb-0.5">
              <i class="pi pi-paperclip text-em-600 text-sm" />
            </button>
            <textarea
              ref="textareaEl"
              v-model="inputText"
              rows="1"
              placeholder="Type a message…"
              class="msg-textarea flex-1 bg-em-950/60 border border-em-900/50 rounded-2xl px-4 py-2.5 text-[13px] text-em-100 placeholder-em-800 focus:border-em-600 transition-colors"
              @keydown="handleKeydown"
              @input="autoResize"
            />
            <button
              :class="[
                'w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 mb-0.5 active:scale-95',
                inputText.trim() ? 'bg-em-600 hover:bg-em-500 shadow-lg shadow-em-900/50' : 'bg-em-900/50 cursor-not-allowed opacity-20',
              ]"
              @click="handleSend"
            >
              <i class="pi pi-send text-slate-900 text-sm" style="margin-left:1px" />
            </button>
          </div>
          <div class="flex items-center gap-3 mt-2 px-1">
            <button class="text-em-800 hover:text-em-500 transition-colors"><i class="pi pi-face-smile text-sm" /></button>
            <button class="text-em-800 hover:text-em-500 transition-colors"><i class="pi pi-image text-sm" /></button>
            <button class="text-em-800 hover:text-em-500 transition-colors"><i class="pi pi-microphone text-sm" /></button>
            <button class="text-em-800 hover:text-em-500 transition-colors"><i class="pi pi-map-marker text-sm" /></button>
            <span class="ml-auto text-[10px] text-em-800 font-mono">
              <kbd class="px-1 py-0.5 rounded bg-em-900/50 text-em-700">Enter</kbd> to send
            </span>
          </div>
        </div>
      </div>
    </template>


    <div v-else class="hidden md:flex flex-col flex-1 items-center justify-center gap-5 bg-white">
      <div class="relative">
        <div class="w-20 h-20 rounded-3xl bg-em-900/30 border border-em-800/20 flex items-center justify-center">
          <i class="pi pi-comments text-em-700 text-3xl" />
        </div>
        <div class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-em-600 flex items-center justify-center">
          <i class="pi pi-arrow-left text-black text-[9px]" />
        </div>
      </div>
      <div class="text-center">
        <p class="text-em-300 font-semibold text-sm">Select a conversation</p>
        <p class="text-em-800 text-xs mt-1.5 max-w-[180px] leading-relaxed">Choose from your chats to start messaging</p>
      </div>
    </div>

  </div>
</template>