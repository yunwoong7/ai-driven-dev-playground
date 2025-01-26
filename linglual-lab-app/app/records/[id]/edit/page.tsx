import { getDb } from "@/lib/db"
import { WriteForm } from "@/components/WriteForm"

async function getRecord(id: string) {
  const db = await getDb()
  const record = await db.get('SELECT * FROM records WHERE id = ?', id)
  return record
}

export default async function EditPage({ params }: { params: { id: string } }) {
  const record = await getRecord(params.id)
  if (!record) return null

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">작문 수정</h1>
        <WriteForm 
          mode="edit"
          initialData={{
            id: record.id,
            topic: record.topic,
            content: record.content
          }}
        />
      </div>
    </main>
  )
} 