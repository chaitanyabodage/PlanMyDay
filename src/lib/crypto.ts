/**
 * High-security client-side End-to-End Encryption (E2EE) engine.
 * Uses Web Crypto APIs (AES-GCM 256-bit, PBKDF2 key derivation with SHA-256).
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Helper to convert Uint8Array to Hex string
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Helper to convert Hex string to Uint8Array
export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

// Generate a cryptographically secure random salt (32 bytes)
export function generateSalt(length = 32): Uint8Array {
  const salt = new Uint8Array(length);
  window.crypto.getRandomValues(salt);
  return salt;
}

// Generate a cryptographically secure random IV for AES-GCM (12 bytes)
export function generateIv(): Uint8Array {
  const iv = new Uint8Array(12);
  window.crypto.getRandomValues(iv);
  return iv;
}

// Hash a string with SHA-256 (for secondary verification check or passwords)
export async function sha256(text: string): Promise<string> {
  const data = encoder.encode(text);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return bytesToHex(new Uint8Array(hashBuffer));
}

/**
 * Derives a 256-bit AES-GCM key from a password and salt using PBKDF2 with SHA-256.
 * Performs 100,000 iterations to resist brute-force attacks.
 */
export async function deriveKey(
  password: string,
  saltHex: string,
  onProgress?: (progress: number) => void
): Promise<{ key: CryptoKey; derivationTimeMs: number }> {
  const startTime = performance.now();
  const saltBytes = hexToBytes(saltHex);
  const passwordBytes = encoder.encode(password);

  // Import raw password as a key-generating key
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    passwordBytes,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  // Simulate progress steps if callback provided (helps visual fidelity in UI)
  if (onProgress) {
    onProgress(10);
    await new Promise((r) => setTimeout(r, 80));
    onProgress(45);
    await new Promise((r) => setTimeout(r, 80));
    onProgress(80);
    await new Promise((r) => setTimeout(r, 60));
  }

  // Derive AES-GCM 256-bit key
  const derivedKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false, // key is non-exportable for security
    ['encrypt', 'decrypt']
  );

  if (onProgress) onProgress(100);

  const derivationTimeMs = Math.round(performance.now() - startTime);
  return { key: derivedKey, derivationTimeMs };
}

/**
 * Encrypts a plain-text payload using AES-GCM with a derived CryptoKey.
 */
export async function encryptData(
  plainText: string,
  key: CryptoKey
): Promise<{ ciphertext: string; iv: string; encryptionTimeMs: number }> {
  const startTime = performance.now();
  const ivBytes = generateIv();
  const dataBytes = encoder.encode(plainText);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: ivBytes,
    },
    key,
    dataBytes
  );

  const ciphertext = bytesToHex(new Uint8Array(encryptedBuffer));
  const iv = bytesToHex(ivBytes);
  const encryptionTimeMs = Math.round(performance.now() - startTime);

  return { ciphertext, iv, encryptionTimeMs };
}

/**
 * Decrypts a hex ciphertext payload using AES-GCM with a derived CryptoKey.
 */
export async function decryptData(
  ciphertextHex: string,
  key: CryptoKey,
  ivHex: string
): Promise<{ decryptedText: string; decryptionTimeMs: number }> {
  const startTime = performance.now();
  const ivBytes = hexToBytes(ivHex);
  const ciphertextBytes = hexToBytes(ciphertextHex);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ivBytes,
    },
    key,
    ciphertextBytes
  );

  const decryptedText = decoder.decode(decryptedBuffer);
  const decryptionTimeMs = Math.round(performance.now() - startTime);

  return { decryptedText, decryptionTimeMs };
}

/**
 * Play a futuristic audio chime for reminders / security using Web Audio API.
 * This does not rely on static assets and runs fully client-side.
 */
export function playCyberChime(type: 'remind' | 'success' | 'lock' | 'unlock') {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    if (type === 'remind') {
      // Futuristic double-shimmer bell
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc1.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.15); // E6

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);

      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(audioCtx.currentTime + 1.2);
      osc2.stop(audioCtx.currentTime + 1.2);
    } else if (type === 'success') {
      // Affirmative short dual sweep
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } else if (type === 'lock') {
      // Descending mechanical tone
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(330, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.3);

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'unlock') {
      // Ascending mechanical tone
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(330, audioCtx.currentTime + 0.25);

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    }
  } catch (err) {
    console.warn('Web Audio API not supported or blocked:', err);
  }
}
