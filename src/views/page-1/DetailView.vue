<script setup lang="ts"></script>

<template>
  <div>
    <h1>Detail view</h1>
    <RouterLink :to="{ name: RouteName.page_1.root }">
      <NButton type="success">Back</NButton>
    </RouterLink>
    <RouterLink :to="{ name: RouteName.page_1.detail.child }">
      <NButton type="info">Child</NButton>
    </RouterLink>
  </div>
</template>
