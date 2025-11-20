<template>
  <div class="h-full bg-[#102A71] rounded-2xl overflow-hidden flex flex-col">
    <!-- Logo Section -->
    <div class="p-12">
      <div class="flex items-center justify-center pb-5">
        <img class="h-12 w-auto" src="/t2fLogogogo.svg" alt="Tap2Find" />
        <span class="ml-2 text-3xl font-semibold">
          <span style="color: #fff">Tap</span>
          <span style="color: #F5C400">2</span>
          <span style="color: #fff">Find</span>
        </span>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class=" px-3 flex-1">
      <div class="space-y-1">
        <!-- Professor Dashboard -->
        <router-link
          to="/professor"
          class="group flex items-center px-4 py-3 text-base font-normal rounded-lg transition-colors leading-none"
          :class="[
            $route.path === '/professor'
              ? 'bg-white text-[#102A71]'
              : 'text-gray-300 hover:bg-[#cbd5f1]/20 hover:text-white' 
          ]"
        >
          <iconify-icon 
            :icon="$route.path === '/professor' ? 'fluent:home-12-filled' : 'fluent:home-12-regular'" 
            class="mr-2 text-xl" 
          />
          Home
        </router-link>

        <!-- Set Availability Status -->
        <router-link
          to="/professor/availability/tap"
          class="group flex items-center px-4 py-3 text-base font-normal rounded-lg transition-colors leading-none"
          :class="[
            $route.path.startsWith('/professor/availability')
              ? 'bg-white text-[#102A71]'
              : 'text-gray-300 hover:bg-[#cbd5f1]/20 hover:text-white'
          ]"
        >
          <iconify-icon 
            :icon="$route.path.startsWith('/professor/availability') ? 'mdi:check-circle' : 'mdi:check-circle-outline'" 
            class="mr-2 text-xl" 
          />
          Set Status
        </router-link>

        <!-- Manage Student Concerns -->
        <router-link
          to="/professor/concerns"
          class="group flex items-center px-4 py-3 text-base font-normal rounded-lg transition-colors leading-none"
          :class="[
            $route.path === '/professor/concerns'
              ? 'bg-white text-[#102A71]'
              : 'text-gray-300 hover:bg-[#cbd5f1]/20 hover:text-white'
          ]"
        >
          <iconify-icon 
            :icon="$route.path === '/professor/concerns' ? 'mingcute:inbox-fill' : 'mingcute:inbox-line'" 
            class="mr-2 text-xl" 
          />
          Manage Concerns
        </router-link>

        <!-- Notifications -->
        <router-link
          to="/professor/notifications"
          class="group flex items-center px-4 py-3 text-base font-normal rounded-lg transition-colors leading-none"
          :class="[
            $route.path === '/professor/notifications'
              ? 'bg-white text-[#102A71]'
              : 'text-gray-300 hover:bg-[#cbd5f1]/20 hover:text-white'
          ]"
        >
          <iconify-icon 
            :icon="$route.path === '/professor/notifications' ? 'lucide:bell' : 'lucide:bell'" 
            class="mr-2 text-xl" 
          />
          Notifications
        </router-link>

        <!-- Upload New/Edit Teaching Schedule -->
        <router-link
          to="/professor/schedule"
          class="group flex items-center px-4 py-3 text-base font-normal rounded-lg transition-colors leading-none"
          :class="[
            $route.path === '/professor/schedule'
              ? 'bg-white text-[#102A71]'
              : 'text-gray-300 hover:bg-[#cbd5f1]/20 hover:text-white'
          ]"
        >
          <iconify-icon 
            :icon="$route.path === '/professor/schedule' ? 'fluent:calendar-12-filled' : 'fluent:calendar-12-regular'" 
            class="mr-2 text-xl" 
          />
          Upload Teaching Schedule
        </router-link>

        <!-- Profile Page -->
      </div>
    </nav>
    <!-- Bottom Actions -->
    <div class="mt-auto px-3 pb-12 space-y-1">
      <router-link
        to="/professor/settings"
        class="group flex items-center px-4 py-3 text-base font-normal rounded-lg transition-colors leading-none"
        :class="[
          $route.path === '/professor/settings'
            ? 'bg-white text-[#102A71] shadow'
            : 'text-gray-300 hover:bg-[#cbd5f1]/20 hover:text-white'
        ]"
      >
        <iconify-icon 
          :icon="$route.path === '/professor/settings' ? 'lucide:settings' : 'lucide:settings'" 
          class="mr-2 text-xl" 
        />
        Settings
      </router-link>
      <router-link
        to="/professor/support"
        class="group flex items-center px-4 py-3 text-base font-normal rounded-lg transition-colors leading-none"
        :class="[
          $route.path === '/professor/support'
            ? 'bg-white text-[#102A71] shadow'
            : 'text-gray-300 hover:bg-[#cbd5f1]/20 hover:text-white'
        ]"
      >
        <iconify-icon 
          :icon="$route.path === '/professor/support' ? 'lucide:info' : 'lucide:info'" 
          class="mr-2 text-xl" 
        />
        Support & About
      </router-link>
    </div>
    
  </div>
</template>

<script setup>
const props = defineProps({
  name: { type: String, default: 'John Doe' },
  email: { type: String, default: 'professor@gmail.com' }
})
const { name, email } = props
</script>