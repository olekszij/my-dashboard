import express from 'express';
import request from 'request';

const app = express();

// Прокси для любого радиопотока (url передаётся как query-параметр)
app.get('/proxy', (req, res) => {
  const streamUrl = req.query.url;
  if (!streamUrl) {
    return res.status(400).send('Missing url parameter');
  }
  res.set('Access-Control-Allow-Origin', '*');
  request(streamUrl).on('error', () => res.status(502).send('Stream error')).pipe(res);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Radio proxy server running on http://localhost:${PORT}`);
}); 