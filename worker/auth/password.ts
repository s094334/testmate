const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')

const fromHex = (hex: string) =>
  Uint8Array.from(hex.match(/../g) ?? [], (h) => parseInt(h, 16))

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iterations = 100_000

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )

  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    key,
    256,
  )

  return {
    hash: toHex(new Uint8Array(bits)),
    salt: toHex(salt),
    iterations,
  }
}

// Hashes the password again with the account's own salt and iterations,
// then compares in constant time so the response time does not hint how close it was
export async function verifyPassword(
  password: string,
  saved: { hash: string; salt: string; iterations: number }
) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: fromHex(saved.salt),
      iterations: saved.iterations,
    },
    key,
    256
  )

  const savedHash = fromHex(saved.hash)

  // timingSafeEqual throws when the lengths differ
  return (
    savedHash.byteLength === bits.byteLength &&
    crypto.subtle.timingSafeEqual(savedHash, bits)
  )
}
