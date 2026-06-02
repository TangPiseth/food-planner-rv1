<template>
  <div class="EG-Default admin-dashboard-page overflow-hidden">
    <div class="breadcrumb-section">
      <div class="container px-3 px-md-4">
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
      <div class="container text-center py-4 py-md-5 px-3 px-md-4">
        <h1 class="fw-bold display-5 mb-3 text-wrap">Moderation Dashboard</h1>
        <p class="lead text-muted mb-0 text-wrap">Manage reviews, reported reviews, users, and moderation logs.</p>
      </div>
    </div>

    <div class="admin-content-section py-4 py-md-5">
      <div class="container-fluid container-xl px-3 px-md-4 px-xxl-5">
        <div class="row g-3 g-md-4 mb-4">
          <div class="col-6 col-sm-4 col-xl">
            <div class="stat-card">
              <h5>Users</h5>
              <p>{{ users.length }}</p>
            </div>
          </div>
          <div class="col-6 col-sm-4 col-xl">
            <div class="stat-card">
              <h5>Pending Reports</h5>
              <p>{{ pendingReports.length }}</p>
            </div>
          </div>
          <div class="col-6 col-sm-4 col-xl">
            <div class="stat-card">
              <h5>Pending Recipes</h5>
              <p>{{ pendingRecipeCount }}</p>
            </div>
          </div>
          <div class="col-6 col-sm-4 col-xl">
            <div class="stat-card">
              <h5>User Recipes</h5>
              <p>{{ recipes.length }}</p>
            </div>
          </div>
          <div class="col-12 col-sm-4 col-xl">
            <div class="stat-card">
              <h5>Moderation Logs</h5>
              <p>{{ logs.length }}</p>
            </div>
          </div>
        </div>

        <div class="admin-tabs-container mb-4">
          <ul class="nav admin-nav-tabs justify-content-center">
            <li class="nav-item">
              <button class="nav-link" :class="{active: activeTab === 'users'}" @click="activeTab = 'users'">
                Users
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" :class="{active: activeTab === 'reports'}" @click="activeTab = 'reports'">
                Reports
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" :class="{active: activeTab === 'recipes'}" @click="activeTab = 'recipes'">
                Recipes
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" :class="{active: activeTab === 'logs'}" @click="activeTab = 'logs'">
                Logs
              </button>
            </li>
          </ul>
        </div>

        <div v-show="activeTab === 'users'" class="glass-card mb-4 animated-tab">
          <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h3 class="fw-bold mb-0">User Management</h3>
            <div class="d-flex gap-2">
              <button class="btn btn-sm px-3 rounded-pill btn-success shadow-sm" @click="openUserEditor()">+ Add User</button>
              <button class="btn btn-sm px-3 rounded-pill btn-outline-success" @click="loadUsers">Refresh</button>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user._id || user.id">
                  <td class="fw-semibold">{{ user.username }}</td>
                  <td class="text-muted">{{ user.email }}</td>
                  <td>
                    <span class="badge rounded-pill" :class="user.role === 'admin' ? 'bg-success' : 'bg-secondary'">{{ user.role }}</span>
                  </td>
                  <td>
                    <span class="badge rounded-pill" :class="user.isBanned ? 'bg-danger' : 'bg-success'">{{ user.isBanned ? 'Banned' : 'Active' }}</span>
                  </td>
                  <td class="text-end">
                    <div class="d-flex gap-2 justify-content-end flex-wrap">
                      <button class="btn btn-sm btn-outline-primary rounded-pill px-3" @click="openUserEditor(user)">Edit</button>
                      <button
                        v-if="user.role !== 'admin'"
                        class="btn btn-sm btn-outline-success rounded-pill px-3"
                        @click="changeUserRole(user, 'admin')"
                      >
                        Make Admin
                      </button>
                      <button
                        v-else
                        class="btn btn-sm btn-outline-secondary rounded-pill px-3"
                        @click="changeUserRole(user, 'user')"
                      >
                        Remove Admin
                      </button>
                      <button
                        class="btn btn-sm rounded-pill px-3"
                        :class="user.isBanned ? 'btn-success' : 'btn-outline-danger'"
                        @click="toggleBan(user)"
                      >
                        {{ user.isBanned ? 'Unban' : 'Ban' }}
                      </button>
                      <button class="btn btn-sm btn-danger rounded-pill px-3 shadow-sm" @click="confirmDeleteUser(user)">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-show="activeTab === 'reports'" class="glass-card mb-4 animated-tab">
          <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h3 class="fw-bold mb-0">Reported Reviews</h3>
            <button class="btn btn-sm px-3 rounded-pill btn-outline-success" @click="loadReports">Refresh</button>
          </div>

          <div v-if="pendingReports.length === 0" class="text-muted text-center py-4">No pending reports found.</div>

          <div v-for="report in pendingReports" :key="report._id" class="review-card mb-3">
            <div class="row align-items-center">
              <div class="col-md-9 mb-3 mb-md-0">
                <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
                  <strong class="fs-5">Reported By: {{ report.reporterId?.username || 'Unknown' }}</strong>
                  <span class="badge rounded-pill bg-warning text-dark text-uppercase">{{ report.status }}</span>
                </div>
                <div class="fw-semibold text-danger mb-2">Report Reason: {{ report.reason }}</div>
                <div class="bg-white p-3 rounded-3 border mb-2">
                  <div class="small fw-bold mb-1">Target Review Comment:</div>
                  <div class="fst-italic text-muted">"{{ report.reviewId?.comment || 'Unavailable' }}"</div>
                </div>
                <div class="small text-muted">Original author: {{ report.reviewId?.name || report.reviewId?.username || '-' }} ({{ report.reviewId?.rating || '-' }}/5)</div>
              </div>
              <div class="col-md-3 d-flex flex-md-column gap-2 justify-content-end align-items-md-end">
                <button class="btn px-4 rounded-pill btn-success shadow-sm w-100" @click="decideReport(report, 'resolved')">Resolve</button>
                <button class="btn px-4 rounded-pill btn-outline-secondary w-100" @click="decideReport(report, 'dismissed')">Dismiss</button>
              </div>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'recipes'" class="glass-card mb-4 animated-tab">
          <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h3 class="fw-bold mb-0">Recipe Database</h3>
            <div class="d-flex gap-2">
              <button class="btn btn-sm px-3 rounded-pill btn-success shadow-sm" @click="openRecipeEditor()">+ Add Recipe</button>
              <button class="btn btn-sm px-3 rounded-pill btn-outline-success" @click="loadRecipes">Refresh</button>
            </div>
          </div>

          <div v-if="recipes.length === 0" class="text-muted text-center py-4">No recipes yet. Add your first recipe.</div>

          <div v-else class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Cuisine</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="recipe in recipes" :key="recipe.id || recipe._id">
                  <td class="fw-semibold">{{ recipe.title }}</td>
                  <td class="text-muted">{{ recipe.category || '-' }}</td>
                  <td class="text-muted">{{ recipe.cuisine || '-' }}</td>
                  <td>
                    <span
                      class="badge rounded-pill"
                      :class="recipe.isApproved ? 'bg-success' : 'bg-warning text-dark'"
                    >
                      {{ recipe.isApproved ? 'Approved' : 'Pending' }}
                    </span>
                  </td>
                  <td class="small text-muted">{{ formatDate(recipe.updatedAt || recipe.createdAt) }}</td>
                  <td class="text-end">
                    <div class="d-flex gap-2 justify-content-end flex-wrap">
                      <button
                        v-if="!recipe.isApproved"
                        class="btn btn-sm btn-success rounded-pill px-3"
                        @click="approveRecipe(recipe)"
                      >
                        Approve
                      </button>
                      <button
                        class="btn btn-sm btn-outline-danger rounded-pill px-3"
                        @click="rejectRecipe(recipe)"
                      >
                        Reject
                      </button>
                      <button class="btn btn-sm btn-outline-primary rounded-pill px-3" @click="openRecipeEditor(recipe)">Edit</button>
                      <button class="btn btn-sm btn-outline-danger rounded-pill px-3" @click="confirmDeleteRecipe(recipe)">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-show="activeTab === 'logs'" class="glass-card animated-tab">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold mb-0">Moderation Logs</h3>
            <button class="btn btn-sm px-3 rounded-pill btn-outline-success" @click="loadLogs">Refresh</button>
          </div>
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Target Type</th>
                  <th>Target Name</th>
                  <th>Reason</th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in logs" :key="log._id">
                  <td class="small text-muted">{{ formatDate(log.createdAt) }}</td>
                  <td class="fw-semibold">{{ log.adminId?.username || 'Unknown' }}</td>
                  <td><span class="badge rounded-pill bg-dark">{{ log.action }}</span></td>
                  <td>{{ log.targetType }}</td>
                  <td>{{ log.targetUsername || '-' }}</td>
                  <td class="text-muted fst-italic">{{ log.reason || '-' }}</td>
                  <td class="text-end">
                    <div class="d-flex gap-2 justify-content-end flex-wrap">
                      <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" @click="editLogReason(log)">Edit Note</button>
                      <button
                        v-if="isReversibleLog(log)"
                        class="btn btn-sm btn-outline-danger rounded-pill px-3"
                        @click="reverseLogAction(log)"
                      >
                        Reverse
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="errorMessage" class="alert alert-danger mt-4 mb-0">{{ errorMessage }}</div>
      </div>
    </div>

    <transition name="glass-fade">
      <div
        v-if="actionDialog.visible"
        class="action-dialog-backdrop"
        @click.self="closeActionDialog"
      >
        <div class="action-dialog-card">
          <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
            <div>
              <h4 class="fw-bold mb-1">{{ actionDialog.title }}</h4>
              <p class="text-muted mb-0">{{ actionDialog.message }}</p>
            </div>
            <button
              class="btn btn-sm btn-outline-secondary"
              :disabled="actionDialog.isSubmitting"
              @click="closeActionDialog"
            >
              Close
            </button>
          </div>

          <label class="form-label fw-semibold mb-1">{{ actionDialog.noteLabel }}</label>
          <textarea
            class="form-control"
            rows="3"
            :placeholder="actionDialog.notePlaceholder"
            v-model="actionDialog.note"
            :disabled="actionDialog.isSubmitting"
          ></textarea>
          <small v-if="actionDialog.noteRequired" class="text-danger d-block mt-1">A note is required for this action.</small>

          <div class="d-flex justify-content-end gap-2 mt-4">
            <button
              class="btn btn-outline-secondary"
              :disabled="actionDialog.isSubmitting"
              @click="closeActionDialog"
            >
              Cancel
            </button>
            <button
              class="btn"
              :class="actionDialog.confirmButtonClass"
              :disabled="actionDialog.isSubmitting"
              @click="confirmActionDialog"
            >
              {{ actionDialog.isSubmitting ? 'Processing...' : actionDialog.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="glass-fade">
      <div
        v-if="recipeEditor.visible"
        class="action-dialog-backdrop"
        @click.self="closeRecipeEditor"
      >
        <div class="action-dialog-card recipe-editor-card">
          <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
            <div>
              <h4 class="fw-bold mb-1">{{ recipeEditor.mode === 'create' ? 'Add Recipe' : 'Edit Recipe' }}</h4>
              <p class="text-muted mb-0">Update the recipe database used across the site.</p>
            </div>
            <button
              class="btn btn-sm btn-outline-secondary"
              :disabled="recipeEditor.isSubmitting"
              @click="closeRecipeEditor"
            >
              Close
            </button>
          </div>

          <form @submit.prevent="submitRecipeEditor">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Title</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="recipeEditor.title"
                  :disabled="recipeEditor.isSubmitting"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Category</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="recipeEditor.category"
                  :disabled="recipeEditor.isSubmitting"
                  placeholder="Main Course, Dessert, etc."
                />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Cuisine</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="recipeEditor.cuisine"
                  :disabled="recipeEditor.isSubmitting"
                  placeholder="Italian, Thai, etc."
                />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Image URL</label>
                <input
                  type="url"
                  class="form-control"
                  v-model="recipeEditor.image"
                  :disabled="recipeEditor.isSubmitting"
                  placeholder="https://..."
                />
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Short Description</label>
                <textarea
                  class="form-control"
                  rows="2"
                  v-model="recipeEditor.description"
                  :disabled="recipeEditor.isSubmitting"
                  placeholder="Quick summary shown in listings."
                ></textarea>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Ingredients (one per line)</label>
                <textarea
                  class="form-control"
                  rows="3"
                  v-model="recipeEditor.ingredients"
                  :disabled="recipeEditor.isSubmitting"
                  placeholder="2 eggs&#10;1 cup flour&#10;..."
                ></textarea>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Instructions</label>
                <textarea
                  class="form-control"
                  rows="4"
                  v-model="recipeEditor.instructions"
                  :disabled="recipeEditor.isSubmitting"
                  placeholder="Step-by-step cooking instructions."
                ></textarea>
              </div>
              <div class="col-md-3">
                <label class="form-label fw-semibold">Prep Time (min)</label>
                <input
                  type="number"
                  class="form-control"
                  min="0"
                  v-model="recipeEditor.prepTime"
                  :disabled="recipeEditor.isSubmitting"
                />
              </div>
              <div class="col-md-3">
                <label class="form-label fw-semibold">Cook Time (min)</label>
                <input
                  type="number"
                  class="form-control"
                  min="0"
                  v-model="recipeEditor.cookingTime"
                  :disabled="recipeEditor.isSubmitting"
                />
              </div>
              <div class="col-md-3">
                <label class="form-label fw-semibold">Servings</label>
                <input
                  type="number"
                  class="form-control"
                  min="1"
                  v-model="recipeEditor.servings"
                  :disabled="recipeEditor.isSubmitting"
                />
              </div>
              <div class="col-md-3">
                <label class="form-label fw-semibold">Calories</label>
                <input
                  type="number"
                  class="form-control"
                  min="0"
                  v-model="recipeEditor.calories"
                  :disabled="recipeEditor.isSubmitting"
                />
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Tags (comma separated)</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="recipeEditor.tags"
                  :disabled="recipeEditor.isSubmitting"
                  placeholder="healthy, quick, gluten-free"
                />
              </div>
            </div>

            <div class="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                class="btn btn-outline-secondary"
                :disabled="recipeEditor.isSubmitting"
                @click="closeRecipeEditor"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-success"
                :disabled="recipeEditor.isSubmitting"
              >
                {{ recipeEditor.isSubmitting ? 'Saving...' : 'Save Recipe' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <transition name="glass-fade">
      <div
        v-if="userEditor.visible"
        class="action-dialog-backdrop"
        @click.self="closeUserEditor"
      >
        <div class="action-dialog-card user-editor-card">
          <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
            <div>
              <h4 class="fw-bold mb-1">{{ userEditor.mode === 'create' ? 'Create User' : 'Edit User' }}</h4>
              <p class="text-muted mb-0">Manage user details and credentials.</p>
            </div>
            <button
              class="btn btn-sm btn-outline-secondary"
              :disabled="userEditor.isSubmitting"
              @click="closeUserEditor"
            >
              Close
            </button>
          </div>

          <form @submit.prevent="submitUserEditor">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Username</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="userEditor.username"
                  :disabled="userEditor.isSubmitting"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  class="form-control"
                  v-model="userEditor.email"
                  :disabled="userEditor.isSubmitting"
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="userEditor.password"
                  :placeholder="userEditor.mode === 'create' ? 'Minimum 6 characters' : 'Leave blank to keep current'"
                  :disabled="userEditor.isSubmitting"
                  :required="userEditor.mode === 'create'"
                />
              </div>
              <div v-if="userEditor.mode === 'create'" class="col-md-6">
                <label class="form-label fw-semibold">Role</label>
                <select
                  class="form-select"
                  v-model="userEditor.role"
                  :disabled="userEditor.isSubmitting"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Reason (optional)</label>
                <textarea
                  class="form-control"
                  rows="2"
                  v-model="userEditor.reason"
                  :disabled="userEditor.isSubmitting"
                  placeholder="Add context for this change..."
                ></textarea>
              </div>
            </div>

            <div class="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                class="btn btn-outline-secondary"
                :disabled="userEditor.isSubmitting"
                @click="closeUserEditor"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-success"
                :disabled="userEditor.isSubmitting"
              >
                {{ userEditor.isSubmitting ? 'Saving...' : 'Save User' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  updateUserRole,
  updateUserBanStatus,
  getAdminRecipes,
  createAdminRecipe,
  updateAdminRecipe,
  deleteAdminRecipe,
  getModerationLogs,
  updateModerationLogReason,
  reverseModerationAction,
  getReportedReviews,
  decideReportedReview
} from '@/services/adminService';

const defaultActionDialog = () => ({
  visible: false,
  title: '',
  message: '',
  noteLabel: 'Moderation note',
  notePlaceholder: 'Add context for this moderation action...',
  note: '',
  noteRequired: false,
  confirmText: 'Confirm',
  confirmButtonClass: 'btn-success',
  isSubmitting: false
});

export default {
  name: 'AdminDashboard',
  data() {
    return {
      activeTab: 'users',
      users: [],
      pendingReports: [],
      recipes: [],
      logs: [],
      errorMessage: '',
      actionDialog: defaultActionDialog(),
      dialogSubmitHandler: null,
      userEditor: {
        visible: false,
        mode: 'create',
        userId: null,
        username: '',
        email: '',
        password: '',
        role: 'user',
        reason: '',
        isSubmitting: false
      },
      recipeEditor: {
        visible: false,
        mode: 'create',
        recipeId: null,
        title: '',
        description: '',
        image: '',
        category: '',
        cuisine: '',
        ingredients: '',
        instructions: '',
        prepTime: '',
        cookingTime: '',
        servings: '',
        calories: '',
        tags: '',
        isSubmitting: false
      }
    };
  },
  computed: {
    activeUserCount() {
      return this.users.filter((user) => !user.isBanned).length;
    },
    pendingRecipeCount() {
      return this.recipes.filter((recipe) => !recipe.isApproved).length;
    }
  },
  methods: {
    resetActionDialog() {
      this.actionDialog = defaultActionDialog();
      this.dialogSubmitHandler = null;
    },
    openActionDialog(options, submitHandler) {
      this.errorMessage = '';
      this.dialogSubmitHandler = submitHandler;
      this.actionDialog = {
        ...defaultActionDialog(),
        ...options,
        visible: true,
        note: options?.note ?? ''
      };
    },
    openUserEditor(user = null) {
      this.errorMessage = '';
      if (user) {
        this.userEditor = {
          visible: true,
          mode: 'edit',
          userId: user._id || user.id,
          username: user.username || '',
          email: user.email || '',
          password: '',
          role: user.role || 'user',
          reason: '',
          isSubmitting: false
        };
      } else {
        this.userEditor = {
          visible: true,
          mode: 'create',
          userId: null,
          username: '',
          email: '',
          password: '',
          role: 'user',
          reason: '',
          isSubmitting: false
        };
      }
    },
    closeUserEditor() {
      if (this.userEditor.isSubmitting) {
        return;
      }
      this.userEditor.visible = false;
    },
    async submitUserEditor() {
      if (this.userEditor.isSubmitting) {
        return;
      }

      this.userEditor.isSubmitting = true;
      this.errorMessage = '';

      try {
        if (this.userEditor.mode === 'create') {
          await createAdminUser({
            username: this.userEditor.username,
            email: this.userEditor.email,
            password: this.userEditor.password,
            role: this.userEditor.role,
            reason: this.userEditor.reason
          });
        } else {
          const payload = {
            username: this.userEditor.username,
            email: this.userEditor.email,
            reason: this.userEditor.reason
          };

          if (this.userEditor.password) {
            payload.password = this.userEditor.password;
          }

          await updateAdminUser(this.userEditor.userId, payload);
        }

        this.userEditor.visible = false;
        await Promise.all([this.loadUsers(), this.loadLogs()]);
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.userEditor.isSubmitting = false;
      }
    },
    openRecipeEditor(recipe = null) {
      this.errorMessage = '';
      if (recipe) {
        this.recipeEditor = {
          visible: true,
          mode: 'edit',
          recipeId: recipe.id || recipe._id,
          title: recipe.title || '',
          description: recipe.description || '',
          image: recipe.image || '',
          category: recipe.category || '',
          cuisine: recipe.cuisine || '',
          ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join('\n') : '',
          instructions: recipe.instructions || '',
          prepTime: recipe.prepTime ?? '',
          cookingTime: recipe.cookingTime ?? '',
          servings: recipe.servings ?? '',
          calories: recipe.calories ?? '',
          tags: Array.isArray(recipe.tags) ? recipe.tags.join(', ') : '',
          isSubmitting: false
        };
      } else {
        this.recipeEditor = {
          visible: true,
          mode: 'create',
          recipeId: null,
          title: '',
          description: '',
          image: '',
          category: '',
          cuisine: '',
          ingredients: '',
          instructions: '',
          prepTime: '',
          cookingTime: '',
          servings: '',
          calories: '',
          tags: '',
          isSubmitting: false
        };
      }
    },
    closeRecipeEditor() {
      if (this.recipeEditor.isSubmitting) {
        return;
      }
      this.recipeEditor.visible = false;
    },
    buildRecipePayload() {
      const toNumber = (value) => {
        if (value === '' || value === null || value === undefined) {
          return undefined;
        }
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
      };

      const payload = {
        title: this.recipeEditor.title.trim(),
        description: this.recipeEditor.description.trim(),
        image: this.recipeEditor.image.trim(),
        category: this.recipeEditor.category.trim(),
        cuisine: this.recipeEditor.cuisine.trim(),
        instructions: this.recipeEditor.instructions.trim()
      };

      const ingredients = this.recipeEditor.ingredients
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      if (ingredients.length > 0) {
        payload.ingredients = ingredients;
      }

      const tags = this.recipeEditor.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
      if (tags.length > 0) {
        payload.tags = tags;
      }

      const prepTime = toNumber(this.recipeEditor.prepTime);
      const cookingTime = toNumber(this.recipeEditor.cookingTime);
      const servings = toNumber(this.recipeEditor.servings);
      const calories = toNumber(this.recipeEditor.calories);

      if (prepTime !== undefined) {
        payload.prepTime = prepTime;
      }
      if (cookingTime !== undefined) {
        payload.cookingTime = cookingTime;
      }
      if (servings !== undefined) {
        payload.servings = servings;
      }
      if (calories !== undefined) {
        payload.calories = calories;
      }

      return payload;
    },
    async submitRecipeEditor() {
      if (this.recipeEditor.isSubmitting) {
        return;
      }

      this.recipeEditor.isSubmitting = true;
      this.errorMessage = '';

      try {
        const payload = this.buildRecipePayload();

        if (this.recipeEditor.mode === 'create') {
          await createAdminRecipe(payload);
        } else {
          await updateAdminRecipe(this.recipeEditor.recipeId, payload);
        }

        this.recipeEditor.visible = false;
        await Promise.all([this.loadRecipes(), this.loadLogs()]);
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.recipeEditor.isSubmitting = false;
      }
    },
    confirmDeleteRecipe(recipe) {
      this.openActionDialog(
        {
          title: 'Delete Recipe',
          message: `Delete ${recipe.title}? This action cannot be undone.`,
          noteLabel: 'Deletion reason (optional)',
          notePlaceholder: 'Add a short note about this deletion...',
          confirmText: 'Delete Recipe',
          confirmButtonClass: 'btn-danger'
        },
        async (reason) => {
          await deleteAdminRecipe(recipe.id || recipe._id, reason);
          await Promise.all([this.loadRecipes(), this.loadLogs()]);
        }
      );
    },
    approveRecipe(recipe) {
      this.openActionDialog(
        {
          title: 'Approve Recipe',
          message: `Approve ${recipe.title} so it appears in search?`,
          noteLabel: 'Approval note (optional)',
          notePlaceholder: 'Add a short approval note...',
          confirmText: 'Approve Recipe',
          confirmButtonClass: 'btn-success'
        },
        async (reason) => {
          await updateAdminRecipe(recipe.id || recipe._id, { isApproved: true, reason });
          await Promise.all([this.loadRecipes(), this.loadLogs()]);
        }
      );
    },
    rejectRecipe(recipe) {
      this.openActionDialog(
        {
          title: 'Reject Recipe',
          message: `Reject ${recipe.title}? It will remain hidden from users.`,
          noteLabel: 'Rejection note (optional)',
          notePlaceholder: 'Add context for this rejection...',
          confirmText: 'Reject Recipe',
          confirmButtonClass: 'btn-danger'
        },
        async (reason) => {
          await updateAdminRecipe(recipe.id || recipe._id, { isApproved: false, reason });
          await Promise.all([this.loadRecipes(), this.loadLogs()]);
        }
      );
    },
    confirmDeleteUser(user) {
      this.openActionDialog(
        {
          title: 'Delete User',
          message: `Delete ${user.username}? This action cannot be undone.`,
          noteLabel: 'Deletion reason (optional)',
          notePlaceholder: 'Add a short note about this deletion...',
          confirmText: 'Delete User',
          confirmButtonClass: 'btn-danger'
        },
        async (reason) => {
          await deleteAdminUser(user._id || user.id, reason);
          await Promise.all([this.loadUsers(), this.loadLogs()]);
        }
      );
    },
    editLogReason(log) {
      this.openActionDialog(
        {
          title: 'Edit Moderation Reason',
          message: 'Update the note for this moderation action.',
          noteLabel: 'Updated reason',
          notePlaceholder: 'Add context for this update...',
          confirmText: 'Save Reason',
          confirmButtonClass: 'btn-success',
          note: log.reason || ''
        },
        async (reason) => {
          await updateModerationLogReason(log._id, reason);
          await this.loadLogs();
        }
      );
    },
    isReversibleLog(log) {
      return ['USER_BAN', 'USER_UNBAN', 'USER_PROMOTE', 'USER_DEMOTE'].includes(log.action);
    },
    reverseLogAction(log) {
      this.openActionDialog(
        {
          title: 'Reverse Moderation Action',
          message: 'This will apply the opposite user action immediately.',
          noteLabel: 'Reason (optional)',
          notePlaceholder: 'Add context for this reversal...',
          confirmText: 'Reverse Action',
          confirmButtonClass: 'btn-danger'
        },
        async (reason) => {
          await reverseModerationAction(log._id, reason);
          await Promise.all([this.loadUsers(), this.loadLogs()]);
        }
      );
    },
    closeActionDialog() {
      if (this.actionDialog.isSubmitting) {
        return;
      }
      this.resetActionDialog();
    },
    async confirmActionDialog() {
      if (!this.dialogSubmitHandler || this.actionDialog.isSubmitting) {
        return;
      }

      const note = this.actionDialog.note.trim();
      if (this.actionDialog.noteRequired && !note) {
        this.errorMessage = 'Please provide a note before confirming this action.';
        return;
      }

      this.errorMessage = '';
      this.actionDialog = {
        ...this.actionDialog,
        isSubmitting: true
      };

      try {
        await this.dialogSubmitHandler(note);
        this.resetActionDialog();
      } catch (error) {
        this.errorMessage = error.message;
        this.actionDialog = {
          ...this.actionDialog,
          isSubmitting: false
        };
      }
    },
    async loadUsers() {
      try {
        this.users = await getAdminUsers();
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
    async loadRecipes() {
      try {
        this.recipes = await getAdminRecipes();
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
      const isPromoting = role === 'admin';
      this.openActionDialog(
        {
          title: isPromoting ? 'Promote User to Admin' : 'Remove Admin Privileges',
          message: `${isPromoting ? 'Give' : 'Remove'} admin access for ${user.username}?`,
          noteLabel: 'Reason (optional)',
          notePlaceholder: 'Add a reason for this role change...',
          confirmText: isPromoting ? 'Promote' : 'Remove Admin',
          confirmButtonClass: isPromoting ? 'btn-success' : 'btn-outline-secondary'
        },
        async (reason) => {
          await updateUserRole(user._id || user.id, role, reason);
          await Promise.all([this.loadUsers(), this.loadLogs()]);
        }
      );
    },
    async toggleBan(user) {
      const nextValue = !user.isBanned;
      this.openActionDialog(
        {
          title: nextValue ? 'Ban User' : 'Unban User',
          message: `${nextValue ? 'Restrict' : 'Restore'} account access for ${user.username}.`,
          noteLabel: nextValue ? 'Ban reason' : 'Unban note (optional)',
          notePlaceholder: nextValue ? 'Explain why this user is being banned...' : 'Add a short note about unbanning...',
          noteRequired: nextValue,
          confirmText: nextValue ? 'Ban User' : 'Unban User',
          confirmButtonClass: nextValue ? 'btn-danger' : 'btn-success'
        },
        async (reason) => {
          await updateUserBanStatus(user._id || user.id, nextValue, reason);
          await Promise.all([this.loadUsers(), this.loadLogs()]);
        }
      );
    },
    async decideReport(report, status) {
      this.openActionDialog(
        {
          title: status === 'resolved' ? 'Resolve Report' : 'Dismiss Report',
          message: status === 'resolved' ? 'Mark this report as resolved.' : 'Dismiss this report without further action.',
          noteLabel: 'Decision note (optional)',
          notePlaceholder: 'Add context for this report decision...',
          confirmText: status === 'resolved' ? 'Resolve' : 'Dismiss',
          confirmButtonClass: status === 'resolved' ? 'btn-success' : 'btn-outline-secondary'
        },
        async (decisionNote) => {
          await decideReportedReview(report._id, status, decisionNote);
          await Promise.all([this.loadReports(), this.loadLogs()]);
        }
      );
    },
    formatDate(value) {
      if (!value) {
        return '-';
      }
      return new Date(value).toLocaleString();
    }
  },
  async mounted() {
    await Promise.all([this.loadUsers(), this.loadReports(), this.loadRecipes(), this.loadLogs()]);
  }
};
</script>

<style scoped>
.admin-dashboard-page {
  padding-top: clamp(90px, 12vw, 120px);
  overflow-x: hidden;
}

.breadcrumb-section,
.admin-hero-section,
.admin-content-section {
  background: #ffffff;
}

.admin-hero-section h1 {
  color: #111;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
  padding: clamp(1.1rem, 2.5vw, 2rem);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glass-card:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.06);
}

.stats-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.stat-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-card h5 {
  color: #555;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.stat-card p {
  font-size: 2.5rem;
  margin-bottom: 0;
  font-weight: 800;
  color: #2e7d32;
}

.review-card {
  background: rgba(249, 250, 251, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 16px;
  padding: 1.5rem;
  transition: background 0.3s ease;
}

.review-card:hover {
  background: rgba(249, 250, 251, 1);
}

.table {
  --bs-table-bg: transparent;
}

.table thead th {
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding-bottom: 1rem;
}

.table td {
  padding: 1rem 0.5rem;
  vertical-align: middle;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.admin-nav-tabs {
  border-bottom: none;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(249, 250, 251, 0.8);
  border-radius: 50px;
  display: inline-flex;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.admin-nav-tabs .nav-link {
  color: #666;
  font-weight: 600;
  border-radius: 50px;
  padding: 0.5rem 1.5rem;
  transition: all 0.3s ease;
  border: none;
}

.admin-nav-tabs .nav-link:hover {
  color: #111;
  background: rgba(0, 0, 0, 0.03);
}

.admin-nav-tabs .nav-link.active {
  background: #2e7d32;
  color: #fff;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.2);
}

.animated-tab {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.action-dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1200;
}

.action-dialog-card {
  width: min(560px, 100%);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 24px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(20px);
  padding: 2rem;
}

.recipe-editor-card {
  width: min(860px, 100%);
}

.user-editor-card {
  width: min(720px, 100%);
}

.glass-fade-enter-active,
.glass-fade-leave-active {
  transition: opacity 0.22s ease;
}

.glass-fade-enter-from,
.glass-fade-leave-to {
  opacity: 0;
}

@media (max-width: 992px) {
  .action-dialog-card {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .admin-nav-tabs {
    flex-wrap: nowrap;
    max-width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .admin-nav-tabs .nav-link {
    white-space: nowrap;
    padding: 0.5rem 1.1rem;
  }
}

@media (max-width: 576px) {
  .stat-card {
    padding: 1.1rem 0.75rem;
  }

  .stat-card p {
    font-size: 1.9rem;
  }

  .table td,
  .table thead th {
    padding-left: 0.4rem;
    padding-right: 0.4rem;
  }

  .action-dialog-card {
    padding: 1.25rem;
    border-radius: 18px;
  }
}
</style>
