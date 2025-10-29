import { ref, computed } from 'vue'

// Shared notifications store (simple composable singleton)
const now = new Date()
const minutesAgo = (m) => new Date(now.getTime() - m * 60 * 1000)
const hoursAgo = (h) => new Date(now.getTime() - h * 60 * 60 * 1000)
const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000)

const notifications = ref([
  {
    id: 1,
    type: 'status',
    title: 'Prof. Alvarez is Available',
    message: 'Professor Alvarez is now available at IT Room 202',
    time: '30mins ago',
    read: false,
    createdAt: minutesAgo(30),
  },
  {
    id: 2,
    type: 'message',
    title: 'Reply from Prof. Alvarez',
    message: "Thank you for your inquiry. I'll be available tomorrow.",
    time: '1hr ago',
    read: false,
    createdAt: hoursAgo(1),
  },
  {
    id: 3,
    type: 'status',
    title: 'Prof. Alvarez is Busy',
    message: 'Professor Alvarez is busy, he is in a meeting',
    time: '30mins ago',
    read: false,
    createdAt: minutesAgo(30),
  },
  {
    id: 4,
    type: 'message',
    title: 'Reply from Prof. Alvarez',
    message: "Thank you for your inquiry. I'll be busy until 4pm..",
    time: '1hr ago',
    read: false,
    createdAt: hoursAgo(1),
  },
  {
    id: 5,
    type: 'system',
    title: 'System Maintenance Tonight',
    message: 'The portal will be under maintenance from 11PM to 12AM.',
    time: '2hrs ago',
    read: true,
    createdAt: hoursAgo(2),
  },
])

const count = computed(() => notifications.value.length)

function addNotification(item) {
  const id = item.id ?? (notifications.value.length ? Math.max(...notifications.value.map(n => n.id)) + 1 : 1)
  notifications.value.unshift({ read: false, createdAt: new Date(), ...item, id })
}

function markAsRead(id) {
  const n = notifications.value.find(n => n.id === id)
  if (n) n.read = true
}

function clearAll() {
  notifications.value = []
}

export function useNotifications() {
  return { notifications, count, addNotification, markAsRead, clearAll }
}
