const server = require('./server');
const request = require('supertest');
const db = require('../data/dbConfig');

test('sanity', () => {
  expect(true).toBe(true)
});

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
});



beforeEach(async () => {
  await request(server).post('/api/auth/register')
    .send({
      username: "Bubble",
      password: "kevin"
    })
})

afterAll(async () => {
  await db.destroy()
})

describe('[POST] /register', () => {
  test('causes a user to be added to the database', async () => {
    const users = await db('users')
    expect(users).toHaveLength(1)
  })
  test('responds with a newly created user', async () => {
    const users = await db('users')
    expect(users[0].username).toEqual("Bubble")
  })
})

describe('[POST] /login', () => {
  test('responds with error when no username', async () => {
    const res = await request(server).post('/login').send({
      username: '',
      password: 'kevin'
    })
    expect(res.status).toBe(404)
  })
  test('responds with error when no password', async () => {
    const res = await request(server).post('/api/auth/login').send({
      username: 'Bubble',
      password: '',
    })
    expect(res.body).toMatchObject({ message: 'username and password required' })
  })
})