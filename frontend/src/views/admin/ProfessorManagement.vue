<template>
  <div class="admin-dashboard mt-1">
    <!-- Shared Toast notification -->
    <BaseToast
      :visible="toast.visible"
      :message="toast.message"
      :progress="toast.progress"
      :type="toast.type"
    />
    <!-- Real-time RFID Notification -->
    <div v-if="showRfidNotification" class="fixed top-4 right-4 z-50">
      <div class="bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg max-w-sm">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold">New RFID Detected</h3>
          <button @click="closeRfidNotification" class="text-white hover:text-blue-200">
            ✖
          </button>
        </div>
        <p class="text-sm mb-3">RFID: <strong class="font-mono">{{ detectedRfid }}</strong></p>
        <p class="text-xs opacity-90 mb-3">This RFID is not assigned to any professor.</p>
        <div class="flex gap-2">
          <button 
            @click="assignDetectedRfid"
            class="flex-1 bg-white text-blue-600 py-2 px-3 rounded text-sm font-medium hover:bg-blue-50"
          >
            Assign Now
          </button>
          <button 
            @click="useInCurrentForm"
            class="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-green-700"
          >
            Use in Form
          </button>
          <button 
            @click="closeRfidNotification"
            class="flex-1 bg-gray-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-gray-700"
          >
            Later
          </button>
        </div>
      </div>
    </div>

    <!-- Assign RFID Modal -->
    <div v-if="showAssignModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Assign RFID to Professor</h3>
          <button class="text-gray-400 hover:text-gray-600" @click="closeAssignModal">✖</button>
        </div>
        <div class="px-6 py-4">
          <p class="text-sm text-gray-700 mb-4">
            Assign RFID <strong class="font-mono">{{ detectedRfid }}</strong> to:
          </p>
          <select 
            v-model="selectedProfessorForAssignment"
            class="w-full border rounded px-3 py-2 text-sm mb-4"
          >
            <option value="">Select a professor...</option>
            <option 
              v-for="prof in professorsWithoutRfid" 
              :key="prof._id" 
              :value="prof._id"
            >
              {{ prof.firstName }} {{ prof.lastName }} - {{ prof.department || 'No department' }}
            </option>
          </select>
          <div v-if="selectedProfessorForAssignment" class="p-3 bg-blue-50 rounded">
            <p class="text-sm text-blue-700">
              Will assign to: <strong>{{ getProfessorName(selectedProfessorForAssignment) }}</strong>
            </p>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button class="px-4 py-2 rounded border" @click="closeAssignModal">Cancel</button>
          <button 
            class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            @click="confirmRfidAssignment"
            :disabled="!selectedProfessorForAssignment"
          >
            Assign RFID
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <!-- Skeleton state -->
      <div v-if="loading" class="px-6 py-4 border-b border-gray-200 bg-slate-50">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-pulse">
          <div class="flex flex-1 items-center gap-3">
            <div class="h-9 flex-1 max-w-md bg-slate-200 rounded-lg"></div>
            <div class="h-9 w-40 bg-slate-200 rounded-lg"></div>
          </div>
          <div class="h-4 w-40 bg-slate-200 rounded self-end"></div>
        </div>
        <div class="mt-4 h-9 bg-slate-100 rounded-lg animate-pulse"></div>
        <div class="mt-2 space-y-2 animate-pulse">
          <div v-for="n in 6" :key="n" class="h-10 bg-slate-100 rounded-lg"></div>
        </div>
      </div>

      <div
        v-else
        class="px-6 py-4 border-b border-gray-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-slate-50"
      >
        <div class="flex flex-1 items-center gap-3">
          <div class="relative flex-1 max-w-md">
            <input
              v-model="query"
              type="text"
              placeholder="Search by name, email or department..."
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

          <!-- Status dropdown (custom, copied from Manage Users) -->
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

        <!-- Right side: connection status and Add Professor -->
        <div class="flex items-center gap-3 justify-end">
          <div
            class="flex items-center gap-2 px-3 py-1 rounded-full text-[11px] border"
            :class="connectionStatus.class"
          >
            <div class="w-2 h-2 rounded-full" :class="connectionStatus.dotClass"></div>
            {{ connectionStatus.text }}
          </div>

          <button
            class="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-[11px] font-medium bg-[#001740] text-white hover:bg-[#102A71] shadow-sm whitespace-nowrap"
            @click="openAddModal"
          >
            <svg
              class="w-3.5 h-3.5"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 4V16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M4 10H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span>Add Professor</span>
          </button>
        </div>
      </div>

      <div v-if="!loading" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RFID ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="p in paginatedProfessors"
              :key="p._id"
              class="hover:bg-gray-50 cursor-pointer"
              @click="openViewModal(p)"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ (p.firstName || '') + ' ' + (p.lastName || '') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ p.facultyPosition || p.department || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span v-if="p.idNumber" class="font-mono bg-gray-100 px-2 py-1 rounded">{{ p.idNumber }}</span>
                <span v-else class="text-gray-400 italic">Not assigned</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ p.emailAddress }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium"
                  :class="p.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ p.isVerified ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                <div class="inline-flex items-center justify-center gap-2">
                  <button
                    class="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 inline-flex items-center justify-center gap-1 text-xs"
                    @click.stop="openScheduleModal(p)"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" stroke-width="1.6" />
                      <path d="M3 9H21" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                      <path d="M9 3V6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                      <path d="M15 3V6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                    </svg>
                    <span>Manage Schedule</span>
                  </button>
                  <button
                    class="px-2.5 py-1 rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 inline-flex items-center justify-center gap-1 text-xs"
                    @click.stop="resetPassword(p)"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3C8.68629 3 6 5.68629 6 9V10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                      <rect x="8" y="10" width="8" height="9" rx="2" stroke="currentColor" stroke-width="1.6" />
                      <path d="M12 13V15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                    </svg>
                    <span>Reset Password</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredProfessors.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500">
                No professors found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="!loading" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-xs sm:text-sm text-gray-600 bg-gray-50">
        <!-- Bottom-left: showing text -->
        <div class="hidden sm:block text-[11px] text-slate-500">
          Showing
          <span class="font-semibold text-[#001740]">{{ paginatedProfessors.length }}</span>
          of
          <span class="font-semibold text-[#001740]">{{ filteredProfessors.length }}</span>
          professors
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

    <!-- View Professor Modal -->
    <div
      v-if="viewTarget"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
    >
      <div class="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden" style="max-height: 90vh;">
        <!-- Header -->
        <div class="px-6 py-4 flex items-center justify-between bg-[#001740]">
          <div>
            <h3 class="text-base font-semibold text-white tracking-tight">Professor Details</h3>
            <p class="text-[11px] text-slate-200/90 mt-0.5">Review the information for this professor.</p>
          </div>
        </div>

        <!-- Body: profile layout -->
        <div class="px-0 py-0 bg-white text-sm text-slate-700">
          <div class="grid grid-cols-1 md:grid-cols-[260px,minmax(0,1fr)]">
            <!-- Left profile panel -->
            <div class="bg-slate-50/80 border-r border-slate-200 px-6 py-6 flex flex-col items-center gap-6">
              <!-- Avatar + basic info -->
              <div class="flex flex-col items-center text-center gap-3 w-full">
                <div class="w-20 h-20 rounded-2xl bg-slate-200 flex items-center justify-center text-base font-semibold text-slate-700">
                  {{ ((viewTarget.firstName || '').charAt(0) + (viewTarget.lastName || '').charAt(0)) || 'PR' }}
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-900">
                    {{ (viewTarget.firstName || '') + ' ' + (viewTarget.lastName || '') }}
                  </p>
                  <p class="text-xs text-slate-500 break-all">
                    {{ viewTarget.emailAddress || '-' }}
                  </p>
                  <div class="mt-2">
                    <span
                      class="inline-flex items-center justify-center px-4 py-1 rounded-full text-[11px] font-semibold border"
                      :class="viewTarget.isVerified
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                        : 'border-slate-300 bg-slate-50 text-slate-600'"
                    >
                      {{ viewTarget.isVerified ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Separator -->
              <div class="w-2/3 mx-auto border-t border-slate-200 my-0"></div>

              <!-- Quick actions -->
              <div class="w-full flex flex-col gap-2 mt-0.5">
                <!-- Enable / Disable -->
                <button
                  type="button"
                  class="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-medium shadow-sm"
                  :class="viewTarget?.isVerified
                    ? 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'"
                  @click="toggleDisable(viewTarget)"
                >
                  <svg
                    v-if="viewTarget?.isVerified"
                    class="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.6" />
                    <path d="M9 12H15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                  </svg>
                  <svg
                    v-else
                    class="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.6" />
                    <path d="M12 8V16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                    <path d="M8 12H16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                  </svg>
                  <span>{{ viewTarget?.isVerified ? 'Disable' : 'Enable' }}</span>
                </button>

                <!-- Edit -->
                <button
                  type="button"
                  class="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-[11px] font-medium text-blue-800 hover:bg-blue-100 shadow-sm"
                  @click="openEditModal(viewTarget); closeViewModal()"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 19L5.5 16.5L16.5 5.5L18.5 7.5L7.5 18.5L5 19Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M14.5 5.5L17 3L21 7L18.5 9.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span>Edit Professor</span>
                </button>

                <!-- Delete -->
                <button
                  type="button"
                  class="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border border-red-200 bg-red-50 text-[11px] font-medium text-red-700 hover:bg-red-100 shadow-sm"
                  @click="confirmDelete(viewTarget); closeViewModal()"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 7H19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                    <path d="M10 11V17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                    <path d="M14 11V17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                    <path d="M8 7L9 4H15L16 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                    <rect x="6" y="7" width="12" height="13" rx="2" stroke="currentColor" stroke-width="1.6" />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>

            <!-- Right details panel -->
            <div class="px-6 py-6 bg-slate-50/60">
              <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-3">Instructor Profile</p>

              <div class="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label class="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">First Name</label>
                  <div class="w-full rounded-lg bg-slate-100 border border-slate-200 px-3 py-2 text-sm text-slate-900">
                    {{ viewTarget.firstName || '-' }}
                  </div>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">Last Name</label>
                  <div class="w-full rounded-lg bg-slate-100 border border-slate-200 px-3 py-2 text-sm text-slate-900">
                    {{ viewTarget.lastName || '-' }}
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-3 mb-4">
                <div>
                  <label class="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">Department</label>
                  <div class="w-full rounded-lg bg-slate-100 border border-slate-200 px-3 py-2 text-sm text-slate-900">
                    {{ viewTarget.facultyPosition || viewTarget.department || '-' }}
                  </div>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">RFID ID</label>
                  <div class="w-full rounded-lg bg-slate-100 border border-slate-200 px-3 py-2 text-sm text-slate-900 font-mono">
                    {{ viewTarget.idNumber || 'Not assigned' }}
                  </div>
                </div>
              </div>

              <!-- Status field removed per design; status badge is shown under email on the left side -->
            </div>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2 bg-gray-50">
          <button
            type="button"
            class="px-3 py-1.5 rounded-md border border-gray-300 text-xs font-medium text-gray-700 bg-white hover:bg-slate-50"
            @click="closeViewModal"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Professor Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200">
        <!-- Header -->
        <div class="px-6 py-4 flex items-center justify-between bg-[#001740]">
          <div>
            <h3 class="text-base font-semibold text-white tracking-tight">
              {{ editTarget ? 'Edit Professor' : 'Add Professor' }}
            </h3>
            <p class="text-[11px] text-slate-200/90 mt-0.5">
              {{ editTarget ? 'Update the details of this professor.' : 'Create a new professor account.' }}
            </p>
          </div>
        </div>

        <!-- Body -->
        <form class="px-6 py-5 space-y-5 bg-slate-50/60" @submit.prevent="submitProfessor">
          <!-- Name -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">First Name</label>
              <input
                v-model="form.firstName"
                type="text"
                required
                class="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 capitalize focus:outline-none focus:ring-2 focus:ring-[#001740]/30 focus:border-[#001740]"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Last Name</label>
              <input
                v-model="form.lastName"
                type="text"
                required
                class="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 capitalize focus:outline-none focus:ring-2 focus:ring-[#001740]/30 focus:border-[#001740]"
              />
            </div>
          </div>

          <!-- Email & Department -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Email</label>
              <input
                v-model="form.emailAddress"
                type="email"
                required
                class="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#001740]/30 focus:border-[#001740]"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Department</label>
              <input
                v-model="form.department"
                type="text"
                class="w-full rounded-lg bg-slate-100 border border-slate-200 px-3 py-2 text-sm text-slate-900 capitalize"
                readonly
              />
            </div>
          </div>

          <!-- RFID & Password -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">RFID ID</label>
              <div class="flex gap-2">
                <input
                  v-model="form.rfidId"
                  type="text"
                  class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono bg-slate-50"
                  :class="detectedRfid ? 'bg-blue-50 border-blue-300' : ''"
                  placeholder="Tap RFID card or enter manually"
                  :disabled="true"
                />
                <button
                  v-if="detectedRfid && !editTarget && !form.rfidId"
                  type="button"
                  @click="useDetectedRfid"
                  class="px-3 py-2 rounded-lg bg-[#001740] text-white text-[11px] font-medium hover:bg-[#001740]/90 whitespace-nowrap shadow-sm"
                >
                  Use Detected
                </button>
              </div>
              <p v-if="detectedRfid && !editTarget" class="text-[11px] text-blue-600 mt-1">
                RFID <strong>{{ detectedRfid }}</strong> detected and ready for assignment
              </p>
              <p v-else-if="form.rfidId" class="text-[11px] text-emerald-600 mt-1">
                RFID assigned: {{ form.rfidId }}
              </p>
              <p v-else class="text-[11px] text-slate-500 mt-1">
                Tap an RFID card or use the detected RFID to assign
              </p>
            </div>

            <div v-if="!editTarget">
              <label class="block text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Password</label>
              <input
                v-model="form.password"
                type="password"
                required
                class="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#001740]/30 focus:border-[#001740]"
              />
              <p class="mt-1 text-[11px] text-slate-500">A verification code will be emailed to this professor.</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="submit"
              class="px-5 py-1.5 rounded-full bg-[#001740] text-xs font-semibold text-white shadow-sm hover:bg-[#001740]/90 inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="savingProfessor"
            >
              <span
                v-if="savingProfessor"
                class="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin"
              ></span>
              <span>{{ savingProfessor ? 'Saving…' : (editTarget ? 'Save Changes' : 'Create Professor') }}</span>
            </button>
            <button
              type="button"
              class="px-4 py-1.5 rounded-full border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50"
              @click="closeModal"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Manual Schedule Modal -->
    <div v-if="scheduleTarget" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-[#001740]/10">
        <div class="px-6 py-4 border-b border-[#001740]/10 flex items-center bg-[#001740] text-white">
          <h3 class="text-lg font-semibold tracking-tight">
            Set Schedule for {{ scheduleTarget.firstName }} {{ scheduleTarget.lastName }}
          </h3>
        </div>
        
        <div class="px-6 py-5 bg-slate-50/60 overflow-auto" style="max-height: calc(90vh - 120px)">
          <!-- Schedule Builder Form -->
          <div class="mb-6 p-4 md:p-5 bg-white rounded-xl border border-[#001740]/10 shadow-sm">
            <h4 class="text-sm font-semibold tracking-wide text-[#001740] uppercase mb-1">Add schedule entry</h4>
            <p class="text-xs text-slate-500 mb-4">Choose the day, time, subject, and room, then add it to this professor's weekly schedule.</p>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label class="block text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Day</label>
                <div class="relative">
                  <button
                    type="button"
                    @click="showDayDropdown = !showDayDropdown"
                    class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-left text-sm text-slate-800 flex items-center justify-between shadow-sm focus:outline-none focus:ring-2 focus:ring-[#001740]/40 focus:border-[#001740] transition-all duration-200"
                  >
                    <span>{{ newSchedule.day }}</span>
                    <svg
                      class="w-4 h-4 text-slate-500 transition-transform duration-200"
                      :class="{ 'rotate-180': showDayDropdown }"
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
                      v-if="showDayDropdown"
                      class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                      <div class="py-1">
                        <button
                          v-for="day in days"
                          :key="day"
                          type="button"
                          @click="selectDay(day)"
                          class="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors duration-150"
                          :class="{ 'bg-slate-50 text-[#001740]': newSchedule.day === day }"
                        >
                          {{ day }}
                        </button>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
              
              <div>
                <label class="block text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Start Time</label>
                <div class="relative">
                  <button
                    type="button"
                    @click="showStartDropdown = !showStartDropdown"
                    class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-left text-sm text-slate-800 flex items-center justify-between shadow-sm focus:outline-none focus:ring-2 focus:ring-[#001740]/40 focus:border-[#001740] transition-all duration-200"
                  >
                    <span>{{ formatTimeDisplay(newSchedule.startTime) }}</span>
                    <svg
                      class="w-4 h-4 text-slate-500 transition-transform duration-200"
                      :class="{ 'rotate-180': showStartDropdown }"
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
                      v-if="showStartDropdown"
                      class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                      <div class="py-1">
                        <button
                          v-for="time in timeOptions"
                          :key="'start-' + time.value"
                          type="button"
                          @click="selectStartTime(time.value)"
                          class="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors duration-150"
                          :class="{ 'bg-slate-50 text-[#001740]': newSchedule.startTime === time.value }"
                        >
                          {{ time.label }}
                        </button>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
              
              <div>
                <label class="block text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">End Time</label>
                <div class="relative">
                  <button
                    type="button"
                    @click="showEndDropdown = !showEndDropdown"
                    class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-left text-sm text-slate-800 flex items-center justify-between shadow-sm focus:outline-none focus:ring-2 focus:ring-[#001740]/40 focus:border-[#001740] transition-all duration-200"
                  >
                    <span>{{ formatTimeDisplay(newSchedule.endTime) }}</span>
                    <svg
                      class="w-4 h-4 text-slate-500 transition-transform duration-200"
                      :class="{ 'rotate-180': showEndDropdown }"
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
                      v-if="showEndDropdown"
                      class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                      <div class="py-1">
                        <button
                          v-for="time in endTimeOptions"
                          :key="'end-' + time.value"
                          type="button"
                          @click="selectEndTime(time.value)"
                          class="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors duration-150"
                          :class="{ 'bg-slate-50 text-[#001740]': newSchedule.endTime === time.value }"
                        >
                          {{ time.label }}
                        </button>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
              
              <div>
                <label class="block text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Subject</label>
                <input
                  v-model="newSchedule.subject"
                  type="text"
                  class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#001740]/40 focus:border-[#001740]"
                  placeholder="e.g., Mathematics"
                  @input="newSchedule.subject = (newSchedule.subject || '').replace(/\b\w/g, c => c.toUpperCase())"
                >
              </div>
              
              <div>
                <label class="block text-[11px] font-semibold uppercase tracking-wide text-slate-600 mb-1">Room</label>
                <input
                  v-model="newSchedule.room"
                  type="text"
                  class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#001740]/40 focus:border-[#001740]"
                  placeholder="e.g., Room 101"
                  @input="newSchedule.room = (newSchedule.room || '').replace(/\b\w/g, c => c.toUpperCase())"
                >
              </div>
            </div>
            
            <div class="mt-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div class="text-[11px] md:text-xs text-slate-600 flex items-center gap-2">
                <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#F5C400]/15 text-[10px] font-bold text-[#001740] border border-[#F5C400]/40">
                  ⏱
                </span>
                <span>
                  <span class="font-semibold text-[#001740]">Duration:</span>
                  {{ calculateDuration() }}
                </span>
              </div>
              <button
                @click="addScheduleEntry"
                :disabled="!isValidSchedule"
                class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-semibold text-[11px] shadow-sm transition-all disabled:bg-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed"
                :class="isValidSchedule
                  ? 'bg-[#F5C400] text-[#001740] hover:bg-[#F5C400]/90'
                  : 'bg-slate-200 text-slate-600'"
              >
                <svg
                  class="w-3 h-3"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" stroke-width="1.4" />
                  <path d="M10 6V14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
                  <path d="M6 10H14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
                </svg>
                <span>Add to Schedule</span>
              </button>
            </div>
          </div>

          <!-- Current Schedule List -->
          <div v-if="currentSchedule.length > 0" class="mb-6">
            <h4 class="text-sm font-semibold tracking-wide text-[#001740] uppercase mb-2">Current schedule entries</h4>
            <div class="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
              <div v-for="(schedule, index) in currentSchedule" :key="schedule.id" 
                   class="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:bg-slate-50">
                <div class="flex flex-wrap items-center gap-3 md:gap-6">
                  <span class="text-xs md:text-sm font-semibold text-[#001740] min-w-[80px]">{{ schedule.day }}</span>
                  <span class="text-xs md:text-sm text-slate-600 min-w-[130px]">{{ formatTimeDisplay(schedule.startTime) }} - {{ formatTimeDisplay(schedule.endTime) }}</span>
                  <span class="text-xs md:text-sm text-[#001740] font-semibold">{{ schedule.subject }}</span>
                  <span class="text-xs md:text-sm text-slate-500">{{ schedule.room }}</span>
                  <span class="text-[10px] md:text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    {{ formatDurationForSchedule(schedule.startTime, schedule.endTime) }}
                  </span>
                </div>
                <button @click="removeScheduleItem(index)" 
                        class="text-red-600 hover:text-red-800 text-xs md:text-sm font-medium">
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- Weekly Schedule Grid -->
          <div class="border border-[#001740]/10 rounded-xl overflow-hidden bg-white">
            <h4 class="text-sm font-semibold tracking-wide text-[#001740] uppercase mb-0 p-4 border-b bg-slate-50/60">
              Weekly schedule overview
            </h4>
            <div class="relative">
              <!-- Time labels -->
              <div class="flex">
                <div class="w-24 flex-shrink-0"></div>
                <div v-for="day in days" :key="day" class="flex-1 text-center py-3 text-xs md:text-sm font-medium text-slate-700 border-b bg-white">
                  {{ day }}
                </div>
              </div>
              
              <!-- Schedule grid -->
              <div class="flex">
                <!-- Time column (1-hour intervals) -->
                <div class="w-24 flex-shrink-0 border-r bg-slate-50/60">
                  <div
                    v-for="time in timeOptions"
                    :key="time.value"
                    class="h-16 border-b text-[10px] md:text-xs text-slate-500 flex items-center justify-center"
                  >
                    {{ time.label }}
                  </div>
                </div>
                
                <!-- Days columns -->
                <div v-for="day in days" :key="day" class="flex-1 relative border-r last:border-r-0">
                  <!-- Time slots background (1-hour intervals) -->
                  <div
                    v-for="time in timeOptions"
                    :key="time.value"
                    class="h-16 border-b hover:bg-slate-50 cursor-pointer flex items-center justify-center"
                    @click="selectTimeSlot(day, time.value)"
                  >
                  </div>
                  
                  <!-- Schedule blocks -->
                  <div v-for="schedule in getSchedulesForDay(day)" 
                       :key="schedule.id"
                       class="absolute left-1 right-1 rounded-lg border-2 p-2 shadow-sm"
                       :class="getScheduleBlockClass(schedule)"
                       :style="getScheduleBlockStyle(schedule)">
                    <div class="text-[10px] md:text-xs font-semibold truncate">{{ schedule.subject }}</div>
                    <div class="text-[10px] md:text-xs truncate">{{ schedule.room }}</div>
                    <div class="text-[10px] md:text-xs opacity-80">
                      {{ formatTimeDisplay(schedule.startTime) }}-{{ formatTimeDisplay(schedule.endTime) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="px-5 py-3 border-t border-[#001740]/10 flex items-center justify-end gap-2.5 bg-slate-50/80">
          <button
            class="px-5 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-colors inline-flex items-center justify-center gap-2"
            :class="currentSchedule.length === 0 || savingSchedule
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-[#001740] text-white hover:bg-[#001740]/90'"
            @click="saveSchedule"
            :disabled="currentSchedule.length === 0 || savingSchedule"
          >
            <span
              v-if="savingSchedule"
              class="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin"
            ></span>
            <span>
              {{ currentSchedule.length === 0 ? 'No Schedule Entries' : (savingSchedule ? 'Saving…' : 'Save Schedule') }}
            </span>
          </button>
          <button
            class="px-4 py-1.5 rounded-full border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            @click="closeScheduleModal"
          >
            Cancel
          </button>
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
            <h3 class="text-sm font-semibold text-red-800">Delete professor</h3>
            <p class="text-xs text-red-600 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <div class="px-6 py-4 text-sm text-slate-700">
          Are you sure you want to delete
          <span class="font-semibold text-slate-900">
            {{ (deleteTarget.firstName || '') + ' ' + (deleteTarget.lastName || '') }}
          </span>
          from the professor list?
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
            :disabled="deletingProfessor"
          >
            <span
              v-if="deletingProfessor"
              class="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin"
            ></span>
            <span>{{ deletingProfessor ? 'Deleting…' : 'Delete professor' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import api from "@/utils/api"
import BaseToast from "@/components/ui/BaseToast.vue"

// Toast state (aligned with ManageUsers.vue but with type support)
const toast = ref({ visible: false, message: '', progress: 0, type: 'success' })
const savingSchedule = ref(false)
const savingProfessor = ref(false)
const deletingProfessor = ref(false)
const pollInterval = ref(null) // Added for polling

const toTitleCase = (s) => {
  if (!s) return ""
  return String(s).replace(/\b\w+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}

const showToast = (message, type = 'success') => {
  toast.value.message = message
  toast.value.type = type
  toast.value.progress = 0
  toast.value.visible = true

  // Trigger bar animation
  setTimeout(() => {
    toast.value.progress = 100
  }, 10)

  setTimeout(() => {
    toast.value.visible = false
    toast.value.progress = 0
  }, 3000)
}

// Reactive data
const professors = ref([])
const loading = ref(false)
const query = ref("")
const statusFilter = ref("")
const showStatusDropdown = ref(false)
const currentPage = ref(1)
const pageSize = ref(6)
const goToPageInput = ref("")
const showModal = ref(false)
const editTarget = ref(null)
const viewTarget = ref(null)
const deleteTarget = ref(null)
const scheduleTarget = ref(null)

// RFID Real-time Detection
const showRfidNotification = ref(false)
const detectedRfid = ref('')
const showAssignModal = ref(false)
const selectedProfessorForAssignment = ref('')

// Connection status
let pollingInterval = null
const isConnected = ref(true)
const lastPollTime = ref('')

// Schedule management data
const currentSchedule = ref([])
const newSchedule = ref({
  day: 'Monday',
  startTime: 7,
  endTime: 8,
  subject: '',
  room: ''
})

const showDayDropdown = ref(false)
const showStartDropdown = ref(false)
const showEndDropdown = ref(false)

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

// Generate hourly time options from 7:00 AM to 6:00 PM (used for grid and dropdowns)
const timeOptions = computed(() => {
  const options = []
  for (let hour = 7; hour <= 18; hour++) {
    options.push({
      value: hour,
      label: hour === 12 ? '12:00 PM' :
             hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`
    })
  }
  return options
})

// End time options: only hours strictly after the selected start time
const endTimeOptions = computed(() => {
  return timeOptions.value.filter(opt => opt.value > newSchedule.value.startTime)
})

// Form data
const form = ref({
  firstName: "",
  lastName: "",
  emailAddress: "",
  department: "CCS",
  rfidId: "",
  password: "",
})

// Status filter options (copied style from Manage Users)
const statusOptions = [
  { value: "", label: "All status", description: "Show all professors" },
  { value: "active", label: "Active", description: "Professors with verified accounts" },
  { value: "inactive", label: "Inactive", description: "Professors not yet verified" },
]

// Connection status
const connectionStatus = computed(() => {
  return {
    text: 'Connected (Polling)',
    // Light green pill styling
    class: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500'
  }
})

// Computed properties
const filteredProfessors = computed(() => {
  const q = query.value.trim().toLowerCase()
  let list = professors.value.filter((p) => {
    const name = ((p.firstName || "") + " " + (p.lastName || "")).toLowerCase()
    const email = (p.emailAddress || "").toLowerCase()
    const dept = (p.facultyPosition || p.department || "").toLowerCase()
    return name.includes(q) || email.includes(q) || dept.includes(q)
  })
  
  if (statusFilter.value === "active") {
    list = list.filter((p) => !!p.isVerified)
  } else if (statusFilter.value === "inactive") {
    list = list.filter((p) => !p.isVerified)
  }
  return list
})

const paginatedProfessors = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProfessors.value.slice(start, end)
})

const totalPages = computed(() => {
  if (filteredProfessors.value.length === 0) return 1
  return Math.ceil(filteredProfessors.value.length / pageSize.value)
})

const pageNumbers = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  if (current <= 3) {
    pages.push(1, 2, 3, 4, '...', total)
  } else if (current >= total - 2) {
    pages.push(1, '...', total - 3, total - 2, total - 1, total)
  } else {
    pages.push(1, '...', current - 1, current, current + 1, '...', total)
  }

  return pages
})

const professorsWithoutRfid = computed(() => {
  return professors.value.filter(prof => !prof.idNumber)
})

// Get all used RFID IDs to prevent duplicates
const usedRfidIds = computed(() => {
  return professors.value
    .filter(prof => prof.idNumber)
    .map(prof => prof.idNumber)
})

// Status dropdown helpers (aligned with Manage Users)
const getStatusLabel = (value) => {
  const found = statusOptions.find((o) => o.value === value)
  return found ? found.label : "All status"
}

const selectStatus = (value) => {
  statusFilter.value = value
  showStatusDropdown.value = false
}

const isValidSchedule = computed(() => {
  return newSchedule.value.startTime < newSchedule.value.endTime && 
         newSchedule.value.subject.trim() !== '' &&
         newSchedule.value.room.trim() !== ''
})

// Time selection helpers for 15-minute dropdowns
const selectDay = (day) => {
  newSchedule.value.day = day
  showDayDropdown.value = false
}

const selectStartTime = (value) => {
  newSchedule.value.startTime = value
  // If end time is before or equal to start, default to +1 hour (respecting max 7PM)
  if (newSchedule.value.endTime <= value) {
    const proposedEnd = value + 1
    newSchedule.value.endTime = proposedEnd > 19 ? 19 : proposedEnd
  }
  showStartDropdown.value = false
}

const selectEndTime = (value) => {
  newSchedule.value.endTime = value
  showEndDropdown.value = false
}

// Watch for detected RFID changes
watch(detectedRfid, (newRfid) => {
  if (newRfid && usedRfidIds.value.includes(newRfid)) {
    console.log('⚠️ RFID already in use, ignoring:', newRfid)
    detectedRfid.value = '' // Clear if already used
    return
  }
})

// ==============================
// 🔹 Polling Functions (NEW)
// ==============================
const startDataPolling = () => {
  // Clear any existing interval
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
  }
  
  // Start new polling interval (2000ms = 2 seconds)
  pollInterval.value = setInterval(() => {
    fetchProfessors();
  }, 2000);
  console.log('🔄 Started polling professors every 2 seconds');
}

const stopDataPolling = () => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value);
    pollInterval.value = null;
    console.log('🛑 Stopped polling professors');
  }
}

// HTTP Polling for RFID Detection
const startRfidPolling = () => {
  console.log('🔄 Starting RFID polling every 3 seconds...')
  
  // Poll immediately first time
  pollForNewRfids()
  
  // Then set up interval
  pollingInterval = setInterval(() => {
    pollForNewRfids()
  }, 3000)
}

const pollForNewRfids = async () => {
  try {
    const response = await api.get('/rfid/recent-unknown')
    if (response.data.success && response.data.data) {
      const recentRfids = response.data.data
      if (recentRfids.length > 0) {
        const latestRfid = recentRfids[0]
        // Only process if it's a new RFID we haven't seen and not already used
        if (latestRfid.uid !== detectedRfid.value && !usedRfidIds.value.includes(latestRfid.uid)) {
          console.log('📨 Polling found new RFID:', latestRfid.uid)
          handleUnknownRfid(latestRfid.uid)
        }
      }
      lastPollTime.value = new Date().toLocaleTimeString()
    }
  } catch (error) {
    console.error('❌ Polling error:', error)
  }
}

const handleUnknownRfid = (rfid) => {
  console.log('🔔 Unknown RFID detected:', rfid)
  detectedRfid.value = rfid
  showRfidNotification.value = true
  
  // Auto-hide notification after 15 seconds
  setTimeout(() => {
    if (showRfidNotification.value) {
      closeRfidNotification()
    }
  }, 15000)
}

const closeRfidNotification = () => {
  showRfidNotification.value = false
  detectedRfid.value = ''
}

const assignDetectedRfid = () => {
  showRfidNotification.value = false
  showAssignModal.value = true
  selectedProfessorForAssignment.value = ''
}

const useInCurrentForm = () => {
  if (showModal.value) {
    // If add/edit modal is open, auto-fill the RFID field
    form.value.rfidId = detectedRfid.value
  } else {
    // If no modal is open, open the add modal with the RFID pre-filled
    openAddModal()
    form.value.rfidId = detectedRfid.value
  }
  showRfidNotification.value = false
}

const useDetectedRfid = () => {
  form.value.rfidId = detectedRfid.value
  detectedRfid.value = '' // Clear after using
}

const closeAssignModal = () => {
  showAssignModal.value = false
  selectedProfessorForAssignment.value = ''
  detectedRfid.value = '' // Clear detected RFID when closing assign modal
}

const getProfessorName = (professorId) => {
  const professor = professors.value.find(p => p._id === professorId)
  return professor ? `${professor.firstName} ${professor.lastName}` : ''
}

const confirmRfidAssignment = async () => {
  try {
    if (!selectedProfessorForAssignment.value) {
      alert('Please select a professor')
      return
    }

    const payload = {
      rfid: detectedRfid.value,
      userId: selectedProfessorForAssignment.value,
      userRole: 'professor'
    }

    await api.post('/rfid/assign', payload)
    
    // Refresh professors list
    await fetchProfessors()
    
    // Clear detected RFID
    detectedRfid.value = ''
    
    showAssignModal.value = false
    selectedProfessorForAssignment.value = ''
    
    alert('RFID assigned successfully!')
    
  } catch (error) {
    console.error('Error assigning RFID:', error)
    alert(error.response?.data?.message || 'Failed to assign RFID')
  }
}

// Existing methods
const fetchProfessors = async () => {
  try {
    const res = await api.get("/admin/professors")
    professors.value = res.data.professors || []
    console.log('🔄 Polled professors:', professors.value.length)
  } catch (e) {
    console.error("Failed to fetch professors", e)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}

const goToPage = () => {
  const raw = String(goToPageInput.value || '').trim()
  const num = Number(raw)
  if (!num || isNaN(num)) return
  if (num < 1) {
    currentPage.value = 1
  } else if (num > totalPages.value) {
    currentPage.value = totalPages.value
  } else {
    currentPage.value = num
  }
  goToPageInput.value = String(currentPage.value)
}

const openViewModal = (prof) => {
  viewTarget.value = prof
}

const closeViewModal = () => {
  viewTarget.value = null
}

const openAddModal = () => {
  editTarget.value = null
  form.value = {
    firstName: "",
    lastName: "",
    emailAddress: "",
    department: "CCS",
    rfidId: detectedRfid.value || "", // Pre-fill with detected RFID
    password: "",
  }
  showModal.value = true
}

const openEditModal = (p) => {
  editTarget.value = p
  form.value = {
    firstName: p.firstName || "",
    lastName: p.lastName || "",
    emailAddress: p.emailAddress || "",
    department: p.facultyPosition || p.department || "",
    rfidId: p.idNumber || "", // Use idNumber field from database
    password: "",
  }
  showModal.value = true
}

const openScheduleModal = async (p) => {
  scheduleTarget.value = p
  currentSchedule.value = []
  
  try {
    // Load existing manual schedule if any - UPDATED ENDPOINT
    const response = await api.get(`/admin/professors/${p._id}/schedule/manual`)
    if (response.data.schedule) {
      currentSchedule.value = response.data.schedule
    }
  } catch (e) {
    // If 404, it means no schedule exists yet - that's fine
    if (e?.response?.status !== 404) {
      console.error('Failed to load schedule:', e)
    }
  }
}

const closeScheduleModal = () => {
  scheduleTarget.value = null
  currentSchedule.value = []
  resetNewSchedule()
}

const closeModal = () => {
  showModal.value = false
  detectedRfid.value = '' // Clear detected RFID when closing modal
}

const resetNewSchedule = () => {
  newSchedule.value = {
    day: 'Monday',
    startTime: 7,
    endTime: 8,
    subject: '',
    room: ''
  }
}

const submitProfessor = async () => {
  try {
    savingProfessor.value = true
    // Check if RFID is already used (except when editing the same professor)
    if (form.value.rfidId && usedRfidIds.value.includes(form.value.rfidId)) {
      const currentProfessor = editTarget.value
      if (!currentProfessor || currentProfessor.idNumber !== form.value.rfidId) {
        alert('This RFID is already assigned to another professor. Please use a different RFID.')
        return
      }
    }

    if (editTarget.value) {
      const payload = {
        firstName: toTitleCase(form.value.firstName),
        lastName: toTitleCase(form.value.lastName),
        emailAddress: form.value.emailAddress,
        idNumber: form.value.rfidId,
      }
      await api.patch(`/admin/users/${editTarget.value._id}`, payload)
      showModal.value = false
      await fetchProfessors()
      showToast('Professor updated successfully.', 'success')
      return
    }
    
    const payload = {
      role: "professor",
      emailAddress: form.value.emailAddress,
      password: form.value.password,
      firstName: toTitleCase(form.value.firstName),
      lastName: toTitleCase(form.value.lastName),
      idNumber: form.value.rfidId,
      contactNumber: "",
      facultyPosition: form.value.department,
    }
    await api.post("/admin/add-professor", payload)
    showModal.value = false
    await fetchProfessors()
    showToast('Professor created. A verification code has been sent to their email.', 'success')
  } catch (e) {
    console.error("Failed to submit professor", e)
    showToast('Failed to submit professor.', 'error')
  } finally {
    savingProfessor.value = false
  }
}

// Schedule management methods
const formatTimeDisplay = (time) => {
  if (time == null) return ''
  const hour = Math.floor(time)
  const minutes = Math.round((time - hour) * 60)
  let displayHour = hour
  let suffix = 'AM'

  if (hour === 0) {
    displayHour = 12
  } else if (hour === 12) {
    suffix = 'PM'
  } else if (hour > 12) {
    displayHour = hour - 12
    suffix = 'PM'
  }

  const minuteStr = minutes.toString().padStart(2, '0')
  return `${displayHour}:${minuteStr} ${suffix}`
}

const calculateDuration = () => {
  const duration = newSchedule.value.endTime - newSchedule.value.startTime
  if (duration <= 0) return '0 minutes'

  const totalMinutes = Math.round(duration * 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  const parts = []
  if (hours > 0) {
    parts.push(`${hours} hour${hours > 1 ? 's' : ''}`)
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`)
  }

  return parts.join(' ')
}

const formatDurationForSchedule = (startTime, endTime) => {
  const duration = endTime - startTime
  if (duration <= 0) return '0 minutes'

  const totalMinutes = Math.round(duration * 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  const parts = []
  if (hours > 0) {
    parts.push(`${hours} hour${hours > 1 ? 's' : ''}`)
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`)
  }

  return parts.join(' ')
}

const addScheduleEntry = () => {
  if (!isValidSchedule.value) {
    showToast('Please fill in all fields and ensure end time is after start time.', 'error')
    return
  }
  
  // Validate time range
  if (newSchedule.value.startTime < 7 || newSchedule.value.endTime > 19) {
    showToast('Schedule time must be between 7:00 AM and 6:00 PM.', 'error')
    return
  }

  // Validate duration (max 4 hours per session)
  const duration = newSchedule.value.endTime - newSchedule.value.startTime;
  if (duration > 4) {
    showToast('Schedule duration cannot exceed 4 hours per session.', 'error')
    return;
  }

  // Check for overlapping schedules on the same day
  const hasOverlap = currentSchedule.value.some(schedule => {
    if (schedule.day !== newSchedule.value.day) return false;
    
    return (
      (newSchedule.value.startTime >= schedule.startTime && newSchedule.value.startTime < schedule.endTime) ||
      (newSchedule.value.endTime > schedule.startTime && newSchedule.value.endTime <= schedule.endTime) ||
      (newSchedule.value.startTime <= schedule.startTime && newSchedule.value.endTime >= schedule.endTime)
    );
  });
  
  if (hasOverlap) {
    showToast('This time slot overlaps with an existing schedule on the same day!', 'error');
    return;
  }
  
  const scheduleEntry = {
    id: Date.now() + Math.random(),
    day: newSchedule.value.day,
    startTime: newSchedule.value.startTime,
    endTime: newSchedule.value.endTime,
    subject: newSchedule.value.subject.trim(),
    room: newSchedule.value.room.trim()
  };
  
  currentSchedule.value.push(scheduleEntry);
  // Sort schedules by day and time for better organization
  currentSchedule.value.sort((a, b) => {
    const dayOrder = { 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5 };
    if (dayOrder[a.day] !== dayOrder[b.day]) {
      return dayOrder[a.day] - dayOrder[b.day];
    }
    return a.startTime - b.startTime;
  });
  
  resetNewSchedule();
}

const removeScheduleItem = (index) => {
  currentSchedule.value.splice(index, 1)
}

const getSchedulesForDay = (day) => {
  return currentSchedule.value.filter(schedule => schedule.day === day)
}

const isSlotOccupied = (day, time) => {
  return currentSchedule.value.some(schedule => {
    if (schedule.day !== day) return false
    return time >= schedule.startTime && time < schedule.endTime
  })
}

const getScheduleBlockStyle = (schedule) => {
  // Use fixed pixel math aligned with the h-16 row height so blocks fully cover rows
  const rowHeight = 64 // h-16 ≈ 64px
  const startHour = schedule.startTime
  const endHour = schedule.endTime
  const duration = Math.max(endHour - startHour, 0)

  const top = (startHour - 7) * rowHeight + 2   // slight inset from row border
  const height = duration * rowHeight           // span the full duration up to the end time line

  return {
    top: `${top}px`,
    height: `${height}px`
  }
}

const getScheduleBlockClass = (schedule) => {
  // Solid light primary blue, consistent with dashboard palette
  return 'bg-[#E5ECFF] border border-[#102A71]/40 text-[#001740]'
}

const selectTimeSlot = (day, time) => {
  newSchedule.value.day = day
  newSchedule.value.startTime = time
  // Default to 1 hour duration; clamp to last allowed time
  const proposedEnd = time + 1
  newSchedule.value.endTime = proposedEnd > 19 ? 19 : proposedEnd
  // Auto-focus on subject input for better UX
  setTimeout(() => {
    const subjectInput = document.querySelector('input[placeholder*="Mathematics"]')
    if (subjectInput) subjectInput.focus()
  }, 100)
}

const saveSchedule = async () => {
  try {
    if (!scheduleTarget.value) return

    // Validate schedule entries
    if (currentSchedule.value.length === 0) {
      showToast('Please add at least one schedule entry before saving.', 'error')
      return
    }

    savingSchedule.value = true

    // Prepare data for API - remove temporary IDs
    const scheduleData = currentSchedule.value.map(schedule => ({
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      subject: schedule.subject,
      room: schedule.room
    }))

    console.log('Saving schedule data:', scheduleData)

    // Use manual schedule endpoint
    const response = await api.post(`/admin/professors/${scheduleTarget.value._id}/schedule/manual`, {
      schedule: scheduleData
    })

    if (response.data?.success) {
      const count = response.data.scheduleCount ?? scheduleData.length
      showToast(`Schedule saved successfully! ${count} entr${count === 1 ? 'y' : 'ies'} added.`, 'success')
      closeScheduleModal()
    } else {
      showToast('Failed to save schedule. Please try again.', 'error')
    }
  } catch (error) {
    console.error('Error saving schedule:', error)
    showToast('An error occurred while saving the schedule.', 'error')
  } finally {
    savingSchedule.value = false
  }
}

const confirmDelete = (p) => {
  deleteTarget.value = p
}

const performDelete = async () => {
  try {
    if (!deleteTarget.value) return
    deletingProfessor.value = true
    await api.delete(`/admin/users/${deleteTarget.value._id}`)
    deleteTarget.value = null
    await fetchProfessors()
    showToast('Professor deleted successfully.', 'success')
  } catch (e) {
    console.error("Failed to delete professor", e)
    showToast('Failed to delete professor.', 'error')
  } finally {
    deletingProfessor.value = false
  }
}

const toggleDisable = async (p) => {
  try {
    await api.patch(`/admin/users/${p._id}`, { isVerified: !p.isVerified })
    await fetchProfessors()
  } catch (e) {
    console.error("Failed to toggle account state", e)
    alert("Failed to update account state")
  }
}

const resetPassword = async (p) => {
  try {
    await api.post('/auth/forgot-password', { emailAddress: p.emailAddress })
    alert('Password reset email has been sent to ' + p.emailAddress + '.')
  } catch (e) {
    console.error('Failed to request password reset', e)
    alert(e?.response?.data?.message || 'Failed to request password reset')
  }
}

// Lifecycle
onMounted(() => {
  fetchProfessors()
  startDataPolling() // Start data polling
  startRfidPolling() // Start RFID polling
})

onUnmounted(() => {
  stopDataPolling() // Stop data polling
  if (pollingInterval) {
    clearInterval(pollingInterval) // Stop RFID polling
  }
})
</script>