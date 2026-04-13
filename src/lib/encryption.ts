import crypto from 'crypto'

const ALGORITHM = 'aes-256-cbc'
const KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production-32!'

function getKey(): Buffer {
  return crypto.scryptSync(KEY, 'salt', 32)
}

export function encrypt(text: string): string {
  if (!text) return ''
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + ':' + encrypted
}

export function decrypt(encryptedText: string): string {
  if (!encryptedText || !encryptedText.includes(':')) {
    return encryptedText || ''
  }
  try {
    const [ivHex, encrypted] = encryptedText.split(':')
    if (!ivHex || !encrypted) return encryptedText
    const iv = Buffer.from(ivHex, 'hex')
    if (iv.length !== 16) return encryptedText
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch {
    return encryptedText
  }
}
