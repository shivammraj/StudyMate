import pg from 'pg';
const { Pool } = pg;

export class DatabaseService {
  private pool: pg.Pool | null = null;
  private isConnected = false;

  constructor() {
    this.initPool();
  }

  private initPool() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.log('ℹ️  DATABASE_URL not configured. Running with in-memory persistence.');
      return;
    }

    try {
      this.pool = new Pool({
        connectionString,
        ssl: {
          rejectUnauthorized: false,
        },
        connectionTimeoutMillis: 5000,
      });

      this.pool.on('error', (err) => {
        console.warn('⚠️  Supabase pool error:', err.message);
      });
    } catch (err: any) {
      console.warn('⚠️  Could not initialize Supabase pool:', err.message);
    }
  }

  async testConnection(): Promise<{ ok: boolean; message: string; version?: string }> {
    if (!this.pool) {
      return { ok: false, message: 'DATABASE_URL is not set.' };
    }

    try {
      const res = await this.pool.query('SELECT NOW() as now, version() as version;');
      this.isConnected = true;
      return {
        ok: true,
        message: 'Successfully connected to Supabase PostgreSQL!',
        version: res.rows[0]?.version,
      };
    } catch (err: any) {
      this.isConnected = false;
      return {
        ok: false,
        message: err.message || 'Connection failed',
      };
    }
  }

  async initSchema(): Promise<void> {
    if (!this.pool) return;

    const schemaSql = `
      CREATE TABLE IF NOT EXISTS ask_sessions (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        mode VARCHAR(50) DEFAULT 'auto',
        subject VARCHAR(100),
        topic VARCHAR(150),
        intent VARCHAR(100),
        difficulty VARCHAR(50),
        learning_mode VARCHAR(100),
        title TEXT,
        answer TEXT,
        summary TEXT,
        student_name VARCHAR(150) DEFAULT 'Shivam Mavi',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS topic_mastery (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(150) DEFAULT 'Shivam Mavi',
        topic VARCHAR(150) NOT NULL UNIQUE,
        subject VARCHAR(100),
        mastery INTEGER DEFAULT 50,
        concept_score INTEGER DEFAULT 50,
        application_score INTEGER DEFAULT 50,
        edge_case_score INTEGER DEFAULT 50,
        questions_attempted INTEGER DEFAULT 0,
        questions_correct INTEGER DEFAULT 0,
        last_practiced TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await this.pool.query(schemaSql);
      console.log('✅ Supabase StudyMate database tables verified.');
    } catch (err: any) {
      console.warn('⚠️  Could not run schema migrations:', err.message);
    }
  }

  async saveAskSession(session: {
    question: string;
    mode: string;
    subject: string;
    topic: string;
    intent: string;
    difficulty: string;
    learningMode: string;
    title: string;
    answer: string;
    summary: string;
    studentName?: string;
  }): Promise<void> {
    if (!this.pool) return;

    try {
      await this.pool.query(
        `INSERT INTO ask_sessions 
          (question, mode, subject, topic, intent, difficulty, learning_mode, title, answer, summary, student_name)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          session.question,
          session.mode,
          session.subject,
          session.topic,
          session.intent,
          session.difficulty,
          session.learningMode,
          session.title,
          session.answer,
          session.summary,
          session.studentName || 'Shivam Mavi',
        ]
      );
    } catch (err: any) {
      // Do not crash the user experience if DB is unreachable
      console.warn('⚠️  Failed to save ask session to Supabase:', err.message);
    }
  }
}

export const dbService = new DatabaseService();
