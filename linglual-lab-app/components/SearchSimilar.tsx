'use client'

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { searchSimilarExpressions, saveSimilarExpression, getSimilarExpressions, deleteSimilarExpressions } from "@/lib/actions"
import { Search, BookOpen, BookmarkPlus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SearchSimilarProps {
  topic: string
  content: string
  recordId: string
}

type SearchStatus = 'idle' | 'searching' | 'generating' | 'complete'

export function SearchSimilar({ topic, content, recordId }: SearchSimilarProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<SearchStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{
    searchResults: string[]
    generatedContent: string
  } | null>(null)
  const [savedExpressions, setSavedExpressions] = useState<any[]>([])

  useEffect(() => {
    loadSavedExpressions()
  }, [recordId])

  async function loadSavedExpressions() {
    try {
      const data = await getSimilarExpressions(recordId)
      setSavedExpressions(data)
    } catch (error) {
      console.error("Failed to load saved expressions:", error)
    }
  }

  async function handleSearch() {
    setIsLoading(true)
    setStatus('searching')
    setProgress(25)
    
    try {
      // 1단계: 관련 검색어 생성
      setProgress(35)
      const searchQuery = `english writing examples about ${topic}`
      
      // 2단계: Tavily로 검색
      setProgress(50)
      const searchResults = await searchSimilarExpressions(searchQuery)
      setProgress(75)
      setStatus('generating')
      
      // 3단계: GPT로 유사 표현 생성
      const generatedContent = await searchSimilarExpressions(
        searchQuery,
        content,
        searchResults
      )
      setProgress(100)
      setStatus('complete')
      
      // 기존 표현 삭제 후 새로운 표현 저장
      await deleteSimilarExpressions(recordId)
      await saveSimilarExpression(
        recordId,
        content,
        generatedContent,
        `참고한 자료:\n${searchResults.map(r => r.title).join('\n')}`
      )

      setResult({
        searchResults: searchResults.map(r => r.title),
        generatedContent
      })
      
      await loadSavedExpressions()
    } catch (error) {
      console.error('Failed to search:', error)
      alert('검색 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">유사 표현 학습</h2>
        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <>
              {status === 'searching' ? '검색 중...' : '표현 생성 중...'}
              <Search className="w-4 h-4 animate-pulse" />
            </>
          ) : (
            <>
              유사 표현 찾기
              <Search className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            {status === 'searching' ? '관련 표현을 검색하고 있습니다...' : '검색 결과를 바탕으로 표현을 생성하고 있습니다...'}
          </p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              참고한 자료
            </h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {result.searchResults.map((title, index) => (
                <li key={index}>{title}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">유사 표현 예시</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-sm whitespace-pre-line">{result.generatedContent}</p>
            </div>
          </div>
        </div>
      )}

      {/* 저장된 유사 표현 */}
      {savedExpressions.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">저장된 유사 표현</h3>
          <div className="grid gap-4">
            {savedExpressions.map((expr) => (
              <Card key={expr.id}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline">원문</Badge>
                      <p>{expr.originalText}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge>대체 표현</Badge>
                      <p>{expr.alternativeText}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {expr.explanation}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 검색 및 결과 */}
      <div className="space-y-4">
        {/* ... 기존 검색 UI ... */}
        
        {result && (
          <div className="space-y-4">
            {result.generatedContent.split('\n\n').map((section, index) => {
              const [original, alternative, explanation] = section.split('\n')
              if (!original || !alternative || !explanation) return null

              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Badge variant="outline">원문</Badge>
                        <p>{original}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge>대체 표현</Badge>
                        <p>{alternative}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {explanation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
} 