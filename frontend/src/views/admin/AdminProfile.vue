<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold text-gray-900 mb-6">Admin Profile</h1>

    <div class="bg-white shadow rounded-lg p-6 max-w-3xl">
      <!-- Photo upload -->
      <div class="flex items-center gap-4 mb-6">
        <div class="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
          <img v-if="photoUrl" :src="photoUrl" alt="Profile" class="w-full h-full object-cover" />
          <span v-else class="text-gray-500 text-xl">👤</span>
        </div>
        <div class="flex items-center gap-2">
          <input id="photo-input" type="file" accept="image/*" @change="onPhotoSelected" class="hidden" />
          <label for="photo-input" class="px-3 py-1.5 border rounded cursor-pointer text-sm">Choose Photo</label>
          <button :disabled="!photoFile || uploadingPhoto" class="px-3 py-1.5 bg-gray-800 text-white rounded text-sm disabled:opacity-50" @click="uploadPhoto">
            {{ uploadingPhoto ? 'Uploading...' : 'Upload' }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs text-gray-600 mb-1">First Name</label>
          <input v-model="form.firstName" type="text" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-600 mb-1">Last Name</label>
          <input v-model="form.lastName" type="text" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div class="md:col-span-2">
          <label class="block text-xs text-gray-600 mb-1">Email</label>
          <input v-model="form.emailAddress" type="email" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-600 mb-1">Contact Number</label>
          <input v-model="form.contactNumber" type="text" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-600 mb-1">ID Number</label>
          <input v-model="form.idNumber" type="text" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-600 mb-1">Faculty Position</label>
          <input v-model="form.facultyPosition" type="text" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-600 mb-1">Section</label>
          <input v-model="form.section" type="text" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-600 mb-1">Program</label>
          <input v-model="form.program" type="text" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-600 mb-1">Year Level</label>
          <input v-model="form.yearLevel" type="text" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div class="md:col-span-2">
          <label class="block text-xs text-gray-600 mb-1">Address</label>
          <input v-model="form.address" type="text" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-600 mb-1">Birthdate</label>
          <input v-model="form.birthdate" type="date" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
      </div>

      <div class="mt-6 flex items-center gap-3">
        <button :disabled="saving" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50" @click="save">
          Save Changes
        </button>
        <span v-if="saved" class="text-sm text-emerald-600">Saved.</span>
        <span v-if="error" class="text-sm text-red-600">{{ error }}</span>
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
    }
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
      const cached = this.getCachedAdmin()
      const id = cached?._id || cached?.id
      if (!id) return
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