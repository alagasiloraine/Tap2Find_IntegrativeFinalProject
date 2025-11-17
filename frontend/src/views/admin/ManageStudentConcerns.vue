<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Manage Student Concerns</h1>
      <div class="flex items-center gap-3">
        <input
          v-model="query"
          type="text"
          placeholder="Search by student, professor, or message..."
          class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
        />
        <select
          v-model="statusFilter"
          class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
        <button class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700" @click="exportExcel">
          ⬇️ Export Excel
        </button>
        <button class="inline-flex items-center px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900" @click="exportPDF">
          Export PDF
        </button>
        <button class="inline-flex items-center px-3 py-2 border rounded-md" @click="printConcerns">
          Print
        </button>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-6 py-3 border-b border-gray-200 text-sm text-gray-500">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1.5 rounded-md text-sm"
              :class="activeTab === 'concerns' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              @click="activeTab = 'concerns'"
            >
              Concerns
            </button>
            <button
              class="px-3 py-1.5 rounded-md text-sm"
              :class="activeTab === 'archive' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              @click="activeTab = 'archive'"
            >
              Archive
            </button>
          </div>
          <div v-if="loading" class="text-gray-400">Loading...</div>
        </div>
        <div class="mt-2">Showing {{ filteredConcerns.length }} of {{ concerns.length }} concerns</div>
      </div>
      <div id="concerns-table-wrapper" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professor Concerned</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concern Message</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="c in filteredConcerns" :key="c._id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ displayStudent(c) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ displayProfessor(c) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 max-w-md">
                <div class="truncate" :title="c.message || c.concern || ''">{{ c.message || c.concern || '' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium"
                      :class="badgeClass(c.status)">
                  {{ capitalize(c.status || 'pending') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(c.createdAt || c.timestamp || c.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                <template v-if="(c.status || 'pending').toLowerCase() === 'archived'">
                  <button
                    class="px-3 py-1.5 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                    @click="setConcernStatus(c, 'pending')"
                  >
                    ♻️ Restore
                  </button>
                </template>
                <template v-else>
                  <button v-if="(c.status || 'pending').toLowerCase() !== 'resolved'"
                          class="px-3 py-1.5 rounded-md text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                          @click="setConcernStatus(c, 'resolved')">
                    ✅ Resolve
                  </button>
                  <button v-else
                          class="px-3 py-1.5 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                          @click="setConcernStatus(c, 'pending')">
                    ↩️ Mark Pending
                  </button>
                </template>
                <button class="px-3 py-1.5 rounded-md text-red-700 bg-red-50 hover:bg-red-100" @click="confirmDelete(c)">
                  🗑️ Delete
                </button>
              </td>
            </tr>
            <tr v-if="filteredConcerns.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500">No concerns found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="deleteTarget" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Delete Concern</h3>
        </div>
        <div class="px-6 py-4 text-sm text-gray-700">
          Are you sure you want to delete this concern? This action cannot be undone.
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
      activeTab: 'concerns',
      deleteTarget: null,
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
  },
  mounted() {
    this.fetchConcerns();
  },
  methods: {
    capitalize(v) {
      if (!v) return "";
      const s = String(v);
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    async fetchConcerns() {
      try {
        this.loading = true;
        const res = await api.get("/admin/concerns");
        this.concerns = res.data.concerns || [];
      } catch (e) {
        console.error("Failed to fetch concerns", e);
      } finally {
        this.loading = false;
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
    confirmDelete(c) {
      this.deleteTarget = c;
    },
    async performDelete() {
      try {
        if (!this.deleteTarget) return;
        const id = this.deleteTarget._id;
        // In Concerns tab: soft-delete by archiving. In Archive tab: hard delete
        if (this.activeTab === 'archive') {
          await api.delete(`/admin/concerns/${id}`);
        } else {
          await api.patch(`/admin/concerns/${id}/archive`);
        }
        this.deleteTarget = null;
        await this.fetchConcerns();
      } catch (e) {
        console.error("Failed to delete/archive concern", e);
        alert(e?.response?.data?.message || "Failed to delete/archive concern");
      }
    },
    async setConcernStatus(c, nextStatus) {
      try {
        await api.patch(`/admin/concerns/${c._id}/status`, { status: nextStatus });
        await this.fetchConcerns();
      } catch (e) {
        console.error("Failed to update status", e);
        alert(e?.response?.data?.message || "Failed to update status");
      }
    },
    async archiveConcern(c) {
      try {
        await api.patch(`/admin/concerns/${c._id}/archive`);
        await this.fetchConcerns();
      } catch (e) {
        console.error("Failed to archive concern", e);
        alert(e?.response?.data?.message || "Failed to archive concern");
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
      const el = document.getElementById('concerns-table-wrapper');
      if (!el) return;
      const w = window.open('', '', 'height=800,width=1000');
      w.document.write('<html><head><title>Student Concerns</title>');
      w.document.write('<style>body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial} table{width:100%;border-collapse:collapse} th,td{border:1px solid #e5e7eb;padding:6px 10px} th{background:#f9fafb} thead th:last-child, tbody td:last-child{display:none}</style>');
      w.document.write('</head><body>');
      w.document.write(el.innerHTML);
      w.document.write('</body></html>');
      w.document.close();
      w.focus();
      w.print();
      w.close();
    },
    exportPDF() {
      const el = document.getElementById('concerns-table-wrapper');
      if (!el) return;
      const w = window.open('', '', 'height=800,width=1000');
      w.document.write('<html><head><title>Student Concerns</title>');
      w.document.write('<style>body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial} table{width:100%;border-collapse:collapse} th,td{border:1px solid #e5e7eb;padding:6px 10px} th{background:#f9fafb} thead th:last-child, tbody td:last-child{display:none}</style>');
      w.document.write('</head><body>');
      w.document.write(el.innerHTML);
      w.document.write('</body></html>');
      w.document.close();
      w.focus();
      w.print();
      w.close();
    }
  },
};
</script>