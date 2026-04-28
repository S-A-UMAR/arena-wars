import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE || 'https://arena-wars.onrender.com/api'

const api = axios.create({
  baseURL: apiBase
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function login(username, password) {
  return api.post('/login/', { username, password })
}

export function register(payload) {
  return api.post('/register/', payload)
}

export function getProfile() {
  return api.get('/profile/')
}

export function updateProfile(payload) {
  return api.put('/profile/', payload)
}

export function updateProfileImage(file) {
  const fd = new FormData()
  fd.append('profile_image', file)
  return api.put('/profile/', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export function listGuilds() {
  return api.get('/guilds/')
}

export function createGuild(payload) {
  return api.post('/guilds/', payload)
}

export function joinGuild(guild) {
  return api.post('/guild-members/join/', { guild })
}

export function leaveGuild(guild) {
  return api.post('/guild-members/leave/', { guild })
}

export function listScrims() {
  return api.get('/scrims/')
}

export function createScrim(payload) {
  return api.post('/scrims/', payload)
}

export function listTournaments() {
  return api.get('/tournaments/')
}

export function createTournament(payload) {
  return api.post('/tournaments/', payload)
}

export function registerGuildToTournament(id, guild) {
  return api.post(`/tournaments/${id}/register_guild/`, { guild })
}

export function generateBracket(id) {
  return api.post(`/tournaments/${id}/generate_bracket/`)
}

export function listMatches() {
  return api.get('/matches/')
}

export function listMatchesByTournament(tournamentId) {
  return api.get('/matches/by_tournament/', { params: { tournament: tournamentId } })
}

export function recordMatchResult(id, payload) {
  return api.post(`/matches/${id}/record_result/`, payload)
}

export function uploadReplay(id, file) {
  const fd = new FormData()
  fd.append('replay_file', file)
  return api.post(`/matches/${id}/upload_replay/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export function listLeaderboard() {
  return api.get('/leaderboard/')
}

export function searchAll(q) {
  return api.get('/search/', { params: { q } })
}

export function listChatMessages(scrim) {
  return api.get('/chat-messages/', { params: { scrim } })
}

export function createChatMessage(payload) {
  return api.post('/chat-messages/', payload)
}

export function listNotifications() {
  return api.get('/notifications/')
}

export default api
