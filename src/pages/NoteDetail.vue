<template>
    <NoteEditor :note-id="id" :open="open" @saved="router.back()"
        @update:open="val => { open = val; if (!val) router.back(); }" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NoteEditor from '@/components/NoteEditor.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string
const open = ref(true)              // startowo edytor otwarty
</script>
