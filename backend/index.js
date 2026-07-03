const express = require('express')
const crypto = require('crypto')

const app = express()
const PORT = process.env.PORT || 3000
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// In-memory user store
const users = new Map()

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL)
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

// JWT helpers using built-in crypto
function createToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url')
  return `${header}.${body}.${signature}`
}

function verifyToken(token) {
  const [header, body, signature] = token.split('.')
  const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url')
  if (expected !== signature) throw new Error('Invalid token')
  return JSON.parse(Buffer.from(body, 'base64url').toString())
}

// Routes
app.get('/api/', (req, res) => {
  res.send('Hello, World!')
})

app.get('/api/auth/github', (req, res) => {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    scope: 'user:email',
  })
  res.redirect(`https://github.com/login/oauth/authorize?${params}`)
})

app.get('/api/auth/github/callback', async (req, res) => {
  const { code } = req.query
  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: GITHUB_CLIENT_ID, client_secret: GITHUB_CLIENT_SECRET, code }),
    })
    const { access_token } = await tokenRes.json()

    const githubRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    const githubUser = await githubRes.json()

    const user = {
      id: githubUser.id,
      github_user_name: githubUser.login,
      name: githubUser.name || githubUser.login,
      email: githubUser.email,
      avatar: githubUser.avatar_url,
    }
    users.set(githubUser.id, user)

    const token = createToken({ id: user.id })
    res.redirect(`${FRONTEND_URL}?token=${token}`)
  } catch {
    res.redirect(`${FRONTEND_URL}?error=auth_failed`)
  }
})

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const payload = verifyToken(authHeader.split(' ')[1])
    const user = users.get(payload.id)
    if (!user) return res.status(401).json({ error: 'User not found' })
    res.json({ user })
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
})

app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`)
})
