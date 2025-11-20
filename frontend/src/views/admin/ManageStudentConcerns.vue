<template>
  <div class="admin-dashboard mt-1">
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <!-- Top controls: search, status filter, exports/print -->
      <div class="px-6 py-3 border-b border-gray-100 bg-slate-50 text-sm text-gray-500">
        <div v-if="loading" class="flex items-center justify-between gap-4 animate-pulse">
          <div class="flex items-center gap-3 flex-1 max-w-xl">
            <div class="h-9 flex-1 bg-slate-100 rounded-md"></div>
            <div class="h-9 w-40 bg-slate-100 rounded-md"></div>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-8 w-24 bg-slate-100 rounded-md"></div>
            <div class="h-8 w-24 bg-slate-100 rounded-md"></div>
            <div class="h-8 w-20 bg-slate-100 rounded-md"></div>
          </div>
        </div>
        <div v-else class="flex items-center justify-between gap-4">
          <!-- Left: search + status filter -->
          <div class="flex items-center gap-3 flex-1 max-w-xl">
            <div class="relative flex-1">
              <input
                v-model="query"
                type="text"
                placeholder="Search by student, professor, or message..."
                class="w-full border border-slate-200 rounded-md px-3 py-2 pl-9 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400"
              />
              <span class="absolute inset-y-0 left-0 flex items-center pl-2 text-slate-400">
                <svg
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="6"
                    stroke="currentColor"
                    stroke-width="1.6"
                  />
                  <line
                    x1="15.5"
                    y1="15.5"
                    x2="20"
                    y2="20"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  />
                </svg>
              </span>
            </div>

            <!-- Custom status dropdown (uniform with Manage Users) -->
            <div class="relative">
              <button
                type="button"
                @click="showStatusDropdown = !showStatusDropdown"
                class="min-w-[150px] px-3 py-2 bg-white border border-slate-200 rounded-lg text-left text-sm text-slate-800 flex items-center justify-between shadow-sm focus:outline-none focus:ring-2 focus:ring-[#102A71]/40 focus:border-[#102A71] transition-all duration-200"
                :class="{ 'text-slate-400': !statusFilter }"
              >
                <span>{{ getStatusLabel(statusFilter) }}</span>
                <svg
                  class="w-4 h-4 text-slate-500 transition-transform duration-200"
                  :class="{ 'rotate-180': showStatusDropdown }"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <transition
                enter-active-class="transition-all duration-200 ease-out"
                leave-active-class="transition-all duration-150 ease-in"
                enter-from-class="opacity-0 transform scale-95 -translate-y-1"
                leave-to-class="opacity-0 transform scale-95 -translate-y-1"
              >
                <div
                  v-if="showStatusDropdown"
                  class="absolute right-0 z-50 w-56 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg"
                >
                  <div class="py-1">
                    <button
                      v-for="opt in statusOptions"
                      :key="opt.value || 'all'"
                      type="button"
                      @click="selectStatus(opt.value)"
                      class="w-full px-4 py-2.5 text-left flex flex-col gap-0.5 hover:bg-slate-50 transition-colors duration-150"
                      :class="{ 'bg-slate-50 text-[#001740]': statusFilter === opt.value }"
                    >
                      <span class="text-sm font-medium">{{ opt.label }}</span>
                      <span class="text-xs text-slate-500" v-if="opt.description">{{ opt.description }}</span>
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <!-- Right: export / print actions -->
          <div class="flex items-center gap-2">
            <!-- Export Excel -->
            <button
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium text-white bg-emerald-600 hover:bg-emerald-700"
              @click="exportExcel"
            >
              <svg
                class="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4V15"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7 10L12 15L17 10"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <rect
                  x="5"
                  y="16"
                  width="14"
                  height="4"
                  rx="1"
                  stroke="currentColor"
                  stroke-width="1.4"
                />
              </svg>
              <span>Export Excel</span>
            </button>

            <!-- Export PDF -->
            <button
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium text-white bg-gray-800 hover:bg-gray-900"
              @click="exportPDF"
            >
              <svg
                class="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="6"
                  y="3"
                  width="12"
                  height="18"
                  rx="2"
                  stroke="currentColor"
                  stroke-width="1.6"
                />
                <path
                  d="M9 8H15"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                />
                <path
                  d="M9 11H13"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                />
                <path
                  d="M9 14H12"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                />
              </svg>
              <span>Export PDF</span>
            </button>

            <!-- Print -->
            <button
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium border border-slate-300 text-slate-800 bg-white hover:bg-slate-50"
              @click="printConcerns"
            >
              <svg
                class="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 7V4H16V7"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <rect
                  x="6"
                  y="7"
                  width="12"
                  height="8"
                  rx="2"
                  stroke="currentColor"
                  stroke-width="1.6"
                />
                <path
                  d="M8 15H16V20H8V15Z"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
              </svg>
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tabs + loading indicator row -->
      <div v-if="loading" class="px-6 py-3 border-b border-gray-200 text-sm text-gray-500">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 w-40">
            <div class="h-6 flex-1 bg-slate-100 rounded-full animate-pulse"></div>
            <div class="h-6 flex-1 bg-slate-100 rounded-full animate-pulse"></div>
          </div>
          <div class="h-4 w-16 bg-slate-100 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div v-else class="px-6 py-3 border-b border-gray-200 text-sm text-gray-500">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button
              class="px-2 py-1 rounded-md text-xs font-medium transition-colors border"
              :class="activeTab === 'concerns'
                ? 'bg-[#001740] text-white border-[#001740] shadow-sm'
                : 'bg-white text-[#001740] border-[#cbd5f5] hover:bg-[#E5ECFF]'"
              @click="activeTab = 'concerns'"
            >
              Concerns
            </button>
            <button
              class="px-2 py-1 rounded-md text-xs font-medium transition-colors border"
              :class="activeTab === 'archive'
                ? 'bg-[#F5C400] text-[#001740] border-[#F5C400] shadow-sm'
                : 'bg-white text-[#8b6a00] border-[#fde68a] hover:bg-yellow-50'"
              @click="activeTab = 'archive'"
            >
              Archive
            </button>
          </div>
          <div v-if="loading" class="text-gray-400">Loading...</div>
        </div>
      </div>
      <!-- Skeleton table when loading -->
      <div v-if="loading" class="px-6 py-4 space-y-2 animate-pulse">
        <div class="h-9 bg-slate-100 rounded-lg"></div>
        <div v-for="n in 5" :key="n" class="h-10 bg-slate-100 rounded-lg"></div>
      </div>

      <!-- Real table -->
      <div
        v-else
        id="concerns-table-wrapper"
        class="overflow-x-hidden"
      >
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="w-40 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
              <th class="w-40 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professor Concerned</th>
              <th class="w-56 max-w-[14rem] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concern Message</th>
              <th class="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="w-40 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
              <th class="w-40 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="c in visibleConcerns"
              :key="c._id"
              class="hover:bg-gray-50 cursor-pointer"
              @click="openConcernDetails(c)"
            >
              <td class="w-40 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ displayStudent(c) }}
              </td>
              <td class="w-40 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ displayProfessor(c) }}
              </td>
              <td class="w-56 max-w-[14rem] px-6 py-4 text-sm text-gray-600">
                <div class="truncate" :title="c.message || c.concern || ''">{{ c.message || c.concern || '' }}</div>
              </td>
              <td class="w-32 px-6 py-4 whitespace-nowrap text-sm">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium"
                      :class="badgeClass(c.status)">
                  {{ capitalize(c.status || 'pending') }}
                </span>
              </td>
              <td class="w-40 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(c.createdAt || c.timestamp || c.date) }}
              </td>
              <td class="w-40 px-6 py-4 whitespace-nowrap text-sm text-right space-x-1.5" @click.stop>
                <!-- Mark Resolved from table actions (for non-resolved concerns) -->
                <button
                  v-if="(c.status || 'pending').toLowerCase() !== 'resolved'"
                  type="button"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-emerald-200 text-emerald-700 bg-emerald-50/70 hover:bg-emerald-50 disabled:opacity-60 disabled:cursor-not-allowed text-[10px] font-medium"
                  :disabled="statusLoading && statusLoadingAction === 'resolve'"
                  @click.stop="setConcernStatus(c, 'resolved')"
                >
                  <span v-if="statusLoading && statusLoadingAction === 'resolve'" class="inline-flex items-center gap-1.5">
                    <span class="w-3.5 h-3.5 border-2 border-emerald-500/60 border-t-transparent rounded-full animate-spin"></span>
                  </span>
                  <span v-else class="inline-flex items-center gap-1.5">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span>Mark Resolved</span>
                  </span>
                </button>

                <!-- Mark Pending from table actions (for resolved concerns) -->
                <button
                  v-else-if="(c.status || 'pending').toLowerCase() === 'resolved'"
                  type="button"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-yellow-200 text-yellow-800 bg-yellow-50/70 hover:bg-yellow-50 disabled:opacity-60 disabled:cursor-not-allowed text-[10px] font-medium"
                  :disabled="statusLoading && statusLoadingAction === 'pending'"
                  @click.stop="setConcernStatus(c, 'pending')"
                >
                  <span v-if="statusLoading && statusLoadingAction === 'pending'" class="inline-flex items-center gap-1.5">
                    <span class="w-3.5 h-3.5 border-2 border-yellow-500/60 border-t-transparent rounded-full animate-spin"></span>
                  </span>
                  <span v-else class="inline-flex items-center gap-1.5">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span>Mark Pending</span>
                  </span>
                </button>

                <!-- Delete -->
                <button
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-red-200 text-red-700 bg-red-50/80 hover:bg-red-50 text-[10px] font-medium"
                  @click.stop="confirmDelete(c)"
                >
                  <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 7H19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                    <path d="M10 11V17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                    <path d="M14 11V17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                    <path d="M8 7L9 4H15L16 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                    <rect x="6" y="7" width="12" height="13" rx="2" stroke="currentColor" stroke-width="1.6" />
                  </svg>
                  <span>Delete</span>
                </button>
              </td>
            </tr>
            <tr v-if="visibleConcerns.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500">No concerns found.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div v-if="!loading" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-xs sm:text-sm text-gray-600 bg-gray-50">
        <!-- Bottom-left: showing text -->
        <div class="hidden sm:block text-[11px] text-slate-500">
          Showing
          <span class="font-semibold text-[#001740]">{{ visibleConcerns.length }}</span>
          of
          <span class="font-semibold text-[#001740]">{{ filteredConcerns.length }}</span>
          concerns
        </div>

        <!-- Centered page number bar -->
        <div class="flex-1 flex items-center justify-center">
          <div class="inline-flex items-center gap-1 sm:gap-2">
          <!-- Previous arrow -->
          <button
            class="w-7 h-7 flex items-center justify-center rounded-full border border-[#b9ccff] bg-white text-xs text-[#102A71] hover:bg-[#E5ECFF] disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === 1"
            @click="prevPage"
          >
            ‹
          </button>

          <!-- Page numbers with ellipsis -->
          <button
            v-for="(page, idx) in pageNumbers"
            :key="idx + '-' + page"
            type="button"
            :disabled="page === '...'"
            @click="page !== '...' && (currentPage = page)"
            class="min-w-[2rem] h-7 px-2 flex items-center justify-center rounded-full text-xs font-medium transition-colors"
            :class="[
              page === '...'
                ? 'text-gray-400 cursor-default'
                : (page === currentPage
                    ? 'bg-[#001740] text-white shadow'
                    : 'bg-white text-[#102A71] border border-[#b9ccff] hover:bg-[#E5ECFF]')
            ]"
          >
            {{ page }}
          </button>

          <!-- Next arrow -->
          <button
            class="w-7 h-7 flex items-center justify-center rounded-full border border-[#b9ccff] bg-white text-xs text-[#102A71] hover:bg-[#E5ECFF] disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >
            ›
          </button>
          </div>
        </div>

        <!-- Go to page (right side) -->
        <div class="hidden sm:flex items-center gap-2 ml-4">
          <span class="text-[11px] text-slate-500">Go to page</span>
          <input
            v-model="goToPageInput"
            type="text"
            inputmode="numeric"
            class="w-16 border border-[#cbd5f5] rounded-md px-2 py-1 text-xs text-[#102A71] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#102A71]/40 focus:border-[#102A71]"
            placeholder="1"
            @keyup.enter="goToPage"
          />
        </div>
      </div>
    </div>

    <!-- Concern Details Modal -->
    <div
      v-if="selectedConcern"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
    >
      <div class="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 flex items-center justify-between bg-[#001740]">
          <div>
            <h3 class="text-base font-semibold text-white tracking-tight">Concern Details</h3>
            <p class="text-[11px] text-slate-200/90 mt-0.5">Review the full information about this student's concern.</p>
          </div>
        </div>

        <!-- Body -->
        <div class="px-6 py-5 space-y-5 text-sm text-slate-700 bg-slate-50/60">
          <!-- Top: student & professor -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white rounded-xl border border-slate-100 px-4 py-3 flex flex-col gap-1.5">
              <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Student</p>
              <p class="text-sm font-medium text-slate-900">
                {{ displayStudent(selectedConcern) }}
              </p>
            </div>
            <div class="bg-white rounded-xl border border-slate-100 px-4 py-3 flex flex-col gap-1.5">
              <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Professor Concerned</p>
              <p class="text-sm text-slate-900">
                {{ displayProfessor(selectedConcern) }}
              </p>
            </div>
          </div>

          <!-- Subject -->
          <div class="bg-white rounded-xl border border-slate-100 px-4 py-3">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Subject</p>
            <p class="text-sm text-slate-900">
              {{ selectedConcern.subject || selectedConcern.title || '-' }}
            </p>
          </div>

          <!-- Message -->
          <div class="bg-white rounded-xl border border-slate-100 px-4 py-3">
            <div class="flex items-center justify-between mb-2">
              <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Concern Message</p>
            </div>
            <div
              class="whitespace-pre-line leading-relaxed text-sm text-slate-800 break-words pr-1"
            >
              {{ selectedConcern.message || selectedConcern.concern || '-' }}
            </div>
          </div>

          <!-- Meta: status and date in separate containers, side by side -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Status card -->
            <div class="bg-white rounded-2xl border border-slate-100 px-4 py-3 flex items-center shadow-sm">
              <div class="flex items-center justify-between w-full">
                <span class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Status</span>
                <span
                  class="inline-flex items-center justify-center min-w-[110px] px-3 py-1 rounded-full text-[11px] font-medium border"
                  :class="statusPillClass(selectedConcern.status)"
                >
                  {{ capitalize(selectedConcern.status || 'pending') }}
                </span>
              </div>
            </div>

            <!-- Date card -->
            <div class="bg-white rounded-2xl border border-slate-100 px-4 py-3 flex items-center shadow-sm">
              <div class="flex items-center justify-between w-full">
                <span class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Date Submitted</span>
                <span class="text-sm text-slate-900">
                  {{ formatDate(selectedConcern.createdAt || selectedConcern.timestamp || selectedConcern.date) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gray-50">
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <template v-if="(selectedConcern.status || 'pending').toLowerCase() === 'archived'">
              <button
                type="button"
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-yellow-200 text-yellow-800 bg-yellow-50 hover:bg-yellow-100 disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="statusLoading"
                @click="setConcernStatus(selectedConcern, 'pending')"
              >
                <span v-if="statusLoading && statusLoadingAction === 'pending'" class="inline-flex items-center gap-1.5">
                  <span class="w-3.5 h-3.5 border-2 border-yellow-500/60 border-t-transparent rounded-full animate-spin"></span>
                </span>
                <span v-else class="inline-flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 8V4H9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5 4L10 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M7 14C7.55228 16.2822 9.61232 18 12 18C14.7614 18 17 15.7614 17 13C17 10.2386 14.7614 8 12 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span>Restore to Pending</span>
                </span>
              </button>
            </template>
            <template v-else>
              <template v-if="(selectedConcern.status || 'pending').toLowerCase() === 'resolved'">
                <button
                  type="button"
                  class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-60 disabled:cursor-not-allowed"
                  :disabled="statusLoading"
                  @click="archiveConcern(selectedConcern)"
                >
                  <span v-if="statusLoading && statusLoadingAction === 'archive'" class="inline-flex items-center gap-1.5">
                    <span class="w-3.5 h-3.5 border-2 border-indigo-500/60 border-t-transparent rounded-full animate-spin"></span>
                  </span>
                  <span v-else class="inline-flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.6" />
                      <path d="M7 7L9 3H15L17 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span>Archive</span>
                  </span>
                </button>
              </template>
            </template>
          </div>

          <button
            type="button"
            class="px-3 py-1.5 rounded-md border border-gray-300 text-xs font-medium text-gray-700 hover:bg-white"
            @click="closeConcernDetails"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Toast notification -->
    <transition
      enter-active-class="transition transform duration-200 ease-out"
      leave-active-class="transition transform duration-150 ease-in"
      enter-from-class="opacity-0 translate-y-2 translate-x-2"
      leave-to-class="opacity-0 translate-y-2 translate-x-2"
    >
      <div
        v-if="toast.visible"
        class="fixed bottom-4 right-4 z-50 max-w-xs bg-white/95 backdrop-blur-sm border border-emerald-200 shadow-xl rounded-xl px-4 pt-3 pb-2 text-sm text-emerald-900"
      >
        <div class="flex items-start gap-3">
          <div class="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold">
            ✓
          </div>
          <div class="flex-1">
            <div class="text-xs font-semibold uppercase tracking-wide text-emerald-700">Success</div>
            <div class="text-[13px] leading-snug mt-0.5">
              {{ toast.message }}
            </div>
          </div>
        </div>
        <div class="mt-2 h-0.5 w-full bg-emerald-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-emerald-500 transition-all duration-[3000ms]"
            :style="{ width: toast.progress + '%' }"
          ></div>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation -->
    <div
      v-if="deleteTarget"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-red-100">
        <div class="px-6 py-4 flex items-center gap-3 bg-red-50 border-b border-red-100">
          <div class="flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 border border-red-100 text-sm font-semibold">
            !
          </div>
          <div>
            <h3 class="text-sm font-semibold text-red-800">Delete concern</h3>
            <p class="text-xs text-red-600 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <div class="px-6 py-4 text-sm text-slate-700">
          Are you sure you want to delete this concern?
        </div>
        <div class="px-6 py-4 flex items-center justify-end gap-3 bg-slate-50 border-t border-slate-100">
          <button
            class="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-white"
            @click="deleteTarget = null"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            @click="performDelete"
            :disabled="deleteLoading"
          >
            <span
              v-if="deleteLoading"
              class="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin"
            ></span>
            <span>{{ deleteLoading ? 'Deleting…' : 'Delete concern' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/utils/api.js";
import * as XLSX from "xlsx";

export default {
  name: "ManageStudentConcerns",
  data() {
    return {
      concerns: [],
      loading: false,
      query: "",
      statusFilter: "",
      showStatusDropdown: false,
      statusOptions: [
        { value: "", label: "All status", description: "Show all concerns" },
        { value: "pending", label: "Pending", description: "Concerns waiting for action" },
        { value: "resolved", label: "Resolved", description: "Concerns already addressed" },
      ],
      activeTab: 'concerns',
      selectedConcern: null,
      deleteTarget: null,
      deleteLoading: false,
      currentPage: 1,
      pageSize: 5,
      goToPageInput: "",
      statusLoading: false,
      statusLoadingAction: "",
      toast: {
        visible: false,
        message: "",
        progress: 0,
      },
      pollInterval: null, // Added for polling
    };
  },
  filters: {
    capitalize(v) {
      if (!v) return "";
      const s = String(v);
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
  },
  computed: {
    filteredConcerns() {
      const q = this.query.trim().toLowerCase();
      let list = this.concerns.filter((c) => {
        const student = this.displayStudent(c).toLowerCase();
        const prof = this.displayProfessor(c).toLowerCase();
        const msg = (c.message || c.concern || "").toLowerCase();
        const matchesText = student.includes(q) || prof.includes(q) || msg.includes(q);
        const status = (c.status || "").toLowerCase();
        const inTab = this.activeTab === 'archive' ? status === 'archived' : status !== 'archived';
        const matchesStatus = this.statusFilter ? status === this.statusFilter : true;
        return matchesText && matchesStatus && inTab;
      });
      return list;
    },
    visibleConcerns() {
      // Paginated slice of filtered concerns
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredConcerns.slice(start, end);
    },
    totalPages() {
      if (this.filteredConcerns.length === 0) return 1;
      return Math.ceil(this.filteredConcerns.length / this.pageSize);
    },
    pageNumbers() {
      const pages = [];
      const total = this.totalPages;
      const current = this.currentPage;

      if (total <= 5) {
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
      }

      // Always include first and last pages, and keep current near the middle
      if (current <= 3) {
        pages.push(1, 2, 3, 4, '...', total);
      } else if (current >= total - 2) {
        pages.push(1, '...', total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total);
      }

      return pages;
    },
  },
  mounted() {
    this.fetchConcerns();
    // Start polling after initial load
    this.startPolling();
  },
  beforeDestroy() {
    // Clean up polling interval when component is destroyed
    this.stopPolling();
  },
  methods: {
    // ==============================
    // 🔹 Polling Functions (NEW)
    // ==============================
    startPolling() {
      // Clear any existing interval
      if (this.pollInterval) {
        clearInterval(this.pollInterval);
      }
      
      // Start new polling interval (2000ms = 2 seconds)
      this.pollInterval = setInterval(() => {
        this.fetchConcerns();
      }, 2000);
      console.log('🔄 Started polling concerns every 2 seconds');
    },

    stopPolling() {
      if (this.pollInterval) {
        clearInterval(this.pollInterval);
        this.pollInterval = null;
        console.log('🛑 Stopped polling concerns');
      }
    },

    openConcernDetails(c) {
      this.selectedConcern = c;
    },
    closeConcernDetails() {
      this.selectedConcern = null;
    },
    getStatusLabel(value) {
      const found = this.statusOptions.find((o) => o.value === value);
      return found ? found.label : "All status";
    },
    selectStatus(value) {
      this.statusFilter = value;
      this.showStatusDropdown = false;
      this.currentPage = 1;
    },
    capitalize(v) {
      if (!v) return "";
      const s = String(v);
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    showSuccessToast(message) {
      this.toast.message = message;
      this.toast.progress = 0;
      this.toast.visible = true;

      setTimeout(() => {
        this.toast.progress = 100;
      }, 10);

      setTimeout(() => {
        this.toast.visible = false;
        this.toast.progress = 0;
      }, 3000);
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },
    goToPage() {
      const raw = String(this.goToPageInput || '').trim();
      const num = Number(raw);
      if (!num || isNaN(num)) return;
      if (num < 1) {
        this.currentPage = 1;
      } else if (num > this.totalPages) {
        this.currentPage = this.totalPages;
      } else {
        this.currentPage = num;
      }
      // keep the value in sync with the actual page
      this.goToPageInput = String(this.currentPage);
    },
    async fetchConcerns() {
      try {
        const res = await api.get("/admin/concerns");
        this.concerns = res.data.concerns || [];
        console.log('🔄 Polled concerns:', this.concerns.length);
      } catch (e) {
        console.error("Failed to fetch concerns", e);
      }
    },
    displayStudent(c) {
      // Try common fields; fallback to names nested under user if present
      return (
        (c.studentName) ||
        (c.student && ((c.student.firstName || "") + " " + (c.student.lastName || ""))) ||
        ((c.firstName || "") + " " + (c.lastName || "")) ||
        "-"
      ).trim();
    },
    displayProfessor(c) {
      return (
        c.professorName ||
        (c.professor && ((c.professor.firstName || "") + " " + (c.professor.lastName || ""))) ||
        c.professor ||
        c.faculty ||
        "-"
      ).toString().trim();
    },
    formatDate(d) {
      if (!d) return "-";
      const date = new Date(d);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleString();
    },
    badgeClass(status) {
      const s = (status || "pending").toLowerCase();
      if (s === "resolved") return "bg-green-100 text-green-800";
      if (s === "archived") return "bg-gray-100 text-gray-800";
      return "bg-yellow-100 text-yellow-800"; // pending
    },
    statusPillClass(status) {
      const s = (status || "pending").toLowerCase();
      if (s === "resolved") {
        return "border-emerald-300 bg-emerald-50 text-emerald-800";
      }
      if (s === "archived") {
        return "border-slate-300 bg-slate-50 text-slate-700";
      }
      // pending
      return "border-amber-300 bg-amber-50 text-amber-800";
    },
    confirmDelete(c) {
      this.deleteTarget = c;
    },
    async performDelete() {
      try {
        if (!this.deleteTarget) return;
        const id = this.deleteTarget._id;
        this.deleteLoading = true;
        // In Concerns tab: soft-delete by archiving. In Archive tab: hard delete
        if (this.activeTab === 'archive') {
          await api.delete(`/admin/concerns/${id}`);
          this.showSuccessToast('Concern permanently deleted');
        } else {
          await api.patch(`/admin/concerns/${id}/archive`);
          this.showSuccessToast('Concern moved to archive');
        }
        this.deleteTarget = null;
        await this.fetchConcerns();
      } catch (e) {
        console.error("Failed to delete/archive concern", e);
        alert(e?.response?.data?.message || "Failed to delete/archive concern");
      } finally {
        this.deleteLoading = false;
      }
    },
    async setConcernStatus(c, nextStatus) {
      try {
        const current = (c.status || '').toLowerCase();
        this.statusLoading = true;
        this.statusLoadingAction = nextStatus === 'resolved'
          ? 'resolve'
          : 'pending';

        await api.patch(`/admin/concerns/${c._id}/status`, { status: nextStatus });
        await this.fetchConcerns();

        let msg = '';
        if (nextStatus === 'resolved') {
          msg = 'Concern marked as resolved';
        } else if (nextStatus === 'pending') {
          msg = current === 'archived'
            ? 'Concern restored to pending'
            : 'Concern marked as pending';
        }
        if (msg) this.showSuccessToast(msg);

        // Close modal after successful update
        if (this.selectedConcern) {
          this.closeConcernDetails();
        }
      } catch (e) {
        console.error("Failed to update status", e);
        alert(e?.response?.data?.message || "Failed to update status");
      } finally {
        this.statusLoading = false;
        this.statusLoadingAction = "";
      }
    },
    async archiveConcern(c) {
      try {
        this.statusLoading = true;
        this.statusLoadingAction = 'archive';
        await api.patch(`/admin/concerns/${c._id}/archive`);
        await this.fetchConcerns();
        this.showSuccessToast('Concern archived');

        // Close modal after archiving
        if (this.selectedConcern) {
          this.closeConcernDetails();
        }
      } catch (e) {
        console.error("Failed to archive concern", e);
        alert(e?.response?.data?.message || "Failed to archive concern");
      } finally {
        this.statusLoading = false;
        this.statusLoadingAction = "";
      }
    },
    exportCSV() {
      const headers = [
        "Student Name",
        "Professor Concerned",
        "Concern Message",
        "Status",
        "Date Submitted",
      ];
      const rows = this.filteredConcerns.map((c) => [
        this.displayStudent(c),
        this.displayProfessor(c),
        (c.message || c.concern || "").replace(/\n/g, " ").replace(/\r/g, " "),
        (c.status || "pending"),
        this.formatDate(c.createdAt || c.timestamp || c.date),
      ]);
      const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `student_concerns_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
    exportExcel() {
      const data = [
        ["Student Name","Professor Concerned","Concern Message","Status","Date Submitted"],
        ...this.filteredConcerns.map((c) => [
          this.displayStudent(c),
          this.displayProfessor(c),
          (c.message || c.concern || "").replace(/\r?\n/g, " "),
          this.capitalize(c.status || "pending"),
          this.formatDate(c.createdAt || c.timestamp || c.date),
        ]),
      ];
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, "Student Concerns");
      const filename = `student_concerns_${new Date().toISOString().slice(0,10)}.xlsx`;
      XLSX.writeFile(wb, filename);
    },
    printConcerns() {
      // Build a full table from ALL filtered concerns (ignore pagination)
      const rows = this.filteredConcerns
        .map((c) => {
          const student = this.displayStudent(c);
          const professor = this.displayProfessor(c);
          const message = (c.message || c.concern || '').replace(/\r?\n/g, ' ');
          const status = this.capitalize(c.status || 'pending');
          const date = this.formatDate(c.createdAt || c.timestamp || c.date);
          return `<tr>
            <td>${student}</td>
            <td>${professor}</td>
            <td>${message}</td>
            <td>${status}</td>
            <td>${date}</td>
          </tr>`;
        })
        .join('');

      const html = `<!DOCTYPE html>
        <html>
          <head>
            <title>Student Concerns</title>
            <style>
              body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;font-size:13px;color:#111827;padding:16px;}
              h1{font-size:18px;margin-bottom:12px;}
              table{width:100%;border-collapse:collapse;margin-top:8px;}
              th,td{border:1px solid #e5e7eb;padding:6px 10px;text-align:left;vertical-align:top;}
              th{background:#f9fafb;font-size:11px;text-transform:uppercase;letter-spacing:0.04em;color:#6b7280;}
            </style>
          </head>
          <body>
            <h1>Student Concerns</h1>
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Professor Concerned</th>
                  <th>Concern Message</th>
                  <th>Status</th>
                  <th>Date Submitted</th>
                </tr>
              </thead>
              <tbody>
                ${rows || '<tr><td colspan="5">No concerns found.</td></tr>'}
              </tbody>
            </table>
          </body>
        </html>`;

      const w = window.open('', '', 'height=800,width=1000');
      if (!w) return;
      w.document.write(html);
      w.document.close();
      w.focus();
      w.print();
      w.close();
    },
    exportPDF() {
      // Use the same all-concerns table as printConcerns so PDF is not limited by pagination
      const rows = this.filteredConcerns
        .map((c) => {
          const student = this.displayStudent(c);
          const professor = this.displayProfessor(c);
          const message = (c.message || c.concern || '').replace(/\r?\n/g, ' ');
          const status = this.capitalize(c.status || 'pending');
          const date = this.formatDate(c.createdAt || c.timestamp || c.date);
          return `<tr>
            <td>${student}</td>
            <td>${professor}</td>
            <td>${message}</td>
            <td>${status}</td>
            <td>${date}</td>
          </tr>`;
        })
        .join('');

      const html = `<!DOCTYPE html>
        <html>
          <head>
            <title>Student Concerns</title>
            <style>
              body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;font-size:13px;color:#111827;padding:16px;}
              h1{font-size:18px;margin-bottom:12px;}
              table{width:100%;border-collapse:collapse;margin-top:8px;}
              th,td{border:1px solid #e5e7eb;padding:6px 10px;text-align:left;vertical-align:top;}
              th{background:#f9fafb;font-size:11px;text-transform:uppercase;letter-spacing:0.04em;color:#6b7280;}
            </style>
          </head>
          <body>
            <h1>Student Concerns</h1>
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Professor Concerned</th>
                  <th>Concern Message</th>
                  <th>Status</th>
                  <th>Date Submitted</th>
                </tr>
              </thead>
              <tbody>
                ${rows || '<tr><td colspan="5">No concerns found.</td></tr>'}
              </tbody>
            </table>
          </body>
        </html>`;

      const w = window.open('', '', 'height=800,width=1000');
      if (!w) return;
      w.document.write(html);
      w.document.close();
      w.focus();
      w.print();
      w.close();
    }
  },
};
</script>