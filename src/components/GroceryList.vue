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
          <div class="list-header" @click="toggleExpanded">
            <div class="list-title-section">
              <div class="title-with-toggle">
                <i class="fa-solid expand-icon" :class="isExpanded ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
                <h3 class="list-title">{{ list.name }}</h3>
              </div>
              <p class="list-date">{{ formatDate(list.date) }} • {{ list.items.length }} items</p>
            </div>
            <div class="list-actions" @click.stop>
              <button @click="downloadPDF" class="action-btn download-btn" title="Download as PDF">
                <i class="fa-solid fa-download"></i>
              </button>
              <button @click="printList" class="action-btn print-btn" title="Print list">
                <i class="fa-solid fa-print"></i>
              </button>
              <button @click="toggleRename" class="action-btn rename-btn" title="Rename list">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button @click="removeList" class="action-btn delete-btn" title="Delete list">
                <i class="fa-solid fa-trash"></i>
              </button>
              <div v-if="isExpanded" class="select-all-wrapper">
                <input class="form-check-input" type="checkbox" v-model="selectAll" @change="toggleAllItems" :id="'selectAll-' + list._id">
                <label class="form-check-label" :for="'selectAll-' + list._id">Mark all</label>
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

          <!-- Collapsible Content -->
          <transition name="expand">
            <div v-show="isExpanded" class="collapsible-content">
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
          </transition>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { jsPDF } from 'jspdf';
  import { updateGroceryList, addItemToList } from '@/services/groceryListService';

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
        isExpanded: false,
      };
    },
    methods: {
      async addItem() {
        if (this.newItem && this.newQuantity > 0 && this.newUnit) {
          try {
            const updatedList = await addItemToList(this.list._id, {
              name: this.newItem,
              quantity: this.newQuantity,
              unit: this.newUnit
            });
            this.list.items = updatedList.items;
            this.newItem = '';
            this.newQuantity = 1;
            this.newUnit = '';
          } catch (error) {
            console.error('Error adding item:', error);
            alert('Error adding item. Please try again.');
          }
        }
      },
      async removeItem(index) {
        this.list.items.splice(index, 1);
        await this.saveList();
      },
      async updateItemStatus(item) {
        if (!item.checked) {
          this.selectAll = false;
        }
        await this.saveList();
      },
      async toggleAllItems() {
        this.list.items.forEach(item => (item.checked = this.selectAll));
        await this.saveList();
      },
      toggleRename() {
        this.isRenaming = !this.isRenaming;
      },
      async renameList() {
        if (this.newListName) {
          try {
            const updatedList = await updateGroceryList(this.list._id, {
              name: this.newListName,
              date: this.list.date,
              items: this.list.items
            });
            this.list.name = updatedList.name;
            this.newListName = '';
            this.isRenaming = false;
          } catch (error) {
            console.error('Error renaming list:', error);
            alert('Error renaming list. Please try again.');
          }
        }
      },
      async saveList() {
        try {
          await updateGroceryList(this.list._id, {
            name: this.list.name,
            date: this.list.date,
            items: this.list.items
          });
        } catch (error) {
          console.error('Error saving list:', error);
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
      toggleExpanded() {
        this.isExpanded = !this.isExpanded;
      },
      escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"]'/g, (character) => {
          const replacements = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
          };
          return replacements[character] || character;
        });
      },
      printList() {
        const printWindow = window.open('', '_blank', 'width=920,height=720');

        if (!printWindow) {
          alert('Please allow popups to print this grocery list.');
          return;
        }

        const itemsMarkup = this.list.items.length > 0
          ? this.list.items.map((item) => `
              <li class="item-row ${item.checked ? 'checked' : ''}">
                <span class="item-check">${item.checked ? '✓' : '&nbsp;'}</span>
                <span class="item-name">${this.escapeHtml(item.name)}</span>
                <span class="item-meta">${this.escapeHtml(item.quantity)} ${this.escapeHtml(item.unit)}</span>
              </li>
            `).join('')
          : '<li class="empty-row">No items added yet.</li>';

        const listName = this.escapeHtml(this.list.name);
        const listDate = this.escapeHtml(this.formatDate(this.list.date));

        const html = `
          <!doctype html>
          <html lang="en">
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <title>${listName} - Grocery List</title>
              <style>
                * { box-sizing: border-box; }
                body {
                  margin: 0;
                  font-family: Arial, Helvetica, sans-serif;
                  color: #111827;
                  background: #ffffff;
                }
                .sheet {
                  max-width: 820px;
                  margin: 0 auto;
                  padding: 28px;
                }
                .header {
                  border: 1px solid rgba(46, 125, 50, 0.18);
                  border-radius: 20px;
                  padding: 22px 24px;
                  background: linear-gradient(180deg, #f8fbf8 0%, #ffffff 100%);
                  margin-bottom: 22px;
                }
                .eyebrow {
                  display: inline-block;
                  padding: 6px 10px;
                  border-radius: 999px;
                  background: rgba(46, 125, 50, 0.1);
                  color: #1b5e20;
                  font-size: 11px;
                  font-weight: 700;
                  letter-spacing: 0.12em;
                  text-transform: uppercase;
                  margin-bottom: 10px;
                }
                h1 {
                  margin: 0 0 6px;
                  font-size: 26px;
                }
                .subhead {
                  margin: 0;
                  color: #4b5563;
                  font-size: 14px;
                }
                .meta {
                  display: flex;
                  gap: 12px;
                  flex-wrap: wrap;
                  margin-top: 16px;
                }
                .meta span {
                  padding: 8px 12px;
                  border-radius: 999px;
                  background: #f3f4f6;
                  font-size: 12px;
                  color: #374151;
                }
                .items {
                  list-style: none;
                  padding: 0;
                  margin: 0;
                  border: 1px solid rgba(17, 24, 39, 0.08);
                  border-radius: 20px;
                  overflow: hidden;
                }
                .item-row {
                  display: grid;
                  grid-template-columns: 28px 1fr auto;
                  gap: 12px;
                  align-items: center;
                  padding: 14px 18px;
                  border-top: 1px solid rgba(17, 24, 39, 0.06);
                  font-size: 14px;
                }
                .item-row:first-child {
                  border-top: none;
                }
                .item-row.checked {
                  background: rgba(46, 125, 50, 0.05);
                  color: #6b7280;
                }
                .item-check {
                  width: 18px;
                  height: 18px;
                  border-radius: 5px;
                  border: 1.5px solid #2e7d32;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 12px;
                  color: #2e7d32;
                }
                .item-row.checked .item-check {
                  background: #2e7d32;
                  color: #ffffff;
                }
                .item-name {
                  font-weight: 600;
                }
                .item-meta {
                  color: #4b5563;
                  white-space: nowrap;
                }
                .empty-row {
                  padding: 24px;
                  text-align: center;
                  color: #6b7280;
                }
                .footer {
                  margin-top: 18px;
                  font-size: 12px;
                  color: #6b7280;
                  text-align: center;
                }
                @media print {
                  body { background: #ffffff; }
                  .sheet { padding: 0; }
                }
              </style>
            </head>
            <body>
              <div class="sheet">
                <div class="header">
                  <div class="eyebrow">Grocery List</div>
                  <h1>${listName}</h1>
                  <p class="subhead">Print-ready shopping list for quick trips and store visits.</p>
                  <div class="meta">
                    <span>${listDate}</span>
                    <span>${this.list.items.length} items</span>
                    <span>${this.list.items.filter((item) => item.checked).length} checked</span>
                  </div>
                </div>

                <ul class="items">
                  ${itemsMarkup}
                </ul>

                <div class="footer">Generated by EatsBuddy</div>
              </div>
              <script>
                window.onload = function () {
                  window.focus();
                  window.print();
                };
                window.onafterprint = function () {
                  window.close();
                };
              <\/script>
            </body>
          </html>
        `;

        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
      },
      downloadPDF() {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const headerHeight = 42;
        const footerHeight = 18;
        const contentTop = margin + headerHeight + 10;
        const contentBottom = pageHeight - footerHeight - 16;
        const sanitizedTitle = this.list.name || 'Grocery List';
        const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        const renderHeader = () => {
          doc.setFillColor(46, 125, 50);
          doc.rect(0, 0, pageWidth, headerHeight, 'F');

          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(22);
          doc.text('EatsBuddy', margin, 18);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text('Grocery List', margin, 28);

          const generatedLabel = `Generated ${generatedDate}`;
          doc.setFontSize(9);
          doc.text(generatedLabel, pageWidth - margin - doc.getTextWidth(generatedLabel), 18);
          doc.text(`${this.list.items.length} items`, pageWidth - margin - doc.getTextWidth(`${this.list.items.length} items`), 29);
        };

        const renderFooter = (pageNumber) => {
          const footerY = pageHeight - 12;
          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(0.3);
          doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

          doc.setFontSize(8.5);
          doc.setTextColor(120, 120, 120);
          doc.text('Generated by EatsBuddy - Smart Food Planner', margin, footerY);
          doc.text(`Page ${pageNumber}`, pageWidth - margin - 18, footerY);
        };

        renderHeader();

        let yPos = contentTop;

        doc.setTextColor(17, 24, 39);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text(sanitizedTitle, margin, yPos);
        yPos += 8;

        doc.setTextColor(75, 85, 99);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        doc.text(`Date: ${this.formatDate(this.list.date)}`, margin, yPos);
        yPos += 12;

        doc.setDrawColor(209, 213, 219);
        doc.setLineWidth(0.4);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 12;

        if (this.list.items.length > 0) {
          doc.setTextColor(27, 94, 32);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.text('Items', margin, yPos);
          yPos += 8;

          let pageNumber = 1;
          this.list.items.forEach((item) => {
            const rowHeight = 14;
            if (yPos + rowHeight > contentBottom) {
              renderFooter(pageNumber);
              doc.addPage();
              pageNumber += 1;
              renderHeader();
              yPos = contentTop;
            }

            doc.setFillColor(item.checked ? 242 : 249, item.checked ? 248 : 250, item.checked ? 242 : 250);
            doc.setDrawColor(226, 232, 240);
            doc.roundedRect(margin, yPos - 4, pageWidth - margin * 2, 11, 3, 3, 'FD');

            doc.setDrawColor(46, 125, 50);
            doc.setLineWidth(0.4);
            doc.rect(margin + 4, yPos - 1.5, 5, 5);

            if (item.checked) {
              doc.setFillColor(46, 125, 50);
              doc.rect(margin + 4, yPos - 1.5, 5, 5, 'F');
              doc.setTextColor(255, 255, 255);
              doc.setFontSize(7.5);
              doc.text('✓', margin + 5.1, yPos + 2.5);
            }

            doc.setTextColor(item.checked ? 120 : 31, item.checked ? 120 : 41, item.checked ? 120 : 55);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10.5);
            doc.text(`${item.name}`, margin + 14, yPos + 2.2);
            const quantityText = `${item.quantity} ${item.unit}`;
            doc.setTextColor(75, 85, 99);
            doc.text(quantityText, pageWidth - margin - doc.getTextWidth(quantityText) - 10, yPos + 2.2);

            yPos += 12;
          });

          renderFooter(pageNumber);
        } else {
          doc.setTextColor(107, 114, 128);
          doc.setFontSize(12);
          doc.text('No items in this list yet.', margin, yPos);
          renderFooter(1);
        }

        const fileName = `${this.list.name.replace(/[^a-z0-9]/gi, '_')}_grocery_list.pdf`;
        doc.save(fileName);
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
    --bg-color: rgba(255, 255, 255, 0.76);
    --highlight: rgba(255, 255, 255, 0.9);
    position: relative;
    border-radius: 26px;
    overflow: hidden;
    box-shadow: 0 14px 38px rgba(15, 23, 42, 0.08),
                inset 1px 1px 0 rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(27, 94, 32, 0.08);
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
    padding: 28px 30px 30px;
  }

  /* List Header */
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 18px;
    margin: -28px -30px 0;
    padding: 26px 30px 22px;
    border-bottom: 2px solid rgba(46, 125, 50, 0.15);
    cursor: pointer;
    transition: background 0.2s ease;
    border-radius: 28px 28px 0 0;
  }

  .list-header:hover {
    background: rgba(46, 125, 50, 0.03);
  }

  .title-with-toggle {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .expand-icon {
    font-size: 14px;
    color: #2e7d32;
    transition: transform 0.3s ease;
  }

  .list-title-section {
    flex: 1 1 auto;
    min-width: 0;
  }

  .list-title {
    font-size: 22px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 8px;
    letter-spacing: -0.5px;
    line-height: 1.2;
  }

  .list-date {
    font-size: 14px;
    color: #4a4a4a;
    margin: 0;
    line-height: 1.35;
  }

  .list-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: flex-end;
    margin-left: auto;
  }

  .action-btn {
    width: 38px;
    height: 38px;
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

  .print-btn:hover {
    background: rgba(33, 150, 243, 0.14);
    color: #1976d2;
  }

  .download-btn:hover {
    background: rgba(33, 150, 243, 0.15);
    color: #2196f3;
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
    margin-left: 4px;
    min-height: 38px;
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
    margin-bottom: 24px;
    padding: 18px;
    background: rgba(46, 125, 50, 0.05);
    border-radius: 20px;
  }

  .add-item-form {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 86px 96px auto;
    gap: 12px;
    align-items: stretch;
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
    height: 100%;
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
    min-width: 84px;
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
    gap: 10px;
  }

  .grocery-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 14px 16px;
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
    line-height: 1.4;
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
      padding: 24px 24px 20px;
      margin: -24px -24px 0;
    }

    .list-actions {
      width: 100%;
      justify-content: space-between;
      margin-left: 0;
    }

    .add-item-form {
      grid-template-columns: minmax(0, 1fr) 78px 88px auto;
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
      align-items: stretch;
      gap: 10px;
    }

    .item-remove-btn {
      align-self: flex-end;
      padding: 6px 10px;
      font-size: 11px;
    }

    .list-actions {
      gap: 8px;
    }

    .select-all-wrapper {
      width: 100%;
      justify-content: center;
      margin-left: 0;
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
      margin: -16px -16px 0;
      padding: 20px 16px 16px;
      margin-bottom: 0;
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
      align-items: flex-start;
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

  /* Collapsible Content */
  .collapsible-content {
    padding-top: 24px;
  }

  /* Expand Transition */
  .expand-enter-active,
  .expand-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .expand-enter-from,
  .expand-leave-to {
    opacity: 0;
    max-height: 0;
    padding-top: 0;
  }

  .expand-enter-to,
  .expand-leave-from {
    opacity: 1;
    max-height: 2000px;
    padding-top: 24px;
  }
  </style>
  