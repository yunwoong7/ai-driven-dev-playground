'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { addVocabulary, getWordInfo } from "@/lib/actions"
import { BookMarked, Loader2, Plus, Wand2 } from "lucide-react"
import { useState } from "react"

interface VocabularyDialogProps {
  recordId?: string
  selectedText?: string
  children?: React.ReactNode
  onAdd?: () => void
}

export function VocabularyDialog({ recordId, selectedText, children, onAdd }: VocabularyDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [word, setWord] = useState(selectedText || "")
  const [meaning, setMeaning] = useState("")
  const [example, setExample] = useState("")

  async function generateInfo() {
    if (!word.trim()) return

    setIsGenerating(true)
    try {
      const info = await getWordInfo(word)
      setMeaning(info.meaning)
      setExample(info.example)
    } catch (error) {
      console.error("Failed to generate word info:", error)
      alert("단어 정보 생성에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!word.trim()) return

    setIsLoading(true)
    try {
      if (!meaning.trim() || !example.trim()) {
        const info = await getWordInfo(word)
        await addVocabulary(
          word,
          meaning.trim() || info.meaning,
          example.trim() || info.example,
          recordId
        )
      } else {
        await addVocabulary(word, meaning, example, recordId)
      }
      setIsOpen(false)
      setWord("")
      setMeaning("")
      setExample("")
      onAdd?.()
    } catch (error) {
      console.error("Failed to add vocabulary:", error)
      alert("단어 추가에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="gap-2">
            <BookMarked className="w-4 h-4" />
            단어장에 추가
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>단어장에 추가</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">단어</label>
            <div className="flex gap-2">
              <Input
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="추가할 단어를 입력하세요"
                disabled={isLoading || isGenerating}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={generateInfo}
                disabled={isLoading || isGenerating || !word.trim()}
                className="shrink-0"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">의미 (자동 생성)</label>
            <Input
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              placeholder="단어의 의미가 자동으로 생성됩니다"
              disabled={isLoading || isGenerating}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">예문 (자동 생성)</label>
            <Textarea
              value={example}
              onChange={(e) => setExample(e.target.value)}
              placeholder="예문이 자동으로 생성됩니다"
              disabled={isLoading || isGenerating}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading || isGenerating}
            >
              취소
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || isGenerating || !word.trim()}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  추가 중...
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  추가하기
                  <Plus className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 