<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Manage Student Accounts</h1>
      <button
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        @click="openAddModal"
      >
        <span class="mr-2">➕</span> Add New Student
      </button>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <input
            v-model="query"
            type="text"
            placeholder="Search by name or email..."
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
          Showing {{ filteredStudents.length }} of {{ students.length }} students
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="u in filteredStudents" :key="u._id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ (u.firstName || '') + ' ' + (u.lastName || '') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ u.section || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ u.emailAddress }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium"
                  :class="u.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ u.isVerified ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                <button
                  class="inline-flex items-center px-3 py-1.5 rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 mr-2"
                  @click="openEditModal(u)"
                >
                  ✏️ Edit
                </button>
                <button
                  class="inline-flex items-center px-3 py-1.5 rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                  @click="confirmDelete(u)"
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
            <tr v-if="filteredStudents.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-sm text-gray-500">No students found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editTarget ? 'Edit Student' : 'Add New Student' }}
          </h3>
          <button class="text-gray-400 hover:text-gray-600" @click="closeModal">✖</button>
        </div>
        <form class="px-6 py-4 space-y-4" @submit.prevent="submitForm">
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
              <label class="block text-xs text-gray-600 mb-1">Section</label>
              <input v-model="form.section" type="text" class="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">ID Number</label>
              <input v-model="form.idNumber" type="text" class="w-full border rounded px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Email</label>
            <input v-model="form.emailAddress" type="email" required class="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div v-if="!editTarget">
            <label class="block text-xs text-gray-600 mb-1">Password</label>
            <input v-model="form.password" type="password" required class="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div class="pt-2 flex items-center justify-end gap-3">
            <button type="button" class="px-4 py-2 rounded border" @click="closeModal">Cancel</button>
            <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              {{ editTarget ? 'Save Changes' : 'Create Student' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div
      v-if="deleteTarget"
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Delete Student</h3>
        </div>
        <div class="px-6 py-4 text-sm text-gray-700">
          Are you sure you want to delete
          <b>{{ (deleteTarget.firstName || '') + ' ' + (deleteTarget.lastName || '') }}</b>?
          This action cannot be undone.
        </div>
        <div class="px-6 py-4 flex items-center justify-end gap-3">
          <button class="px-4 py-2 rounded border" @click="deleteTarget = null">Cancel</button>
          <button class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700" @click="performDelete">
            Confirm
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
import api from "@/plugin/axios.js";

export default {
  name: "ManageUsers",
  data() {
    return {
      students: [],
      loading: false,
      query: "",
      statusFilter: "",
      showModal: false,
      editTarget: null,
      deleteTarget: null,
      showOtpModal: false,
      otpEmail: "",
      otpCode: "",
      otpError: "",
      verifying: false,
      resendBusy: false,
      resendIn: 0,
      resendTimerId: null,
      form: {
        firstName: "",
        lastName: "",
        section: "",
        idNumber: "",
        emailAddress: "",
        password: "",
      },
    };
  },
  computed: {
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
  },
  mounted() {
    this.fetchStudents();
  },
  methods: {
    async fetchStudents() {
      try {
        this.loading = true;
        const res = await api.get("/admin/users?role=student"); // fetch only students from backend
        const users = res.data.users || [];
        this.students = users;
      } catch (e) {
        console.error("Failed to fetch students", e);
      } finally {
        this.loading = false;
      }
    },
    openAddModal() {
      this.editTarget = null;
      this.form = {
        firstName: "",
        lastName: "",
        section: "",
        idNumber: "",
        emailAddress: "",
        password: "",
      };
      this.showModal = true;
    },
    openEditModal(u) {
      this.editTarget = u;
      this.form = {
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        section: u.section || "",
        idNumber: u.idNumber || "",
        emailAddress: u.emailAddress || "",
        password: "", // not editable here
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async submitForm() {
      try {
        if (this.editTarget) {
          const payload = {
            firstName: this.form.firstName,
            lastName: this.form.lastName,
            section: this.form.section,
            idNumber: this.form.idNumber,
            emailAddress: this.form.emailAddress,
          };
          await api.patch(`/admin/users/${this.editTarget._id}`, payload);
          this.showModal = false;
          await this.fetchStudents();
          return;
        }
        // Create student via existing register endpoint
        const payload = {
          role: "student",
          emailAddress: this.form.emailAddress,
          password: this.form.password,
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          idNumber: this.form.idNumber,
          contactNumber: "", // optional
          facultyPosition: "", // not used for students
          section: this.form.section, // stored if your schema supports it
        };
        await api.post("/auth/register", payload);
        this.showModal = false;
        // Open OTP modal for verification
        this.otpEmail = this.form.emailAddress;
        this.otpCode = "";
        this.otpError = "";
        this.showOtpModal = true;
        // Start resend cooldown
        this.startResendTimer(30);
      } catch (e) {
        console.error("Failed to submit form", e);
        alert("Failed to submit form");
      }
    },
    confirmDelete(u) {
      this.deleteTarget = u;
    },
    async performDelete() {
      try {
        if (!this.deleteTarget) return;
        await api.delete(`/admin/users/${this.deleteTarget._id}`);
        this.deleteTarget = null;
        await this.fetchStudents();
      } catch (e) {
        console.error("Failed to delete user", e);
        alert("Failed to delete user");
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