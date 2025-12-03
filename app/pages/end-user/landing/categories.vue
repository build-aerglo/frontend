<template>
  <!--Header-->
  <NavBarCategories/>
  <!--Header-->

  <!--Content-->
  <div class="my-10">
  <SearchBarCategories/>
  </div>
  <!--Section begins-->
  <Categories @category-selected="handleCategorySelection" />
    
  <!--Footer-->
  <NavFooter/>
  <!--Footer-->
</template>

<script setup>
</script>