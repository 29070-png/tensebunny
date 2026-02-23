
import { GoogleGenAI, Modality } from "@google/genai";

/* Initialize the Gemini client using the environment's API key. */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGrammarAdvice = async (userMessage: string, history: {role: string, parts: {text: string}[]}[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: "You are GrammarBot, a friendly and supportive AI English tutor for the website TenseBunny. Your goal is to help students master the 12 English tenses. Keep your tone encouraging and your explanations simple. Use emojis. If a user asks about a specific tense, provide the structure and a clear example.",
      },
    });

    return response.text || "I'm sorry, I'm having a little trouble thinking right now. Let's try again!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! My circuits got crossed. Can you please repeat that?";
  }
};

export const getTechnicalSupport = async (userMessage: string, history: {role: string, parts: {text: string}[]}[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: `You are the TenseBunny Technical Assistant. You help users with bugs and app issues. 
        Context about the app:
        - Games available: Tense Sniper, MatchMaker, Sentence Builder, Tense Runner.
        - Points system: 100 XP per level. Scores are saved in LocalStorage.
        - Bug troubleshooting: 
          1. If score isn't showing, suggest refreshing the page. 
          2. If a game hangs, ensure they answered all questions. 
          3. If ranking is empty, they need to finish the Post-Test (Final Exam).
        - Speak in a friendly, helpful tech-support tone. Use emojis. If you can't solve it, ask them to describe the bug in detail.`,
      },
    });

    return response.text || "I'm here to help with any technical issues! Please try describing the problem again.";
  } catch (error) {
    console.error("Gemini Support API Error:", error);
    return "I am currently experiencing connection issues with the support server. Please refresh your browser.";
  }
};

/**
 * ฟังก์ชันช่วยลบพื้นหลังสีขาวออกจากรูปภาพ base64
 */
const removeBackgroundFromBase64 = async (base64: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // ปรับ threshold ให้กว้างขึ้นเพื่อธีมสีชมพูขาว
        if (r > 235 && g > 235 && b > 235) {
          data[i + 3] = 0;
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(base64);
    img.src = base64;
  });
};

/**
 * ฟังก์ชันสำหรับสร้างรูปภาพ Mascot ตามคำสั่งที่ผู้ใช้ระบุ 
 * ปรับปรุงให้เป็น "Cute Pink Theme" (Rose & Sakura Pink)
 */
export const generateMascotLogo = async (): Promise<string | null> => {
  try {
    const prompt = `ULTIMATE KAWAII PINK THEME CHARACTER DESIGN:
A super-chubby, round snowy-white kitty-cat wearing an oversized, extremely soft Rose-Pink bunny onesie. 
The bunny ears are long, floppy, and decorated with delicate cherry blossom (sakura) patterns.

FACIAL FEATURES (EXTRA CUTE):
- Enormous, glossy, dark galaxy eyes with multi-color pink reflections and tiny heart-shaped twinkles.
- Soft, deep-rose airbrushed blushing cheeks with tiny white highlights.
- A tiny 'w' shaped smiling cat mouth, very sweet and friendly.

ACCESSORIES & COLORS:
- Many colorful pastel ribbons in shades of Sakura Pink, Deep Rose, and soft Cream.
- Tiny golden bells and sparkly strawberry charms tied to the bunny ears.
- Floating magical elements: tiny pink hearts, sparkling sakura petals, and soft bubbles.
- Color Palette: All shades of pink (Strawberry, Sakura, Rose, Peachy-Pink).

ART STYLE:
- High-end digital sticker aesthetic, inspired by Sanrio.
- Thick, smooth, soft cocoa-pink outlines.
- 3D-like soft shading and highlights to make it look 'squishy' and 'fluffy'.
- Clean white background for perfect extraction.

Rendered in high resolution, maximum charm, and heart-melting pink adorableness.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const originalBase64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        return await removeBackgroundFromBase64(originalBase64);
      }
    }
    return null;
  } catch (error) {
    console.error("Mascot generation failed:", error);
    return null;
  }
};

export const speakText = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this sentence clearly and naturally in a sweet and friendly female voice: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, 
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioData = decode(base64Audio);
      const audioBuffer = await decodeAudioData(audioData, audioContext, 24000, 1);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
  } catch (error) {
    console.error("TTS Error:", error);
  }
};

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
