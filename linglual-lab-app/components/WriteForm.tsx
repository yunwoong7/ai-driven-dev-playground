'use client'

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { createRecord, getTopicHints, updateRecord } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Lightbulb, Loader2, RefreshCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface WriteFormProps {
  mode?: 'create' | 'edit'
  initialData?: {
    id: string
    topic: string
    content: string
  }
}

export function WriteForm({ mode = 'create', initialData }: WriteFormProps) {
  const [topic, setTopic] = useState(initialData?.topic ?? "")
  const [content, setContent] = useState(initialData?.content ?? "")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingHints, setIsLoadingHints] = useState(false)
  const [hints, setHints] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || !topic.trim()) return

    setIsLoading(true)
    try {
      if (mode === 'edit' && initialData) {
        await updateRecord(initialData.id, content, topic)
      } else {
        await createRecord(content, topic)
      }
      router.push("/")
    } catch (error) {
      console.error("Failed to save record:", error)
      alert("저장에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  async function loadHints() {
    if (!topic.trim()) {
      alert("주제를 먼저 입력해주세요.")
      return
    }

    setIsLoadingHints(true)
    try {
      const hints = await getTopicHints(topic)
      setHints(hints)
    } catch (error) {
      console.error("Failed to load hints:", error)
      alert("힌트 로딩에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoadingHints(false)
    }
  }

  function handleHintButtonClick() {
    if (hints) {
      setIsDialogOpen(true)
    } else {
      loadHints()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">주제</label>
        <div className="flex gap-2">
          <Input
            placeholder="작문 주제를 입력해주세요 (예: 재택근무, AI의 미래...)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleHintButtonClick}
                disabled={isLoading || isLoadingHints}
                className="relative"
              >
                {isLoadingHints ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lightbulb className="h-4 w-4" />
                )}
                {hints && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>작문 힌트</span>
                  {hints && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadHints}
                      disabled={isLoadingHints}
                      className="gap-2"
                    >
                      {isLoadingHints ? (
                        <>
                          재생성 중...
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          힌트 재생성
                          <RefreshCw className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                {isLoadingHints ? (
                  <div className="flex flex-col items-center gap-2 py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <p className="text-sm text-muted-foreground">
                      힌트를 생성하고 있습니다...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      다음 표현들을 참고하여 작성해보세요:
                    </p>
                    <div className="text-sm whitespace-pre-line">
                      {hints}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">내용</label>
        <Textarea
          placeholder="영어로 작문을 작성해주세요..."
          className="min-h-[200px] resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/")}
          disabled={isLoading}
        >
          취소
        </Button>
        <Button type="submit" disabled={isLoading || !content.trim() || !topic.trim()}>
          {isLoading ? "분석 중..." : mode === 'edit' ? "수정하기" : "분석하기"}
        </Button>
      </div>
    </form>
  )
} 