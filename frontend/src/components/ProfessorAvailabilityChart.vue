<template>
  <div class="w-full h-full flex flex-col items-center p-2">
    <div class="flex flex-col items-center w-full p-2 sm:p-4 text-white relative">
      <h2 class="text-base font-semibold">Professor Availability</h2>
      <span class="text-xs font-medium text-white/80 mb-8">Today</span>
      <div class="flex items-end flex-grow w-full mt-2 space-x-1 sm:space-x-2">
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">22 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>12 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>4 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>6 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-6 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-4 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-12 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">8 AM</span>
        </div>
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">28 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>16 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>4 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>8 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-8 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-4 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-16 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">9 AM</span>
        </div>
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">30 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>16 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>6 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>8 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-8 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-6 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-16 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">10 AM</span>
        </div>
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">32 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>20 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>4 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>8 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-8 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-4 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-20 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">11 AM</span>
        </div>
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">40 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>24 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>6 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>10 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-10 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-6 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-24 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">12 PM</span>
        </div>
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">34 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>16 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>8 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>10 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-10 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-8 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-16 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">1 PM</span>
        </div>
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">30 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>16 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>6 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>8 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-8 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-6 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-16 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">2 PM</span>
        </div>
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">28 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>16 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>6 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>6 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-6 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-6 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-16 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">3 PM</span>
        </div>
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">22 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>12 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>4 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>6 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-6 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-4 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-12 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">4 PM</span>
        </div>
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">18 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>10 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>4 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>4 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-4 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-4 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-10 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">5 PM</span>
        </div>
        <div class="relative flex flex-col items-center flex-grow pb-5 group">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-44 rounded-lg bg-indigo-900 text-white shadow-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div class="text-sm font-semibold">20 PROFESSOR</div>
            <div class="mt-1 space-y-1 text-xs">
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-400"></span><span>12 Available</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-300"></span><span>4 Busy</span></div>
              <div class="flex items-center gap-2"><span class="inline-block h-3 w-3 rounded-sm bg-indigo-200"></span><span>4 Not Available</span></div>
            </div>
          </div>
          <div class="relative flex justify-center w-full h-4 bg-indigo-200" title="Not Available"></div>
          <div class="relative flex justify-center w-full h-4 bg-indigo-300" title="Busy"></div>
          <div class="relative flex justify-center w-full h-12 bg-indigo-400" title="Available"></div>
          <span class="absolute bottom-0 text-[10px] font-semibold">6 PM</span>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
// Design-only static chart markup
</script>

<style scoped>
.group:hover .group-hover\:block {
  display: block;
}
</style>