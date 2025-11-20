<template>
  <div class="admin-dashboard mt-1">
    <!-- Skeleton loading (similar feel to dashboard) -->
    <div v-if="loading" class="bg-white/95 border border-slate-100 rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div class="flex flex-col md:flex-row">
        <!-- Left skeleton: avatar + buttons -->
        <div class="md:w-5/12 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50 px-6 py-6 flex flex-col gap-6">
          <div class="flex flex-col items-center text-center gap-3">
            <div class="w-28 h-28 rounded-2xl bg-slate-200"></div>
            <div class="space-y-2 w-32">
              <div class="h-3 bg-slate-200 rounded"></div>
              <div class="h-3 bg-slate-200 rounded w-24 mx-auto"></div>
            </div>
          </div>

          <div class="space-y-2 mt-2">
            <div class="flex items-center justify-center gap-2">
              <div class="w-24 h-8 bg-slate-200 rounded-full"></div>
              <div class="w-20 h-8 bg-slate-200 rounded-full"></div>
            </div>
            <div class="h-3 w-40 bg-slate-200 rounded mx-auto"></div>
          </div>

          <div class="mt-7 space-y-2">
            <div class="h-px w-full bg-slate-200 mb-5"></div>
            <div class="h-9 rounded-xl bg-slate-200"></div>
            <div class="h-9 rounded-xl bg-slate-200"></div>
            <div class="h-9 rounded-xl bg-slate-200"></div>
          </div>
        </div>

        <!-- Right skeleton: form fields -->
        <div class="md:w-7/12 px-6 py-6 flex flex-col gap-4">
          <div class="space-y-3">
            <div class="h-3 w-32 bg-slate-200 rounded"></div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="h-9 bg-slate-200 rounded-lg"></div>
              <div class="h-9 bg-slate-200 rounded-lg"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="h-9 bg-slate-200 rounded-lg"></div>
              <div class="h-9 bg-slate-200 rounded-lg"></div>
            </div>
          </div>

          <div class="space-y-3 mt-4">
            <div class="h-3 w-40 bg-slate-200 rounded"></div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="h-9 bg-slate-200 rounded-lg"></div>
              <div class="h-9 bg-slate-200 rounded-lg"></div>
            </div>
          </div>

          <div class="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
            <div class="h-4 w-40 bg-slate-200 rounded"></div>
            <div class="h-8 w-28 bg-slate-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white/95 border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div class="flex flex-col md:flex-row">
        <!-- Left sidebar: avatar + sections -->
        <div class="md:w-5/12 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50 px-6 py-6 flex flex-col gap-6">
          <div class="flex flex-col items-center text-center gap-3">
            <div class="w-36 h-36 rounded-2xl bg-slate-200 flex items-center justify-center overflow-hidden">
              <img
                v-if="photoUrl"
                :src="photoUrl"
                alt="Profile"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-xl font-semibold text-[#001740]">
                {{ ((form.firstName || 'A').charAt(0) + (form.lastName || 'P').charAt(0)).toUpperCase() }}
              </span>
            </div>
            <div>
              <div class="text-sm font-semibold text-[#001740]">
                {{ (form.firstName || 'Admin') + (form.firstName || form.lastName ? ' ' : '') + (form.lastName || '') }}
              </div>
              <div class="text-xs text-slate-500 break-all">
                {{ form.emailAddress || 'No email set' }}
              </div>
            </div>
          </div>

          <!-- Photo upload controls -->
          <div class="space-y-2">
            <div class="flex items-center justify-center gap-2">
              <input id="photo-input" type="file" accept="image/*" @change="onPhotoSelected" class="hidden" />
              <label
                for="photo-input"
                class="px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer inline-flex items-center gap-1"
              >
                <span>Choose Photo</span>
              </label>
              <button
                :disabled="!photoFile || uploadingPhoto"
                class="px-3 py-1.5 rounded-lg bg-[#001740] text-white text-[11px] font-medium hover:bg-[#102A71] disabled:opacity-50 disabled:cursor-not-allowed"
                @click="uploadPhoto"
              >
                {{ uploadingPhoto ? 'Uploading…' : 'Upload' }}
              </button>
            </div>
            <p v-if="photoError" class="text-[11px] text-red-600 text-center">{{ photoError }}</p>
            <p v-else class="text-[11px] text-slate-400 text-center">Max 2MB • JPG, PNG, GIF, WebP</p>
          </div>

          <!-- Profile sections buttons -->
          <div class="mt-7 space-y-2">
            <div class="h-px w-full bg-slate-200 mb-5"></div>

            <button
              type="button"
              @click="activeSection = 'personal'"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium border bg-white shadow-sm transition-colors"
              :class="activeSection === 'personal'
                ? 'border-[#001740] bg-[#001740]/5 text-[#001740]'
                : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'"
            >
              <span>Personal information</span>
            </button>
            <button
              type="button"
              @click="activeSection = 'academic'"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium border bg-white shadow-sm transition-colors"
              :class="activeSection === 'academic'
                ? 'border-[#001740] bg-[#001740]/5 text-[#001740]'
                : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'"
            >
              <span>Academic information</span>
            </button>
            <button
              type="button"
              @click="activeSection = 'contact'"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium border bg-white shadow-sm transition-colors"
              :class="activeSection === 'contact'
                ? 'border-[#001740] bg-[#001740]/5 text-[#001740]'
                : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'"
            >
              <span>Contact information</span>
            </button>
          </div>
        </div>

        <!-- Right content: sections -->
        <div class="md:w-7/12 px-6 py-6 flex flex-col">
          <div class="flex-1 space-y-6 pr-0 md:pr-1">
            <!-- Personal information -->
            <div v-if="activeSection === 'personal'" class="space-y-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Personal information</p>
              <div class="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <div class="text-xs font-medium text-slate-500 mb-0.5">First Name</div>
                  <input
                    v-model="form.firstName"
                    type="text"
                    class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#001740]/30 focus:border-[#001740]"
                  />
                </div>
                <div>
                  <div class="text-xs font-medium text-slate-500 mb-0.5">Last Name</div>
                  <input
                    v-model="form.lastName"
                    type="text"
                    class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#001740]/30 focus:border-[#001740]"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-1">
                <div>
                  <div class="text-xs font-medium text-slate-500 mb-0.5">Birthdate</div>
                  <input
                    v-model="form.birthdate"
                    type="date"
                    class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#001740]/30 focus:border-[#001740]"
                  />
                </div>
                <div>
                  <div class="text-xs font-medium text-slate-500 mb-0.5">Age</div>
                  <div class="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-800">
                    {{ computedAge || '-' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Academic / school information -->
            <div v-else-if="activeSection === 'academic'" class="space-y-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Academic information</p>
              <div class="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <div class="text-xs font-medium text-slate-500 mb-0.5">Program</div>
                  <input
                    v-model="form.program"
                    type="text"
                    class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#001740]/30 focus:border-[#001740]"
                  />
                </div>
                <div>
                  <div class="text-xs font-medium text-slate-500 mb-0.5">Faculty Position</div>
                  <input
                    v-model="form.facultyPosition"
                    type="text"
                    class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#001740]/30 focus:border-[#001740]"
                  />
                </div>

                <div>
                  <div class="text-xs font-medium text-slate-500 mb-0.5">ID Number</div>
                  <input
                    v-model="form.idNumber"
                    type="text"
                    class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#001740]/30 focus:border-[#001740] font-mono"
                  />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <div class="text-xs font-medium text-slate-500 mb-0.5">Year Level</div>
                    <input
                      v-model="form.yearLevel"
                      type="text"
                      class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#001740]/30 focus:border-[#001740]"
                    />
                  </div>
                  <div>
                    <div class="text-xs font-medium text-slate-500 mb-0.5">Section</div>
                    <input
                      v-model="form.section"
                      type="text"
                      class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#001740]/30 focus:border-[#001740]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact information -->
            <div v-else class="space-y-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Contact information</p>
              <div class="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <div class="text-xs font-medium text-slate-500 mb-0.5">Email</div>
                  <input
                    v-model="form.emailAddress"
                    type="email"
                    class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#001740]/30 focus:border-[#001740]"
                  />
                </div>
                <div>
                  <div class="text-xs font-medium text-slate-500 mb-0.5">Contact Number</div>
                  <input
                    v-model="form.contactNumber"
                    type="text"
                    class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#001740]/30 focus:border-[#001740]"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <div class="text-xs font-medium text-slate-500 mb-0.5">Address</div>
                  <input
                    v-model="form.address"
                    type="text"
                    class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#001740]/30 focus:border-[#001740]"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Footer actions -->
          <div class="pt-3 mt-4 flex items-center justify-between border-t border-slate-100">
            <div class="flex items-center gap-2 text-xs sm:text-[13px] text-slate-500">
              <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#001740]/5 text-[#001740] text-xs font-semibold">i</span>
              <span>Changes apply only to your admin account.</span>
            </div>
            <div class="flex items-center gap-3">
              <span v-if="saved" class="text-xs text-emerald-600">Saved successfully.</span>
              <span v-if="error" class="text-xs text-red-600">{{ error }}</span>
              <button
                :disabled="saving"
                class="px-4 py-2 rounded-full bg-[#001740] text-white text-xs font-semibold hover:bg-[#102A71] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                @click="save"
              >
                <span v-if="saving">Saving…</span>
                <span v-else>Save Changes</span>
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
  name: 'AdminProfile',
  data() {
    return {
      adminId: '',
      form: {
        firstName: '',
        lastName: '',
        emailAddress: '',
        contactNumber: '',
        address: '',
        program: '',
        yearLevel: '',
        birthdate: '',
        section: '',
        idNumber: '',
        facultyPosition: '',
      },
      photoUrl: '',
      photoFile: null,
      uploadingPhoto: false,
      saving: false,
      saved: false,
      error: '',
      photoError: '',
      activeSection: 'personal',
      loading: true,
    }
  },
  computed: {
    computedAge() {
      if (!this.form.birthdate) return '';
      const d = new Date(this.form.birthdate);
      if (isNaN(d.getTime())) return '';
      const today = new Date();
      let a = today.getFullYear() - d.getFullYear();
      const m = today.getMonth() - d.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < d.getDate())) a--;
      return a;
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    getCachedAdmin() {
      const keys = ['currentUser','user','admin']
      for (const k of keys) {
        const raw = localStorage.getItem(k)
        if (raw) { try { return JSON.parse(raw) } catch {} }
      }
      return null
    },
    async init() {
      const start = Date.now()
      this.loading = true
      const cached = this.getCachedAdmin()
      const id = cached?._id || cached?.id
      if (!id) {
        this.loading = false
        return
      }
      this.adminId = id
      try {
        const res = await api.get(`/admin/profile/${id}`)
        const a = res.data?.admin || {}
        this.form = {
          firstName: a.firstName || '',
          lastName: a.lastName || '',
          emailAddress: a.emailAddress || '',
          contactNumber: a.contactNumber || '',
          address: a.address || '',
          program: a.program || '',
          yearLevel: a.yearLevel || '',
          birthdate: a.birthdate ? new Date(a.birthdate).toISOString().slice(0,10) : '',
          section: a.section || '',
          idNumber: a.idNumber || '',
          facultyPosition: a.facultyPosition || '',
        }
        if (a.photoBase64 && a.photoMime) {
          this.photoUrl = `data:${a.photoMime};base64,${a.photoBase64}`
        } else {
          this.photoUrl = ''
        }
      } catch (e) {
        this.error = e?.response?.data?.message || 'Failed to load profile'
      } finally {
        const elapsed = Date.now() - start
        const remaining = Math.max(0, 1500 - elapsed)
        setTimeout(() => {
          this.loading = false
        }, remaining)
      }
    },
    async save() {
      if (!this.adminId) return
      this.saving = true
      this.saved = false
      this.error = ''
      try {
        const payload = { ...this.form }
        const res = await api.patch(`/admin/profile/${this.adminId}`, payload)
        const a = res.data?.admin
        if (a?.photoBase64 && a?.photoMime) {
          this.photoUrl = `data:${a.photoMime};base64,${a.photoBase64}`
        }
        if (res.data?.success) this.saved = true
      } catch (e) {
        this.error = e?.response?.data?.message || 'Failed to save profile'
      } finally {
        this.saving = false
      }
    },
    onPhotoSelected(e) {
      this.photoError = ''
      const file = e.target.files && e.target.files[0]
      if (!file) { this.photoFile = null; return }
      const allowed = ['image/png','image/jpeg','image/jpg','image/gif','image/webp']
      if (!allowed.includes(file.type)) {
        this.photoError = 'Unsupported file type'
        this.photoFile = null
        return
      }
      const maxBytes = 2 * 1024 * 1024
      if (file.size > maxBytes) {
        this.photoError = 'File too large (max 2MB)'
        this.photoFile = null
        return
      }
      this.photoFile = file
      const reader = new FileReader()
      reader.onload = () => { this.photoUrl = reader.result }
      reader.readAsDataURL(file)
    },
    async uploadPhoto() {
      if (!this.adminId || !this.photoFile) return
      this.uploadingPhoto = true
      this.photoError = ''
      try {
        const formData = new FormData()
        formData.append('file', this.photoFile)
        const res = await api.post(`/admin/profile/${this.adminId}/photo`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        const a = res.data?.admin
        if (a?.photoBase64 && a?.photoMime) {
          this.photoUrl = `data:${a.photoMime};base64,${a.photoBase64}`
        }
        this.photoFile = null
        const input = document.getElementById('photo-input')
        if (input) input.value = ''
      } catch (e) {
        this.photoError = e?.response?.data?.message || 'Failed to upload photo'
      } finally {
        this.uploadingPhoto = false
      }
    }
  }
}
</script>