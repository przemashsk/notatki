<template>
  <article class="p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer h-full relative" :class="bgColor"
    :style="{ backgroundColor: note.color || '#ffffff' }">
    <button class="absolute top-2 right-2 text-red-500 hover:text-red-600" @click.stop="del" title="Usuń notatkę">
      ✕
    </button>
    <h2 class="font-semibold mb-1 line-clamp-1">{{ note.title || 'Bez tytułu' }}</h2>

    <p class="text-sm text-gray-700 whitespace-pre-wrap line-clamp-4 mb-2">
      {{ note.content }}
    </p>

    <p v-if="todoCount" class="text-xs text-gray-500">
      {{ doneCount }}/{{ todoCount }} zadań ukończonych
    </p>
    <img v-if="firstImg" :src="publicImgUrl" class="mt-2 w-full h-32 object-cover rounded-md" />
    <!-- <pre>{{ notes.attachments[props.note.id] }}</pre> -->
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNotes, type Note } from '@/stores/useNotes'

const props = defineProps<{ note: Note }>()

const bgColor = computed(() =>
  props.note.color ? `${props.note.color}` : 'bg-white'
)



// const { items } = useNotes()
const notes = useNotes()
const firstImg = computed(() => notes.attachments[props.note.id]?.[0])
const publicImgUrl = computed(() => {
  if (!firstImg.value) return undefined

  return `https://ntytzgwnrhehmgwtrnci.supabase.co/storage/v1/object/public/attachments/${firstImg.value.storage_path}`
})
// const checklist = computed(() => items[props.note.id] ?? [])
// const todoCount = computed(() => checklist.value.length)
// const doneCount = computed(() => checklist.value.filter((c) => c.checked).length)

/* 📝 lista zadań dla tej notatki */
const allItems = computed(() => notes.items[props.note.id] ?? [])

/* liczniki */
const todoCount = computed(() => allItems.value.length)
const doneCount = computed(() =>
  allItems.value.filter((c) => c.checked).length,
)

async function del() {
  if (confirm('Na pewno usunąć tę notatkę?')) {
    await notes.remove(props.note.id)
  }
}
</script>
