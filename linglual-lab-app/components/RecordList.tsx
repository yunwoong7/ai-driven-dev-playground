'use client'

import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { LevelIcon } from "./LevelIcon"
import { Button } from "./ui/button"
import { ChevronRight, Edit2, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { deleteRecord, getRecords } from "@/lib/actions"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function RecordList() {
  const [records, setRecords] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function loadRecords() {
    try {
      const data = await getRecords()
      setRecords(data)
    } catch (error) {
      console.error('Failed to load records:', error)
    }
  }

  useEffect(() => {
    loadRecords()
  }, [])

  async function handleDelete(id: string) {
    setIsDeleting(true)
    try {
      await deleteRecord(id)
      await loadRecords()
      router.refresh()
    } catch (error) {
      console.error('Failed to delete record:', error)
      alert('삭제에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      {records.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-secondary rounded-lg">
          작성된 글이 없습니다. 새로운 학습을 시작해보세요!
        </div>
      ) : (
        records.map((record) => {
          // 피드백 텍스트 파싱
          const feedbackLines = record.feedback?.split('\n').filter(Boolean) || []
          const strengths = feedbackLines.find(line => line.startsWith('강점:'))?.replace('강점:', '').trim()
          const firstCorrection = feedbackLines.find(line => line.startsWith('•'))?.trim()

          return (
            <div
              key={record.id}
              className="p-6 rounded-lg border border-border bg-card hover:border-primary transition-colors animate-hover"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-lg">{formatDate(record.date)}</p>
                  <span className="text-sm text-muted-foreground px-2 py-1 bg-secondary rounded-full">
                    {record.topic}
                  </span>
                </div>
                {record.level && <LevelIcon level={record.level} className="w-8 h-8" />}
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-foreground">{record.content}</p>
              </div>

              <div className="space-y-3 mb-6 bg-accent p-4 rounded-md">
                {strengths && (
                  <div className="text-sm">
                    <span className="font-semibold text-primary">강점: </span>
                    <span className="text-accent-foreground">{strengths}</span>
                  </div>
                )}
                {firstCorrection && (
                  <div className="text-sm">
                    <span className="font-semibold text-primary">주요 수정사항: </span>
                    <span className="text-accent-foreground">{firstCorrection}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Link href={`/records/${record.id}`}>
                  <Button variant="outline" size="sm" className="animate-hover">
                    상세보기
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <AlertDialog open={deleteId === record.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="gap-2"
                      onClick={() => setDeleteId(record.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      삭제
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>작문을 삭제하시겠습니까?</AlertDialogTitle>
                      <AlertDialogDescription>
                        이 작업은 되돌릴 수 없습니다. 작문과 관련된 모든 데이터(유사 표현 등)가 영구적으로 삭제됩니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteId && handleDelete(deleteId)}
                        disabled={isDeleting}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {isDeleting ? "삭제 중..." : "삭제"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

