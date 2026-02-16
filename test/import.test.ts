import { describe, expect, it } from 'vitest'
import { sThree } from '../src'

describe('module import', () => {
  it('should expose sThree in node runtime', () => {
    expect(typeof sThree).toBe('function')
  })
})
