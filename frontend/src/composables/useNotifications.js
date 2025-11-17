// import { ref, computed } from 'vue'

// // Shared notifications store (simple composable singleton)
// const now = new Date()
// const minutesAgo = (m) => new Date(now.getTime() - m * 60 * 1000)
// const hoursAgo = (h) => new Date(now.getTime() - h * 60 * 60 * 1000)
// const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000)

// const notifications = ref([])

// const count = computed(() => notifications.value.length)

// function addNotification(item) {
//   const id = item.id ?? (notifications.value.length ? Math.max(...notifications.value.map(n => n.id)) + 1 : 1)
//   notifications.value.unshift({ read: false, createdAt: new Date(), ...item, id })
// }

// function markAsRead(id) {
//   const n = notifications.value.find(n => n.id === id)
//   if (n) n.read = true
// }

// function clearAll() {
//   notifications.value = []
// }

// export function useNotifications() {
//   return { notifications, count, addNotification, markAsRead, clearAll }
// }

import { ref, computed } from 'vue'

const notifications = ref([])

const count = computed(() => notifications.value.length)

function addNotification(item) {
  const id =
    item.id ??
    (notifications.value.length
      ? Math.max(...notifications.value.map((n) => n.id)) + 1
      : 1)

  notifications.value.unshift({
    id,
    read: item.read ?? false,
    createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
    ...item,
  })
}

function markAsRead(id) {
  const n = notifications.value.find((n) => n.id === id)
  if (n) n.read = true
}

function clearAll() {
  notifications.value = []
}

export function useNotifications() {
  return { notifications, count, addNotification, markAsRead, clearAll }
}
