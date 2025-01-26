'use server'

import { getDb } from "./db"
import crypto from 'crypto'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const ANALYSIS_PROMPT = `
You are an English writing evaluator. Analyze the given English text and provide detailed feedback.

Please respond in the following JSON format:
{
  "level": "one of: Beginner, Intermediate, Upper Intermediate, Advanced, Master",
  "summary": "전반적인 평가 요약 (1-2문장, 한글)",
  "feedback": {
    "strengths": "2-3 강점을 한글로 작성",
    "improvements": "2-3 개선점을 한글로 작성",
    "corrections": [
      {
        "original": "원문에서 개선이 필요한 부분",
        "suggestion": "개선된 표현",
        "explanation": "개선 이유에 대한 설명 (한글)"
      }
    ]
  },
  "searchKeywords": [
    "관련 주제나 표현을 검색하기 위한 영어 키워드 3-5개",
    "예: business email writing, formal expressions, professional tone 등"
  ]
}`

const SIMILAR_EXPRESSIONS_PROMPT = `
You are helping an English learner improve their writing skills. Based on the search results and the learner's original text, create a response that:

1. Shows 2-3 alternative ways to express similar ideas
2. Explains why these alternatives might be more effective or natural
3. Provides example sentences in a similar context
4. Maintains a similar tone and style to the original text

Format your response in Korean for better understanding.
Make it feel like a friendly writing partner sharing knowledge, not a formal evaluation.
`

const HINT_PROMPT = `
You are helping an English learner write about a specific topic.
Provide 10 useful English expressions or sentence patterns that could be used when writing about the given topic.

Format your response in Korean as follows:
1. [영어 표현] - [한글 설명]
2. [영어 표현] - [한글 설명]
...

Make expressions practical and natural, suitable for the topic.
`

const WORD_PROMPT = `
You are helping an English learner understand a word. 
Please provide the meaning in Korean and a natural example sentence.

Respond in the following JSON format:
{
  "meaning": "한글로 된 단어의 의미",
  "example": "A natural example sentence using the word"
}
`

export async function createRecord(content: string, topic: string) {
  const db = await getDb()
  const id = crypto.randomUUID()
  const date = new Date().toISOString().split('T')[0]

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: ANALYSIS_PROMPT },
      { role: "user", content }
    ],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" }
  })

  const analysis = JSON.parse(completion.choices[0].message.content)
  const feedback = `
강점:
${analysis.feedback.strengths}

개선점:
${analysis.feedback.improvements}

수정 제안:
${analysis.feedback.corrections.map(c => 
  `• ${c.original} → ${c.suggestion}
   ${c.explanation}`
).join('\n\n')}
`

  await db.run(
    `INSERT INTO records (id, date, content, level, feedback, topic) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, date, content, analysis.level, feedback, topic]
  )

  return { id, date, content, level: analysis.level, feedback, topic }
}

export async function searchSimilarExpressions(
  query: string,
  originalContent?: string,
  searchResults?: any[]
) {
  if (!searchResults) {
    // 첫 번째 단계: Tavily 검색
    const searchResponse = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TAVILY_API_KEY}`
      },
      body: JSON.stringify({
        query,
        search_depth: "advanced",
        include_answer: true,
        max_results: 5
      })
    })

    const data = await searchResponse.json()
    return data.results
  } else {
    // 두 번째 단계: GPT로 유사 표현 생성
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SIMILAR_EXPRESSIONS_PROMPT },
        { 
          role: "user", 
          content: `
Original text:
${originalContent}

Search results:
${searchResults.map((r: any) => `${r.title}\n${r.content}`).join('\n\n')}
          `
        }
      ],
      model: "gpt-3.5-turbo"
    })

    return completion.choices[0].message.content
  }
}

export async function getTopicHints(topic: string) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: HINT_PROMPT },
      { role: "user", content: `Topic: ${topic}` }
    ],
    model: "gpt-3.5-turbo"
  })

  return completion.choices[0].message.content
}

export async function updateRecord(id: string, content: string, topic: string) {
  const db = await getDb()
  const date = new Date().toISOString().split('T')[0]

  // 새로운 피드백 생성
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: ANALYSIS_PROMPT },
      { role: "user", content }
    ],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" }
  })

  const analysis = JSON.parse(completion.choices[0].message.content)
  const feedback = `
강점:
${analysis.feedback.strengths}

개선점:
${analysis.feedback.improvements}

수정 제안:
${analysis.feedback.corrections.map(c => 
  `• ${c.original} → ${c.suggestion}
   ${c.explanation}`
).join('\n\n')}
`

  await db.run(
    `UPDATE records 
     SET content = ?, topic = ?, level = ?, feedback = ?, date = ?, updatedAt = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [content, topic, analysis.level, feedback, date, id]
  )

  return { id, date, content, level: analysis.level, feedback, topic }
}

export async function addVocabulary(word: string, meaning: string, example?: string, recordId?: string) {
  const db = await getDb()
  const id = crypto.randomUUID()

  await db.run(
    `INSERT INTO vocabulary (id, word, meaning, example, recordId) 
     VALUES (?, ?, ?, ?, ?)`,
    [id, word, meaning, example, recordId]
  )

  return { id, word, meaning, example, recordId }
}

export async function getVocabulary() {
  const db = await getDb()
  const words = await db.all(`
    SELECT * FROM vocabulary 
    ORDER BY createdAt DESC
  `)
  return words
}

export async function getWordInfo(word: string) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: WORD_PROMPT },
      { role: "user", content: word }
    ],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" }
  })

  return JSON.parse(completion.choices[0].message.content)
}

export async function deleteVocabulary(id: string) {
  const db = await getDb()
  await db.run('DELETE FROM vocabulary WHERE id = ?', id)
  return id
}

export async function saveSimilarExpression(
  recordId: string,
  originalText: string,
  alternativeText: string,
  explanation: string
) {
  const db = await getDb()
  const id = crypto.randomUUID()

  await db.run(
    `INSERT INTO similar_expressions (id, recordId, originalText, alternativeText, explanation) 
     VALUES (?, ?, ?, ?, ?)`,
    [id, recordId, originalText, alternativeText, explanation]
  )

  return { id, recordId, originalText, alternativeText, explanation }
}

export async function getSimilarExpressions(recordId: string) {
  const db = await getDb()
  const expressions = await db.all(
    'SELECT * FROM similar_expressions WHERE recordId = ? ORDER BY createdAt DESC',
    recordId
  )
  return expressions
}

export async function deleteSimilarExpressions(recordId: string) {
  const db = await getDb()
  await db.run('DELETE FROM similar_expressions WHERE recordId = ?', recordId)
}

export async function deleteRecord(id: string) {
  const db = await getDb()
  
  // 관련된 유사 표현도 함께 삭제
  await db.run('DELETE FROM similar_expressions WHERE recordId = ?', id)
  
  // 작문 기록 삭제
  await db.run('DELETE FROM records WHERE id = ?', id)
  
  return id
}

export async function getRecords() {
  const db = await getDb()
  const records = await db.all(`
    SELECT * FROM records 
    ORDER BY date DESC, createdAt DESC
  `)
  return records
} 