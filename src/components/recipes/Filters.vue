<!-- Filters.vue -->
<template>
    <aside class="col-12 col-lg-3 mb-4 mb-lg-0" data-aos="fade-right">
      <div class="accordion" id="filtersAccordion">
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingDishType">
            <button class="accordion-button collapsed text-wrap" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDishType" aria-expanded="false" aria-controls="collapseDishType">
              Dish Type
            </button>
          </h2>
          <div id="collapseDishType" class="accordion-collapse collapse" aria-labelledby="headingDishType" data-bs-parent="#filtersAccordion">
            <div class="accordion-body p-3 p-md-4">
              <ul class="list-unstyled d-flex flex-column gap-2 mb-0">
                <li><a href="#" class="text-wrap d-block">Appetizers & Snacks</a></li>
                <li><a href="#" class="text-wrap d-block">Bread Recipes</a></li>
                <li><a href="#" class="text-wrap d-block">Cambodian Amok</a></li>
                <li><a href="#" class="text-wrap d-block">Beef Lok Lak</a></li>
                <li><a href="#" class="text-wrap d-block">Khmer Noodles (Num Banh Chok)</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingMealType">
            <button class="accordion-button collapsed text-wrap" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMealType" aria-expanded="false" aria-controls="collapseMealType">
              Meal Type
            </button>
          </h2>
          <div id="collapseMealType" class="accordion-collapse collapse" aria-labelledby="headingMealType" data-bs-parent="#filtersAccordion">
            <div class="accordion-body p-3 p-md-4">
              <ul class="list-unstyled d-flex flex-column gap-2 mb-0">
                <li><a href="#" class="text-wrap d-block">Breakfast</a></li>
                <li><a href="#" class="text-wrap d-block">Lunch</a></li>
                <li><a href="#" class="text-wrap d-block">Dinner</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </template>
  
  <script>
  export default {
    name: 'Filters',
  };
  </script>
  
  <style scoped>
  /* Add any necessary styles for the Filters component here */
  .accordion-button {
    font-weight: 600;
  }

  .accordion-body a {
    color: #166534;
    text-decoration: none;
  }

  .accordion-body a:hover {
    text-decoration: underline;
  }
  </style>
