<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-center items-center min-h-screen">
          <div class="w-full lg:w-2/3 text-center">
            <h1 class="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Welcome to Tap2Find 🔥
            </h1>
            <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your ultimate solution for finding and connecting with what matters most. 
              Discover, connect, and thrive with our innovative platform.
            </p>
            <div class="flex justify-center gap-4 flex-wrap">
              <router-link 
                to="/register"
                class="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                🚀 Get Started
              </router-link>
              <router-link 
                to="/about"
                class="border-2 border-gray-600 text-gray-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-600 hover:text-white transition-colors"
              >
                ℹ️ Learn More
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white" id="features">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Why Choose Tap2Find?</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the features that make us different and help you achieve your goals faster.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title" class="text-center p-8 border border-gray-200 rounded-lg">
            <div class="text-6xl mb-6">{{ feature.icon }}</div>
            <h3 class="text-xl font-bold mb-4 text-gray-800">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-blue-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <div class="max-w-2xl mx-auto">
            <h2 class="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Get Started?</h2>
            <p class="text-xl text-white mb-8">
              Join thousands of users who are already using Tap2Find to achieve their goals.
            </p>
            <router-link 
              to="/register"
              class="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              ➡️ Start Your Journey
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
