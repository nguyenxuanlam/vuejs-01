<script setup lang="ts">
/* ----- Import Type ----- */

/* ----- Import Variables ----- */

/* ----- Import Components ----- */

/* ----- Global variables ----- */

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
//#endregion ----- Stores -----

//#region ----- State -----
const state = reactive({
  isFetching: true,
  isPending: false,
  isError404: false
})
//#endregion ----- State -----

//#region ----- Composables -----
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
//#endregion ----- Functions -----

//#region ----- Hooks -----
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <PageHeader title="Test Page 1" class="mb-5" tooltip="Tooltip page 1">
      <NButton type="primary">Create</NButton>
    </PageHeader>

    <PageBlock>
      <RouterLink :to="{ name: RouteName.page_1.detail.root, params: { id: 1 } }">
        <NButton type="success">Detail</NButton>
      </RouterLink>
    </PageBlock>
  </div>
</template>
