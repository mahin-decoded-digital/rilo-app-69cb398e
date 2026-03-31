// ---------------------------------------------------------------------------
// Database Client — dual mode
// Development (WebContainer): in-memory Map (default)
// Production (PROD=true + MONGODB_URI): real MongoDB driver
// ---------------------------------------------------------------------------

import { MongoClient, ObjectId } from 'mongodb'
import type { Db } from 'mongodb'

export interface Doc {
  _id: string
  [key: string]: any
}

const IS_PROD = process.env.PROD === 'true'
const MONGODB_URI = process.env.MONGODB_URI ?? ''

// ---------------------------------------------------------------------------
// In-memory storage (development / WebContainer)
// ---------------------------------------------------------------------------

let idCounter = 0
function genId(): string {
  return Date.now().toString(36) + (idCounter++).toString(36) + Math.random().toString(36).slice(2, 8)
}

const store = new Map<string, Doc[]>()

function getStore(name: string): Doc[] {
  if (!store.has(name)) store.set(name, [])
  return store.get(name)!
}

function matchesQuery(doc: Doc, query: Record<string, any>): boolean {
  for (const [key, val] of Object.entries(query)) {
    if (val && typeof val === 'object' && '$ne' in val) {
      if (doc[key] === (val as any).$ne) return false
      continue
    }
    if (doc[key] !== val) return false
  }
  return true
}

function memoryCollection(name: string) {
  return {
    async find(query?: Record<string, any>): Promise<Doc[]> {
      const docs = getStore(name)
      if (!query || Object.keys(query).length === 0) return [...docs]
      return docs.filter((d) => matchesQuery(d, query))
    },
    async findOne(query: Record<string, any>): Promise<Doc | null> {
      const docs = getStore(name)
      return docs.find((d) => matchesQuery(d, query)) ?? null
    },
    async findById(id: string): Promise<Doc | null> {
      return getStore(name).find((d) => d._id === id) ?? null
    },
    async insertOne(doc: Record<string, any>): Promise<string> {
      const id = genId()
      const newDoc = { ...doc, _id: id } as Doc
      getStore(name).push(newDoc)
      return id
    },
    async updateOne(id: string, update: Record<string, any>): Promise<boolean> {
      const docs = getStore(name)
      const idx = docs.findIndex((d) => d._id === id)
      if (idx === -1) return false
      docs[idx] = { ...docs[idx]!, ...update, _id: id }
      return true
    },
    async deleteOne(id: string): Promise<boolean> {
      const docs = getStore(name)
      const idx = docs.findIndex((d) => d._id === id)
      if (idx === -1) return false
      docs.splice(idx, 1)
      return true
    },
  }
}

// ---------------------------------------------------------------------------
// Real MongoDB collection (production — PROD=true + MONGODB_URI)
// ---------------------------------------------------------------------------

let mongoDb: Db | null = null

async function getMongoDb(): Promise<Db> {
  if (mongoDb) return mongoDb
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  mongoDb = client.db()
  console.log('[db] MongoDB connected')
  return mongoDb
}

function mongoCollection(name: string) {
  return {
    async find(query?: Record<string, any>): Promise<Doc[]> {
      const db = await getMongoDb()
      const docs = await db.collection(name).find(query ?? {}).toArray()
      return docs.map((d) => ({ ...d, _id: d._id.toString() })) as Doc[]
    },
    async findOne(query: Record<string, any>): Promise<Doc | null> {
      const db = await getMongoDb()
      const doc = await db.collection(name).findOne(query)
      if (!doc) return null
      return { ...doc, _id: doc._id.toString() } as Doc
    },
    async findById(id: string): Promise<Doc | null> {
      const db = await getMongoDb()
      let doc
      try {
        doc = await db.collection(name).findOne({ _id: new ObjectId(id) })
      } catch {
        doc = await db.collection(name).findOne({ _id: id as any })
      }
      if (!doc) return null
      return { ...doc, _id: doc._id.toString() } as Doc
    },
    async insertOne(doc: Record<string, any>): Promise<string> {
      const db = await getMongoDb()
      const result = await db.collection(name).insertOne(doc)
      return result.insertedId.toString()
    },
    async updateOne(id: string, update: Record<string, any>): Promise<boolean> {
      const db = await getMongoDb()
      let result
      try {
        result = await db.collection(name).updateOne({ _id: new ObjectId(id) }, { $set: update })
      } catch {
        result = await db.collection(name).updateOne({ _id: id as any }, { $set: update })
      }
      return result.modifiedCount > 0
    },
    async deleteOne(id: string): Promise<boolean> {
      const db = await getMongoDb()
      let result
      try {
        result = await db.collection(name).deleteOne({ _id: new ObjectId(id) })
      } catch {
        result = await db.collection(name).deleteOne({ _id: id as any })
      }
      return result.deletedCount > 0
    },
  }
}

// ---------------------------------------------------------------------------
// Exported client — auto-selects based on environment
// ---------------------------------------------------------------------------

function collection(name: string) {
  if (IS_PROD && MONGODB_URI) return mongoCollection(name)
  return memoryCollection(name)
}

export const db = { collection, isProduction: () => IS_PROD && !!MONGODB_URI }