<template>
  <div class="admin-dashboard mt-1">
    <!-- Filters -->
    <div class="bg-white shadow-sm rounded-xl border border-slate-200 mb-6">
      <template v-if="generating">
        <div class="px-5 pt-4 pb-3 border-b border-slate-100 animate-pulse">
          <div class="h-3 w-72 bg-slate-100 rounded"></div>
        </div>
        <div class="px-5 pb-4 pt-3 space-y-3 animate-pulse">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="flex flex-col gap-1">
              <div class="h-3 w-10 bg-slate-100 rounded"></div>
              <div class="h-9 w-full bg-slate-100 rounded-lg"></div>
            </div>
            <div class="flex flex-col gap-1">
              <div class="h-3 w-6 bg-slate-100 rounded"></div>
              <div class="h-9 w-full bg-slate-100 rounded-lg"></div>
            </div>
            <div class="flex flex-col gap-1">
              <div class="h-3 w-16 bg-slate-100 rounded"></div>
              <div class="h-9 w-full bg-slate-100 rounded-lg"></div>
            </div>
            <div class="flex flex-col gap-1">
              <div class="h-3 w-20 bg-slate-100 rounded"></div>
              <div class="h-9 w-full bg-slate-100 rounded-lg"></div>
            </div>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-2 mt-2">
            <div class="flex items-center gap-2">
              <div class="h-8 w-20 bg-slate-100 rounded-md"></div>
              <div class="h-8 w-16 bg-slate-100 rounded-md"></div>
            </div>
            <div class="flex items-center gap-2">
              <div class="h-8 w-24 bg-slate-100 rounded-md"></div>
              <div class="h-8 w-28 bg-slate-100 rounded-md"></div>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
      <div class="px-5 pt-4 pb-3 border-b border-slate-100">
        <p class="text-[11px] text-slate-400">Refine the date range and professor to preview and export reports.</p>
      </div>
      <div class="px-5 pb-4 pt-3 space-y-3">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">From</label>
            <input
              type="date"
              v-model="filters.from"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#001740]/30 focus:border-[#001740]"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">To</label>
            <input
              type="date"
              v-model="filters.to"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#001740]/30 focus:border-[#001740]"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Professor</label>
            <div class="relative">
              <button
                type="button"
                @click="showProfessorDropdown = !showProfessorDropdown"
                class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-left text-sm text-slate-800 flex items-center justify-between shadow-sm focus:outline-none focus:ring-2 focus:ring-[#001740]/30 focus:border-[#001740]"
                :class="{ 'text-slate-400': !filters.professorId }"
              >
                <span class="truncate">{{ professorFilterLabel }}</span>
                <svg
                  class="w-4 h-4 text-slate-500 transition-transform duration-200"
                  :class="{ 'rotate-180': showProfessorDropdown }"
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
                  v-if="showProfessorDropdown"
                  class="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg"
                >
                  <div class="py-1 max-h-60 overflow-y-auto">
                    <button
                      type="button"
                      class="w-full px-4 py-2.5 text-left flex flex-col gap-0.5 hover:bg-slate-50 transition-colors duration-150"
                      :class="{ 'bg-slate-50 text-[#001740]': !filters.professorId }"
                      @click="selectProfessor('')"
                    >
                      <span class="text-sm font-medium">All Professors</span>
                      <span class="text-xs text-slate-500">Show concerns for any professor</span>
                    </button>
                    <button
                      v-for="p in professors"
                      :key="p._id"
                      type="button"
                      class="w-full px-4 py-2.5 text-left flex flex-col gap-0.5 hover:bg-slate-50 transition-colors duration-150"
                      :class="{ 'bg-slate-50 text-[#001740]': filters.professorId === p._id }"
                      @click="selectProfessor(p._id)"
                    >
                      <span class="text-sm font-medium">{{ (p.firstName||'') + ' ' + (p.lastName||'') }}</span>
                      <span class="text-xs text-slate-500" v-if="p.emailAddress">{{ p.emailAddress }}</span>
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Concern Type</label>
            <div class="relative">
              <button
                type="button"
                @click="showConcernTypeDropdown = !showConcernTypeDropdown"
                class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-left text-sm text-slate-800 flex items-center justify-between shadow-sm focus:outline-none focus:ring-2 focus:ring-[#001740]/30 focus:border-[#001740]"
                :class="{ 'text-slate-400': !filters.concernType }"
              >
                <span class="truncate">{{ concernTypeFilterLabel }}</span>
                <svg
                  class="w-4 h-4 text-slate-500 transition-transform duration-200"
                  :class="{ 'rotate-180': showConcernTypeDropdown }"
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
                  v-if="showConcernTypeDropdown"
                  class="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg"
                >
                  <div class="py-1 max-h-60 overflow-y-auto">
                    <button
                      type="button"
                      class="w-full px-4 py-2.5 text-left flex flex-col gap-0.5 hover:bg-slate-50 transition-colors duration-150"
                      :class="{ 'bg-slate-50 text-[#001740]': !filters.concernType }"
                      @click="selectConcernType('')"
                    >
                      <span class="text-sm font-medium">All Types</span>
                      <span class="text-xs text-slate-500">Show all concern types</span>
                    </button>
                    <button
                      v-for="t in concernTypes"
                      :key="t"
                      type="button"
                      class="w-full px-4 py-2.5 text-left flex flex-col gap-0.5 hover:bg-slate-50 transition-colors duration-150"
                      :class="{ 'bg-slate-50 text-[#001740]': filters.concernType === t }"
                      @click="selectConcernType(t)"
                    >
                      <span class="text-sm font-medium">{{ t }}</span>
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <button
              class="inline-flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium text-white bg-[#001740] hover:bg-[#102A71] shadow-sm"
              @click="generateReports"
            >
              Generate
            </button>
            <button
              class="inline-flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium text-[#001740] border border-slate-200 bg-white hover:bg-slate-50"
              @click="resetFilters"
            >
              Reset
            </button>
          </div>
          <div class="flex items-center gap-2">
            <button class="px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 text-xs" @click="exportAllExcel">
              Export Excel
            </button>
            <button class="px-3 py-1.5 rounded-md bg-gray-800 text-white hover:bg-gray-900 text-xs" @click="printPDF">
              Download PDF
            </button>
          </div>
        </div>
      </div>
      </template>
    </div>

    <!-- Preview -->
    <div id="report-preview" class="space-y-6">
      <!-- Skeleton for entire report preview -->
      <div v-if="generating" class="space-y-6 animate-pulse">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div class="h-4 w-48 bg-slate-100 rounded"></div>
            <div class="h-3 w-32 bg-slate-100 rounded"></div>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="h-10 rounded-full bg-slate-100"></div>
              <div class="h-10 rounded-full bg-slate-100"></div>
              <div class="h-10 rounded-full bg-slate-100"></div>
            </div>
            <div class="border border-gray-200 rounded-xl overflow-hidden">
              <div class="bg-gray-50 h-9"></div>
              <div class="space-y-2 p-4">
                <div v-for="n in 5" :key="'avail-' + n" class="h-8 bg-slate-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div class="h-4 w-56 bg-slate-100 rounded"></div>
            <div class="h-3 w-40 bg-slate-100 rounded"></div>
          </div>
          <div class="p-6 space-y-3">
            <div class="h-4 w-3/4 bg-slate-100 rounded"></div>
            <div class="h-3 w-1/2 bg-slate-100 rounded"></div>
            <div class="mt-4 border border-gray-200 rounded-xl overflow-hidden">
              <div class="bg-gray-50 h-9"></div>
              <div class="space-y-2 p-4">
                <div v-for="n in 4" :key="'att-' + n" class="h-8 bg-slate-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div class="h-4 w-64 bg-slate-100 rounded"></div>
            <div class="flex items-center gap-2">
              <div class="h-7 w-20 bg-slate-100 rounded"></div>
              <div class="h-7 w-16 bg-slate-100 rounded"></div>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div class="border border-gray-200 rounded-xl overflow-hidden">
              <div class="bg-gray-50 h-9"></div>
              <div class="space-y-2 p-4">
                <div v-for="n in 6" :key="'conc-' + n" class="h-8 bg-slate-100 rounded"></div>
              </div>
            </div>
            <div class="mt-2 px-2 py-3 border-t border-gray-200 flex items-center justify-between text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-b-lg">
              <div class="hidden sm:block h-3 w-40 bg-slate-100 rounded"></div>
              <div class="flex-1 flex items-center justify-center">
                <div class="inline-flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-slate-100"></div>
                  <div class="w-7 h-7 rounded-full bg-slate-100"></div>
                  <div class="w-7 h-7 rounded-full bg-slate-100"></div>
                </div>
              </div>
              <div class="hidden sm:flex items-center gap-2 ml-4">
                <div class="h-3 w-20 bg-slate-100 rounded"></div>
                <div class="h-7 w-16 bg-slate-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template v-else>
      <!-- Availability Statistics (moved first) -->
      <div id="availability-section" class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-sm font-semibold tracking-[0.18em] text-[#001740] uppercase">AVAILABILITY STATISTICS</h2>
          <span class="text-xs text-gray-500">Source: Dashboard Availability</span>
        </div>
        <div class="p-6 space-y-5">
          <!-- Skeleton while generating -->
          <div v-if="generating" class="space-y-5 animate-pulse">
            <!-- Skeleton summary tiles -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div class="rounded-full bg-slate-100 h-10"></div>
              <div class="rounded-full bg-slate-100 h-10"></div>
              <div class="rounded-full bg-slate-100 h-10"></div>
            </div>

            <!-- Skeleton table -->
            <div class="border border-gray-200 rounded-xl overflow-hidden">
              <div class="bg-gray-50 h-9"></div>
              <div class="space-y-2 p-4">
                <div v-for="n in 5" :key="n" class="h-8 bg-slate-100 rounded"></div>
              </div>
            </div>

            <!-- Skeleton pagination -->
            <div class="mt-4 px-2 py-3 border-t border-gray-200 flex items-center justify-between text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-b-lg">
              <div class="flex-1 flex items-center justify-center">
                <div class="inline-flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-slate-100"></div>
                  <div class="w-7 h-7 rounded-full bg-slate-100"></div>
                  <div class="w-7 h-7 rounded-full bg-slate-100"></div>
                </div>
              </div>
              <div class="hidden sm:flex items-center gap-2 ml-4">
                <div class="h-6 w-24 bg-slate-100 rounded"></div>
              </div>
            </div>
          </div>

          <!-- Real content when not generating -->
          <div v-else class="space-y-5">
            <!-- Top summary tiles -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div class="rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 flex items-center justify-between">
                <div class="text-sm font-medium text-emerald-800">Available</div>
                <div class="text-sm font-semibold text-emerald-900">
                  {{ availability.available }} ({{ availabilityPercent('available') }}%)
                </div>
              </div>
              <div class="rounded-full border border-amber-200 bg-amber-50 px-5 py-3 flex items-center justify-between">
                <div class="text-sm font-medium text-amber-800">Busy</div>
                <div class="text-sm font-semibold text-amber-900">
                  {{ availability.busy }} ({{ availabilityPercent('busy') }}%)
                </div>
              </div>
              <div class="rounded-full border border-red-200 bg-red-50 px-5 py-3 flex items-center justify-between">
                <div class="text-sm font-medium text-red-800">Not Available</div>
                <div class="text-sm font-semibold text-red-900">
                  {{ availability.notAvailable }} ({{ availabilityPercent('notAvailable') }}%)
                </div>
              </div>
            </div>

            <!-- Detailed list -->
            <div class="border border-gray-200 rounded-xl overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professor</th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="p in availabilityVisible" :key="p.id">
                      <td class="px-6 py-3 text-sm text-gray-900">{{ p.name }}</td>
                      <td class="px-6 py-3 text-sm text-right">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              :class="availabilityBadge(p.status)">
                          {{ p.status }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="professorsWithStatus.length === 0">
                      <td colspan="2" class="px-6 py-6 text-center text-sm text-gray-500">No professors found.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="mt-4 px-2 py-3 border-t border-gray-200 flex items-center justify-between text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-b-lg">
              <div class="flex-1 flex items-center justify-center">
                <div class="inline-flex items-center gap-1 sm:gap-2">
                  <button
                    class="w-7 h-7 flex items-center justify-center rounded-full border border-[#b9ccff] bg-white text-xs text-[#102A71] hover:bg-[#E5ECFF] disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="availabilityCurrentPage === 1"
                    @click="availabilityPrevPage"
                  >
                    ‹
                  </button>

                  <button
                    v-for="(page, idx) in availabilityPageNumbers"
                    :key="idx + '-' + page"
                    type="button"
                    :disabled="page === '...'"
                    @click="page !== '...' && (availabilityCurrentPage = page)"
                    class="min-w-[2rem] h-7 px-2 flex items-center justify-center rounded-full text-xs font-medium transition-colors"
                    :class="[
                      page === '...'
                        ? 'text-gray-400 cursor-default'
                        : (page === availabilityCurrentPage
                            ? 'bg-[#001740] text-white shadow'
                            : 'bg-white text-[#102A71] border border-[#b9ccff] hover:bg-[#E5ECFF]')
                    ]"
                  >
                    {{ page }}
                  </button>

                  <button
                    class="w-7 h-7 flex items-center justify-center rounded-full border border-[#b9ccff] bg-white text-xs text-[#102A71] hover:bg-[#E5ECFF] disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="availabilityCurrentPage === availabilityTotalPages"
                    @click="availabilityNextPage"
                  >
                    ›
                  </button>
                </div>
              </div>

              <div class="hidden sm:flex items-center gap-2 ml-4">
                <span class="text-[11px] text-slate-500">Go to page</span>
                <input
                  v-model="availabilityGoToPageInput"
                  type="text"
                  inputmode="numeric"
                  class="w-16 border border-[#cbd5f5] rounded-md px-2 py-1 text-xs text-[#102A71] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#102A71]/40 focus:border-[#102A71]"
                  placeholder="1"
                  @keyup.enter="availabilityGoToPage"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Professor Attendance Logs (placeholder) -->
      <div id="attendance-section" class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-sm font-semibold tracking-[0.18em] text-[#001740] uppercase">PROFESSOR ATTENDANCE LOGS</h2>
          <span class="text-xs text-gray-500">Source: RFID data (endpoint pending)</span>
        </div>
        <div class="p-6 text-sm text-gray-600">
          <p class="mb-2">This section will display RFID-based professor tap-in/tap-out logs filtered by date range and professor.</p>
          <p class="text-gray-500">Backend endpoint is not implemented yet. Showing placeholder rows.</p>
          <div class="overflow-x-auto mt-4">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professor</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RFID ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(row, idx) in attendancePlaceholder" :key="idx">
                  <td class="px-6 py-3 text-sm text-gray-900">{{ row.time }}</td>
                  <td class="px-6 py-3 text-sm text-gray-500">{{ row.professor }}</td>
                  <td class="px-6 py-3 text-sm text-gray-500">{{ row.rfidId }}</td>
                  <td class="px-6 py-3 text-sm text-gray-500">{{ row.action }}</td>
                </tr>
                <tr v-if="attendancePlaceholder.length === 0">
                  <td colspan="4" class="px-6 py-6 text-center text-sm text-gray-500">No data.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Student Concerns Summary -->
      <div id="concerns-summary-section" class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-sm font-semibold tracking-[0.18em] text-[#001740] uppercase">STUDENT CONCERNS SUMMARY</h2>
          <div class="flex items-center gap-2">
            <button class="px-3 py-1.5 rounded bg-gray-800 text-white hover:bg-gray-900 text-xs" @click="exportConcernsPDF">Export PDF</button>
            <button class="px-3 py-1.5 rounded border text-xs" @click="printConcerns">Print</button>
          </div>
        </div>
        <div class="p-6">
          <div id="concerns-section" class="overflow-x-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="w-40 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="w-40 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th class="w-40 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Professor</th>
                  <th class="w-32 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th class="w-32 max-w-[8rem] px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th class="w-56 max-w-[14rem] px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th class="w-32 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="c in concernsVisible"
                  :key="c._id"
                >
                  <td class="w-40 px-6 py-3 text-sm text-gray-900 whitespace-nowrap">{{ formatDate(c.createdAt || c.timestamp || c.date) }}</td>
                  <td class="w-40 px-6 py-3 text-sm text-gray-500 truncate" :title="displayStudent(c)">{{ displayStudent(c) }}</td>
                  <td class="w-40 px-6 py-3 text-sm text-gray-500 truncate" :title="displayProfessor(c)">{{ displayProfessor(c) }}</td>
                  <td class="w-32 px-6 py-3 text-sm text-gray-500 truncate" :title="(c.type || c.category || 'General')">{{ (c.type || c.category || 'General') }}</td>
                  <td class="w-32 max-w-[8rem] px-6 py-3 text-sm text-gray-500 truncate" :title="(c.subject || c.title || '-')">{{ (c.subject || c.title || '-') }}</td>
                  <td class="w-56 max-w-[14rem] px-6 py-3 text-sm text-gray-500 truncate" :title="(c.message || c.description || c.details || '-')">{{ (c.message || c.description || c.details || '-') }}</td>
                  <td class="w-32 px-6 py-3 text-sm">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium"
                          :class="badgeClass(normalizeConcernStatusRaw(c.status))">
                      {{ concernStatusLabel(c.status) }}
                    </span>
                  </td>
                </tr>
                <tr v-if="concernsFiltered.length === 0">
                  <td colspan="7" class="px-6 py-6 text-center text-sm text-gray-500">No concerns in selected filters.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination for concerns summary -->
          <div class="mt-4 px-2 py-3 border-t border-gray-200 flex items-center justify-between text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-b-lg">
            <!-- Showing text -->
            <div class="hidden sm:block text-[11px] text-slate-500">
              Showing
              <span class="font-semibold text-[#001740]">{{ concernsVisible.length }}</span>
              of
              <span class="font-semibold text-[#001740]">{{ concernsFiltered.length }}</span>
              concerns
            </div>

            <!-- Centered page numbers -->
            <div class="flex-1 flex items-center justify-center">
              <div class="inline-flex items-center gap-1 sm:gap-2">
                <!-- Previous -->
                <button
                  class="w-7 h-7 flex items-center justify-center rounded-full border border-[#b9ccff] bg-white text-xs text-[#102A71] hover:bg-[#E5ECFF] disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="concernsCurrentPage === 1"
                  @click="concernsPrevPage"
                >
                  ‹
                </button>

                <!-- Page numbers with ellipsis -->
                <button
                  v-for="(page, idx) in concernsPageNumbers"
                  :key="idx + '-' + page"
                  type="button"
                  :disabled="page === '...'"
                  @click="page !== '...' && (concernsCurrentPage = page)"
                  class="min-w-[2rem] h-7 px-2 flex items-center justify-center rounded-full text-xs font-medium transition-colors"
                  :class="[
                    page === '...'
                      ? 'text-gray-400 cursor-default'
                      : (page === concernsCurrentPage
                          ? 'bg-[#001740] text-white shadow'
                          : 'bg-white text-[#102A71] border border-[#b9ccff] hover:bg-[#E5ECFF]')
                  ]"
                >
                  {{ page }}
                </button>

                <!-- Next -->
                <button
                  class="w-7 h-7 flex items-center justify-center rounded-full border border-[#b9ccff] bg-white text-xs text-[#102A71] hover:bg-[#E5ECFF] disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="concernsCurrentPage === concernsTotalPages"
                  @click="concernsNextPage"
                >
                  ›
                </button>
              </div>
              <div v-if="concernsPageLoading" class="ml-3 flex items-center">
                <span class="w-4 h-4 border-2 border-[#001740]/40 border-t-transparent rounded-full animate-spin"></span>
              </div>
            </div>

            <!-- Go to page -->
            <div class="hidden sm:flex items-center gap-2 ml-4">
              <span class="text-[11px] text-slate-500">Go to page</span>
              <input
                v-model="concernsGoToPageInput"
                type="text"
                inputmode="numeric"
                class="w-16 border border-[#cbd5f5] rounded-md px-2 py-1 text-xs text-[#102A71] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#102A71]/40 focus:border-[#102A71]"
                placeholder="1"
                @keyup.enter="concernsGoToPage"
              />
            </div>
          </div>
        </div>
      </div>
      </template>
    </div>
  </div>
</template>

<script>
import api from "@/utils/api.js";
import * as XLSX from "xlsx";

export default {
  name: "GenerateReports",
  data() {
    return {
      filters: {
        from: "",
        to: "",
        professorId: "",
        concernType: "",
      },
      professors: [],
      concerns: [],
      availability: { available: 0, busy: 0, notAvailable: 0 },
      attendancePlaceholder: [],
      generating: true,
      // Pagination for Student Concerns Summary
      concernsCurrentPage: 1,
      concernsPageSize: 7,
      concernsGoToPageInput: "",
      concernsPageLoading: false,
      // Pagination for Availability table
      availabilityCurrentPage: 1,
      availabilityPageSize: 4,
      availabilityGoToPageInput: "",
      // Pagination for Attendance Logs
      attendanceCurrentPage: 1,
      attendancePageSize: 5,
      attendanceGoToPageInput: "",
      // Filters dropdown state
      showProfessorDropdown: false,
      showConcernTypeDropdown: false,
    };
  },
  computed: {
    concernTypes() {
      const set = new Set();
      for (const c of this.concerns) {
        const t = (c.type || c.category || "").toString().trim();
        if (t) set.add(t);
      }
      const base = Array.from(set).sort();
      // Always offer status-based filters as pseudo "types"
      if (!base.includes('Pending')) base.push('Pending');
      if (!base.includes('Resolved')) base.push('Resolved');
      return base;
    },
    professorFilterLabel() {
      if (!this.filters.professorId) return 'All Professors';
      const p = this.professors.find(p => p._id === this.filters.professorId);
      if (!p) return 'All Professors';
      const name = ((p.firstName || '') + ' ' + (p.lastName || '')).trim();
      return name || 'All Professors';
    },
    concernTypeFilterLabel() {
      return this.filters.concernType || 'All Types';
    },
    concernsFiltered() {
      const from = this.filters.from ? new Date(this.filters.from) : null;
      const to = this.filters.to ? new Date(this.filters.to + 'T23:59:59') : null;
      const profId = this.filters.professorId;
      const typeRaw = this.filters.concernType || "";
      const type = typeRaw.toLowerCase();
      return this.concerns.filter((c) => {
        const date = new Date(c.createdAt || c.timestamp || c.date || 0);
        if (from && date < from) return false;
        if (to && date > to) return false;
        if (profId) {
          const pid = c.professorId || c.professor?._id || c.professorIdRef;
          if (pid && pid !== profId) return false;
          // also try match by name when id not present
          if (!pid) {
            const pObj = this.professors.find(p => p._id === profId);
            const pname = pObj ? ((pObj.firstName||'') + ' ' + (pObj.lastName||'')) : '';
            const label = (c.professorName || c.professor || c.faculty || '').toString();
            if (pname && label && !label.includes(pname)) return false;
          }
        }
        if (type) {
          if (type === 'pending' || type === 'resolved') {
            // Treat these two as status-based filters
            const s = this.normalizeConcernStatusRaw(c.status);
            if (s !== type) return false;
          } else {
            const ctype = (c.type || c.category || "").toLowerCase();
            if (ctype !== type) return false;
          }
        }
        return true;
      });
    },
    // Paginated slice of concerns for the summary table
    concernsVisible() {
      const start = (this.concernsCurrentPage - 1) * this.concernsPageSize;
      const end = start + this.concernsPageSize;
      return this.concernsFiltered.slice(start, end);
    },
    concernsTotalPages() {
      if (this.concernsFiltered.length === 0) return 1;
      return Math.ceil(this.concernsFiltered.length / this.concernsPageSize);
    },
    concernsPageNumbers() {
      const pages = [];
      const total = this.concernsTotalPages;
      const current = this.concernsCurrentPage;

      if (total <= 5) {
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
      }

      if (current <= 3) {
        pages.push(1, 2, 3, 4, '...', total);
      } else if (current >= total - 2) {
        pages.push(1, '...', total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total);
      }

      return pages;
    },
    attendanceVisible() {
      const start = (this.attendanceCurrentPage - 1) * this.attendancePageSize;
      const end = start + this.attendancePageSize;
      return this.attendancePlaceholder.slice(start, end);
    },
    attendanceTotalPages() {
      if (this.attendancePlaceholder.length === 0) return 1;
      return Math.ceil(this.attendancePlaceholder.length / this.attendancePageSize);
    },
    attendancePageNumbers() {
      const pages = [];
      const total = this.attendanceTotalPages;
      const current = this.attendanceCurrentPage;

      if (total <= 5) {
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
      }

      if (current <= 3) {
        pages.push(1, 2, 3, 4, '...', total);
      } else if (current >= total - 2) {
        pages.push(1, '...', total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total);
      }

      return pages;
    },
    professorsWithStatus() {
      return (this.professors || []).map(p => ({
        id: p._id,
        name: (((p.firstName || '') + ' ' + (p.lastName || '')).trim()) || p.emailAddress || 'Unknown',
        status: (p.status || 'Not Available')
      }));
    },
    availabilityVisible() {
      const start = (this.availabilityCurrentPage - 1) * this.availabilityPageSize;
      const end = start + this.availabilityPageSize;
      return this.professorsWithStatus.slice(start, end);
    },
    availabilityTotalPages() {
      if (this.professorsWithStatus.length === 0) return 1;
      return Math.ceil(this.professorsWithStatus.length / this.availabilityPageSize);
    },
    availabilityPageNumbers() {
      const pages = [];
      const total = this.availabilityTotalPages;
      const current = this.availabilityCurrentPage;

      if (total <= 5) {
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
      }

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
  filters: {
    capitalize(v) {
      if (!v) return "";
      const s = String(v);
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.generating = true;
      try {
        await Promise.all([
          this.fetchProfessors(),
          this.fetchConcerns(),
          this.fetchAvailability(),
        ]);
        this.generateAttendancePlaceholder();
      } finally {
        this.generating = false;
      }
    },
    scrollToSection(id) {
      if (typeof document === 'undefined') return;
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    async fetchProfessors() {
      try {
        const res = await api.get('/admin/professors');
        this.professors = res.data.professors || [];
      } catch (e) {
        console.error('Failed to fetch professors', e);
      }
    },
    async fetchConcerns() {
      try {
        const res = await api.get('/admin/concerns');
        this.concerns = res.data.concerns || [];
      } catch (e) {
        console.error('Failed to fetch concerns', e);
      }
    },
    async fetchAvailability() {
      try {
        const res = await api.get('/admin/dashboard');
        const a = res.data?.stats?.professorAvailability || {};
        this.availability = {
          available: a.available || 0,
          busy: a.busy || 0,
          notAvailable: a.notAvailable || 0,
        };
      } catch (e) {
        console.error('Failed to fetch availability', e);
      }
    },
    generateReports() {
      // In current implementation, preview reacts to filters automatically
      this.generating = true;
      this.generateAttendancePlaceholder();
      // reset concerns pagination to first page when filters change
      this.concernsCurrentPage = 1;
      this.concernsPageLoading = false;
      this.showProfessorDropdown = false;
      this.showConcernTypeDropdown = false;
      setTimeout(() => {
        this.generating = false;
      }, 400);
    },
    resetFilters() {
      this.filters = { from: '', to: '', professorId: '', concernType: '' };
      this.concernsCurrentPage = 1;
      this.concernsPageLoading = false;
      this.showProfessorDropdown = false;
      this.showConcernTypeDropdown = false;
    },
    // Placeholder attendance rows until backend endpoint exists
    generateAttendancePlaceholder() {
      const prof = this.professors.find(p => p._id === this.filters.professorId);
      const pname = prof ? ((prof.firstName||'') + ' ' + (prof.lastName||'')) : 'Any Professor';
      const base = [
        { time: this.formatDate(new Date()), professor: pname, rfidId: prof?.idNumber || '-', action: 'Tap-in' },
        { time: this.formatDate(new Date()), professor: pname, rfidId: prof?.idNumber || '-', action: 'Tap-out' },
      ];
      this.attendancePlaceholder = base;
    },
    availabilityPrevPage() {
      if (this.availabilityCurrentPage > 1) {
        this.availabilityCurrentPage -= 1;
      }
    },
    availabilityNextPage() {
      if (this.availabilityCurrentPage < this.availabilityTotalPages) {
        this.availabilityCurrentPage += 1;
      }
    },
    availabilityGoToPage() {
      const raw = String(this.availabilityGoToPageInput || '').trim();
      const num = Number(raw);
      if (!num || isNaN(num)) return;
      if (num < 1) {
        this.availabilityCurrentPage = 1;
      } else if (num > this.availabilityTotalPages) {
        this.availabilityCurrentPage = this.availabilityTotalPages;
      } else {
        this.availabilityCurrentPage = num;
      }
      this.availabilityGoToPageInput = String(this.availabilityCurrentPage);
    },
    attendancePrevPage() {
      if (this.attendanceCurrentPage > 1) {
        this.attendanceCurrentPage -= 1;
      }
    },
    attendanceNextPage() {
      if (this.attendanceCurrentPage < this.attendanceTotalPages) {
        this.attendanceCurrentPage += 1;
      }
    },
    attendanceGoToPage() {
      const raw = String(this.attendanceGoToPageInput || '').trim();
      const num = Number(raw);
      if (!num || isNaN(num)) return;
      if (num < 1) {
        this.attendanceCurrentPage = 1;
      } else if (num > this.attendanceTotalPages) {
        this.attendanceCurrentPage = this.attendanceTotalPages;
      } else {
        this.attendanceCurrentPage = num;
      }
      this.attendanceGoToPageInput = String(this.attendanceCurrentPage);
    },
    selectProfessor(id) {
      this.filters.professorId = id;
      this.showProfessorDropdown = false;
      this.concernsCurrentPage = 1;
    },
    selectConcernType(v) {
      this.filters.concernType = v;
      this.showConcernTypeDropdown = false;
      this.concernsCurrentPage = 1;
    },
    // Pagination controls for concerns summary
    concernsPrevPage() {
      if (this.concernsCurrentPage > 1) {
        this.concernsPageLoading = true;
        this.concernsCurrentPage -= 1;
        setTimeout(() => {
          this.concernsPageLoading = false;
        }, 200);
      }
    },
    concernsNextPage() {
      if (this.concernsCurrentPage < this.concernsTotalPages) {
        this.concernsPageLoading = true;
        this.concernsCurrentPage += 1;
        setTimeout(() => {
          this.concernsPageLoading = false;
        }, 200);
      }
    },
    concernsGoToPage() {
      const raw = String(this.concernsGoToPageInput || '').trim();
      const num = Number(raw);
      if (!num || isNaN(num)) return;
      this.concernsPageLoading = true;
      if (num < 1) {
        this.concernsCurrentPage = 1;
      } else if (num > this.concernsTotalPages) {
        this.concernsCurrentPage = this.concernsTotalPages;
      } else {
        this.concernsCurrentPage = num;
      }
      this.concernsGoToPageInput = String(this.concernsCurrentPage);
      setTimeout(() => {
        this.concernsPageLoading = false;
      }, 200);
    },
    displayStudent(c) {
      return (
        (c.studentName) ||
        (c.student && ((c.student.firstName || '') + ' ' + (c.student.lastName || ''))) ||
        ((c.firstName || '') + ' ' + (c.lastName || '')) ||
        '-'
      ).trim();
    },
    displayProfessor(c) {
      return (
        c.professorName ||
        (c.professor && ((c.professor.firstName || '') + ' ' + (c.professor.lastName || ''))) ||
        c.professor ||
        c.faculty ||
        '-'
      ).toString().trim();
    },
    badgeClass(status) {
      const s = (status || 'pending').toLowerCase();
      if (s === 'resolved') return 'bg-green-100 text-green-800';
      if (s === 'archived') return 'bg-gray-100 text-gray-800';
      return 'bg-yellow-100 text-yellow-800';
    },
    availabilityBadge(status) {
      const s = (status || '').toLowerCase().trim();
      if (s === 'available') return 'bg-green-100 text-green-800';
      if (s === 'busy') return 'bg-yellow-100 text-yellow-800';
      return 'bg-gray-100 text-gray-800';
    },
    availabilityPercent(type) {
      const a = this.availability || {};
      const total = (a.available || 0) + (a.busy || 0) + (a.notAvailable || 0);
      if (!total) return 0;
      const value = a[type] || 0;
      return Math.round((value / total) * 100);
    },
    normalizeConcernStatusRaw(status) {
      const v = (status === 0 || status === 1 || status === 2) ? String(status) : String(status || '').toLowerCase().trim();
      if (v === '0' || v === 'pending') return 'pending';
      if (v === '1' || v === 'resolved') return 'resolved';
      if (v === '2' || v === 'archived') return 'archived';
      return 'pending';
    },
    concernStatusLabel(status) {
      const raw = this.normalizeConcernStatusRaw(status);
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    },
    formatDate(d) {
      const date = d instanceof Date ? d : new Date(d);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleString();
    },
    // Export helpers
    exportAllExcel() {
      // Attendance sheet
      const attendanceData = [
        ['Date/Time','Professor','RFID ID','Action'],
        ...this.attendancePlaceholder.map(r => [r.time, r.professor, r.rfidId, r.action])
      ];

      // Concerns sheet
      const concernsData = [
        ['Date','Student','Professor','Type','Subject','Message','Status'],
        ...this.concernsFiltered.map(c => [
          this.formatDate(c.createdAt || c.timestamp || c.date),
          this.displayStudent(c),
          this.displayProfessor(c),
          (c.type || c.category || 'General'),
          (c.subject || c.title || '-'),
          (c.message || c.description || c.details || '-'),
          this.concernStatusLabel(c.status)
        ])
      ];

      // Availability sheet (counts)
      const availabilityData = [
        ['Metric','Count'],
        ['Available', this.availability.available],
        ['Busy', this.availability.busy],
        ['Not Available', this.availability.notAvailable],
      ];

      // Availability by professor (list)
      const profAvailabilityData = [
        ['Professor','Status'],
        ...this.professorsWithStatus.map(p => [p.name, p.status])
      ];

      const wb = XLSX.utils.book_new();
      const wsAttendance = XLSX.utils.aoa_to_sheet(attendanceData);
      const wsConcerns = XLSX.utils.aoa_to_sheet(concernsData);
      const wsAvailability = XLSX.utils.aoa_to_sheet(availabilityData);
      const wsProfAvailability = XLSX.utils.aoa_to_sheet(profAvailabilityData);

      XLSX.utils.book_append_sheet(wb, wsAttendance, 'Attendance');
      XLSX.utils.book_append_sheet(wb, wsConcerns, 'Concerns');
      XLSX.utils.book_append_sheet(wb, wsAvailability, 'Availability');
      XLSX.utils.book_append_sheet(wb, wsProfAvailability, 'Availability By Professor');

      const filename = `reports_${new Date().toISOString().slice(0,10)}.xlsx`;
      XLSX.writeFile(wb, filename);
    },
    printPDF() {
      const printContents = document.getElementById('report-preview').innerHTML;
      const w = window.open('', '', 'height=800,width=1000');
      w.document.write('<html><head><title>Reports</title>');
      w.document.write('<style>body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial} table{width:100%;border-collapse:collapse} th,td{border:1px solid #e5e7eb;padding:6px 10px} th{background:#f9fafb}</style>');
      w.document.write('</head><body>');
      w.document.write(printContents);
      w.document.write('</body></html>');
      w.document.close();
      w.focus();
      w.print();
      w.close();
    },
    printConcerns() {
      const el = document.getElementById('concerns-section');
      if (!el) return;
      const w = window.open('', '', 'height=800,width=1000');
      w.document.write('<html><head><title>Student Concerns</title>');
      w.document.write('<style>body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial} table{width:100%;border-collapse:collapse} th,td{border:1px solid #e5e7eb;padding:6px 10px} th{background:#f9fafb}</style>');
      w.document.write('</head><body>');
      w.document.write(el.innerHTML);
      w.document.write('</body></html>');
      w.document.close();
      w.focus();
      w.print();
      w.close();
    },
    exportConcernsPDF() {
      const el = document.getElementById('concerns-section');
      if (!el) return;
      const w = window.open('', '', 'height=800,width=1000');
      w.document.write('<html><head><title>Student Concerns</title>');
      w.document.write('<style>body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial} table{width:100%;border-collapse:collapse} th,td{border:1px solid #e5e7eb;padding:6px 10px} th{background:#f9fafb}</style>');
      w.document.write('</head><body>');
      w.document.write(el.innerHTML);
      w.document.write('</body></html>');
      w.document.close();
      w.focus();
      w.print();
      w.close();
    },
  },
};
</script>

<style>
/* Global scrollbar styling – slimmer and blue to match branding */
* {
  scrollbar-width: thin;               /* Firefox */
  scrollbar-color: #001740 #E5EDF9;    /* thumb, track */
}

/* WebKit-based browsers (Chrome, Edge, etc.) */
*::-webkit-scrollbar {
  width: 6px;
}

*::-webkit-scrollbar-track {
  background: #E5EDF9;
}

*::-webkit-scrollbar-thumb {
  background-color: #001740;
  border-radius: 9999px;
}
</style>