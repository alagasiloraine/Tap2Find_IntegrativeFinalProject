<template>
  <div class="flex flex-col items-center justify-center h-screen text-center">
    <h1 class="text-4xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
    <p class="text-gray-600 mb-6">You don’t have permission to view this page.</p>
    <router-link to="/auth/login" class="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600">
      Go to Login
    </router-link>
  </div>
</template>
