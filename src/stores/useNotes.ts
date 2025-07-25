import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export interface Note {
  id: string
  owner: string
  title: string | null
  content: string | null
  color: string | null
  created_at: string
  updated_at: string | null
  attachments: [] // opcjonalne, jeśli notatka ma załączniki
}

export interface CheckItem {
  id: string
  note_id: string
  text: string | null
  checked: boolean
  position: number | null
  created_at: string
  updated_at: string | null
}

// typ
export interface Attachment {
  id: string
  note_id: string
  url: string
  created_at: string
  storage_path: string
}

export const useNotes = defineStore('notes', {
  state: () => ({
    notes: [] as Note[],
    items: {} as Record<string, CheckItem[]>,   // key = note_id
    loading: false,
    attachments: {} as Record<string, Attachment[]>,
  }),

  actions: {
    /* ---- NOTES ---------------------------------------------------------- */
    async fetch() {
      this.loading = true

      const [{ data: notes }, { data: items }] = await Promise.all([
        supabase.from('notes').select('*'),
        supabase.from('check_items').select('*'),
      ])

      const { data: atts } = await supabase.from('attachments').select('*')

      this.notes = notes ?? []

      this.items = {}
      for (const it of items ?? []) {
        (this.items[it.note_id] ??= []).push(it as CheckItem)
      }

      // ✅ ZRESETUJ załączniki przed dodaniem
      this.attachments = {}
      for (const a of atts ?? []) {
        (this.attachments[a.note_id] ??= []).push(a)
      }

      this.loading = false
    }
    ,
    // upload
    async uploadFilex(noteId: string, file: File) {
      const path = `${noteId}/${crypto.randomUUID()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(path, file)

      if (uploadError) throw uploadError

      // const { data: { publicUrl } } = supabase.storage.from('attachments').getPublicUrl(path)

      const { data: _data, error: insertError } = await supabase
        .from('attachments')
        .insert({
          note_id: noteId,
          file_name: file.name,
          storage_path: path,
          mime_type: file.type,
          size: file.size,
        })
        .select('*')
        .single()

      if (insertError) throw insertError

      // this.attachments[noteId] = [...(this.attachments[noteId] ?? []), data as Attachment]
      // const current = this.attachments[noteId] ?? []
      // const updated = [...current.filter(a => a.id !== data.id), data as Attachment]
      // this.attachments[noteId] = updated

    },
    async uploadFile(noteId: string, file: File) {
      const path = `${noteId}/${crypto.randomUUID()}-${file.name}`

      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(path, file)

      if (uploadError) throw uploadError

      const { error: insertError } = await supabase
        .from('attachments')
        .insert({
          note_id: noteId,
          file_name: file.name,
          storage_path: path,
          mime_type: file.type,
          size: file.size,
        })
        .select('*')
        .single()

      if (insertError) throw insertError

      // ✅ Nie dodajemy lokalnie — tylko odświeżamy z Supabase
      await this.loadAttachments(noteId)
    },




    // delete
    async deleteFile(att: Attachment) {
      await supabase.storage.from('attachments').remove([new URL(att.url).pathname.slice(1)])
      await supabase.from('attachments').delete().eq('id', att.id)
      this.attachments[att.note_id] = (this.attachments[att.note_id] ?? []).filter(a => a.id !== att.id)
    },
    async removeAttachment(id: string) {
      const att = await supabase.from('attachments').select('*').eq('id', id).single()
      if (att.data) {
        await supabase.storage.from('files').remove([att.data.storage_path])
        await supabase.from('attachments').delete().eq('id', id)
        // zaktualizuj lokalnie:
        const noteId = att.data.note_id
        this.attachments[noteId] = this.attachments[noteId]?.filter((a) => a.id !== id) ?? []
      }
    },
    async loadAttachments(noteId: string) {
      const { data, error } = await supabase
        .from('attachments')
        .select('*')
        .eq('note_id', noteId)

      if (!error && data) {
        this.attachments[noteId] = data
      }
    },



    async add(note: Partial<Omit<Note, 'id' | 'owner'>>) {
      const { data } = await supabase.from('notes').insert(note).single()
      if (data) this.notes = [...this.notes, data as Note]
    },

    async update(id: string, payload: Partial<Note>) {
      const { data } = await supabase.from('notes').update(payload).eq('id', id).single()
      if (!data) return
      this.notes = this.notes.map((n) => (n.id === id ? (data as Note) : n))
    },

    /* ---- CHECKLIST ------------------------------------------------------ */
    async addItem(noteId: string, text = '') {
      const { data, error } = await supabase
        .from('check_items')
        .insert({ note_id: noteId, text })
        .select('*')            //  👈  DOPISANE
        .single()

      if (error) throw error

      const list = [...(this.items[noteId] ?? []), data as CheckItem]
      this.items = { ...this.items, [noteId]: list }
      return data as CheckItem
    },


    /* toggleItem — NOWA wersja */
    async toggleItem(id: string, checked: boolean) {
      const { data } = await supabase
        .from('check_items')
        .update({ checked })
        .eq('id', id)
        .single()
      if (!data) return

      const noteId = (data as CheckItem).note_id
      // 1️⃣  kopiujemy całą tablicę
      const list = (this.items[noteId] ?? []).map((ci) =>
        ci.id === id ? (data as CheckItem) : ci,
      )
      // 2️⃣  tworzymy NOWY obiekt items → Vue widzi zmianę referencji
      this.items = { ...this.items, [noteId]: list }
    },


    async updateItemText(id: string, text: string) {
      const { data } = await supabase
        .from('check_items')
        .update({ text })
        .eq('id', id)
        .single()
      if (!data) return

      const noteId = (data as CheckItem).note_id
      const list = (this.items[noteId] ?? []).map((ci) =>
        ci.id === id ? (data as CheckItem) : ci,
      )
      this.items = { ...this.items, [noteId]: list }
    },

    async removeItem(id: string, noteId: string) {
      await supabase.from('check_items').delete().eq('id', id)
      const list = (this.items[noteId] ?? []).filter((ci) => ci.id !== id)
      this.items = { ...this.items, [noteId]: list }
    },
    /* ---- NOTES ---------------------------------------------------------- */
    async remove(id: string) {
      // 1. usuń powiązane checklisty (ON DELETE CASCADE też zadziała, jeśli masz FK)
      await supabase.from('check_items').delete().eq('note_id', id)

      // 2. usuń samą notatkę
      const { error } = await supabase.from('notes').delete().eq('id', id)
      if (error) throw error

      // 3. wyczyść store
      this.notes = this.notes.filter((n) => n.id !== id)
      delete this.items[id]
    },

  },
})
// function removeAttachment(id: any, string: any) {
//   throw new Error('Function not implemented.')
// }

