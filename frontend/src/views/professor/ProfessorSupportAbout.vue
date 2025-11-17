<template>
  <div class="bg-white min-h-screen pb-20 md:pb-8 p-4 md:p-4">
    <div class="px-4 md:px-6 pt-8">
      <div class="mb-4">
        <button @click="goBack" class="inline-flex items-center gap-2 text-sm font-medium text-gray-700 ">
          <iconify-icon icon="ion:chevron-back" class="text-base" />
          <span>Back</span>
        </button>
      </div>
      <h1 class="text-4xl font-semibold text-gray-900">Support & About</h1>
      <p class="text-base text-gray-500 mb-6">Help resources and application information.</p>

      <!-- Help Center / FAQs -->
      <section class="bg-white shadow rounded-xl p-5 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Help Center / FAQs</h2>
        <div class="grid sm:grid-cols-2 gap-4 text-sm">
          <a href="#" class="block border rounded-xl p-4 hover:bg-gray-50">
            <div class="font-medium text-gray-900">Browse Help Articles</div>
            <div class="text-xs text-gray-500">Guides and troubleshooting tips</div>
          </a>
          <a href="#" class="block border rounded-xl p-4 hover:bg-gray-50">
            <div class="font-medium text-gray-900">Frequently Asked Questions</div>
            <div class="text-xs text-gray-500">Find quick answers to common questions</div>
          </a>
          <a href="#" class="block border rounded-xl p-4 hover:bg-gray-50">
            <div class="font-medium text-gray-900">Contact Support</div>
            <div class="text-xs text-gray-500">Email our team or submit a ticket</div>
          </a>
          <a href="#" class="block border rounded-xl p-4 hover:bg-gray-50">
            <div class="font-medium text-gray-900">Community Forum</div>
            <div class="text-xs text-gray-500">Ask questions and share tips</div>
          </a>
        </div>
      </section>

      <!-- Version Info -->
      <section class="bg-white shadow rounded-xl p-5 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Version Info</h2>
        <div class="grid sm:grid-cols-3 gap-4 text-sm">
          <div class="border rounded-xl p-4">
            <div class="text-xs text-gray-500">Current Version</div>
            <div class="text-gray-900 font-medium">v1.0.0</div>
          </div>
          <div class="border rounded-xl p-4">
            <div class="text-xs text-gray-500">Build</div>
            <div class="text-gray-900 font-medium">2025.11.06</div>
          </div>
          <div class="border rounded-xl p-4">
            <div class="text-xs text-gray-500">Environment</div>
            <div class="text-gray-900 font-medium">Production</div>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-sm font-medium text-gray-900 mb-2">Changelog</div>
          <ul class="text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>Initial release of Support & About page</li>
            <li>Settings page improvements and back navigation</li>
          </ul>
        </div>
      </section>

      <!-- Terms & Privacy Policy -->
      <section class="bg-white shadow rounded-xl p-5">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Terms & Privacy Policy</h2>
        <div class="grid sm:grid-cols-2 gap-4 text-sm">
          <a href="#" class="block border rounded-xl p-4 hover:bg-gray-50">
            <div class="font-medium text-gray-900">Terms of Service</div>
            <div class="text-xs text-gray-500">Read the terms for using this application</div>
          </a>
          <a href="#" class="block border rounded-xl p-4 hover:bg-gray-50">
            <div class="font-medium text-gray-900">Privacy Policy</div>
            <div class="text-xs text-gray-500">Understand how your data is handled</div>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => {
  router.back()
}
</script>
