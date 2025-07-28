<template>
    <!-- 🖼️ miniatura załącznika -->
    <div class="relative group w-24 h-24 cursor-pointer">
        <img :src="publicImgUrl" class="object-cover w-full h-full rounded-md" @click="$emit('preview')" />

        <button
            class="absolute top-2 right-2 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-80 hover:opacity-100 active:scale-95 transition duration-200 shadow-md z-10"
            @click.stop="del" title="Usuń">
            ✕
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNotes, type Attachment } from '@/stores/useNotes'

const props = defineProps<{ att: Attachment }>()
const emit = defineEmits(['preview'])

const notes = useNotes()

function del() {
    if (confirm('Na pewno chcesz usunąć ten załącznik?')) {
        notes.removeAttachment(props.att.id)
    }
}

const publicImgUrl = computed(() =>
    `https://ntytzgwnrhehmgwtrnci.supabase.co/storage/v1/object/public/attachments/${props.att.storage_path}`
)
</script>
