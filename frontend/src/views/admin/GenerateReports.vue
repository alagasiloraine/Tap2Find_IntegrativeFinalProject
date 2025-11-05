<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold text-gray-900 mb-6">Generate Reports</h1>

    <!-- Filters -->
    <div class="bg-white shadow rounded-lg p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs text-gray-600 mb-1">From</label>
          <input type="date" v-model="filters.from" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-600 mb-1">To</label>
          <input type="date" v-model="filters.to" class="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-600 mb-1">Professor</label>
          <select v-model="filters.professorId" class="w-full border rounded px-3 py-2 text-sm">
            <option value="">All Professors</option>
            <option v-for="p in professors" :key="p._id" :value="p._id">{{ (p.firstName||'') + ' ' + (p.lastName||'') }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-600 mb-1">Concern Type</label>
          <select v-model="filters.concernType" class="w-full border rounded px-3 py-2 text-sm">
            <option value="">All Types</option>
            <option v-for="t in concernTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex items-center gap-3">
        <button class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" @click="generateReports">Generate</button>
        <button class="px-4 py-2 rounded border" @click="resetFilters">Reset</button>
      </div>
    </div>

    <!-- Actions -->
    <div class="mb-4 flex items-center gap-3">
      <button class="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700" @click="exportAllCSV">Export CSV</button>
      <button class="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900" @click="printPDF">Download PDF</button>
    </div>

    <!-- Preview -->
    <div id="report-preview" class="space-y-6">
      <!-- Professor Attendance Logs (placeholder) -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Professor Attendance Logs</h2>
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
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Student Concerns Summary</h2>
          <span class="text-xs text-gray-500">Source: Admin Concerns</span>
        </div>
        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professor</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="c in concernsFiltered" :key="c._id">
                  <td class="px-6 py-3 text-sm text-gray-900">{{ formatDate(c.createdAt || c.timestamp || c.date) }}</td>
                  <td class="px-6 py-3 text-sm text-gray-500">{{ displayStudent(c) }}</td>
                  <td class="px-6 py-3 text-sm text-gray-500">{{ displayProfessor(c) }}</td>
                  <td class="px-6 py-3 text-sm text-gray-500">{{ (c.type || c.category || 'General') }}</td>
                  <td class="px-6 py-3 text-sm">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium"
                          :class="badgeClass(c.status)">
                      {{ (c.status || 'pending') | capitalize }}
                    </span>
                  </td>
                </tr>
                <tr v-if="concernsFiltered.length === 0">
                  <td colspan="5" class="px-6 py-6 text-center text-sm text-gray-500">No concerns in selected filters.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Availability Statistics -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Availability Statistics</h2>
          <span class="text-xs text-gray-500">Source: Dashboard Availability</span>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div class="p-4 border rounded">
              <div class="text-gray-500">Available</div>
              <div class="text-2xl font-semibold">{{ availability.available }}</div>
            </div>
            <div class="p-4 border rounded">
              <div class="text-gray-500">Busy</div>
              <div class="text-2xl font-semibold">{{ availability.busy }}</div>
            </div>
            <div class="p-4 border rounded">
              <div class="text-gray-500">Not Available</div>
              <div class="text-2xl font-semibold">{{ availability.notAvailable }}</div>
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
      generating: false,
    };
  },
  computed: {
    concernTypes() {
      const set = new Set();
      for (const c of this.concerns) {
        const t = (c.type || c.category || "").toString().trim();
        if (t) set.add(t);
      }
      return Array.from(set).sort();
    },
    concernsFiltered() {
      const from = this.filters.from ? new Date(this.filters.from) : null;
      const to = this.filters.to ? new Date(this.filters.to + 'T23:59:59') : null;
      const profId = this.filters.professorId;
      const type = (this.filters.concernType || "").toLowerCase();
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
          const ctype = (c.type || c.category || "").toLowerCase();
          if (ctype !== type) return false;
        }
        return true;
      });
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
      await Promise.all([
        this.fetchProfessors(),
        this.fetchConcerns(),
        this.fetchAvailability(),
      ]);
      this.generateAttendancePlaceholder();
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
        const a = res.data?.professorAvailability || {};
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
      this.generateAttendancePlaceholder();
    },
    resetFilters() {
      this.filters = { from: '', to: '', professorId: '', concernType: '' };
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
    formatDate(d) {
      const date = d instanceof Date ? d : new Date(d);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleString();
    },
    // Export helpers
    exportAllCSV() {
      const sections = [];
      // Attendance
      sections.push(['Attendance Logs']);
      sections.push(['Date/Time','Professor','RFID ID','Action']);
      for (const r of this.attendancePlaceholder) {
        sections.push([r.time, r.professor, r.rfidId, r.action]);
      }
      sections.push([]);
      // Concerns
      sections.push(['Student Concerns']);
      sections.push(['Date','Student','Professor','Type','Status']);
      for (const c of this.concernsFiltered) {
        sections.push([
          this.formatDate(c.createdAt || c.timestamp || c.date),
          this.displayStudent(c),
          this.displayProfessor(c),
          (c.type || c.category || 'General'),
          (c.status || 'pending')
        ]);
      }
      sections.push([]);
      // Availability
      sections.push(['Availability Statistics']);
      sections.push(['Available','Busy','Not Available']);
      sections.push([this.availability.available, this.availability.busy, this.availability.notAvailable]);

      const csv = sections.map((r)=> r.map((v)=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reports_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
    printPDF() {
      // Basic print of the preview area; users can "Save as PDF"
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
  },
};
</script>
