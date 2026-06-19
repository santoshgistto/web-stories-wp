/*
 * Render server. Accepts a story's pages from the editor and returns an MP4.
 *
 *   POST /render   body: { pages: Page[], pageWidth?: number }  -> video/mp4
 *   GET  /health   -> "ok"
 *
 * The Remotion project is bundled once (lazily, on the first request) and the
 * bundle is reused for every render. Pages are passed through Remotion input
 * props, so the composition's calculateMetadata sizes the timeline per story.
 */
import http from 'node:http';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { bundle } from '@remotion/bundler';
import { selectComposition, renderMedia } from '@remotion/renderer';

const require = createRequire(import.meta.url);
const webpackOverride = require('./webpackOverride.cjs');

const PORT = Number(process.env.PORT) || 4000;
const COMPOSITION_ID = 'StoryVideo';

let bundlePromise;
function getBundle() {
  if (!bundlePromise) {
    console.log('Bundling Remotion project (first request, ~once)…');
    bundlePromise = bundle({
      entryPoint: path.resolve(process.cwd(), 'src/index.ts'),
      webpackOverride,
    });
  }
  return bundlePromise;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    ...headers,
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return send(res, 204, '');
  }
  if (req.method === 'GET' && req.url === '/health') {
    return send(res, 200, 'ok');
  }
  if (req.method !== 'POST' || req.url !== '/render') {
    return send(res, 404, 'Not found');
  }

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    const pages = body.pages;
    if (!Array.isArray(pages) || pages.length === 0) {
      return send(
        res,
        400,
        JSON.stringify({ error: 'body.pages must be a non-empty array' }),
        { 'Content-Type': 'application/json' }
      );
    }

    const inputProps = { pages, pageWidth: body.pageWidth ?? 720 };
    const serveUrl = await getBundle();
    const composition = await selectComposition({
      serveUrl,
      id: COMPOSITION_ID,
      inputProps,
    });

    const outPath = path.join(os.tmpdir(), `story-${Date.now()}.mp4`);
    console.log(
      `Rendering ${pages.length} page(s), ${composition.durationInFrames} frames → ${outPath}`
    );
    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      outputLocation: outPath,
      inputProps,
    });

    const video = await fs.readFile(outPath);
    await fs.unlink(outPath).catch(() => {});
    send(res, 200, video, {
      'Content-Type': 'video/mp4',
      'Content-Disposition': 'attachment; filename="story.mp4"',
      'Content-Length': String(video.length),
    });
    console.log('Render complete.');
  } catch (err) {
    console.error(err);
    send(res, 500, JSON.stringify({ error: String(err?.message ?? err) }), {
      'Content-Type': 'application/json',
    });
  }
});

server.listen(PORT, () => {
  console.log(`Render server listening on http://localhost:${PORT}`);
  console.log('POST /render { pages, pageWidth? } → video/mp4');
});
