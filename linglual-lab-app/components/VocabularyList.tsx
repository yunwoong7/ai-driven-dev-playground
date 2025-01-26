'use client'

import { getVocabulary, deleteVocabulary } from "@/lib/actions"
import { formatDate } from "@/lib/utils"
import { VocabularyDialog } from "@/components/VocabularyDialog"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function VocabularyList() {
  const [words, setWords] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function loadWords() {
    try {
      const data = await getVocabulary()
      setWords(data)
    } catch (error) {
      console.error("Failed to load vocabulary:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setIsDeleting(true)
    try {
      await deleteVocabulary(id)
      await loadWords() // 목록 새로고침
    } catch (error) {
      console.error("Failed to delete vocabulary:", error)
      alert("단어 삭제에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  useEffect(() => {
    loadWords()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center text-muted-foreground">
          단어장을 불러오는 중...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">나의 단어장</h1>
          <p className="text-muted-foreground">
            학습 중 저장한 단어들을 복습하세요.
          </p>
        </div>
        <VocabularyDialog onAdd={loadWords}>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            단어 추가
          </Button>
        </VocabularyDialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {words.map((word) => (
          <div
            key={word.id}
            className="p-4 rounded-lg border border-border bg-card hover:border-primary transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{word.word}</h3>
                <span className="text-xs text-muted-foreground">
                  {formatDate(word.createdAt)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => setDeleteId(word.id)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-foreground mb-2">{word.meaning}</p>
            {word.example && (
              <p className="text-sm text-muted-foreground italic">
                "{word.example}"
              </p>
            )}
          </div>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>단어 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 단어를 단어장에서 삭제하시겠습니까?
              삭제된 단어는 복구할 수 없습니다.
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

      {words.length === 0 && (
        <div className="text-center py-12 text-muted-foreground bg-secondary rounded-lg">
          아직 저장된 단어가 없습니다. 학습하면서 단어를 추가해보세요!
        </div>
      )}
    </div>
  )
} 