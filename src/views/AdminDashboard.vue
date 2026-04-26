<template>
  <div class="EG-Default" style="margin-top: 80px;">
    <div class="breadcrumb-section">
      <div class="container">
        <div class="text-center">
          <nav>
            <ol class="breadcrumb justify-content-center mb-0">
              <li class="breadcrumb-item"><router-link to="/home-page" class="text-success">HOME</router-link></li>
              <li class="breadcrumb-item active" aria-current="page">ADMIN DASHBOARD</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>

    <div class="admin-hero-section">
      <div class="container text-center py-5">
        <h1 class="fw-bold display-5 mb-3">Moderation Dashboard</h1>
        <p class="lead text-muted mb-0">Manage reviews, reported reviews, users, and moderation logs.</p>
      </div>
    </div>

    <div class="admin-content-section py-5">
      <div class="container">
        <div class="stats-grid mb-4">
          <div class="stat-card">
            <h5>Users</h5>
            <p>{{ users.length }}</p>
          </div>
          <div class="stat-card">
            <h5>Pending Reports</h5>
            <p>{{ pendingReports.length }}</p>
          </div>
          <div class="stat-card">
            <h5>Moderation Logs</h5>
            <p>{{ logs.length }}</p>
          </div>
        </div>

        <div class="glass-card mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h3 class="fw-bold mb-0">User Management</h3>
            <button class="btn btn-sm btn-outline-success" @click="loadUsers">Refresh</button>
          </div>
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user._id || user.id">
                  <td>{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="badge" :class="user.role === 'admin' ? 'bg-success' : 'bg-secondary'">{{ user.role }}</span>
                  </td>
                  <td>
                    <span class="badge" :class="user.isBanned ? 'bg-danger' : 'bg-success'">{{ user.isBanned ? 'Banned' : 'Active' }}</span>
                  </td>
                  <td class="d-flex gap-2 flex-wrap">
                    <button
                      v-if="user.role !== 'admin'"
                      class="btn btn-sm btn-success"
                      @click="changeUserRole(user, 'admin')"
                    >
                      Make Admin
                    </button>
                    <button
                      v-else
                      class="btn btn-sm btn-outline-secondary"
                      @click="changeUserRole(user, 'user')"
                    >
                      Remove Admin
                    </button>
                    <button
                      class="btn btn-sm"
                      :class="user.isBanned ? 'btn-outline-success' : 'btn-outline-danger'"
                      @click="toggleBan(user)"
                    >
                      {{ user.isBanned ? 'Unban' : 'Ban' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="glass-card mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h3 class="fw-bold mb-0">Review Moderation</h3>
            <div class="d-flex gap-2">
              <select class="form-select form-select-sm" v-model="reviewStatusFilter" @change="loadReviews">
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="all">All</option>
              </select>
              <button class="btn btn-sm btn-outline-success" @click="loadReviews">Refresh</button>
            </div>
          </div>

          <div v-if="pendingReviews.length === 0" class="text-muted">No reviews for this filter.</div>

          <div v-for="review in pendingReviews" :key="review._id" class="review-card mb-3">
            <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap">
              <div class="flex-grow-1">
                <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                  <strong>{{ review.name || review.username || 'User' }}</strong>
                  <span class="badge bg-success">{{ review.rating }}/5</span>
                  <span class="badge bg-secondary">{{ review.status }}</span>
                </div>
                <div class="text-muted small mb-2">{{ review.email || 'N/A' }} • Recipe: {{ review.recipeId }}</div>
                <textarea class="form-control form-control-sm" rows="2" v-model="review.editComment"></textarea>
                <div class="d-flex gap-2 mt-2 flex-wrap">
                  <input class="form-control form-control-sm w-auto" type="number" min="1" max="5" v-model.number="review.editRating" />
                  <select class="form-select form-select-sm w-auto" v-model="review.editStatus">
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div class="d-flex flex-column gap-2">
                <button class="btn btn-sm btn-success" @click="saveReview(review)">Save</button>
                <button class="btn btn-sm btn-outline-danger" @click="removeReview(review)">Delete</button>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-card mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h3 class="fw-bold mb-0">Reported Reviews (Pending)</h3>
            <button class="btn btn-sm btn-outline-success" @click="loadReports">Refresh</button>
          </div>

          <div v-if="pendingReports.length === 0" class="text-muted">No pending reports.</div>

          <div v-for="report in pendingReports" :key="report._id" class="review-card mb-3">
            <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap">
              <div class="flex-grow-1">
                <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                  <strong>Reporter: {{ report.reporterId?.username || 'Unknown' }}</strong>
                  <span class="badge bg-warning text-dark">{{ report.status }}</span>
                </div>
                <div class="text-muted small mb-2">Reason: {{ report.reason }}</div>
                <div class="small"><strong>Review:</strong> {{ report.reviewId?.comment || 'Unavailable' }}</div>
                <div class="small text-muted">By {{ report.reviewId?.name || report.reviewId?.username || '-' }} ({{ report.reviewId?.rating || '-' }}/5)</div>
              </div>
              <div class="d-flex flex-column gap-2">
                <button class="btn btn-sm btn-success" @click="decideReport(report, 'resolved')">Resolve</button>
                <button class="btn btn-sm btn-outline-secondary" @click="decideReport(report, 'dismissed')">Dismiss</button>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-card">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="fw-bold mb-0">Moderation Logs</h3>
            <button class="btn btn-sm btn-outline-success" @click="loadLogs">Refresh</button>
          </div>
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in logs" :key="log._id">
                  <td>{{ formatDate(log.createdAt) }}</td>
                  <td>{{ log.adminId?.username || 'Unknown' }}</td>
                  <td><span class="badge bg-dark">{{ log.action }}</span></td>
                  <td>{{ log.targetType }}</td>
                  <td>{{ log.reason || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="errorMessage" class="alert alert-danger mt-4 mb-0">{{ errorMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAdminUsers,
  updateUserRole,
  updateUserBanStatus,
  getReviewsForModeration,
  updateReviewModeration,
  deleteModeratedReview,
  getModerationLogs,
  getReportedReviews,
  decideReportedReview
} from '@/services/adminService';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      users: [],
      pendingReviews: [],
      pendingReports: [],
      logs: [],
      reviewStatusFilter: 'all',
      errorMessage: ''
    };
  },
  methods: {
    async loadUsers() {
      try {
        this.users = await getAdminUsers();
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    async loadReviews() {
      try {
        const reviews = await getReviewsForModeration(this.reviewStatusFilter);
        this.pendingReviews = reviews.map((review) => ({
          ...review,
          editComment: review.comment,
          editRating: review.rating,
          editStatus: review.status
        }));
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    async loadReports() {
      try {
        this.pendingReports = await getReportedReviews('pending');
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    async loadLogs() {
      try {
        this.logs = await getModerationLogs(100);
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    async changeUserRole(user, role) {
      try {
        const reason = window.prompt('Reason for role change (optional):', '') || '';
        await updateUserRole(user._id || user.id, role, reason);
        await Promise.all([this.loadUsers(), this.loadLogs()]);
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    async toggleBan(user) {
      try {
        const nextValue = !user.isBanned;
        const reason = nextValue ? (window.prompt('Reason for ban:', '') || '') : '';
        await updateUserBanStatus(user._id || user.id, nextValue, reason);
        await Promise.all([this.loadUsers(), this.loadLogs()]);
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    async saveReview(review) {
      try {
        const reason = window.prompt('Reason for review moderation (optional):', '') || '';
        await updateReviewModeration(review._id, {
          comment: review.editComment,
          rating: review.editRating,
          status: review.editStatus,
          reason
        });
        await Promise.all([this.loadReviews(), this.loadLogs()]);
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    async removeReview(review) {
      try {
        if (!window.confirm('Delete this review permanently?')) {
          return;
        }

        const reason = window.prompt('Reason for deletion (optional):', '') || '';
        await deleteModeratedReview(review._id, reason);
        await Promise.all([this.loadReviews(), this.loadLogs()]);
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    async decideReport(report, status) {
      try {
        const decisionNote = window.prompt('Decision note (optional):', '') || '';
        await decideReportedReview(report._id, status, decisionNote);
        await Promise.all([this.loadReports(), this.loadLogs()]);
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    formatDate(value) {
      if (!value) {
        return '-';
      }
      return new Date(value).toLocaleString();
    }
  },
  async mounted() {
    await Promise.all([this.loadUsers(), this.loadReviews(), this.loadReports(), this.loadLogs()]);
  }
};
</script>

<style scoped>
.breadcrumb-section,
.admin-hero-section,
.admin-content-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
}

.glass-card {
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(46, 125, 50, 0.12);
  border-radius: 18px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 1.25rem;
}

.stats-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.stat-card {
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(46, 125, 50, 0.12);
  border-radius: 18px;
  padding: 1rem;
  text-align: center;
}

.stat-card h5 {
  color: #1b5e20;
  margin-bottom: 0.3rem;
}

.stat-card p {
  font-size: 1.5rem;
  margin-bottom: 0;
  font-weight: 700;
  color: #2e7d32;
}

.review-card {
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(46, 125, 50, 0.1);
  border-radius: 14px;
  padding: 1rem;
}

.table thead th {
  color: #1b5e20;
}

@media (max-width: 992px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
