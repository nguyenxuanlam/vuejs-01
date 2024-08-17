<script setup lang="ts"></script>

<template>
  <div>
    <h1>Detail child view</h1>
    <RouterLink :to="{ name: RouteName.page_1.detail.root }">
      <NButton type="success">Back</NButton>
    </RouterLink>
  </div>
</template>
