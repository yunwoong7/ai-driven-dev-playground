import { getDb } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { LevelIcon } from "@/components/LevelIcon"
import { Button } from "@/components/ui/button"
import { SearchSimilar } from "@/components/SearchSimilar"
import { RecordActions } from "@/components/RecordActions"
import Link from "next/link"
import { ArrowLeft, Edit } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

async function getRecord(id: string) {
  const db = await getDb()
  const record = await db.get('SELECT * FROM records WHERE id = ?', id)
  return record
}

export default async function RecordPage({ params }: { params: { id: string } }) {
  const record = await getRecord(params.id)
  if (!record) return null

  // 피드백 텍스트 파싱
  const feedbackLines = record.feedback?.split('\n').filter(Boolean) || []
  
  // 강점 파싱
  const strengthsLine = feedbackLines.find(line => line.startsWith('강점:'))
  const strengths = strengthsLine 
    ? feedbackLines
        .slice(feedbackLines.indexOf(strengthsLine) + 1)
        .takeWhile(line => !line.startsWith('개선점:'))
        .join('\n')
        .trim()
    : '분석 중...'

  // 개선점 파싱
  const improvementsLine = feedbackLines.find(line => line.startsWith('개선점:'))
  const improvements = improvementsLine
    ? feedbackLines
        .slice(feedbackLines.indexOf(improvementsLine) + 1)
        .takeWhile(line => !line.startsWith('수정 제안:'))
        .join('\n')
        .trim()
    : '분석 중...'

  // 수정 제안 파싱
  const correctionStartIndex = feedbackLines.findIndex(line => line.includes('수정 제안:'))
  const correctionLines = correctionStartIndex !== -1 
    ? feedbackLines.slice(correctionStartIndex + 1) 
    : []

  const corrections = []
  let currentCorrection = null

  for (const line of correctionLines) {
    if (line.startsWith('•')) {
      if (currentCorrection) {
        corrections.push(currentCorrection)
      }
      const [original, suggestion] = line.replace('•', '').split('→').map(s => s.trim())
      currentCorrection = { original, suggestion, explanation: '' }
    } else if (currentCorrection && line.trim()) {
      currentCorrection.explanation = line.trim()
    }
  }
  if (currentCorrection) {
    corrections.push(currentCorrection)
  }

  // 수정 제안이 없는 경우 기본값 설정
  if (corrections.length === 0) {
    corrections.push({
      original: '분석 중...',
      suggestion: '분석이 완료되면 수정 제안이 표시됩니다.',
      explanation: '잠시만 기다려주세요.'
    })
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                돌아가기
              </Button>
            </Link>
            <Link href={`/records/${record.id}/edit`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="w-4 h-4" />
                수정하기
              </Button>
            </Link>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">{record.topic}</h1>
              <p className="text-muted-foreground">{formatDate(record.date)}</p>
            </div>
            {record.level && <LevelIcon level={record.level} />}
          </div>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">작성 내용</TabsTrigger>
            <TabsTrigger value="feedback">피드백</TabsTrigger>
            <TabsTrigger value="similar">유사 표현</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>작성 내용</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {record.content}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            {/* 강점 */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">강점</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-600">{strengths}</p>
              </CardContent>
            </Card>

            {/* 개선점 */}
            <Card className="bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-700">개선점</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-600">{improvements}</p>
              </CardContent>
            </Card>

            {/* 수정 제안 */}
            {corrections.length > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-700">수정 제안</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {corrections.map((correction, index) => (
                    <div key={index} className="text-sm space-y-2">
                      <div className="flex items-start gap-2">
                        <Badge variant="destructive" className="shrink-0 mt-1">원문</Badge>
                        <p className="text-slate-600">{correction.original}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge variant="default" className="shrink-0 mt-1">제안</Badge>
                        <p className="text-blue-600">{correction.suggestion}</p>
                      </div>
                      <p className="text-sm text-slate-500 ml-14">{correction.explanation}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="similar">
            <Card>
              <CardHeader>
                <CardTitle>유사 표현 학습</CardTitle>
              </CardHeader>
              <CardContent>
                <SearchSimilar 
                  topic={record.topic} 
                  content={record.content}
                  recordId={record.id}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <RecordActions recordId={record.id} />
        </div>
      </div>
    </main>
  )
}

// Array.prototype.takeWhile 확장
declare global {
  interface Array<T> {
    takeWhile(predicate: (value: T) => boolean): T[]
  }
}

if (!Array.prototype.takeWhile) {
  Array.prototype.takeWhile = function<T>(predicate: (value: T) => boolean): T[] {
    const result = []
    for (const item of this) {
      if (!predicate(item)) break
      result.push(item)
    }
    return result
  }
} 