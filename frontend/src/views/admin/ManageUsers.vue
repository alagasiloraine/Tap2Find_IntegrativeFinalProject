<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Manage Student Accounts</h1>
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Id</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="u in filteredStudents" :key="u._id" class="hover:bg-gray-50 cursor-pointer" @click="openViewModal(u)">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ (u.firstName || '') + ' ' + (u.lastName || '') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ u.section || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ u.idNumber || '-' }}
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
                  @click.stop="openEditModal(u)"
                >
                  ✏️ Edit
                </button>
                <button
                  class="inline-flex items-center px-3 py-1.5 rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                  @click.stop="confirmDelete(u)"
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
            <tr v-if="filteredStudents.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500">No students found.</td>
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
            {{ editTarget ? 'Edit Student' : 'Edit Student' }}
          </h3>
          <button class="text-gray-400 hover:text-gray-600" @click="closeModal">✖</button>
        </div>
        <form class="px-6 py-4 space-y-4" @submit.prevent="submitForm">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs text-gray-600 mb-1">First Name</label>
              <input v-model="form.firstName" type="text" required class="w-full border rounded px-3 py-2 text-sm" @input="form.firstName = toTitleCase(form.firstName)" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">Last Name</label>
              <input v-model="form.lastName" type="text" required class="w-full border rounded px-3 py-2 text-sm" @input="form.lastName = toTitleCase(form.lastName)" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs text-gray-600 mb-1">Section</label>
              <input v-model="form.section" type="text" class="w-full border rounded px-3 py-2 text-sm" @input="form.section = toTitleCase(form.section)" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">ID Number</label>
              <div class="flex">
                <span class="inline-flex items-center px-3 border border-r-0 rounded-l text-sm bg-gray-50 text-gray-700">MCC</span>
                <input
                  v-model="idNumberTail"
                  type="text"
                  class="w-full border rounded-r px-3 py-2 text-sm"
                  placeholder="YYYY-NNNN"
                  @input="onIdTailInput"
                />
              </div>
            </div>
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Email</label>
            <input v-model="form.emailAddress" type="email" required class="w-full border rounded px-3 py-2 text-sm" @input="form.emailAddress = (form.emailAddress || '').toLowerCase()" />
            <div v-if="errors.emailAddress" class="text-sm text-red-600">{{ errors.emailAddress }}</div>
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Contact Number</label>
            <input v-model="form.contactNumber" type="tel" required class="w-full border rounded px-3 py-2 text-sm" />
            <div v-if="errors.contactNumber" class="text-sm text-red-600">{{ errors.contactNumber }}</div>
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Address</label>
            <textarea v-model="form.address" rows="2" class="w-full border rounded px-3 py-2 text-sm" @input="form.address = toTitleCase(form.address)"></textarea>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-xs text-gray-600 mb-1">Program</label>
              <input v-model="form.program" type="text" class="w-full border rounded px-3 py-2 text-sm bg-gray-50" disabled />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">Year Level</label>
              <select v-model="form.yearLevel" class="w-full border rounded px-3 py-2 text-sm">
                <option value="">Select</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">Birthdate</label>
              <input v-model="form.birthdate" type="date" class="w-full border rounded px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-1">Age</label>
            <input :value="computedAge" type="number" class="w-full border rounded px-3 py-2 text-sm bg-gray-50" disabled />
          </div>
          <div class="pt-2 flex items-center justify-end gap-3">
            <button type="button" class="px-4 py-2 rounded border" @click="closeModal">Cancel</button>
            <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Student Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Student Details</h3>
          <button class="text-gray-400 hover:text-gray-600" @click="closeViewModal">✖</button>
        </div>
        <div class="px-6 py-4 space-y-3 text-sm">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-gray-500">First Name</div>
              <div class="font-medium">{{ viewTarget?.firstName || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500">Last Name</div>
              <div class="font-medium">{{ viewTarget?.lastName || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500">Email</div>
              <div class="font-medium break-all">{{ viewTarget?.emailAddress || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500">Status</div>
              <div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium" :class="viewTarget?.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                  {{ viewTarget?.isVerified ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
            <div>
              <div class="text-gray-500">Section</div>
              <div class="font-medium">{{ viewTarget?.section || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500">Program</div>
              <div class="font-medium">BSIT</div>
            </div>
            <div>
              <div class="text-gray-500">Year Level</div>
              <div class="font-medium">{{ viewTarget?.yearLevel || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500">ID Number</div>
              <div class="font-medium break-all">{{ viewTarget?.idNumber || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500">Contact Number</div>
              <div class="font-medium">{{ viewTarget?.contactNumber || '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500">Birthdate</div>
              <div class="font-medium">{{ viewTarget?.birthdate ? new Date(viewTarget.birthdate).toLocaleDateString() : '-' }}</div>
            </div>
            <div>
              <div class="text-gray-500">Age</div>
              <div class="font-medium">{{ viewTarget?.age ?? '-' }}</div>
            </div>
            <div class="col-span-2">
              <div class="text-gray-500">Address</div>
              <div class="font-medium">{{ viewTarget?.address || '-' }}</div>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-end bg-gray-50">
          <button class="px-4 py-2 rounded border" @click="closeViewModal">Close</button>
        </div>
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
import api from "@/utils/api.js";

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
  },
  mounted() {
    this.fetchStudents();
  },
  methods: {
    toTitleCase(s) {
      if (!s) return "";
      return String(s).replace(/\b\w+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    },
    onIdTailInput() {
      const tail = (this.idNumberTail || "").toUpperCase().replace(/\s+/g, "");
      this.idNumberTail = tail;
      this.form.idNumber = "MCC" + tail;
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
      if (!ok) {
        alert('Please fix the highlighted errors before submitting.');
      }
      return ok;
    },
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
        yearLevel: (u.yearLevel ?? "").toString(),
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
    async submitForm() {
      try {
        // Basic validation aligned with Registration
        if (!this.validateForm()) return;

        if (this.editTarget) {
          const payload = {
            firstName: this.toTitleCase(this.form.firstName.trim()),
            lastName: this.toTitleCase(this.form.lastName.trim()),
            section: this.toTitleCase((this.form.section || '').trim()),
            idNumber: this.form.idNumber.trim(),
            emailAddress: (this.form.emailAddress || '').trim().toLowerCase(),
            contactNumber: this.form.contactNumber.trim(),
            address: this.toTitleCase((this.form.address || '').trim()),
            program: 'BSIT',
            yearLevel: (this.form.yearLevel || '').trim(),
            birthdate: this.form.birthdate || "",
          };
          await api.patch(`/admin/users/${this.editTarget._id}`, payload);
          this.showModal = false;
          await this.fetchStudents();
          return;
        }
        // Adding new students is disabled from Admin Manage Users.
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