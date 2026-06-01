const express = require('express');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const GEMINI_FALLBACK_MODELS = (process.env.GEMINI_FALLBACK_MODELS || 'gemini-1.5-flash-8b,gemini-2.0-flash')
  .split(',')
  .map((name) => name.trim())
  .filter(Boolean);
const GEMINI_MAX_RETRIES = Number.parseInt(process.env.GEMINI_MAX_RETRIES || '3', 10);
const GEMINI_RETRY_BASE_MS = Number.parseInt(process.env.GEMINI_RETRY_BASE_MS || '500', 10);

const HF_IMAGE_MODEL = process.env.HF_IMAGE_MODEL || 'nateraw/food101';
const HF_MAX_RETRIES = Number.parseInt(process.env.HF_MAX_RETRIES || '3', 10);
const HF_RETRY_BASE_MS = Number.parseInt(process.env.HF_RETRY_BASE_MS || '500', 10);
const HF_ENDPOINT_URL = process.env.HF_ENDPOINT_URL || '';

const GROQ_MODEL = process.env.GROQ_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct';
const GROQ_MAX_RETRIES = Number.parseInt(process.env.GROQ_MAX_RETRIES || '2', 10);
const GROQ_RETRY_BASE_MS = Number.parseInt(process.env.GROQ_RETRY_BASE_MS || '500', 10);

function shouldRetryGemini(error) {
  const status = error?.status || error?.response?.status || error?.statusCode;
  if (status === 429 || status === 500 || status === 503) {
    return true;
  }
  const message = String(error?.message || '').toLowerCase();
  return message.includes('quota') || message.includes('rate limit') || message.includes('too many requests');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetryHf(error) {
  const status = error?.response?.status || error?.status || error?.statusCode;
  if (status === 429 || status === 500 || status === 503) {
    return true;
  }
  const code = String(error?.code || '').toUpperCase();
  if (['ENOTFOUND', 'EAI_AGAIN', 'ECONNRESET', 'ETIMEDOUT', 'ECONNABORTED'].includes(code)) {
    return true;
  }
  const message = String(error?.response?.data?.error || error?.message || '').toLowerCase();
  return message.includes('rate limit') || message.includes('too many requests') || message.includes('loading');
}

function shouldRetryGroq(error) {
  const status = error?.response?.status || error?.status || error?.statusCode;
  if (status === 429 || status === 500 || status === 503) {
    return true;
  }
  const message = String(error?.response?.data?.error?.message || error?.message || '').toLowerCase();
  return message.includes('rate limit') || message.includes('too many requests');
}

function getHfEndpointUrl() {
  if (HF_ENDPOINT_URL) {
    return HF_ENDPOINT_URL;
  }

  return `https://api-inference.huggingface.co/models/${HF_IMAGE_MODEL}`;
}

async function callHfImageModelWithRetries(imageBuffer) {
  let lastError;
  for (let attempt = 0; attempt < HF_MAX_RETRIES; attempt += 1) {
    try {
      if (!process.env.HF_API_TOKEN) {
        throw new Error('Missing HF_API_TOKEN');
      }

      const response = await axios.post(getHfEndpointUrl(), imageBuffer, {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
          'Content-Type': 'application/octet-stream'
        },
        timeout: 30000
      });

      return response.data;
    } catch (error) {
      lastError = error;
      if (!shouldRetryHf(error) || attempt === HF_MAX_RETRIES - 1) {
        throw error;
      }

      const backoff = HF_RETRY_BASE_MS * (2 ** attempt);
      const jitter = Math.floor(Math.random() * 100);
      await sleep(backoff + jitter);
    }
  }

  throw lastError;
}

async function callHfImageModel(imageBuffer) {
  return callHfImageModelWithRetries(imageBuffer);
}

async function generateGroqEnhancement(dishName) {
  if (!process.env.GROQ_API_KEY) {
    return null;
  }

  let lastError;
  for (let attempt = 0; attempt < GROQ_MAX_RETRIES; attempt += 1) {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: GROQ_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are a culinary assistant. Return only valid JSON with keys dishName, ingredients, description.'
            },
            {
              role: 'user',
              content: `Dish name: ${dishName}. Provide 5-10 typical ingredients and a one-sentence description.`
            }
          ],
          temperature: 0.4
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const content = response?.data?.choices?.[0]?.message?.content || '';
      const cleaned = content.replace(/```json|```/g, '').trim();
      const match = cleaned.match(/\{[\s\S]*\}/);
      const jsonText = match ? match[0] : cleaned;
      const parsed = JSON.parse(jsonText);

      return {
        dishName: parsed.dishName || dishName,
        ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : [],
        description: parsed.description || ''
      };
    } catch (error) {
      lastError = error;
      if (!shouldRetryGroq(error) || attempt === GROQ_MAX_RETRIES - 1) {
        return null;
      }

      const backoff = GROQ_RETRY_BASE_MS * (2 ** attempt);
      const jitter = Math.floor(Math.random() * 100);
      await sleep(backoff + jitter);
    }
  }

  return null;
}

async function generateWithRetry(model, contents) {
  let lastError;
  for (let attempt = 0; attempt < GEMINI_MAX_RETRIES; attempt += 1) {
    try {
      return await model.generateContent(contents);
    } catch (error) {
      lastError = error;
      if (!shouldRetryGemini(error) || attempt === GEMINI_MAX_RETRIES - 1) {
        throw error;
      }

      const backoff = GEMINI_RETRY_BASE_MS * (2 ** attempt);
      const jitter = Math.floor(Math.random() * 100);
      await sleep(backoff + jitter);
    }
  }

  throw lastError;
}

async function generateWithFallbackModels(genAI, contents) {
  const triedModels = new Set();
  const modelsToTry = [GEMINI_MODEL, ...GEMINI_FALLBACK_MODELS].filter((name) => {
    if (!name || triedModels.has(name)) {
      return false;
    }
    triedModels.add(name);
    return true;
  });

  let lastError;
  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      return await generateWithRetry(model, contents);
    } catch (error) {
      lastError = error;
      console.warn(`Gemini model failed: ${modelName}`, error?.message || error);
    }
  }

  throw lastError;
}

function parseBase64Image(dataUrl) {
  const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid image data URL');
  }
  return { mimeType: match[1], data: match[2] };
}

function parseJsonFromText(text) {
  const cleaned = String(text || '').replace(/```json|```/g, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  const jsonText = match ? match[0] : cleaned;
  return JSON.parse(jsonText);
}

async function callGroqVisionOnce(imageDataUrl, instruction) {
  if (!process.env.GROQ_API_KEY) {
    return null;
  }

  let lastError;
  for (let attempt = 0; attempt < GROQ_MAX_RETRIES; attempt += 1) {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: GROQ_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are a food recognition AI. Return only valid JSON with keys dishName, ingredients, description.'
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: instruction },
                { type: 'image_url', image_url: { url: imageDataUrl } }
              ]
            }
          ],
          temperature: 0.3,
          max_completion_tokens: 512
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const content = response?.data?.choices?.[0]?.message?.content || '';
      return parseJsonFromText(content);
    } catch (error) {
      lastError = error;
      if (!shouldRetryGroq(error) || attempt === GROQ_MAX_RETRIES - 1) {
        return null;
      }

      const backoff = GROQ_RETRY_BASE_MS * (2 ** attempt);
      const jitter = Math.floor(Math.random() * 100);
      await sleep(backoff + jitter);
    }
  }

  return null;
}

async function generateGroqVision(imageDataUrl) {
  const primaryInstruction =
    'Identify the dish in the image. Return JSON with dishName, ingredients (5-10 items), and description (1 sentence).';
  const strictInstruction =
    'Return ONLY valid JSON. dishName is a string. ingredients is a JSON array of 5-10 strings. description is a 1-sentence string.';

  const first = await callGroqVisionOnce(imageDataUrl, primaryInstruction);
  if (first && Array.isArray(first.ingredients) && first.ingredients.length >= 3) {
    return {
      dishName: first.dishName || 'Unknown Dish',
      ingredients: first.ingredients,
      description: first.description || ''
    };
  }

  const second = await callGroqVisionOnce(imageDataUrl, strictInstruction);
  if (second && Array.isArray(second.ingredients) && second.ingredients.length >= 3) {
    return {
      dishName: second.dishName || 'Unknown Dish',
      ingredients: second.ingredients,
      description: second.description || ''
    };
  }

  if (first) {
    return {
      dishName: first.dishName || 'Unknown Dish',
      ingredients: Array.isArray(first.ingredients) ? first.ingredients : [],
      description: first.description || ''
    };
  }

  return null;
}

router.post('/scan-image', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const { mimeType, data } = parseBase64Image(image);

    const groqVision = await generateGroqVision(image);
    if (groqVision) {
      return res.json(groqVision);
    }

    if (process.env.HF_API_TOKEN) {
      const imageBuffer = Buffer.from(data, 'base64');
      const hfResult = await callHfImageModel(imageBuffer);

      if (Array.isArray(hfResult) && hfResult.length > 0) {
        const top = hfResult[0];
        const dishName = top.label || 'Unknown Dish';
        const groqData = await generateGroqEnhancement(dishName);
        return res.json({
          dishName: groqData?.dishName || dishName,
          ingredients: groqData?.ingredients || [],
          description: groqData?.description || (dishName ? `Likely: ${dishName}` : '')
        });
      }

      if (hfResult?.generated_text || hfResult?.caption) {
        const caption = hfResult.generated_text || hfResult.caption;
        const groqData = await generateGroqEnhancement(caption);
        return res.json({
          dishName: groqData?.dishName || caption,
          ingredients: groqData?.ingredients || [],
          description: groqData?.description || caption
        });
      }
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const prompt = `You are a food recognition AI. Analyze this food photo and return a JSON object with exactly these fields:
{
  "dishName": "The name of the main dish shown (e.g. 'Grilled Salmon', 'Chicken Adobo')",
  "ingredients": ["list", "of", "key", "visible", "ingredients"],
  "description": "A one-sentence description of the dish"
}
Return ONLY valid JSON, no markdown, no other text.`;

    const result = await generateWithFallbackModels(genAI, [
      { text: prompt },
      { inlineData: { mimeType, data } }
    ]);

    const text = result.response.text();

    let parsed;
    try {
      parsed = parseJsonFromText(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('Failed to parse Gemini response');
      }
    }

    res.json({
      dishName: parsed.dishName || 'Unknown Dish',
      ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : [],
      description: parsed.description || ''
    });
  } catch (error) {
    const code = String(error?.code || error?.cause?.code || '').toUpperCase();
    if (code === 'ENOTFOUND') {
      return res.status(502).json({
        error: 'Failed to analyze image',
        message: 'DNS lookup failed for Hugging Face. Check network/DNS or set HF_ENDPOINT_URL to a reachable endpoint.'
      });
    }

    console.error('AI scan error:', error);
    return res.status(500).json({
      error: 'Failed to analyze image',
      message: error.message
    });
  }
});

module.exports = router;
