import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { generateRobotsTxt, generateSitemapXml } from './src/utils/sitemapGenerator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  // Dynamic Sitemap XML Endpoint (serves real-time indexed active jobs, results, admissions)
  app.get(['/sitemap.xml', '/sitemap', '/api/sitemap', '/api/sitemap.xml'], (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.headers.host || 'ais-pre-whrtzakdpynxkkxdqr2cbs-313809848943.asia-east1.run.app';
    const baseUrl = `${protocol}://${host}`;

    const xml = generateSitemapXml(baseUrl);
    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=3600, must-revalidate');
    res.send(xml);
  });

  // Dynamic Robots.txt Endpoint
  app.get('/robots.txt', (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.headers.host || 'ais-pre-whrtzakdpynxkkxdqr2cbs-313809848943.asia-east1.run.app';
    const baseUrl = `${protocol}://${host}`;

    const txt = generateRobotsTxt(baseUrl);
    res.header('Content-Type', 'text/plain; charset=utf-8');
    res.send(txt);
  });

  const isProduction = process.env.NODE_ENV === 'production' || fs.existsSync(path.join(__dirname, 'dist'));

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sarkari Result server running on port ${PORT}`);
  });
}

startServer();
