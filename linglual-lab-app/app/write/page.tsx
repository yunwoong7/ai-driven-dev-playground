import { WriteForm } from "@/components/WriteForm"

export default function WritePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">새로운 작문 작성</h1>
        <WriteForm />
      </div>
    </main>
  )
} 