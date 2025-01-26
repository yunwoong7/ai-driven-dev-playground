import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// SQLite 데이터베이스 연결 설정
export async function getDb() {
  return open({
    filename: './records.db', // 데이터베이스 파일 경로
    driver: sqlite3.Database
  });
}

// 데이터베이스 초기화 함수
export async function initializeDb() {
  const db = await getDb();
  
  // 기본 테이블 생성
  await db.exec(`
    CREATE TABLE IF NOT EXISTS records (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      content TEXT NOT NULL,
      topic TEXT NOT NULL,
      level TEXT,
      feedback TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vocabulary (
      id TEXT PRIMARY KEY,
      word TEXT NOT NULL,
      meaning TEXT NOT NULL,
      example TEXT,
      recordId TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (recordId) REFERENCES records(id)
    );

    CREATE TABLE IF NOT EXISTS similar_expressions (
      id TEXT PRIMARY KEY,
      recordId TEXT NOT NULL,
      originalText TEXT NOT NULL,
      alternativeText TEXT NOT NULL,
      explanation TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (recordId) REFERENCES records(id)
    );
  `);

  // topic 컬럼이 없는 경우 추가
  const columns = await db.all("PRAGMA table_info(records)");
  const hasTopicColumn = columns.some(col => col.name === 'topic');
  
  if (!hasTopicColumn) {
    await db.exec("ALTER TABLE records ADD COLUMN topic TEXT");
  }
  
  return db;
} 