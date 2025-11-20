<template>
  <div class="admin-dashboard mt-1">
    <div class="bg-white/95 shadow rounded-2xl border border-slate-100 overflow-hidden">
      <!-- Skeleton state -->
      <div v-if="loading" class="p-6 space-y-5 animate-pulse">
        <!-- Skeleton toolbar -->
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-1 items-center gap-3">
            <div class="h-9 flex-1 max-w-md bg-slate-200 rounded-lg"></div>
            <div class="h-9 w-40 bg-slate-200 rounded-lg"></div>
          </div>
          <div class="h-4 w-40 bg-slate-200 rounded"></div>
        </div>

        <!-- Skeleton table header -->
        <div class="mt-4 h-9 bg-slate-100 rounded-lg"></div>

        <!-- Skeleton table rows -->
        <div class="mt-2 space-y-2">
          <div v-for="n in 6" :key="n" class="h-10 bg-slate-100 rounded-lg"></div>
        </div>
      </div>

      <!-- Real content -->
      <div v-else>
        <!-- Toolbar -->
        <div
          class="px-6 py-4 border-b border-slate-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-slate-50"
        >
          <div class="flex flex-1 items-center gap-3">
            <div class="relative flex-1 max-w-md">
              <input
                v-model="query"
                type="text"
                placeholder="Search by name or email..."
                class="w-full border border-slate-200 rounded-lg px-3 py-2 pl-9 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#102A71]/40 focus:border-[#102A71] bg-white"
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
            <!-- Status dropdown (custom) -->
            <div class="relative">
              <button
                type="button"
                @click="showStatusDropdown = !showStatusDropdown"
                class="min-w-[140px] px-3 py-2 bg-white border border-slate-200 rounded-lg text-left text-sm text-slate-800 flex items-center justify-between shadow-sm focus:outline-none focus:ring-2 focus:ring-[#102A71]/40 focus:border-[#102A71] transition-all duration-200"
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
                  class="absolute right-0 z-50 w-52 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  <div class="py-1">
                    <button
                      v-for="opt in statusOptions"
                      :key="opt.value"
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
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-3 text-left text-[11px] font-medium text-slate-500 uppercase tracking-wide">Student Name</th>
                <th class="px-6 py-3 text-left text-[11px] font-medium text-slate-500 uppercase tracking-wide">Section</th>
                <th class="px-6 py-3 text-left text-[11px] font-medium text-slate-500 uppercase tracking-wide">Student ID</th>
                <th class="px-6 py-3 text-left text-[11px] font-medium text-slate-500 uppercase tracking-wide">Email</th>
                <th class="px-6 py-3 text-left text-[11px] font-medium text-slate-500 uppercase tracking-wide">Status</th>
                <th class="px-6 py-3 text-center text-[11px] font-medium text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-100">
              <tr
                v-for="u in paginatedStudents"
                :key="u._id"
                class="hover:bg-slate-50 cursor-pointer transition-colors"
                @click="openViewModal(u)"
              >
                <td class="px-6 py-3 whitespace-nowrap text-sm text-slate-900">
                  {{ (u.firstName || '') + ' ' + (u.lastName || '') }}
                </td>
                <td class="px-6 py-3 whitespace-nowrap text-sm text-slate-600">
                  {{ u.section || '-' }}
                </td>
                <td class="px-6 py-3 whitespace-nowrap text-sm text-slate-600">
                  {{ u.idNumber || '-' }}
                </td>
                <td class="px-6 py-3 whitespace-nowrap text-sm text-slate-600">
                  {{ u.emailAddress }}
                </td>
                <td class="px-6 py-3 whitespace-nowrap text-sm">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                    :class="u.isVerified ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-700'"
                  >
                    {{ u.isVerified ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-3 whitespace-nowrap text-sm text-center">
                  <div class="inline-flex items-center justify-center">
                    <button
                      class="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-[11px] font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-100"
                      @click.stop="confirmDelete(u)"
                    >
                      <svg
                        class="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 7H18"
                          stroke="currentColor"
                          stroke-width="1.6"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9 7V5C9 4.44772 9.44772 4 10 4H14C14.5523 4 15 4.44772 15 5V7"
                          stroke="currentColor"
                          stroke-width="1.6"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M8 7L8.5 18C8.5 18.5523 8.94772 19 9.5 19H14.5C15.0523 19 15.5 18.5523 15.5 18L16 7"
                          stroke="currentColor"
                          stroke-width="1.6"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredStudents.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-sm text-slate-500">No students found.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-xs sm:text-sm text-gray-600 bg-gray-50">
          <!-- Bottom-left: showing text -->
          <div class="hidden sm:block text-[11px] text-slate-500">
            Showing
            <span class="font-semibold text-[#001740]">{{ paginatedStudents.length }}</span>
            of
            <span class="font-semibold text-[#001740]">{{ filteredStudents.length }}</span>
            students
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
                &lt;
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
                &gt;
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
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
    >
      <div class="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-3xl lg:max-w-4xl min-h-[60vh] overflow-hidden">
        <div class="px-6 py-4 flex items-center justify-between bg-[#001740]">
          <div>
            <h3 class="text-base font-semibold text-white">
              {{ editTarget ? 'Edit Student' : 'Edit Student' }}
            </h3>
            <p class="text-[11px] text-slate-200 mt-0.5">Update the student's information below.</p>
          </div>
        </div>

        <div class="flex flex-col md:flex-row overflow-y-auto">
          <!-- Left sidebar -->
          <div class="md:w-5/12 border-r border-slate-100 bg-slate-50 px-6 py-5 flex flex-col gap-5">
            <div class="flex flex-col items-center text-center gap-3">
              <div class="w-20 h-20 rounded-2xl bg-slate-200 flex items-center justify-center overflow-hidden">
                <span class="text-xl font-semibold text-[#001740]">
                  {{ ((form.firstName || 'S').charAt(0) + (form.lastName || '').charAt(0)).toUpperCase() }}
                </span>
              </div>
              <div>
                <div class="text-sm font-semibold text-[#001740]">
                  {{ (form.firstName || '') + (form.firstName || form.lastName ? ' ' : '') + (form.lastName || '') || 'Student' }}
                </div>
                <div class="text-xs text-slate-500 truncate max-w-[180px]">
                  {{ form.emailAddress || 'No email provided' }}
                </div>
              </div>
            </div>

            <div class="mt-4 space-y-2">
              <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">Profile sections</p>

              <button
                type="button"
                @click="setActiveSection('personal')"
                class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium border bg-white shadow-sm transition-colors"
                :class="activeSection === 'personal'
                  ? 'border-[#001740] bg-[#001740]/5 text-[#001740]'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'"
              >
                <span>Personal information</span>
              </button>

              <button
                type="button"
                @click="setActiveSection('academic')"
                class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium border bg-white shadow-sm transition-colors"
                :class="activeSection === 'academic'
                  ? 'border-[#001740] bg-[#001740]/5 text-[#001740]'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'"
              >
                <span>Academic information</span>
              </button>

              <button
                type="button"
                @click="setActiveSection('contact')"
                class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium border bg-white shadow-sm transition-colors"
                :class="activeSection === 'contact'
                  ? 'border-[#001740] bg-[#001740]/5 text-[#001740]'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'"
              >
                <span>Contact information</span>
              </button>
            </div>
          </div>

          <!-- Right form -->
          <form class="md:w-7/12 px-6 py-5 flex flex-col" @submit.prevent="submitForm">
            <div class="flex-1 space-y-5 pr-1">
            <!-- Personal information -->
            <div v-if="activeSection === 'personal'" class="space-y-5">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Personal information</p>
              <!-- Names stacked vertically -->
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">First Name</label>
                  <input
                    v-model="form.firstName"
                    type="text"
                    required
                    class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#102A71]/40 focus:border-[#102A71]"
                    @input="form.firstName = toTitleCase(form.firstName)"
                  />
                  <div v-if="errors.firstName" class="mt-1 text-xs text-red-600">{{ errors.firstName }}</div>
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">Last Name</label>
                  <input
                    v-model="form.lastName"
                    type="text"
                    required
                    class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#102A71]/40 focus:border-[#102A71]"
                    @input="form.lastName = toTitleCase(form.lastName)"
                  />
                  <div v-if="errors.lastName" class="mt-1 text-xs text-red-600">{{ errors.lastName }}</div>
                </div>
              </div>

              <!-- Birthdate and age side by side -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">Birthdate</label>
                  <input
                    v-model="form.birthdate"
                    type="date"
                    class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#102A71]/40 focus:border-[#102A71]"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">Age</label>
                  <input
                    :value="computedAge"
                    type="number"
                    class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-600"
                    disabled
                  />
                </div>
              </div>
            </div>

            <!-- Academic information -->
            <div v-else-if="activeSection === 'academic'" class="space-y-5">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Academic information</p>
              <div class="grid grid-cols-1 gap-4">
                <!-- Program (first) -->
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">Program</label>
                  <input
                    v-model="form.program"
                    type="text"
                    class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-600"
                    disabled
                  />
                </div>

                <!-- Year Level and Section side by side -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Year Level (number input 1-4) -->
                  <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">Year Level</label>
                    <input
                      v-model="form.yearLevel"
                      type="text"
                      inputmode="numeric"
                      placeholder="1-4"
                      class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#102A71]/40 focus:border-[#102A71]"
                      @input="onYearLevelInput"
                    />
                  </div>

                  <!-- Section (F1-F5 text input) -->
                  <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">Section</label>
                    <input
                      v-model="form.section"
                      type="text"
                      maxlength="2"
                      pattern="F[1-5]"
                      placeholder="F1-F5"
                      class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#102A71]/40 focus:border-[#102A71]"
                      @input="form.section = (form.section || '').toUpperCase()"
                    />
                  </div>
                </div>

                <!-- ID Number -->
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">ID Number</label>
                  <div class="flex">
                    <span
                      class="inline-flex items-center px-3 border border-r-0 border-slate-200 rounded-l-lg text-sm bg-slate-50 text-slate-700"
                    >
                      MCC
                    </span>
                    <input
                      v-model="idNumberTail"
                      type="text"
                      class="w-full border border-l-0 border-slate-200 rounded-r-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#102A71]/40 focus:border-[#102A71]"
                      placeholder="YYYY-NNNN"
                      @input="onIdTailInput"
                    />
                  </div>
                  <div v-if="errors.idNumber" class="mt-1 text-xs text-red-600">{{ errors.idNumber }}</div>
                </div>
              </div>
            </div>

            <!-- Contact information -->
            <div v-else class="space-y-5">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Contact information</p>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">Email</label>
                  <input
                    v-model="form.emailAddress"
                    type="email"
                    required
                    class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#102A71]/40 focus:border-[#102A71]"
                    @input="form.emailAddress = (form.emailAddress || '').toLowerCase()"
                  />
                  <div v-if="errors.emailAddress" class="mt-1 text-xs text-red-600">{{ errors.emailAddress }}</div>
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">Contact Number</label>
                  <input
                    v-model="form.contactNumber"
                    type="tel"
                    required
                    class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#102A71]/40 focus:border-[#102A71]"
                  />
                  <div v-if="errors.contactNumber" class="mt-1 text-xs text-red-600">{{ errors.contactNumber }}</div>
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">Address</label>
                <textarea
                  v-model="form.address"
                  rows="2"
                  class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#102A71]/40 focus:border-[#102A71]"
                  @input="form.address = toTitleCase(form.address)"
                ></textarea>
              </div>
            </div>

            </div>

            <div class="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 mt-2 pt-3">
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
                @click="closeModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-3 py-1.5 rounded-lg bg-[#001740] text-white text-xs font-medium hover:bg-[#102A71] disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="saving"
              >
                <span v-if="saving" class="inline-flex items-center gap-2">
                  <span class="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin"></span>
                  <span>Saving…</span>
                </span>
                <span v-else>Save Changes</span>
              </button>
            </div>
          </form>
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

    <!-- View Student Modal -->
    <div
      v-if="showViewModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
    >
      <div class="bg-white border border-yellow-200 rounded-2xl shadow-xl w-full max-w-3xl lg:max-w-4xl min-h-[60vh] overflow-hidden">
        <!-- Header (yellow themed like edit modal) -->
        <div class="px-6 py-4 flex items-center justify-between bg-[#F5C400]">
          <div>
            <h3 class="text-base font-semibold text-[#001740]">Student Details</h3>
            <p class="text-[11px] text-[#3b2a00]/80 mt-0.5">Read-only view of the student's information.</p>
          </div>
        </div>

        <div class="flex flex-col md:flex-row overflow-y-auto">
          <!-- Left sidebar (profile) -->
          <div class="md:w-5/12 border-r border-slate-100 bg-slate-50 px-6 py-6 flex flex-col gap-6">
            <div class="flex flex-col items-center text-center gap-3">
              <div class="w-24 h-24 rounded-2xl bg-slate-200 flex items-center justify-center overflow-hidden">
                <span class="text-xl font-semibold text-[#001740]">
                  {{ ((viewTarget?.firstName || 'S').charAt(0) + (viewTarget?.lastName || '').charAt(0)).toUpperCase() }}
                </span>
              </div>
              <div>
                <div class="text-sm font-semibold text-[#001740]">
                  {{ (viewTarget?.firstName || '') + (viewTarget?.firstName || viewTarget?.lastName ? ' ' : '') + (viewTarget?.lastName || '') || 'Student' }}
                </div>
                <div class="text-xs text-slate-500 truncate max-w-[180px]">
                  {{ viewTarget?.emailAddress || 'No email provided' }}
                </div>
              </div>
            </div>

            <div class="mt-4 space-y-2">
              <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">Profile sections</p>

              <button
                type="button"
                @click="setViewActiveSection('personal')"
                class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium border bg-white shadow-sm transition-colors"
                :class="viewActiveSection === 'personal'
                  ? 'border-[#001740] bg-[#001740]/5 text-[#001740]'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'"
              >
                <span>Personal information</span>
              </button>

              <button
                type="button"
                @click="setViewActiveSection('academic')"
                class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium border bg-white shadow-sm transition-colors"
                :class="viewActiveSection === 'academic'
                  ? 'border-[#001740] bg-[#001740]/5 text-[#001740]'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'"
              >
                <span>Academic information</span>
              </button>

              <button
                type="button"
                @click="setViewActiveSection('contact')"
                class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium border bg-white shadow-sm transition-colors"
                :class="viewActiveSection === 'contact'
                  ? 'border-[#001740] bg-[#001740]/5 text-[#001740]'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'"
              >
                <span>Contact information</span>
              </button>
            </div>
          </div>

          <!-- Right content: read-only fields mirroring edit modal -->
          <div class="md:w-7/12 px-6 py-5 flex flex-col">
            <div class="flex-1 space-y-6 pr-1">
              <!-- Personal information -->
              <div v-if="viewActiveSection === 'personal'" class="space-y-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Personal information</p>
                <!-- Names stacked vertically -->
                <div class="grid grid-cols-1 gap-4 text-sm">
                  <div>
                    <div class="text-xs font-medium text-slate-500 mb-0.5">First Name</div>
                    <div class="border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800">
                      {{ viewTarget?.firstName || '-' }}
                    </div>
                  </div>
                  <div>
                    <div class="text-xs font-medium text-slate-500 mb-0.5">Last Name</div>
                    <div class="border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800">
                      {{ viewTarget?.lastName || '-' }}
                    </div>
                  </div>
                </div>

                <!-- Birthdate and age side by side in view -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-1">
                  <div>
                    <div class="text-xs font-medium text-slate-500 mb-0.5">Birthdate</div>
                    <div class="border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800">
                      {{ viewTarget?.birthdate ? new Date(viewTarget.birthdate).toLocaleDateString() : '-' }}
                    </div>
                  </div>
                  <div>
                    <div class="text-xs font-medium text-slate-500 mb-0.5">Age</div>
                    <div class="border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800">
                      {{ viewTarget?.age ?? '-' }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Academic information -->
              <div v-else-if="viewActiveSection === 'academic'" class="space-y-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Academic information</p>
                <div class="grid grid-cols-1 gap-4 text-sm">
                  <!-- Program (first) -->
                  <div>
                    <div class="text-xs font-medium text-slate-500 mb-0.5">Program</div>
                    <div class="border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800">
                      BSIT
                    </div>
                  </div>

                  <!-- Year Level and Section side by side -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Year Level -->
                    <div>
                      <div class="text-xs font-medium text-slate-500 mb-0.5">Year Level</div>
                      <div class="border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800">
                        {{ displayYearLevel(viewTarget?.yearLevel) }}
                      </div>
                    </div>

                    <!-- Section -->
                    <div>
                      <div class="text-xs font-medium text-slate-500 mb-0.5">Section</div>
                      <div class="border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800">
                        {{ viewTarget?.section || '-' }}
                      </div>
                    </div>
                  </div>

                  <!-- ID Number -->
                  <div>
                    <div class="text-xs font-medium text-slate-500 mb-0.5">ID Number</div>
                    <div class="border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800 break-all">
                      {{ viewTarget?.idNumber || '-' }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contact information -->
              <div v-else class="space-y-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Contact information</p>
                <div class="space-y-3 text-sm">
                  <div>
                    <div class="text-xs font-medium text-slate-500 mb-0.5">Email</div>
                    <div class="border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800 break-all">
                      {{ viewTarget?.emailAddress || '-' }}
                    </div>
                  </div>
                  <div>
                    <div class="text-xs font-medium text-slate-500 mb-0.5">Contact Number</div>
                    <div class="border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800">
                      {{ viewTarget?.contactNumber || '-' }}
                    </div>
                  </div>
                  <div>
                    <div class="text-xs font-medium text-slate-500 mb-0.5">Address</div>
                    <div class="border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800">
                      {{ viewTarget?.address || '-' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer: only Close button on the right -->
            <div class="pt-3 flex items-center justify-end border-t border-slate-100 mt-4">
              <button
                type="button"
                class="px-3 py-1.5 rounded-md border border-slate-200 text-[11px] sm:text-xs font-medium text-slate-700 hover:bg-slate-50"
                @click="closeViewModal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

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
            <h3 class="text-sm font-semibold text-red-800">Delete student</h3>
            <p class="text-xs text-red-600 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <div class="px-6 py-4 text-sm text-slate-700">
          Are you sure you want to delete
          <span class="font-semibold text-slate-900">
            {{ (deleteTarget.firstName || '') + ' ' + (deleteTarget.lastName || '') }}
          </span>
          from the student list?
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
            :disabled="deletingStudent"
          >
            <span
              v-if="deletingStudent"
              class="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin"
            ></span>
            <span>{{ deletingStudent ? 'Deleting…' : 'Delete student' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- OTP Verification Modal -->
    <div v-if="showOtpModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Verify Email</h3>
          <button class="text-gray-400 hover:text-gray-600" @click="showOtpModal = false">✖</button>
        </div>
        <div class="px-6 py-4 space-y-3">
          <p class="text-sm text-gray-600">We sent a 6-digit verification code to <b>{{ otpEmail }}</b>. Enter it below to activate the account.</p>
          <input
            v-model="otpCode"
            type="text"
            maxlength="6"
            placeholder="Enter 6-digit code"
            class="w-full border rounded px-3 py-2 text-sm tracking-widest text-center"
          />
          <div v-if="otpError" class="text-sm text-red-600">{{ otpError }}</div>
          <div class="flex items-center justify-between pt-2">
            <button class="px-4 py-2 rounded border" @click="showOtpModal = false">Cancel</button>
            <div class="flex items-center gap-2">
              <button
                class="px-3 py-2 rounded text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                :disabled="resendIn > 0 || resendBusy"
                @click="resendOtp"
              >
                Resend Code <span v-if="resendIn > 0">({{ resendIn }})</span>
              </button>
              <button
                class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                :disabled="verifying || otpCode.length !== 6"
                @click="verifyOtp"
              >
                {{ verifying ? 'Verifying...' : 'Verify' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/utils/api.js";

export default {
  name: "ManageUsers",
  data() {
    return {
      students: [],
      loading: false,
      query: "",
      statusFilter: "",
      activeSection: 'personal',
      viewActiveSection: 'personal',
      sectionOptions: [
        { value: "personal", label: "Personal Information" },
        { value: "academic", label: "Academic Information" },
        { value: "contact", label: "Contact Information" },
      ],
      showYearDropdown: false,
      yearOptions: [
        { value: "1", label: "1st year" },
        { value: "2", label: "2nd year" },
        { value: "3", label: "3rd year" },
        { value: "4", label: "4th year" },
      ],
      showSectionDropdown: false,
      sectionYearOptions: [
        { value: "F1", label: "F1" },
        { value: "F2", label: "F2" },
        { value: "F3", label: "F3" },
        { value: "F4", label: "F4" },
        { value: "F5", label: "F5" },
      ],
      showStatusDropdown: false,
      statusOptions: [
        { value: "", label: "All status", description: "Show all students" },
        { value: "active", label: "Active", description: "Students with verified accounts" },
        { value: "inactive", label: "Inactive", description: "Students not yet verified" },
      ],
      currentPage: 1,
      pageSize: 6,
      goToPageInput: "",
      showModal: false,
      editTarget: null,
      deleteTarget: null,
      deletingStudent: false,
      // ...
      showViewModal: false,
      viewTarget: null,
      showOtpModal: false,
      otpEmail: "",
      otpCode: "",
      otpError: "",
      verifying: false,
      resendBusy: false,
      resendIn: 0,
      resendTimerId: null,
      saving: false,
      toast: {
        visible: false,
        message: "",
        progress: 0,
      },
      form: {
        firstName: "",
        lastName: "",
        section: "",
        idNumber: "MCC",
        emailAddress: "",
        contactNumber: "",
        address: "",
        program: "BSIT",
        yearLevel: "",
        birthdate: "",
        password: "",
      },
      idNumberTail: "",
      errors: {
        firstName: "",
        lastName: "",
        idNumber: "",
        contactNumber: "",
        emailAddress: "",
        password: "",
      },
      emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phoneRegex: /^(09|\+639)\d{9}$/,
      idRegex: /^MCC\d{4}-\d{4}$/,
      pollInterval: null, // Added for polling
    };
  },
  computed: {
    computedAge() {
      if (!this.form.birthdate) return "";
      const d = new Date(this.form.birthdate);
      if (isNaN(d.getTime())) return "";
      const today = new Date();
      let a = today.getFullYear() - d.getFullYear();
      const m = today.getMonth() - d.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < d.getDate())) a--;
      return a;
    },
    filteredStudents() {
      const q = this.query.trim().toLowerCase();
      let list = this.students.filter(
        (u) =>
          ((u.firstName || "") + " " + (u.lastName || "")).toLowerCase().includes(q) ||
          (u.emailAddress || "").toLowerCase().includes(q)
      );
      if (this.statusFilter === "active") {
        list = list.filter((u) => !!u.isVerified);
      } else if (this.statusFilter === "inactive") {
        list = list.filter((u) => !u.isVerified);
      }
      return list;
    },
    paginatedStudents() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredStudents.slice(start, end);
    },
    totalPages() {
      if (this.filteredStudents.length === 0) return 1;
      return Math.ceil(this.filteredStudents.length / this.pageSize);
    },
    pageNumbers() {
      const pages = [];
      const total = this.totalPages;
      const current = this.currentPage;

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
  mounted() {
    this.fetchStudents();
    // Start polling after initial load
    this.startPolling();
  },
  beforeDestroy() {
    // Clean up polling interval when component is destroyed
    this.stopPolling();
    // Clean up resend timer if it exists
    if (this.resendTimerId) {
      clearInterval(this.resendTimerId);
    }
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
        this.fetchStudents();
      }, 2000);
      console.log('🔄 Started polling students every 2 seconds');
    },

    stopPolling() {
      if (this.pollInterval) {
        clearInterval(this.pollInterval);
        this.pollInterval = null;
        console.log('🛑 Stopped polling students');
      }
    },

    toTitleCase(s) {
      if (!s) return "";
      return String(s).replace(/\b\w+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    },
    displayYearLevel(raw) {
      if (raw === null || raw === undefined) return '-';
      const s = String(raw).trim();
      if (!s) return '-';
      // Extract first digit(s), then clamp between 1 and 4
      const match = s.match(/\d+/);
      if (!match) return '-';
      let num = parseInt(match[0], 10);
      if (isNaN(num)) return '-';
      if (num < 1) num = 1;
      if (num > 4) num = 4;
      return String(num);
    },
    onIdTailInput() {
      const tail = (this.idNumberTail || "").toUpperCase().replace(/\s+/g, "");
      this.idNumberTail = tail;
      this.form.idNumber = "MCC" + tail;
    },
    onYearLevelInput() {
      // Allow only digits 1-4, strip other characters
      let v = String(this.form.yearLevel || "").replace(/[^0-9]/g, "");
      if (v === "") {
        this.form.yearLevel = "";
        return;
      }
      let num = parseInt(v, 10);
      if (isNaN(num)) {
        this.form.yearLevel = "";
        return;
      }
      if (num < 1) num = 1;
      if (num > 4) num = 4;
      this.form.yearLevel = String(num);
    },
    validateForm() {
      // reset
      this.errors = { firstName:"", lastName:"", idNumber:"", contactNumber:"", emailAddress:"", password:"" };
      let ok = true;
      if (!this.form.firstName.trim()) { this.errors.firstName = 'First name is required'; ok = false; }
      if (!this.form.lastName.trim()) { this.errors.lastName = 'Last name is required'; ok = false; }
      if (!this.idRegex.test(this.form.idNumber.trim())) { this.errors.idNumber = 'Use MCCYYYY-NNNN (e.g., MCC2025-0001)'; ok = false; }
      if (!this.phoneRegex.test(this.form.contactNumber.trim())) { this.errors.contactNumber = 'Use 09XXXXXXXXX or +639XXXXXXXXX'; ok = false; }
      if (!this.emailRegex.test(this.form.emailAddress.trim())) { this.errors.emailAddress = 'Invalid email'; ok = false; }
      if (!this.editTarget && (this.form.password || '').length < 6) { this.errors.password = 'Password must be at least 6 characters'; ok = false; }
      return ok;
    },
    async fetchStudents() {
      try {
        const res = await api.get("/admin/users?role=student"); // fetch only students from backend
        const users = res.data.users || [];
        this.students = users;
        console.log('🔄 Polled students:', this.students.length);
      } catch (e) {
        console.error("Failed to fetch students", e);
      }
    },
    setActiveSection(section) {
      this.activeSection = section;
    },
    setViewActiveSection(section) {
      this.viewActiveSection = section;
    },
    getYearLevelLabel(value) {
      const found = this.yearOptions.find((o) => o.value === String(value));
      return found ? found.label : "Select year level";
    },
    selectYearLevel(value) {
      this.form.yearLevel = value;
      this.showYearDropdown = false;
    },
    selectSection(value) {
      this.form.section = value;
      this.showSectionDropdown = false;
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
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },
    goToPage() {
      const raw = (this.goToPageInput || '').trim();
      if (!raw) return;
      const num = parseInt(raw, 10);
      if (isNaN(num)) return;
      if (num < 1 || num > this.totalPages) return;
      this.currentPage = num;
      this.goToPageInput = '';
    },
    openEditModal(u) {
      this.editTarget = u;
      this.form = {
        firstName: this.toTitleCase(u.firstName || ""),
        lastName: this.toTitleCase(u.lastName || ""),
        section: this.toTitleCase(u.section || ""),
        idNumber: u.idNumber || "MCC",
        emailAddress: (u.emailAddress || "").toLowerCase(),
        contactNumber: u.contactNumber || "",
        address: this.toTitleCase(u.address || ""),
        program: "BSIT",
        // ensure we start from numeric-only year level (1-4) in the edit form
        yearLevel: this.displayYearLevel(u.yearLevel),
        birthdate: u.birthdate ? new Date(u.birthdate).toISOString().slice(0,10) : "",
        password: "", // not editable here
      };
      const raw = (this.form.idNumber || "").toUpperCase().replace(/\s+/g, "");
      this.idNumberTail = raw.replace(/^MCC/, "");
      this.showModal = true;
    },
    openViewModal(u) {
      this.viewTarget = u;
      this.showViewModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    closeViewModal() {
      this.showViewModal = false;
      this.viewTarget = null;
    },
    showSuccessToast(message) {
      this.toast.message = message;
      this.toast.progress = 0;
      this.toast.visible = true;

      // trigger bar animation
      setTimeout(() => {
        this.toast.progress = 100;
      }, 10);

      setTimeout(() => {
        this.toast.visible = false;
        this.toast.progress = 0;
      }, 3000);
    },
    async submitForm() {
      try {
        // Basic validation aligned with Registration
        if (!this.validateForm()) return;

        this.saving = true;

        if (this.editTarget) {
          const yearLevelStr = String(this.form.yearLevel || '').trim();

          const payload = {
            firstName: this.toTitleCase(this.form.firstName.trim()),
            lastName: this.toTitleCase(this.form.lastName.trim()),
            section: this.toTitleCase((this.form.section || '').trim()),
            idNumber: this.form.idNumber.trim(),
            emailAddress: (this.form.emailAddress || '').trim().toLowerCase(),
            contactNumber: this.form.contactNumber.trim(),
            address: this.toTitleCase((this.form.address || '').trim()),
            program: 'BSIT',
            // send numeric string 1-4 for year level
            yearLevel: yearLevelStr || this.editTarget.yearLevel,
            birthdate: this.form.birthdate || "",
          };
          await api.patch(`/admin/users/${this.editTarget._id}`, payload);
          await this.fetchStudents();

          // If the Student Details modal is open for this same student,
          // refresh its data from the newly fetched list so year level updates.
          if (this.showViewModal && this.viewTarget && this.viewTarget._id === this.editTarget._id) {
            const updated = this.students.find((s) => s._id === this.editTarget._id);
            if (updated) {
              this.viewTarget = updated;
            }
          }

          // Keep the button in loading state briefly, then close modal
          setTimeout(() => {
            this.showModal = false;
            this.saving = false;
            // Show toast only after modal is closed
            this.showSuccessToast('Student updated successfully');
          }, 3000);

          return;
        }
        // Adding new students is disabled from Admin Manage Users.
      } catch (e) {
        console.error("Failed to submit form", e);
        alert("Failed to submit form");
      } finally {
        if (!this.editTarget) {
          // For safety: only auto-reset saving here when not in edit mode.
          this.saving = false;
        }
      }
    },
    confirmDelete(u) {
      this.deleteTarget = u;
    },
    async performDelete() {
      try {
        if (!this.deleteTarget) return;
        this.deletingStudent = true;
        await api.delete(`/admin/users/${this.deleteTarget._id}`);
        this.deleteTarget = null;
        await this.fetchStudents();

        // Show delete toast after the delete modal is closed
        this.showSuccessToast('Student deleted successfully');
      } catch (e) {
        console.error("Failed to delete user", e);
        alert("Failed to delete user");
      } finally {
        this.deletingStudent = false;
      }
    },
    async verifyOtp() {
      try {
        this.verifying = true;
        this.otpError = "";
        await api.post("/auth/verify-otp", { emailAddress: this.otpEmail, otp: this.otpCode });
        this.showOtpModal = false;
        await this.fetchStudents();
      } catch (e) {
        console.error("Failed to verify OTP", e);
        this.otpError = e?.response?.data?.message || "Invalid or expired code";
      } finally {
        this.verifying = false;
      }
    },
    async resendOtp() {
      try {
        if (this.resendIn > 0 || this.resendBusy) return;
        this.resendBusy = true;
        await api.post("/auth/resend-otp", { emailAddress: this.otpEmail });
        this.startResendTimer(30);
      } catch (e) {
        console.error("Failed to resend OTP", e);
        this.otpError = e?.response?.data?.message || "Failed to resend code";
      } finally {
        this.resendBusy = false;
      }
    },
    startResendTimer(seconds) {
      this.resendIn = seconds;
      if (this.resendTimerId) clearInterval(this.resendTimerId);
      this.resendTimerId = setInterval(() => {
        if (this.resendIn > 0) this.resendIn -= 1;
        if (this.resendIn <= 0 && this.resendTimerId) {
          clearInterval(this.resendTimerId);
          this.resendTimerId = null;
        }
      }, 1000);
    },
  },
};
</script>