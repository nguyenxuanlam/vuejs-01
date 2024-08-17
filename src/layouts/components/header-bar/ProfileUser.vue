<script setup lang="ts">
/* ----- Import Type ----- */
import type { Auth } from '@/types'

/* ----- Import Variables ----- */

/* ----- Import Components ----- */

/* ----- Global variables ----- */
defineProps<{
  profile: Auth.UserProfile | null
}>()

const isShow = defineModel<boolean>('show', {
  required: true
})

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
//#endregion ----- Stores -----

//#region ----- State -----
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
  <NSpace item-style="width: 450px;">
    <NCard title="Thông tin người dùng" closable @close="isShow = false">
      <div v-if="profile" class="flex flex-col gap-y-2">
        <div class="flex">
          <p class="flex justify-between sub-title w-[25%] pr-2">
            {{ $t('auth.id') }} <span>:</span>
          </p>
          <p class="font-bold w-[75%]">{{ profile.id }}</p>
        </div>
        <div class="flex">
          <p class="flex justify-between sub-title w-[25%] pr-2">
            {{ $t('auth.name') }} <span>:</span>
          </p>
          <p class="font-bold">{{ profile.name }}</p>
        </div>
        <div class="flex">
          <p class="flex justify-between sub-title w-[25%] pr-2">
            {{ $t('auth.email') }} <span>:</span>
          </p>
          <p class="font-bold">{{ profile.email }}</p>
        </div>
        <div class="flex">
          <p class="flex justify-between sub-title w-[25%] pr-2">
            {{ $t('auth.role') }} <span>:</span>
          </p>
          <p class="font-bold">
            <NTag v-for="role in profile.roles" :key="role" class="mr-1" type="success">
              {{ role }}
            </NTag>
          </p>
        </div>
        <div class="flex">
          <p class="flex justify-between sub-title w-[25%] pr-2">
            {{ $t('auth.created_at') }} <span>:</span>
          </p>
          <p class="font-bold">
            {{ $d(new Date(profile.created_at), 'dateTime') }}
          </p>
        </div>
      </div>
      <NEmpty v-else description="Chưa có thông tin" />
    </NCard>
  </NSpace>
</template>
