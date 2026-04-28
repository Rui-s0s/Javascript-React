import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'

const app = new Hono().basePath('/api')

// In-memory data (Note: this resets when the worker isolate restarts)
let playlists = [
  {
    id: 'pl1',
    name: 'Frontend Development',
    videos: [
      {
        id: 'vid1',
        title: 'Building a YouTube Clone with React',
        link: 'https://youtube.com/watch?v=clone-tutorial',
        likes: 1200,
        dislikes: 42,
        messages: [{ id: 'msg1', user: 'User1', text: 'Hello everyone!' }]
      }
    ]
  }
]

// GET all data
app.get('/data', (c) => resJSON(c, playlists))

// Playlists
app.post('/playlists', async (c) => {
  const { name } = await c.req.json()
  const newPl = { id: 'pl' + Date.now(), name, videos: [] }
  playlists.push(newPl)
  return resJSON(c, newPl, 201)
})

app.put('/playlists/:id', async (c) => {
  const id = c.req.param('id')
  const { name } = await c.req.json()
  const pl = playlists.find(p => p.id === id)
  if (pl) {
    pl.name = name
    return resJSON(c, pl)
  }
  return c.notFound()
})

app.delete('/playlists/:id', (c) => {
  const id = c.req.param('id')
  playlists = playlists.filter(p => p.id !== id)
  return c.body(null, 204)
})

// Videos
app.post('/playlists/:plId/videos', async (c) => {
  const plId = c.req.param('plId')
  const { title, link } = await c.req.json()
  const pl = playlists.find(p => p.id === plId)
  if (pl) {
    const newVid = { id: 'vid' + Date.now(), title, link, likes: 0, dislikes: 0, messages: [] }
    pl.videos.push(newVid)
    return resJSON(c, newVid, 201)
  }
  return c.notFound()
})

app.put('/videos/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  let found = false
  playlists.forEach(pl => {
    const v = pl.videos.find(v => v.id === id)
    if (v) {
      Object.assign(v, body)
      found = true
    }
  })
  return found ? c.body(null, 200) : c.notFound()
})

app.delete('/videos/:id', (c) => {
  const id = c.req.param('id')
  playlists.forEach(pl => {
    pl.videos = pl.videos.filter(v => v.id !== id)
  })
  return c.body(null, 204)
})

// Messages
app.post('/videos/:vidId/messages', async (c) => {
  const vidId = c.req.param('vidId')
  const { text } = await c.req.json()
  let target
  playlists.forEach(pl => {
    const v = pl.videos.find(v => v.id === vidId)
    if (v) target = v
  })
  if (target) {
    const msg = { id: 'msg' + Date.now(), user: 'You', text }
    target.messages.push(msg)
    return resJSON(c, msg, 201)
  }
  return c.notFound()
})

function resJSON(c, data, status = 200) {
  return c.json(data, status)
}

export const onRequest = handle(app)
