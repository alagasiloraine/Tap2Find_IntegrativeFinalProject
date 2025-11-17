<template>
  <div class="bg-white min-h-screen">
    <!-- Header (nav already overlays) -->
    <section class="bg-[#001740] text-white min-h-[40vh] flex items-center">
      <div class="mx-auto max-w-screen-xl 2xl:max-w-screen-2xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl sm:text-5xl font-extrabold">Get in Touch with Tap2Find</h1>
        <p class="mt-2 text-white/80 text-base sm:text-lg">We’re here to answer your questions and listen to feedback</p>
      </div>
    </section>

    <!-- Card -->
    <section class="relative">
      <div class="mx-auto max-w-screen-xl 2xl:max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div class="-mt-14 sm:-mt-16 rounded-xl border border-gray-300 bg-white shadow-md overflow-hidden">
          <div class="grid gap-8 sm:gap-10 lg:gap-12 lg:grid-cols-2 p-6 sm:p-8 lg:p-10">
            <!-- Left: Contact Info -->
            <div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900">Contact Information</h2>
              <p class="mt-2 text-gray-600 max-w-prose">Our team is here to help you with technical issues, feature requests, or general system inquiries.</p>

              <ul class="mt-6 space-y-4">
                <li class="flex items-start gap-4">
                  <span class="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"/></svg>
                  </span>
                  <div>
                    <div class="font-semibold text-gray-900">Address</div>
                    <div class="text-gray-600">College of Computer Studies – Mindoro State University</div>
                  </div>
                </li>
                <li class="flex items-start gap-4">
                  <span class="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  </span>
                  <div>
                    <div class="font-semibold text-gray-900">Email us</div>
                    <div class="text-gray-600">tap2findccs@gmail.com</div>
                  </div>
                </li>
                <li class="flex items-start gap-4">
                  <span class="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.2 2.4 3.2 4.4 5.6 5.6l1.9-1.9c.3-.3.8-.4 1.2-.3 1 .3 2 .5 3.1.5.7 0 1.3.6 1.3 1.3V20c0 .7-.6 1.3-1.3 1.3C9.5 21.3 2.7 14.5 2.7 6.3 2.7 5.6 3.3 5 4 5h3c.7 0 1.3.6 1.3 1.3 0 1 .2 2.1.5 3.1.1.4 0 .9-.3 1.2l-1.9 2.2z"/></svg>
                  </span>
                  <div>
                    <div class="font-semibold text-gray-900">Contact us</div>
                    <div class="text-gray-600">+63 995 2225 880</div>
                  </div>
                </li>
                <li class="flex items-start gap-4">
                  <span class="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2a1 1 0 0 0-1 1v2h2V4h10v1h2V3a1 1 0 0 0-1-1H6zm13 6H5a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a1 1 0 0 0-1-1zm-1 11H6v-9h12v9z"/></svg>
                  </span>
                  <div>
                    <div class="font-semibold text-gray-900">Office Hours</div>
                    <div class="text-gray-600">Monday–Friday | 8:00 AM–5:00 PM</div>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Right: Form -->
            <div class="bg-gray-50 rounded-xl p-5 sm:p-6">
              <h3 class="text-2xl font-extrabold text-gray-900">Send us a message</h3>
              <form class="mt-4 space-y-4">
                <div class="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#001740]" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#001740]" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Subject</label>
                  <input type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#001740]" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Message</label>
                  <textarea rows="5" class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#001740]"></textarea>
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-xs text-gray-500">Our team gets back to you within 24–48 hours.</p>
                  <button type="button" class="inline-flex items-center rounded-full bg-[#F5C400] hover:bg-[#e0b100] text-[#001740] font-semibold px-6 py-3 shadow">Send message</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
