<!-- <template>
  <div class="h-full bg-[#102A71] rounded-2xl overflow-hidden flex flex-col">
    <div class="p-6">
      <div class="flex items-center justify-center pb-5 ">
        <img
          class="h-12 w-auto"
          src="/t2fLogogogo.svg"
          alt="Tap2Find"
        />
        <span class="ml-2 text-3xl font-semibold">
          <span style="color: #fff">Tap</span>
          <span style="color: #F5C400">2</span>
          <span style="color: #fff">Find</span>
        </span>
      </div>
    </div>

    <nav class="mt-2 px-3 flex-1">
      <div class="space-y-1">
        <router-link
          to="/student/dashboard"
          class="group flex items-center px-4 py-3 text-base font-normal rounded-lg transition-colors leading-none"
          :class="[
            $route.path === '/student/dashboard'
              ? 'bg-[#cbd5f1]/20 text-white'
              : 'text-gray-400 hover:bg-gray-50 hover:text-[#102A71]'
          ]"
        >
          <iconify-icon 
            :icon="$route.path === '/student/dashboard' ? 'fluent:home-12-filled' : 'fluent:home-12-regular'" 
            class="mr-2 text-xl" 
          />
         Home
        </router-link>

        <router-link
          to="/student/locate-professor"
          class="group flex items-center px-4 py-3 text-base font-normal rounded-lg transition-colors leading-none"
          :class="[
            $route.path === '/student/locate-professor'
              ? 'bg-[#cbd5f1]/20 text-white'
              : 'text-gray-400 hover:bg-gray-50 hover:text-[#102A71]'
          ]"
        >
          <iconify-icon 
            :icon="$route.path === '/student/locate-professor' ? 'fluent:location-12-filled' : 'fluent:location-12-regular'" 
            class="mr-2 text-xl" 
          />
          Locate Professor
        </router-link>

        <router-link
          to="/student/messages"
          class="group flex items-center px-4 py-3 text-base font-normal rounded-lg transition-colors leading-none"
          :class="[
            $route.path === '/student/messages'
              ? 'bg-[#cbd5f1]/20 text-white'
              : 'text-gray-400 hover:bg-gray-50 hover:text-[#102A71]'
          ]"
        >
          <iconify-icon 
            :icon="$route.path === '/student/messages' ? 'mingcute:message-3-fill' : 'mingcute:message-3-line'" 
            class="mr-2 text-xl" 
          />
          Inquiries
        </router-link>

        <router-link
          to="/student/notifications"
          class="group flex items-center px-4 py-3 text-base font-normal rounded-lg transition-colors leading-none"
          :class="[
            $route.path === '/student/notifications'
              ? 'bg-[#cbd5f1]/20 text-white'
              : 'text-gray-400 hover:bg-gray-50 hover:text-[#102A71]'
          ]"
        >
          <iconify-icon 
            :icon="$route.path === '/student/notifications' ? 'lucide:bell' : 'lucide:bell'" 
            class="mr-2 text-xl" 
          />
          Notifications
        </router-link>
      </div>
    </nav>

  </div>
</template>

<script setup>
// Pure navigation component
</script> -->

<template>
  <div class="h-full bg-[#102A71] rounded-2xl overflow-hidden flex flex-col">
    <!-- Logo Section -->
    <div class="p-6">
      <div class="flex items-center justify-center pb-5 ">
        <img
          class="h-12 w-auto"
          src="/t2fLogogogo.svg"
          alt="Tap2Find"
        />
        <span class="ml-2 text-3xl font-semibold">
          <span style="color: #fff">Tap</span>
          <span style="color: #F5C400">2</span>
          <span style="color: #fff">Find</span>
        </span>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="mt-2 px-3 flex-1">
      <div class="space-y-1">
        <!-- Student Dashboard -->
        <router-link
          to="/student/dashboard"
          class="group flex items-center px-4 py-3 text-base font-normal rounded-lg transition-colors leading-none"
          :class="[
            $route.path === '/student/dashboard'
              ? 'bg-[#cbd5f1]/20 text-white'
              : 'text-gray-400 hover:bg-gray-50 hover:text-[#102A71]'
          ]"
        >
          <iconify-icon 
            :icon="$route.path === '/student/dashboard' ? 'fluent:home-12-filled' : 'fluent:home-12-regular'" 
            class="mr-2 text-xl" 
          />
         Home
        </router-link>

        <!-- Locate Professor -->
        <router-link
          to="/student/locate-professor"
          class="group flex items-center px-4 py-3 text-base font-normal rounded-lg transition-colors leading-none"
          :class="[
            $route.path === '/student/locate-professor'
              ? 'bg-[#cbd5f1]/20 text-white'
              : 'text-gray-400 hover:bg-gray-50 hover:text-[#102A71]'
          ]"
        >
          <iconify-icon 
            :icon="$route.path === '/student/locate-professor' ? 'fluent:location-12-filled' : 'fluent:location-12-regular'" 
            class="mr-2 text-xl" 
          />
          Locate Professor
        </router-link>

        <!-- Notifications -->
        <router-link
          to="/student/notifications"
          class="group flex items-center px-4 py-3 text-base font-normal rounded-lg transition-colors leading-none"
          :class="[
            $route.path === '/student/notifications'
              ? 'bg-[#cbd5f1]/20 text-white'
              : 'text-gray-400 hover:bg-gray-50 hover:text-[#102A71]'
          ]"
        >
          <iconify-icon 
            :icon="$route.path === '/student/notifications' ? 'lucide:bell' : 'lucide:bell'" 
            class="mr-2 text-xl" 
          />
          Notifications
        </router-link>
      </div>
    </nav>

  </div>
</template>

<script setup>
// Pure navigation component
</script>