const request = require('supertest');
const { app, alarms } = require('../src/app');

describe('Alarms API', () => {
  beforeEach(() => {
    alarms.clear();
  });

  it('creates an alarm', async () => {
    const res = await request(app)
      .post('/alarms')
      .send({ title: 'Wake up', timeISO: '2099-12-01T07:00:00.000Z' })
      .expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Wake up');
  });

  it('lists alarms', async () => {
    const created = await request(app)
      .post('/alarms')
      .send({ title: 'A1', timeISO: '2099-12-01T07:00:00.000Z' })
      .expect(201);
    const res = await request(app).get('/alarms').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe(created.body.id);
  });

  it('updates an alarm', async () => {
    const created = await request(app)
      .post('/alarms')
      .send({ title: 'A2', timeISO: '2099-12-01T07:00:00.000Z' })
      .expect(201);
    const res = await request(app)
      .put(`/alarms/${created.body.id}`)
      .send({ enabled: false })
      .expect(200);
    expect(res.body.enabled).toBe(false);
  });

  it('deletes an alarm', async () => {
    const created = await request(app)
      .post('/alarms')
      .send({ title: 'A3', timeISO: '2099-12-01T07:00:00.000Z' })
      .expect(201);
    await request(app).delete(`/alarms/${created.body.id}`).expect(204);
    const list = await request(app).get('/alarms').expect(200);
    expect(list.body.find(a => a.id === created.body.id)).toBeUndefined();
  });
});
