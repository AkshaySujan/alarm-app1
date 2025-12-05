const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
// --- API shim: rewrite /api/... to /... so routes defined at /alarms still work ---
app.use((req, res, next) => {
  if (req.originalUrl && req.originalUrl.startsWith('/api/')) {
    // rewrite the incoming URL (/api/alarms -> /alarms)
    req.url = req.originalUrl.replace(/^\/api/, '');
  }
  next();
});
// --- end shim ---

app.use(cors());
app.use(bodyParser.json());

const alarms = new Map();

// Create alarm
app.post('/alarms', (req, res) => {
  const { title, timeISO } = req.body;

  if (!title || !timeISO) {
    return res.status(400).json({ error: 'title and timeISO required' });
  }

  const id = uuidv4();
  const alarm = {
    id,
    title,
    timeISO,
    timezone: req.body.timezone || null,
    recurrence: req.body.recurrence || 'once',
    enabled: req.body.enabled !== undefined ? req.body.enabled : true,
    snoozeUntil: null
  };

  alarms.set(id, alarm);
  res.status(201).json(alarm);
});

// List alarms
app.get('/alarms', (req, res) => {
  res.json(Array.from(alarms.values()));
});

// Get single alarm
app.get('/alarms/:id', (req, res) => {
  const alarm = alarms.get(req.params.id);

  if (!alarm) {
    return res.status(404).json({ error: 'not found' });
  }

  res.json(alarm);
});

// Update alarm
app.put('/alarms/:id', (req, res) => {
  const id = req.params.id;

  if (!alarms.has(id)) {
    return res.status(404).json({ error: 'not found' });
  }

  const updated = { ...alarms.get(id), ...req.body };
  alarms.set(id, updated);

  res.json(updated);
});

// Delete alarm
app.delete('/alarms/:id', (req, res) => {
  const id = req.params.id;

  if (!alarms.has(id)) {
    return res.status(404).json({ error: 'not found' });
  }

  alarms.delete(id);
  res.status(204).send();
});

  
// --- Explicit /api/alarms endpoints (temporary shim) ---
app.get('/api/alarms', (req, res) => {
  res.json(Array.from(alarms.values()));
});

app.post('/api/alarms', (req, res) => {
  const { title, timeISO } = req.body;
  if (!title || !timeISO) return res.status(400).json({ error: 'title and timeISO required' });

  const id = uuidv4();
  const alarm = {
    id,
    title,
    timeISO,
    timezone: req.body.timezone || null,
    recurrence: req.body.recurrence || 'once',
    enabled: req.body.enabled !== undefined ? req.body.enabled : true,
    snoozeUntil: null
  };

  alarms.set(id, alarm);
  res.status(201).json(alarm);
});

app.get('/api/alarms/:id', (req, res) => {
  const alarm = alarms.get(req.params.id);
  if (!alarm) return res.status(404).json({ error: 'not found' });
  res.json(alarm);
});

app.put('/api/alarms/:id', (req, res) => {
  const id = req.params.id;
  if (!alarms.has(id)) return res.status(404).json({ error: 'not found' });

  const updated = { ...alarms.get(id), ...req.body };
  alarms.set(id, updated);
  res.json(updated);
});

app.delete('/api/alarms/:id', (req, res) => {
  const id = req.params.id;
  if (!alarms.has(id)) return res.status(404).json({ error: 'not found' });
  alarms.delete(id);
  res.status(204).send();
});
// --- end explicit /api endpoints ---
module.exports = { app, alarms };

