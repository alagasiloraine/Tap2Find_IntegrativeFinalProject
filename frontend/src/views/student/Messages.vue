<template>
  <div class="bg-white min-h-screen pb-20 md:pb-8 p-4 md:p-4">
    <!-- Top Bar with Notifications and Profile -->
    <StudentTopNav />

    <!-- Content Division -->
    <div class="px-4 md:px-6 py-4 min-h-0">
      <!-- Messages Layout -->
      <div class="flex h-[calc(100vh-200px)] bg-white rounded-xl shadow overflow-hidden">
        
        <!-- Left Sidebar - Conversations List -->
        <div class="w-1/3 border-r border-gray-200 flex flex-col">
          <!-- Title -->
          <div class="p-4 pb-2">
            <h2 class="text-xl font-semibold text-gray-900">Chats</h2>
          </div>
          
          <!-- Search Bar -->
          <div class="px-4 pb-4">
            <div class="relative">
              <iconify-icon icon="fluent:search-16-filled" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                class="w-full pl-10 text-black pr-4 py-2 bg-gray-50 rounded-full outline-none transition-colors"
                v-model="searchQuery"
              />
            </div>
          </div>

          <!-- Tabs -->
          <div class="px-4 py-3">
            <div class="flex items-center justify-between">
              <div class="flex">
                <button 
                  @click="activeTab = 'all'"
                  class="px-4 py-2 text-sm font-medium rounded-full transition-colors"
                  :class="activeTab === 'all' ? 'bg-[#102A71] text-white' : 'text-gray-500 hover:text-gray-700'"
                >
                  All
                </button>
                <button 
                  @click="activeTab = 'unread'"
                  class="px-4 py-2 text-sm font-medium rounded-full transition-colors ml-2"
                  :class="activeTab === 'unread' ? 'bg-[#102A71] text-white' : 'text-gray-500 hover:text-gray-700'"
                >
                  Unread
                </button>
              </div>
            </div>
          </div>

          <!-- Conversations List -->
          <div class="flex-1 overflow-y-auto">
            <!-- All Messages List -->
            <div v-if="activeTab === 'all'" class="space-y-1">
              <div 
                v-for="message in messages" 
                :key="message.id"
                @click="openConversation(message)"
                class="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                :class="[
                  selectedMessage?.id === message.id ? 'bg-blue-50 border-r-2 border-blue-500' : '',
                  message.unread ? 'bg-gray-50' : ''
                ]"
              >
                <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  :class="message.avatarBg"
                >
                  <span class="text-white text-sm font-bold">{{ message.initials }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ message.name }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ message.preview }}</p>
                </div>
                <div class="flex flex-col items-end ml-2">
                  <span class="text-xs text-gray-400">{{ message.time }}</span>
                </div>
              </div>
            </div>

            <!-- Unread Messages List -->
            <div v-if="activeTab === 'unread'" class="space-y-1">
              <div 
                v-for="message in messages" 
                :key="message.id"
                @click="openConversation(message)"
                class="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                :class="[
                  selectedMessage?.id === message.id ? 'bg-blue-50 border-r-2 border-blue-500' : '',
                  message.unread ? 'bg-gray-50' : ''
                ]"
              >
                <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  :class="message.avatarBg"
                >
                  <span class="text-white text-sm font-bold">{{ message.initials }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ message.name }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ message.preview }}</p>
                </div>
                <div class="flex flex-col items-end ml-2">
                  <span class="text-xs text-gray-400">{{ message.time }}</span>
                  <div v-if="message.unread" class="w-2 h-2 bg-red-500 rounded-full mt-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Conversation View -->
        <div class="flex-1 flex flex-col">
          <!-- Conversation Header -->
          <div v-if="selectedMessage" class="flex items-center justify-between p-4 border-b border-gray-200">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                :class="selectedMessage.avatarBg"
              >
                <span class="text-white text-sm font-bold">{{ selectedMessage.initials }}</span>
              </div>
              <div class="flex flex-col">
                <h3 class="text-lg font-semibold text-gray-900">{{ selectedMessage.name }}</h3>
                <div class="flex items-center">
                  <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span 
                    class="text-sm font-medium"
                    :class="getStatusTextColor(selectedMessage.status)"
                  >
                    {{ getStatusText(selectedMessage.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Messages Area -->
          <div v-if="selectedMessage" class="flex-1 overflow-y-auto p-4" ref="messagesContainer">
            <transition-group :name="enableMessageTransition ? 'message' : null" tag="div" class="space-y-4">
              <div 
                v-for="conversation in selectedMessage.conversations" 
                :key="conversation.id"
                class="flex items-end"
                :class="conversation.sender === 'student' ? 'justify-end' : 'justify-start'"
              >
                <!-- Professor Message with Avatar -->
                <div v-if="conversation.sender === 'professor'" class="flex items-end">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center mr-2 mb-1"
                    :class="selectedMessage.avatarBg"
                  >
                    <span class="text-white text-xs font-bold">{{ selectedMessage.initials }}</span>
                  </div>
                  <div class="flex flex-col max-w-xs lg:max-w-md">
                    <div class="px-4 py-2 bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md">
                      <p class="text-sm">{{ conversation.message }}</p>
                    </div>
                    <p class="text-xs text-gray-500 mt-1 text-left">
                      {{ conversation.time }}
                    </p>
                  </div>
                </div>

                <!-- Student Message without Avatar -->
                <div v-if="conversation.sender === 'student'" class="flex flex-col max-w-xs lg:max-w-md">
                  <div class="px-4 py-2 bg-[#102A71] text-white rounded-2xl rounded-br-md">
                    <p class="text-sm">{{ conversation.message }}</p>
                  </div>
                  <p class="text-xs text-gray-500 mt-1 text-right">
                    {{ conversation.time }}
                  </p>
                </div>
              </div>
            </transition-group>
          </div>

          <!-- Empty State -->
          <div v-else class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <iconify-icon icon="mingcute:message-3-line" class="text-6xl text-gray-300 mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p class="text-sm text-gray-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>

          <!-- Message Input Area -->
          <div v-if="selectedMessage" class="p-4 ">
            <div class="flex items-center space-x-2">
              <!-- Message Input -->
              <div class="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type a message"
                  class="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none transition-colors"
                  v-model="newMessage"
                  @keyup.enter="sendMessage"
                />
              </div>

              <button class="p-2 transition-colors" @click="sendMessage">
                <iconify-icon icon="fluent:send-16-filled" class="text-2xl text-[#102A71]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import StudentTopNav from '@/components/StudentTopNav.vue'

const activeTab = ref('all')
const searchQuery = ref('')
const showMenu = ref(false)
const selectedMessage = ref(null)
const newMessage = ref('')
const messagesContainer = ref(null)
const enableMessageTransition = ref(false)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const openConversation = (message) => {
  selectedMessage.value = message
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  const text = newMessage.value.trim()
  if (!text || !selectedMessage.value) return

  const convs = selectedMessage.value.conversations
  const nextId = convs.length ? Math.max(...convs.map(c => c.id)) + 1 : 1
  enableMessageTransition.value = true
  convs.push({
    id: nextId,
    sender: 'student',
    message: text,
    time: 'Just now'
  })
  newMessage.value = ''
  await scrollToBottom()
  setTimeout(() => { enableMessageTransition.value = false }, 300)
}

const getStatusColor = (status) => {
  switch(status) {
    case 'available': return 'bg-green-500'
    case 'busy': return 'bg-blue-500'
    case 'not-available': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}

const getStatusTextColor = (status) => {
  switch(status) {
    case 'available': return 'text-green-600'
    case 'busy': return 'text-blue-600'
    case 'not-available': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

const getStatusText = (status) => {
  switch(status) {
    case 'available': return 'Available'
    case 'busy': return 'Busy'
    case 'not-available': return 'Not Available'
    default: return 'Unknown'
  }
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Computed property for unread messages
const unreadMessages = computed(() => {
  return messages.value.filter(message => message.unread)
})

const messages = ref([
  {
    id: 1,
    name: 'Prof. Pauline Alvarez',
    initials: 'PA',
    preview: 'Regarding your project submission...',
    time: '2h ago',
    unread: true,
    status: 'available',
    avatarBg: 'bg-gradient-to-br from-purple-300 to-purple-500',
    conversations: [
      { id: 1, sender: 'professor', message: 'Hello! I received your project submission. Let\'s discuss it.', time: '2h ago' },
      { id: 2, sender: 'student', message: 'Thank you professor! I\'m excited to hear your feedback.', time: '1h ago' },
      { id: 3, sender: 'professor', message: 'Your work shows great improvement. Let\'s schedule a meeting to discuss the details.', time: '30min ago' }
    ]
  },
  {
    id: 2,
    name: 'Dr. Jane Smith',
    initials: 'JS',
    preview: 'Thank you for your inquiry...',
    time: '5h ago',
    unread: false,
    status: 'busy',
    avatarBg: 'bg-gradient-to-br from-green-300 to-green-500',
    conversations: [
      { id: 1, sender: 'student', message: 'Hi Dr. Smith, I have a question about the assignment.', time: '5h ago' },
      { id: 2, sender: 'professor', message: 'Of course! I\'m here to help. What\'s your question?', time: '4h ago' },
      { id: 3, sender: 'student', message: 'I\'m not sure about the requirements for the final project.', time: '3h ago' },
      { id: 4, sender: 'professor', message: 'The requirements are clearly outlined in the syllabus. Let me know if you need clarification.', time: '2h ago' }
    ]
  },
  {
    id: 3,
    name: 'Prof. Robert Johnson',
    initials: 'RJ',
    preview: 'Office hours have changed...',
    time: '1d ago',
    unread: true,
    status: 'not-available',
    avatarBg: 'bg-gradient-to-br from-blue-300 to-blue-500',
    conversations: [
      { id: 1, sender: 'professor', message: 'Office hours have been changed to Tuesday 2-4 PM.', time: '1d ago' },
      { id: 2, sender: 'student', message: 'Got it! Thank you for the update.', time: '20h ago' }
    ]
  },
  {
    id: 4,
    name: 'Dr. Maria Garcia',
    initials: 'MG',
    preview: 'Assignment feedback ready...',
    time: '3d ago',
    unread: false,
    status: 'available',
    avatarBg: 'bg-gradient-to-br from-pink-300 to-pink-500',
    conversations: [
      { id: 1, sender: 'professor', message: 'Your assignment feedback is ready for review.', time: '3d ago' },
      { id: 2, sender: 'student', message: 'Thank you! I\'ll check it right away.', time: '2d ago' }
    ]
  },
  {
    id: 5,
    name: 'Prof. David Wilson',
    initials: 'DW',
    preview: 'Meeting scheduled for tomorrow...',
    time: '1w ago',
    unread: false,
    status: 'busy',
    avatarBg: 'bg-gradient-to-br from-indigo-300 to-indigo-500',
    conversations: [
      { id: 1, sender: 'student', message: 'Can we schedule a meeting to discuss my thesis?', time: '1w ago' },
      { id: 2, sender: 'professor', message: 'Sure! How about tomorrow at 2 PM?', time: '1w ago' },
      { id: 3, sender: 'student', message: 'Perfect! See you tomorrow.', time: '1w ago' }
    ]
  }
])
</script>

<style scoped>
.message-enter-from,
.message-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.message-enter-active,
.message-leave-active {
  transition: all 250ms ease;
}

.message-move {
  transition: transform 250ms ease;
}
</style>
