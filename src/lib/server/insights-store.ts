import { promises as fs } from 'node:fs'
import path from 'node:path'

export type TrackedKind = 'meal' | 'drink'

export interface TrackedRecipePayload {
  id: string
  title: string
  image: string
  category: string
  kind: TrackedKind
}

export interface TrackedRecipe extends TrackedRecipePayload {
  views: number
  lastViewedAt: number
}

interface InsightsStore {
  items: TrackedRecipe[]
}

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'insights.json')
const MAX_TRACKED_ITEMS = 500

let writeChain: Promise<void> = Promise.resolve()

const sanitizeTrackedRecipe = (value: unknown): TrackedRecipe | null => {
  if (!value || typeof value !== 'object') return null

  const item = value as Partial<TrackedRecipe>
  const views = Number(item.views)
  const lastViewedAt = Number(item.lastViewedAt)

  if (
    typeof item.id !== 'string' ||
    typeof item.title !== 'string' ||
    typeof item.image !== 'string' ||
    typeof item.category !== 'string' ||
    (item.kind !== 'meal' && item.kind !== 'drink') ||
    Number.isNaN(views) ||
    views < 0 ||
    Number.isNaN(lastViewedAt) ||
    lastViewedAt < 0
  ) {
    return null
  }

  return {
    id: item.id,
    title: item.title,
    image: item.image,
    category: item.category,
    kind: item.kind,
    views: views || 0,
    lastViewedAt: lastViewedAt || Date.now(),
  }
}

const ensureStoreFile = async (): Promise<void> => {
  await fs.mkdir(DATA_DIR, { recursive: true })

  try {
    await fs.access(DATA_FILE)
  } catch {
    const initial: InsightsStore = { items: [] }
    await fs.writeFile(DATA_FILE, JSON.stringify(initial, null, 2), 'utf8')
  }
}

const readStore = async (): Promise<TrackedRecipe[]> => {
  await ensureStoreFile()

  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw) as Partial<InsightsStore> | null
    const items = Array.isArray(parsed?.items) ? parsed.items : []
    return items.map(sanitizeTrackedRecipe).filter((item): item is TrackedRecipe => item !== null)
  } catch {
    return []
  }
}

const writeStore = async (items: TrackedRecipe[]): Promise<void> => {
  const trimmed = [...items]
    .sort((a, b) => b.lastViewedAt - a.lastViewedAt)
    .slice(0, MAX_TRACKED_ITEMS)

  const payload: InsightsStore = { items: trimmed }
  await fs.writeFile(DATA_FILE, JSON.stringify(payload, null, 2), 'utf8')
}

const withWriteLock = async <T>(task: () => Promise<T>): Promise<T> => {
  const run = writeChain.then(task, task)
  writeChain = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

export const addRecipeView = async (recipe: TrackedRecipePayload): Promise<void> =>
  withWriteLock(async () => {
    const items = await readStore()
    const now = Date.now()
    const index = items.findIndex((item) => item.id === recipe.id)

    if (index >= 0) {
      items[index] = {
        ...items[index],
        views: items[index].views + 1,
        lastViewedAt: now,
      }
    } else {
      items.push({
        ...recipe,
        views: 1,
        lastViewedAt: now,
      })
    }

    await writeStore(items)
  })

export const getTopRecipes = async (limit: number): Promise<TrackedRecipe[]> => {
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(Math.floor(limit), 1), 24) : 8
  const items = await readStore()
  return [...items]
    .sort((a, b) => b.views - a.views || b.lastViewedAt - a.lastViewedAt)
    .slice(0, safeLimit)
}
