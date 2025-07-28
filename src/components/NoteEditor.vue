<style>
#modal {
    max-height: 90vh;
    overflow-y: auto;
}
</style>
<template>
    <div v-if="open" class="p-3 fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <!-- <div class="bg-white w-full max-w-lg rounded-2xl p-4 shadow-xl"> -->
        <div id="modal" class="bg-white w-full max-w-lg rounded-2xl p-4 shadow-xl overflow-y-auto scrollbar-thin">

            <h2 class="text-xl font-semibold mb-4">
                {{ isNew ? 'Nowa notatka' : 'Edytuj notatkę' }}
            </h2>

            <!-- formularz -->
            <div class="space-y-4">
                <input v-model="form.title" placeholder="Tytuł" class="w-full border rounded-md p-2" />
                <textarea v-model="form.content" rows="6" class="w-full border rounded-md p-2" />

                <!-- <div class="flex items-center gap-2 text-sm">
                    <span>Kolor:</span>
                    <input type="color" v-model="form.color" class="h-8 w-8 border rounded-md p-0" />
                </div> -->

                <!-- W formularzu -->
                <div class="space-y-2">
                    <label class="text-sm font-medium">Kolor:</label>
                    <div class="grid grid-cols-5 gap-2">
                        <div v-for="color in colors" :key="color" :class="[
                            'w-8 h-8 rounded cursor-pointer border-2',
                            form.color === color ? 'border-black' : 'border-transparent',
                            color
                        ]" @click="form.color = color"></div>
                    </div>
                </div>


                <!-- checklist -->
                <div v-if="noteId" class="space-y-2 border-t pt-4">
                    <h3 class="font-medium">Checklist</h3>

                    <CheckItem v-for="ci in itemsForNote" :key="ci.id" :item="ci" />

                    <button class="text-sm text-emerald-600" @click="addItem">
                        + Dodaj pozycję
                    </button>
                </div>

                <!-- ZAŁĄCZNIKI -->
                <div v-if="noteId" class="space-y-2 border-t pt-4">
                    <h3 class="font-medium">Załączniki</h3>
                    <div class="flex gap-2 flex-wrap">
                        <AttachmentItem v-for="a in attsForNote" :key="a.id" :att="a" />
                        <!-- upload placeholder -->
                        <label class="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-md cursor-pointer">
                            +
                            <input type="file" accept="image/*" class="hidden" @change="onFile" />
                        </label>
                    </div>
                </div>
            </div>

            <!-- akcje -->
            <div class="mt-6 flex justify-end gap-3">
                <button class="px-4 py-2 rounded-md border" @click="emit('update:open', false)">
                    Anuluj
                </button>
                <button class="px-4 py-2 rounded-md bg-emerald-600 text-white disabled:opacity-50" :disabled="loading"
                    @click="save">
                    {{ loading ? 'Zapisywanie…' : 'Zapisz' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useNotes } from '@/stores/useNotes'
import CheckItem from '@/components/CheckItem.vue'
import AttachmentItem from '@/components/AttachmentItem.vue'

const colors = [
    'bg-red-200',
    'bg-orange-200',
    'bg-amber-200',
    'bg-yellow-200',
    'bg-lime-200',
    'bg-green-200',
    'bg-emerald-200',
    'bg-teal-200',
    'bg-cyan-200',
    'bg-sky-200',
    'bg-blue-200',
    'bg-indigo-200',
    'bg-violet-200',
    'bg-purple-200',
    'bg-fuchsia-200',
    'bg-pink-200',
    'bg-rose-200',
    'bg-neutral-200',
    'bg-gray-200',
    'bg-zinc-200',
]


const props = defineProps<{ noteId?: string; open: boolean }>()
const emit = defineEmits(['update:open', 'saved'])

const notes = useNotes()
const loading = ref(false)

const blank = { title: '', content: '', color: '#ffffff' }
const form = ref({ ...blank })
const isNew = computed(() => !props.noteId)

/* formularz załączniki */
const attsForNote = computed(() => props.noteId ? notes.attachments[props.noteId] ?? [] : [])
// async function onFile(e: Event) {
//     const file = (e.target as HTMLInputElement).files?.[0]
//     if (file && props.noteId) await notes.uploadFile(props.noteId, file)
// }
async function onFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file && props.noteId) {
        await notes.uploadFile(props.noteId, file) // ⬅️ to wystarczy
    }
}


/* checklist */
const itemsForNote = computed(() =>
    props.noteId ? notes.items[props.noteId] ?? [] : [],
)

async function addItem() {
    if (props.noteId) {
        await notes.addItem(props.noteId, '')
    }
}

/* załaduj dane notatki gdy modal otwiera się */
watch(
    () => [props.open, props.noteId],
    async () => {
        if (!props.open) return

        if (props.noteId) {
            const n = notes.notes.find((x) => x.id === props.noteId)
            form.value = n
                ? { title: n.title ?? '', content: n.content ?? '', color: n.color ?? '#ffffff' }
                : { ...blank }

            // await notes.loadAttachments(props.noteId)  // 👈 DODANE TUTAJ
        } else {
            form.value = { ...blank }
        }
    },
    { immediate: true },
)


async function save() {
    loading.value = true
    if (isNew.value) await notes.add({ ...form.value })
    else await notes.update(props.noteId!, { ...form.value })
    loading.value = false
    emit('saved')
    emit('update:open', false)
}
</script>
