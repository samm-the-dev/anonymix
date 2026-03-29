import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Web Push with VAPID using Web Crypto API (Deno-compatible)
// Based on RFC 8291 (Message Encryption for Web Push) and RFC 8292 (VAPID)

const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT")!;

function base64UrlDecode(str: string): Uint8Array {
  const padding = "=".repeat((4 - (str.length % 4)) % 4);
  const base64 = (str + padding).replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function concatUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((acc, a) => acc + a.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const a of arrays) {
    result.set(a, offset);
    offset += a.length;
  }
  return result;
}

async function createVapidAuthHeader(
  audience: string,
  subject: string,
  publicKey: string,
  privateKeyBase64: string,
): Promise<{ authorization: string; cryptoKey: string }> {
  const header = base64UrlEncode(new TextEncoder().encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const exp = Math.floor(Date.now() / 1000) + 12 * 60 * 60;
  const payload = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify({ aud: audience, exp, sub: subject })),
  );

  const unsignedToken = `${header}.${payload}`;

  // Import private key
  const privateKeyBytes = base64UrlDecode(privateKeyBase64);
  const publicKeyBytes = base64UrlDecode(publicKey);

  // Build JWK for ECDSA P-256
  const jwk = {
    kty: "EC",
    crv: "P-256",
    x: base64UrlEncode(publicKeyBytes.slice(1, 33)),
    y: base64UrlEncode(publicKeyBytes.slice(33, 65)),
    d: base64UrlEncode(privateKeyBytes),
  };

  const key = await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);

  const signature = new Uint8Array(
    await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, new TextEncoder().encode(unsignedToken)),
  );

  // Convert DER signature to raw r||s format (each 32 bytes)
  const r = signature.slice(0, 32);
  const s = signature.slice(32, 64);
  const rawSig = concatUint8Arrays(r, s);

  const token = `${unsignedToken}.${base64UrlEncode(rawSig)}`;

  return {
    authorization: `vapid t=${token}, k=${publicKey}`,
    cryptoKey: `p256ecdsa=${publicKey}`,
  };
}

async function encryptPayload(
  payload: string,
  p256dhKey: string,
  authSecret: string,
): Promise<{ encrypted: Uint8Array; salt: Uint8Array; localPublicKey: Uint8Array }> {
  const clientPublicKeyBytes = base64UrlDecode(p256dhKey);
  const authSecretBytes = base64UrlDecode(authSecret);

  // Generate ephemeral ECDH key pair
  const localKeyPair = (await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"],
  )) as CryptoKeyPair;

  const localPublicKeyRaw = new Uint8Array(await crypto.subtle.exportKey("raw", localKeyPair.publicKey));

  // Import client public key
  const clientPublicKey = await crypto.subtle.importKey(
    "raw",
    clientPublicKeyBytes,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    [],
  );

  // ECDH shared secret
  const sharedSecret = new Uint8Array(
    await crypto.subtle.deriveBits({ name: "ECDH", public: clientPublicKey }, localKeyPair.privateKey, 256),
  );

  // Salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // HKDF: auth_info = "WebPush: info\0" + client_public + local_public
  const authInfo = concatUint8Arrays(
    new TextEncoder().encode("WebPush: info\0"),
    clientPublicKeyBytes,
    localPublicKeyRaw,
  );

  // IKM from HKDF with auth secret
  const authHkdfKey = await crypto.subtle.importKey("raw", authSecretBytes, "HKDF", false, ["deriveBits"]);
  const ikm = new Uint8Array(
    await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt: sharedSecret, info: authInfo }, authHkdfKey, 256),
  );

  // Content encryption key
  const cekInfo = new TextEncoder().encode("Content-Encoding: aes128gcm\0");
  const cekHkdfKey = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  const cek = new Uint8Array(
    await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info: cekInfo }, cekHkdfKey, 128),
  );

  // Nonce
  const nonceInfo = new TextEncoder().encode("Content-Encoding: nonce\0");
  const nonceHkdfKey = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  const nonce = new Uint8Array(
    await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info: nonceInfo }, nonceHkdfKey, 96),
  );

  // Encrypt with AES-128-GCM
  const encKey = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const paddedPayload = concatUint8Arrays(new TextEncoder().encode(payload), new Uint8Array([2])); // padding delimiter
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, encKey, paddedPayload));

  // Build aes128gcm content: header(salt + rs + keylen + key) + ciphertext
  const rs = new Uint8Array(4);
  new DataView(rs.buffer).setUint32(0, 4096);
  const header = concatUint8Arrays(salt, rs, new Uint8Array([localPublicKeyRaw.length]), localPublicKeyRaw);
  const encrypted = concatUint8Arrays(header, ciphertext);

  return { encrypted, salt, localPublicKey: localPublicKeyRaw };
}

async function sendPushNotification(
  endpoint: string,
  p256dh: string,
  auth: string,
  payload: object,
): Promise<{ success: boolean; status: number }> {
  const payloadStr = JSON.stringify(payload);

  const url = new URL(endpoint);
  const audience = `${url.protocol}//${url.host}`;

  const vapidHeaders = await createVapidAuthHeader(audience, VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  const { encrypted } = await encryptPayload(payloadStr, p256dh, auth);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: vapidHeaders.authorization,
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "aes128gcm",
      TTL: "86400",
    },
    body: encrypted,
  });

  return { success: response.status >= 200 && response.status < 300, status: response.status };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, content-type" },
    });
  }

  try {
    const { session_id, title, body, url, exclude_player_id } = await req.json();

    if (!session_id || !title) {
      return new Response(JSON.stringify({ error: "session_id and title required" }), { status: 400 });
    }

    // Use service role to query all subscriptions for session members
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Get all session member player IDs
    const { data: members } = await supabase
      .from("session_players")
      .select("player_id")
      .eq("session_id", session_id);

    if (!members || members.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), { status: 200 });
    }

    const memberIds = members
      .map((m: { player_id: string }) => m.player_id)
      .filter((id: string) => id !== exclude_player_id);

    if (memberIds.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), { status: 200 });
    }

    // Get push subscriptions for those members
    const { data: subscriptions } = await supabase
      .from("push_subscriptions")
      .select("id, player_id, endpoint, p256dh, auth")
      .in("player_id", memberIds);

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), { status: 200 });
    }

    const payload = { title, body, url: url || `/${session_id}` };
    let sent = 0;
    const expired: string[] = [];

    // Send to all subscriptions
    await Promise.allSettled(
      subscriptions.map(async (sub: { id: string; endpoint: string; p256dh: string; auth: string }) => {
        const result = await sendPushNotification(sub.endpoint, sub.p256dh, sub.auth, payload);
        if (result.success) {
          sent++;
        } else if (result.status === 410 || result.status === 404) {
          expired.push(sub.id);
        }
      }),
    );

    // Clean up expired subscriptions
    if (expired.length > 0) {
      await supabase.from("push_subscriptions").delete().in("id", expired);
    }

    return new Response(JSON.stringify({ sent, expired: expired.length }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
