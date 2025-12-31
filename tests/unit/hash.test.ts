import { describe, it, expect } from 'vitest'
import { hashUserPassword, verifyPassword } from '@/lib/hash'

describe('hashUserPassword', () => {
  it('should return a hashed password with salt', () => {
    const password = 'testPassword123'
    const result = hashUserPassword(password)
    
    expect(result).toBeDefined()
    expect(result).toContain(':') // Format: hash:salt
    
    const [hash, salt] = result.split(':')
    expect(hash).toHaveLength(128) // 64 bytes = 128 hex chars
    expect(salt).toHaveLength(32) // 16 bytes = 32 hex chars
  })

  it('should generate different hashes for the same password (due to random salt)', () => {
    const password = 'samePassword'
    const hash1 = hashUserPassword(password)
    const hash2 = hashUserPassword(password)
    
    expect(hash1).not.toBe(hash2)
  })

  it('should handle empty password', () => {
    const result = hashUserPassword('')
    expect(result).toContain(':')
  })

  it('should handle special characters in password', () => {
    const password = 'p@$$w0rd!#$%^&*()'
    const result = hashUserPassword(password)
    expect(result).toContain(':')
  })

  it('should handle unicode characters', () => {
    const password = 'пароль123日本語'
    const result = hashUserPassword(password)
    expect(result).toContain(':')
  })
})

describe('verifyPassword', () => {
  it('should return true for correct password', () => {
    const password = 'correctPassword'
    const storedPassword = hashUserPassword(password)
    
    expect(verifyPassword(storedPassword, password)).toBe(true)
  })

  it('should return false for incorrect password', () => {
    const password = 'correctPassword'
    const storedPassword = hashUserPassword(password)
    
    expect(verifyPassword(storedPassword, 'wrongPassword')).toBe(false)
  })

  it('should return false for similar but different passwords', () => {
    const password = 'Password123'
    const storedPassword = hashUserPassword(password)
    
    expect(verifyPassword(storedPassword, 'password123')).toBe(false) // case difference
    expect(verifyPassword(storedPassword, 'Password1234')).toBe(false) // extra char
    expect(verifyPassword(storedPassword, 'Password12')).toBe(false) // missing char
  })

  it('should work with special characters', () => {
    const password = 'p@$$w0rd!#$%'
    const storedPassword = hashUserPassword(password)
    
    expect(verifyPassword(storedPassword, password)).toBe(true)
    expect(verifyPassword(storedPassword, 'p@$$w0rd!#$')).toBe(false)
  })

  it('should work with unicode characters', () => {
    const password = 'пароль日本語'
    const storedPassword = hashUserPassword(password)
    
    expect(verifyPassword(storedPassword, password)).toBe(true)
  })
})
