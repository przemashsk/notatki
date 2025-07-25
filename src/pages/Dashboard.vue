<template>
    <div class="p-4 space-y-4">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-semibold">Moje notatki</h1>
            <button class="btn btn-primary" @click="openNew = true">+ Nowa</button>
        </div>

        <section v-if="loading" class="text-gray-500">Ładowanie…</section>
        <section v-else-if="notes.length === 0" class="text-gray-500">Brak notatek</section>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <NoteCard v-for="n in notes" :key="n.id" :note="n" @click="router.push(`/note/${n.id}`)" />
        </div>

        <!-- <NoteEditor v-model:open="openNew" @saved="notesStore.fetch()" /> -->
        <NoteEditor v-model:open="openNew" @saved="notesStore.fetch(); openNew = false" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotes } from '@/stores/useNotes'
import { useRouter } from 'vue-router'
import NoteCard from '@/components/NoteCard.vue'
import NoteEditor from '@/components/NoteEditor.vue'

const notesStore = useNotes()
const { notes, loading } = storeToRefs(notesStore)
const openNew = ref(false)
const router = useRouter()

onMounted(notesStore.fetch)
</script>