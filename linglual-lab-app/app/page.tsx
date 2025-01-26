import { Button } from "@/components/ui/button"
import { RecordList } from "@/components/RecordList"
import Link from "next/link"

export default async function Home() {
  return (
    <main className="container mx-auto px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Study English with AI</h1>
        <Link href="/write">
          <Button>새로운 작문 작성</Button>
        </Link>
      </div>
      
      <RecordList />
    </main>
  )
}
