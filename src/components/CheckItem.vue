<template>
    <label class="flex items-center gap-3">
        <input type="checkbox" :checked="item.checked" class="h-4 w-4 accent-emerald-600" @change="toggle" />

        <input v-model="localText" @blur="saveText"
            class="flex-1 border-b border-transparent focus:border-emerald-600 outline-none bg-transparent" />

        <button class="text-red-500 hover:text-red-600 px-1" @click="remove" title="Usuń">✕</button>
    </label>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useNotes, type CheckItem } from '@/stores/useNotes'

const props = defineProps<{ item: CheckItem }>()
const notes = useNotes()

const localText = ref(props.item.text ?? '')
watch(
    () => props.item.text,
    (t) => (localText.value = t ?? ''),
)

function toggle(e: Event) {
    const checked = (e.target as HTMLInputElement).checked
    notes.toggleItem(props.item.id, checked)
}

function saveText() {
    if (localText.value !== props.item.text) {
        notes.updateItemText(props.item.id, localText.value)
    }
}

function remove() {
    notes.removeItem(props.item.id, props.item.note_id)
}
</script>
