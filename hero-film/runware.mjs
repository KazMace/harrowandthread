#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';

const ENDPOINT = 'https://api.runware.ai/v1';
const ENV_PATH = new URL('./.env', import.meta.url).pathname;

function loadApiKey() {
  const raw = readFileSync(ENV_PATH, 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (key === 'RUNWARE_API_KEY') {
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      return val;
    }
  }
  throw new Error(`RUNWARE_API_KEY not found in ${ENV_PATH}`);
}

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        out[key] = true;
      } else {
        out[key] = next;
        i++;
      }
    } else {
      out._.push(a);
    }
  }
  return out;
}

async function callApi(apiKey, tasks) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(tasks),
  });
  const body = await res.json();
  if (body.errors?.length) {
    const msg = body.errors.map((e) => `${e.taskType ?? ''} ${e.code ?? ''}: ${e.message ?? JSON.stringify(e)}`).join('\n');
    throw new Error(`Runware API error:\n${msg}`);
  }
  if (!res.ok) {
    throw new Error(`Runware API HTTP ${res.status}: ${JSON.stringify(body)}`);
  }
  return body.data ?? [];
}

async function pollUntilDone(apiKey, taskUUID, taskType, maxWaitMs = 15 * 60 * 1000) {
  const start = Date.now();
  let delay = 3000;
  while (Date.now() - start < maxWaitMs) {
    const [result] = await callApi(apiKey, [{ taskType: 'getResponse', taskUUID }]);
    const status = result?.status ?? 'unknown';
    console.log(`[poll] ${taskType} ${taskUUID} status=${status}${result?.progress != null ? ` progress=${result.progress}` : ''}`);
    if (status === 'success') return result;
    if (status === 'error') {
      throw new Error(`Task failed: ${result?.message ?? JSON.stringify(result)}`);
    }
    await new Promise((r) => setTimeout(r, delay));
    delay = Math.min(delay * 1.3, 15000);
  }
  throw new Error(`Timed out waiting for ${taskType} ${taskUUID} after ${maxWaitMs}ms`);
}

async function downloadFile(url, outPath) {
  mkdirSync(dirname(outPath), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(outPath, buf);
}

function suffixedPath(outPath, n) {
  if (n === 1) return outPath;
  const ext = extname(outPath);
  const base = outPath.slice(0, -ext.length || undefined);
  return `${base}-${n}${ext}`;
}

async function uploadLocalMedia(apiKey, path, kind = 'image') {
  const buf = readFileSync(path);
  const ext = extname(path).slice(1).toLowerCase() || (kind === 'video' ? 'mp4' : 'png');
  const mime = ext === 'jpg' ? 'jpeg' : ext;
  const dataUri = `data:${kind}/${mime};base64,${buf.toString('base64')}`;
  const [result] = await callApi(apiKey, [
    { taskType: 'mediaStorage', taskUUID: randomUUID(), operation: 'upload', media: dataUri },
  ]);
  return result.mediaUUID ?? result.mediaURL;
}

const uploadLocalImage = (apiKey, path) => uploadLocalMedia(apiKey, path, 'image');

async function cmdModels(apiKey, args) {
  const search = args.search;
  if (!search) throw new Error('--search is required');
  const [result] = await callApi(apiKey, [
    { taskType: 'modelSearch', taskUUID: randomUUID(), search, limit: Number(args.limit ?? 25) },
  ]);
  const results = result?.results ?? [];
  if (!results.length) {
    console.log(`No models found for "${search}"`);
    return;
  }
  for (const m of results) {
    console.log(`${m.air}  ${m.name ?? ''}  [${m.category ?? m.architecture ?? ''}]`);
  }
  console.log(`\n${results.length} of ${result.totalResults ?? results.length} results`);
}

// Comma-separated list of local paths or URLs -> the array Runware wants in
// inputs.referenceImages. Local files are uploaded first and referenced by UUID.
async function resolveRefs(apiKey, spec) {
  const paths = String(spec).split(',').map((s) => s.trim()).filter(Boolean);
  const out = [];
  for (const p of paths) {
    out.push(/^https?:\/\//.test(p) ? p : await uploadLocalImage(apiKey, p));
  }
  return out;
}

async function cmdImage(apiKey, args) {
  if (!args.prompt) throw new Error('--prompt is required');
  if (!args.out) throw new Error('--out is required');
  const model = args.model ?? 'openai:gpt-image@2';
  const width = Number(args.w ?? 1080);
  const height = Number(args.h ?? 1920);
  const n = Number(args.n ?? 1);

  const task = {
    taskType: 'imageInference',
    taskUUID: randomUUID(),
    model,
    positivePrompt: args.prompt,
    width,
    height,
    numberResults: n,
    outputType: 'URL',
    outputFormat: 'JPG',
    includeCost: true,
  };
  // Nano Banana Pro (google:4@2) and friends take up to 14 reference images.
  if (args.ref) task.inputs = { referenceImages: await resolveRefs(apiKey, args.ref) };
  const results = await callApi(apiKey, [task]);
  let totalCost = 0;
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const outPath = suffixedPath(args.out, i + 1);
    await downloadFile(r.imageURL, outPath);
    totalCost += r.cost ?? 0;
    console.log(`saved ${outPath}  cost=${r.cost ?? 'n/a'}`);
  }
  console.log(`total cost: ${totalCost}`);
}

// Kling text-to-video only accepts width/height from this exact set (confirmed live
// against klingai:kling-video@3.0-turbo, code "unsupportedDimensions"). Image-to-video
// mode rejects width/height entirely and instead takes a "resolution" preset
// ("720p"/"1080p"), inheriting aspect ratio from the input image.
const KLING_TEXT_TO_VIDEO_DIMS = {
  '720p': { '16:9': [1280, 720], '9:16': [720, 1280], '1:1': [960, 960] },
  '1080p': { '16:9': [1920, 1080], '9:16': [1080, 1920], '1:1': [1440, 1440] },
};

// Seedance 2.5 takes explicit width/height from a fixed set, or a "resolution"
// preset -- but never both. We send width/height so the ratio is unambiguous.
// It has NO negativePrompt, and its native audio is settings.audio (default true).
const SEEDANCE_DIMS = {
  '480p': { '16:9': [854, 480], '9:16': [480, 854], '1:1': [640, 640] },
  '720p': { '16:9': [1280, 720], '9:16': [720, 1280], '1:1': [960, 960] },
  '1080p': { '16:9': [1920, 1080], '9:16': [1080, 1920], '1:1': [1440, 1440] },
};

async function cmdVideo(apiKey, args) {
  if (!args.prompt) throw new Error('--prompt is required');
  if (!args.out) throw new Error('--out is required');
  if (!args.model) throw new Error('--model is required (AIR id, e.g. klingai:kling-video@3.0-turbo)');

  const duration = Number(args.duration ?? 5);
  const ratio = args.ratio ?? '9:16';
  const resolution = args.resolution ?? '1080p';
  const isKling = args.model.startsWith('klingai:');
  const isSeedance = args.model.startsWith('bytedance:seedance@2');
  const hasImage = Boolean(args.image || args['image-last']);

  const task = {
    taskType: 'videoInference',
    taskUUID: randomUUID(),
    model: args.model,
    positivePrompt: args.prompt,
    duration,
    numberResults: 1,
    outputType: 'URL',
    outputFormat: 'MP4',
    includeCost: true,
    deliveryMethod: 'async',
  };
  if (args.seed) task.seed = Number(args.seed); // CONSISTENCY-RULES.md s7: seed on every request

  if (args.reference) {
    task.inputs = { ...(task.inputs ?? {}), referenceImages: await resolveRefs(apiKey, args.reference) };
  }

  // Seedance 2.5 video edit (10x-ad recipe): --video <src> keeps the source's
  // motion, cuts and length. Runware wants duration "auto", a resolution preset
  // (480p/720p) and no width/height.
  if (args.video) {
    const src = /^https?:\/\//.test(args.video) ? args.video : await uploadLocalMedia(apiKey, args.video, 'video');
    task.inputs = { ...(task.inputs ?? {}), video: src };
    task.duration = 'auto';
    task.resolution = resolution;
  }

  if (hasImage) {
    const frameImages = [];
    for (const [flag, frame] of [['image', 'first'], ['image-last', 'last']]) {
      if (!args[flag]) continue;
      const ref = /^https?:\/\//.test(args[flag]) ? args[flag] : await uploadLocalImage(apiKey, args[flag]);
      frameImages.push({ image: ref, frame });
    }
    task.inputs = { ...(task.inputs ?? {}), frameImages };
  }

  if (isKling) {
    // Kling: negativePrompt is only accepted in image-to-video mode.
    if (args.negative && hasImage) task.negativePrompt = args.negative;
    else if (args.negative) console.log('note: Kling rejects negativePrompt in text-to-video mode (no --image); dropping it.');
    if (hasImage) {
      task.resolution = resolution; // aspect ratio inherited from the input image
    } else {
      const dims = KLING_TEXT_TO_VIDEO_DIMS[resolution]?.[ratio];
      if (!dims) throw new Error(`Unsupported --ratio/--resolution combo for Kling: ${ratio} @ ${resolution}`);
      task.width = dims[0];
      task.height = dims[1];
    }
  } else if (isSeedance) {
    if (args.negative) console.log('note: Seedance has no negativePrompt; dropping it. State what you DO want in --prompt instead.');
    if (hasImage || args.video) {
      task.resolution = resolution; // image-to-video / video edit: Seedance rejects width/height, aspect comes from the input
    } else {
      const dims = SEEDANCE_DIMS[resolution]?.[ratio];
      if (!dims) throw new Error(`Unsupported --ratio/--resolution combo for Seedance: ${ratio} @ ${resolution}`);
      task.width = dims[0];
      task.height = dims[1];
    }
  } else {
    if (args.negative) task.negativePrompt = args.negative;
    const dims = { '9:16': [1080, 1920], '16:9': [1920, 1080], '1:1': [1080, 1080] }[ratio] ?? [1080, 1920];
    task.width = dims[0];
    task.height = dims[1];
  }

  if (args.audio) {
    if (args.model.startsWith('google:')) {
      task.providerSettings = { google: { generateAudio: args.audio === 'on' } };
    } else if (isSeedance) {
      task.settings = { ...(task.settings ?? {}), audio: args.audio === 'on' };
    } else {
      console.log(`note: --audio has no known effect for model "${args.model}" (only confirmed for google: Veo models)`);
    }
  }

  const [submitted] = await callApi(apiKey, [task]);
  const result = await pollUntilDone(apiKey, submitted.taskUUID ?? task.taskUUID, 'videoInference');
  await downloadFile(result.videoURL, args.out);
  console.log(`saved ${args.out}  cost=${result.cost ?? 'n/a'}`);
}

// TTS voices confirmed live against inworld:tts@2 (error enum "invalidAudioVoiceId").
// Calm/confident British-leaning picks: Oliver (male), Claire (female), Rupert (male, deeper).
const TTS_DEFAULT_MODEL = 'inworld:tts@2';
const TTS_VOICE_HINTS = 'Oliver (male, calm/confident British), Claire (female, British), Rupert (male, deeper British)';

async function cmdTts(apiKey, args) {
  if (!args.text) throw new Error('--text is required');
  if (!args.out) throw new Error('--out is required');
  const model = args.model ?? TTS_DEFAULT_MODEL;
  const voice = args.voice ?? 'Oliver';

  const task = {
    taskType: 'audioInference',
    taskUUID: randomUUID(),
    model,
    speech: { text: args.text, voice, language: args.language ?? 'en' },
    outputType: 'URL',
    outputFormat: 'MP3',
    includeCost: true,
    deliveryMethod: 'async',
  };
  const [submitted] = await callApi(apiKey, [task]);
  const result = await pollUntilDone(apiKey, submitted.taskUUID ?? task.taskUUID, 'audioInference');
  await downloadFile(result.audioURL, args.out);
  console.log(`saved ${args.out}  cost=${result.cost ?? 'n/a'}`);
}

// ACE-Step (music) duration confirmed live: min 30s, max 300s, step 0.1
// (code "invalidDurationNumber" against runware:ace-step@v1.5-turbo). 20s is below
// the floor, so it's clamped up to 30s with a note.
const MUSIC_DEFAULT_MODEL = 'runware:ace-step@v1.5-turbo';
const MUSIC_MIN_DURATION = 30;
const MUSIC_MAX_DURATION = 300;

async function cmdMusic(apiKey, args) {
  if (!args.prompt) throw new Error('--prompt is required');
  if (!args.out) throw new Error('--out is required');
  const model = args.model ?? MUSIC_DEFAULT_MODEL;
  let duration = Number(args.duration ?? MUSIC_MIN_DURATION);
  if (duration < MUSIC_MIN_DURATION) {
    console.log(`note: requested duration ${duration}s is below the model minimum, clamping to ${MUSIC_MIN_DURATION}s`);
    duration = MUSIC_MIN_DURATION;
  }
  if (duration > MUSIC_MAX_DURATION) {
    console.log(`note: requested duration ${duration}s exceeds the model maximum, clamping to ${MUSIC_MAX_DURATION}s`);
    duration = MUSIC_MAX_DURATION;
  }

  const task = {
    taskType: 'audioInference',
    taskUUID: randomUUID(),
    model,
    positivePrompt: args.prompt,
    duration,
    steps: 20,
    outputType: 'URL',
    outputFormat: 'MP3',
    includeCost: true,
    deliveryMethod: 'async',
  };
  const [submitted] = await callApi(apiKey, [task]);
  const result = await pollUntilDone(apiKey, submitted.taskUUID ?? task.taskUUID, 'audioInference');
  await downloadFile(result.audioURL, args.out);
  console.log(`saved ${args.out}  cost=${result.cost ?? 'n/a'}`);
}

const SFX_DEFAULT_MODEL = 'mirelo:1@1';

// Mirelo SFX is a video-to-audio model: it watches the clip and puts the hits on
// the frames where they happen. Use this for sound effects, never cmdMusic --
// ACE-Step is a music model and can only produce musical tone.
async function cmdSfx(apiKey, args) {
  if (!args.video) throw new Error('--video is required');
  if (!args.out) throw new Error('--out is required');

  const videoUuid = await uploadLocalMedia(apiKey, args.video, 'video');
  const task = {
    taskType: 'audioInference',
    taskUUID: randomUUID(),
    model: args.model ?? SFX_DEFAULT_MODEL,
    inputs: { video: videoUuid },
    // no duration: the clip's own length sets it, and sending both is a conflict
    outputType: 'URL',
    outputFormat: 'mp4',
    includeCost: true,
    deliveryMethod: 'async',
    settings: { startOffset: Number(args.offset ?? 0) },
  };
  if (args.prompt) task.positivePrompt = args.prompt;
  if (args.seed) task.seed = Number(args.seed);

  const [submitted] = await callApi(apiKey, [task]);
  const result = await pollUntilDone(apiKey, submitted.taskUUID ?? task.taskUUID, 'audioInference');
  // Mirelo hands back the source video with the new effects track muxed in, so
  // --out is an .mp4. Strip the audio off with ffmpeg afterwards if you need it.
  await downloadFile(result.videoURL ?? result.audioURL, args.out);
  console.log(`saved ${args.out}  cost=${result.cost ?? 'n/a'}`);
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);
  const apiKey = loadApiKey();

  if (cmd === 'models') return cmdModels(apiKey, args);
  if (cmd === 'image') return cmdImage(apiKey, args);
  if (cmd === 'video') return cmdVideo(apiKey, args);
  if (cmd === 'tts') return cmdTts(apiKey, args);
  if (cmd === 'music') return cmdMusic(apiKey, args);
  if (cmd === 'sfx') return cmdSfx(apiKey, args);

  console.log('Usage:');
  console.log('  node runware.mjs models --search "<term>"');
  console.log('  node runware.mjs image --prompt "<p>" --out <file.jpg> [--model openai:gpt-image@2] [--w 1080] [--h 1920] [--n 1] [--ref a.png,b.png]');
  console.log('    --ref passes reference images (Nano Banana Pro google:4@2 takes up to 14).');
  console.log('  node runware.mjs video --prompt "<p>" --out <file.mp4> --model <air-id> [--image <path|url>] [--reference a.png,b.png] [--duration 5] [--ratio 9:16] [--resolution 1080p] [--negative "<n>"] [--audio on|off] [--video <src.mp4> (Seedance 2.5 edit; keeps the source length)]');
  console.log('    Seedance (bytedance:seedance@2.5): --duration 4-30, --reference for @Image1..N identity locks,');
  console.log('    --audio on|off for its native soundtrack. It has no negative prompt.');
  console.log('    Kling (klingai:...): text-to-video uses --ratio+--resolution (720p/1080p) to pick a fixed width/height;');
  console.log('    image-to-video (--image set) drops width/height and sends --resolution as a preset, aspect ratio comes from the input image.');
  console.log(`  node runware.mjs tts --text "<t>" --out <file.mp3> [--model ${TTS_DEFAULT_MODEL}] [--voice Oliver]`);
  console.log(`    voices: ${TTS_VOICE_HINTS}`);
  console.log(`  node runware.mjs music --prompt "<p>" --duration <s> --out <file.mp3> [--model ${MUSIC_DEFAULT_MODEL}]`);
  console.log(`    duration is clamped to ${MUSIC_MIN_DURATION}-${MUSIC_MAX_DURATION}s (ACE-Step's supported range)`);
  console.log(`  node runware.mjs sfx --video <file.mp4> --duration <s> --out <file.mp3> [--prompt "<p>"] [--offset 0] [--model ${SFX_DEFAULT_MODEL}]`);
  console.log('    video-to-audio: hits land on the frames. Use this for sound effects, not music.');
  process.exit(cmd ? 1 : 0);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
