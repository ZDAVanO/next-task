import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn (classNames utility)', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'included', false && 'excluded')).toBe('base included')
  })

  it('should merge tailwind classes correctly', () => {
    // tailwind-merge should dedupe conflicting classes
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('should handle arrays of classes', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })

  it('should handle empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
    expect(cn(null, undefined)).toBe('')
  })

  it('should handle objects with boolean values', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
  })
})
