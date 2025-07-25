<template>
  <div class="h-[100svh] flex flex-col">
    <Navbar class="sticky top-0 z-50" />
    <div class="flex-1 overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
</script>
