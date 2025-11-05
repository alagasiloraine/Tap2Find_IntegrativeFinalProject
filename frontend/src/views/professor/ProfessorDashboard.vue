<template>
  <div class="bg-white min-h-screen pb-20 md:pb-8 p-4 md:p-4">
    <ProfessorTopNav />
    <div class="px-4 md:px-6 py-4 min-h-0">
      <div class="space-y-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl bg-gray-50  p-5 ">
          <div class="space-y-1">
            <div :class="['flex items-center gap-2 font-semibold text-2xl', statusTextClass]">
              <span :class="['inline-block w-2.5 h-2.5 rounded-full', statusDotClass]"></span>
              <span>You are {{ status.toLowerCase() }}</span>
            </div>
            <div class="text-gray-500 text-sm">Available for student consultations</div>
          </div>
          <!-- Removed change status dropdown -->
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="rounded-xl shadow p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 grid place-items-center">
                <Icon icon="material-symbols:today" class="w-5 h-5" />
              </div>
              <div>
                <div class="text-gray-600 ">Today's Concern</div>
                <div class="text-2xl font-bold">8</div>
                <div class="text-xs text-gray-400">+2 from yesterday</div>
              </div>
            </div>
          </div>
          <div class="rounded-xl shadow p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 grid place-items-center">
                <Icon icon="formkit:week" class="w-5 h-5" />
              </div>
              <div>
                <div class="text-gray-600">This Week's Concern</div>
                <div class="text-2xl font-bold">23</div>
                <div class="text-xs text-gray-400">+5 pending</div>
              </div>
            </div>
          </div>
          <div class="rounded-xl shadow p-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-green-100 text-green-600 grid place-items-center">
                <Icon icon="pajamas:task-done" class="w-5 h-5" />
              </div>
              <div>
                <div class="text-gray-600">Resolved</div>
                <div class="text-2xl font-bold">18</div>
                <div class="text-xs text-gray-400">78% resolution rate</div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl shadow">
          <div class="px-5 pt-5">
            <div class="text-xl font-semibold">Recent Student Concerns</div>
            <div class="text-sm text-gray-500">You have {{ concerns.length }} new notifications</div>
          </div>
          <div class="mt-3">
            <div
              v-for="(item, idx) in concerns"
              :key="idx"
              class="relative flex items-center justify-between gap-3 px-5 py-3 border-t border-gray-200">
              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-full bg-orange-200 text-orange-700 grid place-items-center font-bold">
                  {{ item.initials }}
                </div>
                <div>
                  <div class="font-semibold">{{ item.name }}</div>
                  <div class="text-sm text-gray-500">{{ item.subject }}</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import ProfessorTopNav from '@/components/ProfessorTopNav.vue'

const status = ref('Available')
const openMenuId = ref(null)
const concerns = ref([
  { name: 'Sharon Caballero', subject: 'Question about assignment 3 deadline', initials: 'SC' },
  { name: 'Katherine De Leon', subject: 'Question about assignment 3 deadline', initials: 'KD' },
  { name: 'Loraine Alagasi', subject: 'Question about assignment 3 deadline', initials: 'LA' },
  { name: 'Ellie Almeda', subject: 'Question about assignment 3 deadline', initials: 'EA' },
  { name: 'Darwin Lambon', subject: 'Question about assignment 3 deadline', initials: 'DL' },
])

function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id
}

function onReply(item) {
  openMenuId.value = null
}

function onDelete(item) {
  openMenuId.value = null
}

// Removed status dropdown handlers

const statusTextClass = computed(() => {
  if (status.value === 'Available') return 'text-green-700'
  if (status.value === 'Busy') return 'text-orange-700'
  return 'text-red-700'
})

const statusDotClass = computed(() => {
  if (status.value === 'Available') return 'bg-green-500'
  if (status.value === 'Busy') return 'bg-orange-500'
  return 'bg-red-500'
})
</script>
