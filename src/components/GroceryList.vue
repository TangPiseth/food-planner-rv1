<template>
    <div class="grocery-list-container" data-aos="fade-up">
      <!-- SVG Filter -->
      <svg style="display: none">
        <filter id="glass-distortion-grocery-item">
          <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="14" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
        </filter>
      </svg>

      <div class="grocery-list-glass-card">
        <div class="glass-filter"></div>
        <div class="glass-overlay"></div>
        <div class="glass-specular"></div>

        <div class="list-content">
          <!-- List Header -->
          <div class="list-header">
            <div class="list-title-section">
              <h3 class="list-title">{{ list.name }}</h3>
              <p class="list-date">{{ formatDate(list.date) }}</p>
            </div>
            <div class="list-actions">
              <button @click="toggleRename" class="action-btn rename-btn" title="Rename list">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button @click="removeList" class="action-btn delete-btn" title="Delete list">
                <i class="fa-solid fa-trash"></i>
              </button>
              <div class="select-all-wrapper">
                <input class="form-check-input" type="checkbox" v-model="selectAll" @change="toggleAllItems" id="selectAll">
                <label class="form-check-label" for="selectAll">Mark all</label>
              </div>
            </div>
          </div>

          <!-- Rename Section -->
          <div v-if="isRenaming" class="rename-section">
            <div class="rename-form">
              <input v-model="newListName" class="glass-input" placeholder="Rename list" @keyup.enter="renameList" />
              <button @click="renameList" class="rename-submit-btn">Confirm</button>
              <button @click="toggleRename" class="rename-cancel-btn">Cancel</button>
            </div>
          </div>

          <!-- Add Item Section -->
          <div class="add-item-section">
            <div class="add-item-form">
              <input 
                type="text" 
                v-model="newItem" 
                class="glass-input" 
                placeholder="Add new item" 
                @keyup.enter="addItem"
              />
              <input 
                type="number" 
                v-model="newQuantity" 
                class="glass-input quantity-input" 
                placeholder="Qty" 
                min="1" 
                @keyup.enter="addItem"
              />
              <select v-model="newUnit" class="glass-select">
                <option disabled value="">Unit</option>
                <option>kg</option>
                <option>lb</option>
                <option>pcs</option>
              </select>
              <button @click="addItem" class="add-item-btn">Add</button>
            </div>
          </div>

          <!-- Items List -->
          <div v-if="list.items.length > 0" class="items-list">
            <div v-for="(item, index) in list.items" :key="index" class="grocery-item" :class="{ 'item-checked': item.checked }">
              <div class="item-content">
                <input class="item-checkbox" type="checkbox" v-model="item.checked" @change="updateItemStatus(item)" />
                <span class="item-text" :class="{ 'text-strikethrough': item.checked }">
                  {{ item.name }} - {{ item.quantity }} {{ item.unit }}
                </span>
              </div>
              <button @click="removeItem(index)" class="item-remove-btn">Remove</button>
            </div>
          </div>
          <div v-else class="items-empty">
            <p class="text-muted">No items added yet</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      list: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        newItem: '',
        newQuantity: 1,
        newUnit: '',
        selectAll: false,
        isRenaming: false,
        newListName: '',
      };
    },
    methods: {
      addItem() {
        if (this.newItem && this.newQuantity > 0 && this.newUnit) {
          this.list.items.push({ name: this.newItem, quantity: this.newQuantity, unit: this.newUnit, checked: false });
          this.newItem = '';
          this.newQuantity = 1;
          this.newUnit = '';
        }
      },
      removeItem(index) {
        this.list.items.splice(index, 1);
      },
      updateItemStatus(item) {
        if (!item.checked) {
          this.selectAll = false;
        }
      },
      toggleAllItems() {
        this.list.items.forEach(item => (item.checked = this.selectAll));
      },
      toggleRename() {
        this.isRenaming = !this.isRenaming;
      },
      renameList() {
        if (this.newListName) {
          this.list.name = this.newListName;
          this.newListName = '';
          this.isRenaming = false;
        }
      },
      removeList() {
        this.$emit('remove-list');
      },
      formatDate(date) {
        if (!date) return 'No date';
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      },
    },
  };
  </script>
  
  <style scoped>
  .grocery-list-container {
    animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  /* Glass Card Three-Layer System */
  .grocery-list-glass-card {
    --bg-color: rgba(255, 255, 255, 0.55);
    --highlight: rgba(255, 255, 255, 0.9);
    position: relative;
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
                inset 1px 1px 0 rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.4);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .glass-filter {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(5px);
    filter: url(#glass-distortion-grocery-item) saturate(130%) brightness(1.2) contrast(1.05);
    z-index: 1;
  }

  .glass-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--bg-color);
    z-index: 2;
  }

  .glass-specular {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.75),
                inset -1px -1px 2px rgba(0, 0, 0, 0.05);
    z-index: 3;
  }

  .list-content {
    position: relative;
    z-index: 4;
    padding: 32px;
  }

  /* List Header */
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 2px solid rgba(46, 125, 50, 0.15);
  }

  .list-title-section {
    flex: 1;
  }

  .list-title {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 8px;
    letter-spacing: -0.5px;
  }

  .list-date {
    font-size: 14px;
    color: #4a4a4a;
    margin: 0;
  }

  .list-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .action-btn {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    border: none;
    background: rgba(46, 125, 50, 0.1);
    color: #2e7d32;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: all 0.2s ease;
  }

  .action-btn:hover {
    background: rgba(46, 125, 50, 0.2);
    transform: scale(1.05);
  }

  .delete-btn:hover {
    background: rgba(244, 67, 54, 0.15);
    color: #f44336;
  }

  .select-all-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: rgba(46, 125, 50, 0.08);
    border-radius: 20px;
    margin-left: 12px;
  }

  .select-all-wrapper .form-check-input {
    margin: 0;
    width: 18px;
    height: 18px;
    border: 2px solid #2e7d32;
    border-radius: 4px;
    cursor: pointer;
  }

  .select-all-wrapper .form-check-input:checked {
    background-color: #2e7d32;
    border-color: #2e7d32;
  }

  .select-all-wrapper .form-check-label {
    margin: 0;
    font-size: 13px;
    font-weight: 500;
    color: #1a1a1a;
    cursor: pointer;
  }

  /* Rename Section */
  .rename-section {
    margin-bottom: 20px;
    animation: slideInUp 0.3s ease;
  }

  .rename-form {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .rename-form .glass-input {
    flex: 1;
    min-width: 0;
  }

  .rename-submit-btn,
  .rename-cancel-btn {
    padding: 10px 16px;
    border-radius: 12px;
    border: none;
    font-weight: 500;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .rename-submit-btn {
    background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
    color: white;
  }

  .rename-submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
  }

  .rename-cancel-btn {
    background: rgba(74, 74, 74, 0.1);
    color: #4a4a4a;
  }

  .rename-cancel-btn:hover {
    background: rgba(74, 74, 74, 0.15);
  }

  /* Add Item Section */
  .add-item-section {
    margin-bottom: 28px;
    padding: 20px;
    background: rgba(46, 125, 50, 0.05);
    border-radius: 20px;
  }

  .add-item-form {
    display: grid;
    grid-template-columns: 1fr 80px 100px 80px;
    gap: 12px;
    align-items: end;
  }

  /* Glass Inputs */
  .glass-input,
  .glass-select {
    --bg-color: rgba(255, 255, 255, 0.5);
    --border-color: rgba(46, 125, 50, 0.2);
    position: relative;
    padding: 12px 14px;
    font-size: 14px;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    background: var(--bg-color);
    color: #1a1a1a;
    font-family: inherit;
    transition: all 0.2s ease;
  }

  .glass-input::placeholder {
    color: rgba(74, 74, 74, 0.6);
  }

  .glass-input:focus,
  .glass-select:focus {
    outline: none;
    border-color: #2e7d32;
    background: rgba(255, 255, 255, 0.65);
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1),
                inset 0 1px 2px rgba(255, 255, 255, 0.5);
  }

  .glass-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%232e7d32' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    padding-right: 28px;
  }

  .quantity-input {
    min-width: 0;
  }

  .add-item-btn {
    padding: 12px 16px;
    background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.2);
  }

  .add-item-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(46, 125, 50, 0.3);
  }

  .add-item-btn:active {
    transform: translateY(0);
  }

  /* Items List */
  .items-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .grocery-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: rgba(46, 125, 50, 0.04);
    border-radius: 16px;
    border: 1px solid rgba(46, 125, 50, 0.1);
    transition: all 0.2s ease;
    animation: slideInUp 0.4s ease;
  }

  .grocery-item:hover {
    background: rgba(46, 125, 50, 0.08);
    border-color: rgba(46, 125, 50, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.1);
  }

  .grocery-item.item-checked {
    opacity: 0.7;
  }

  .item-content {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  .item-checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid #2e7d32;
    border-radius: 4px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .item-checkbox:checked {
    background-color: #2e7d32;
  }

  .item-text {
    color: #1a1a1a;
    font-size: 14px;
    word-break: break-word;
  }

  .text-strikethrough {
    text-decoration: line-through;
    color: #999;
  }

  .item-remove-btn {
    padding: 8px 12px;
    background: rgba(244, 67, 54, 0.1);
    color: #f44336;
    border: none;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .item-remove-btn:hover {
    background: rgba(244, 67, 54, 0.2);
    transform: scale(1.05);
  }

  /* Empty State */
  .items-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 48px 24px;
    text-align: center;
    animation: fadeIn 0.4s ease;
  }

  .items-empty .text-muted {
    font-size: 16px;
    color: #999;
    margin: 0;
  }

  /* Responsive Design */
  @media (max-width: 992px) {
    .list-content {
      padding: 24px;
    }

    .list-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .list-actions {
      width: 100%;
      justify-content: space-between;
    }

    .add-item-form {
      grid-template-columns: 1fr 60px 80px;
      gap: 10px;
    }

    .add-item-btn {
      grid-column: 3;
    }
  }

  @media (max-width: 768px) {
    .grocery-list-glass-card {
      border-radius: 20px;
    }

    .list-content {
      padding: 18px;
    }

    .list-title {
      font-size: 18px;
    }

    .add-item-form {
      grid-template-columns: 1fr 50px 70px;
      gap: 8px;
    }

    .grocery-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .item-remove-btn {
      align-self: flex-end;
      padding: 6px 10px;
      font-size: 11px;
    }
  }

  @media (max-width: 576px) {
    .list-content {
      padding: 16px;
    }

    .list-title {
      font-size: 16px;
    }

    .list-header {
      margin-bottom: 16px;
      padding-bottom: 12px;
    }

    .select-all-wrapper {
      margin-left: 0;
    }

    .add-item-section {
      padding: 16px;
      margin-bottom: 20px;
    }

    .add-item-form {
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .add-item-btn {
      grid-column: 1;
      width: 100%;
    }

    .quantity-input {
      grid-column: 1;
    }

    .glass-select {
      grid-column: 1;
    }

    .grocery-item {
      padding: 12px;
    }

    .item-content {
      width: 100%;
    }

    .items-empty {
      padding: 32px 16px;
    }
  }

  /* Animations */
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  </style>
  