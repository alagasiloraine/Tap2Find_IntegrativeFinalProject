<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Professor Management</h1>
      <button
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        @click="openAddModal"
      >
        <span class="mr-2">➕</span> Add Professor
      </button>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <input
            v-model="query"
            type="text"
            placeholder="Search by name, email or department..."
            class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
          />
          <select
            v-model="statusFilter"
            class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div class="text-sm text-gray-500">
          Showing {{ filteredProfessors.length }} of {{ professors.length }} professors
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RFID ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="p in filteredProfessors" :key="p._id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ (p.firstName || '') + ' ' + (p.lastName || '') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ p.facultyPosition || p.department || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ p.rfidId || p.rfid || p.idNumber || '-' }}
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                <button class="px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                        @click="openScheduleModal(p)">
                  {{ scheduleMeta[p._id] ? '📄 View Schedule' : '📅 Upload Schedule' }}
                </button>
                <button class="px-3 py-1.5 rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                        @click="openEditModal(p)">
                  ✏️ Edit
                </button>
                <button class="px-3 py-1.5 rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                        @click="confirmDelete(p)">
                  🗑️ Delete
                </button>
                <button class="px-3 py-1.5 rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
                        @click="resetPassword(p)">
                  🔑 Reset Password
                </button>
                <button
                  class="px-3 py-1.5 rounded-md"
                  :class="p.isVerified ? 'text-gray-700 bg-gray-100 hover:bg-gray-200' : 'text-green-700 bg-green-50 hover:bg-green-100'"
                  @click="toggleDisable(p)"
                >
                  {{ p.isVerified ? 'Disable' : 'Enable' }}
                </button>
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
    </div>

    <!-- Add/Edit Professor Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">{{ editTarget ? 'Edit Professor' : 'Add Professor' }}</h3>
          <button class="text-gray-400 hover:text-gray-600" @click="closeModal">✖</button>
        </div>
        <form class="px-6 py-4 space-y-4" @submit.prevent="submitProfessor">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs text-gray-600 mb-1">First Name</label>
              <input v-model="form.firstName" type="text" required class="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">Last Name</label>
              <input v-model="form.lastName" type="text" required class="w-full border rounded px-3 py-2 text-sm" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs text-gray-600 mb-1">Email</label>
              <input v-model="form.emailAddress" type="email" required class="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">Department</label>
              <input v-model="form.department" type="text" class="w-full border rounded px-3 py-2 text-sm" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs text-gray-600 mb-1">RFID ID</label>
              <input v-model="form.rfidId" type="text" class="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div v-if="!editTarget">
              <label class="block text-xs text-gray-600 mb-1">Password</label>
              <input v-model="form.password" type="password" required class="w-full border rounded px-3 py-2 text-sm" />
            </div>
          </div>
          <div class="pt-2 flex items-center justify-end gap-3">
            <button type="button" class="px-4 py-2 rounded border" @click="closeModal">Cancel</button>
            <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              {{ editTarget ? 'Save Changes' : 'Create Professor' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Upload Schedule Modal (placeholder) -->
    <div v-if="scheduleTarget" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Upload Schedule for {{ scheduleTarget.firstName }} {{ scheduleTarget.lastName }}</h3>
          <button class="text-gray-400 hover:text-gray-600" @click="scheduleTarget = null">✖</button>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div v-if="scheduleTarget && scheduleMeta[scheduleTarget._id]" class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Current schedule preview</span>
              <a
                class="text-sm text-indigo-600 hover:underline"
                :href="scheduleUrl(scheduleTarget._id, { download: true })"
                target="_blank"
                rel="noopener"
              >
                Download
              </a>
            </div>
            <iframe
              class="w-full border rounded"
              style="height: 420px;"
              :key="scheduleMeta[scheduleTarget._id]?.fileId || scheduleTarget._id"
              :src="scheduleUrl(scheduleTarget._id)"
            ></iframe>
          </div>
          <div class="space-y-2">
            <div class="text-sm text-gray-600">{{ scheduleMeta[scheduleTarget?._id] ? 'Upload a new file to replace the current schedule' : 'Upload a schedule file' }}</div>
            <input ref="scheduleFileInput" type="file" @change="onScheduleFile" class="w-full text-sm" />
          </div>
          <div class="flex items-center justify-end gap-3">
            <button class="px-4 py-2 rounded border" @click="scheduleTarget = null">Cancel</button>

            <button class="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700" @click="uploadSchedule">
              {{ scheduleMeta[scheduleTarget?._id] ? 'Replace' : 'Upload' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="deleteTarget" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Delete Professor</h3>
        </div>
        <div class="px-6 py-4 text-sm text-gray-700">
          Are you sure you want to delete
          <b>{{ (deleteTarget.firstName || '') + ' ' + (deleteTarget.lastName || '') }}</b>?
          This action cannot be undone.
        </div>
        <div class="px-6 py-4 flex items-center justify-end gap-3">
          <button class="px-4 py-2 rounded border" @click="deleteTarget = null">Cancel</button>
          <button class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700" @click="performDelete">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/plugin/axios.js";

export default {
  name: "ProfessorManagement",
  data() {
    return {
      professors: [],
      loading: false,
      query: "",
      statusFilter: "",
      showModal: false,
      editTarget: null,
      deleteTarget: null,
      scheduleTarget: null,
      scheduleFile: null,
      scheduleMeta: {},
      form: {
        firstName: "",
        lastName: "",
        emailAddress: "",
        department: "",
        rfidId: "",
        password: "",
      },
    };
  },
  computed: {
    filteredProfessors() {
      const q = this.query.trim().toLowerCase();
      let list = this.professors.filter((p) => {
        const name = ((p.firstName || "") + " " + (p.lastName || "")).toLowerCase();
        const email = (p.emailAddress || "").toLowerCase();
        const dept = (p.facultyPosition || p.department || "").toLowerCase();
        return name.includes(q) || email.includes(q) || dept.includes(q);
      });
      if (this.statusFilter === "active") {
        list = list.filter((p) => !!p.isVerified);
      } else if (this.statusFilter === "inactive") {
        list = list.filter((p) => !p.isVerified);
      }
      return list;
    },
    backendBase() {
      try {
        const base = (api && api.defaults && api.defaults.baseURL) ? api.defaults.baseURL : "/api";
        return base || "/api";
      } catch {
        return "/api";
      }
    },
  },
  mounted() {
    this.fetchProfessors();
  },
  methods: {
    async fetchProfessors() {
      try {
        this.loading = true;
        const res = await api.get("/admin/professors");
        this.professors = res.data.professors || [];
        await this.loadScheduleMetaForList();
      } catch (e) {
        console.error("Failed to fetch professors", e);
      } finally {
        this.loading = false;
      }
    },
    openAddModal() {
      this.editTarget = null;
      this.form = {
        firstName: "",
        lastName: "",
        emailAddress: "",
        department: "",
        rfidId: "",
        password: "",
      };
      this.showModal = true;
    },
    openEditModal(p) {
      this.editTarget = p;
      this.form = {
        firstName: p.firstName || "",
        lastName: p.lastName || "",
        emailAddress: p.emailAddress || "",
        department: p.facultyPosition || p.department || "",
        rfidId: p.rfidId || p.rfid || p.idNumber || "",
        password: "",
      };
      this.showModal = true;
    },
    async openScheduleModal(p) {
      this.scheduleTarget = p;
      this.scheduleFile = null;
      await this.fetchScheduleMeta(p._id);
    },
    closeModal() {
      this.showModal = false;
    },
    async submitProfessor() {
      try {
        if (this.editTarget) {
          // Allowed PATCH fields on backend: firstName, lastName, idNumber, emailAddress, isVerified, contactNumber, section
          const payload = {
            firstName: this.form.firstName,
            lastName: this.form.lastName,
            emailAddress: this.form.emailAddress,
            idNumber: this.form.rfidId, // use idNumber for RFID ID storage
          };
          await api.patch(`/admin/users/${this.editTarget._id}`, payload);
          this.showModal = false;
          await this.fetchProfessors();
          return;
        }
        // Create professor via existing register endpoint
        const payload = {
          role: "professor",
          emailAddress: this.form.emailAddress,
          password: this.form.password,
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          idNumber: this.form.rfidId, // store RFID in idNumber
          contactNumber: "",
          facultyPosition: this.form.department, // store Department here
        };
        await api.post("/auth/register", payload);
        this.showModal = false;
        await this.fetchProfessors();
        alert("Professor created. A verification code has been sent to their email.");
      } catch (e) {
        console.error("Failed to submit professor", e);
        alert("Failed to submit professor");
      }
    },
    async uploadSchedule() {
      if (!this.scheduleTarget || !this.scheduleFile) {
        alert("Please select a file.");
        return;
      }
      try {
        const formData = new FormData();
        formData.append("file", this.scheduleFile);
        await api.post(`/admin/professors/${this.scheduleTarget._id}/schedule`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Schedule uploaded successfully!");
        this.scheduleFile = null;
        if (this.$refs && this.$refs.scheduleFileInput) {
          this.$refs.scheduleFileInput.value = null;
        }
        await this.fetchScheduleMeta(this.scheduleTarget._id);
      } catch (e) {
        console.error("Upload failed:", e);
        alert(e?.response?.data?.message || "Failed to upload schedule");
      }
    },
    async fetchScheduleMeta(id) {
      try {
        const r = await api.get(`/admin/professors/${id}/schedule/meta`);
        this.$set ? this.$set(this.scheduleMeta, id, r.data.file) : (this.scheduleMeta[id] = r.data.file);
      } catch (e) {
        if (e?.response?.status === 404) {
          this.$set ? this.$set(this.scheduleMeta, id, null) : (this.scheduleMeta[id] = null);
        } else {
          console.error("Failed to load schedule meta", e);
        }
      }
    },
    async loadScheduleMetaForList() {
      const ids = (this.professors || []).map(p => p._id);
      await Promise.all(ids.map(id => this.fetchScheduleMeta(id)));
    },
    scheduleUrl(id, opts = {}) {
      const base = this.backendBase;
      const meta = this.scheduleMeta[id];
      const v = meta && meta.uploadDate ? new Date(meta.uploadDate).getTime() : Date.now();
      if (opts.download) return `${base}/admin/professors/${id}/schedule?download=1`;
      return `${base}/admin/professors/${id}/schedule?v=${v}`;
    },
    confirmDelete(p) {
      this.deleteTarget = p;
    },
    async performDelete() {
      try {
        if (!this.deleteTarget) return;
        await api.delete(`/admin/users/${this.deleteTarget._id}`);
        this.deleteTarget = null;
        await this.fetchProfessors();
      } catch (e) {
        console.error("Failed to delete professor", e);
        alert("Failed to delete professor");
      }
    },
    async toggleDisable(p) {
      try {
        await api.patch(`/admin/users/${p._id}`, { isVerified: !p.isVerified });
        await this.fetchProfessors();
      } catch (e) {
        console.error("Failed to toggle account state", e);
        alert("Failed to update account state");
      }
    },
    async resetPassword(p) {
      try {
        await api.post('/auth/forgot-password', { emailAddress: p.emailAddress });
        alert('Password reset email has been sent to ' + p.emailAddress + '.');
      } catch (e) {
        console.error('Failed to request password reset', e);
        alert(e?.response?.data?.message || 'Failed to request password reset');
      }
    },
    onScheduleFile(e) {
      this.scheduleFile = e.target.files?.[0] || null;
    },
  },
};
</script>