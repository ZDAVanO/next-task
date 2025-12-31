import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '@/lib/store'

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.setState({
      lastAction: 'No actions yet',
      searchQuery: '',
      taskFilter: 'all',
      sortBy: 'position',
    })
  })

  describe('searchQuery', () => {
    it('should have empty searchQuery by default', () => {
      expect(useAppStore.getState().searchQuery).toBe('')
    })

    it('should update searchQuery', () => {
      useAppStore.getState().setSearchQuery('test query')
      expect(useAppStore.getState().searchQuery).toBe('test query')
    })

    it('should handle empty string', () => {
      useAppStore.getState().setSearchQuery('something')
      useAppStore.getState().setSearchQuery('')
      expect(useAppStore.getState().searchQuery).toBe('')
    })

    it('should handle special characters', () => {
      useAppStore.getState().setSearchQuery('test @#$ query')
      expect(useAppStore.getState().searchQuery).toBe('test @#$ query')
    })
  })

  describe('taskFilter', () => {
    it('should have "all" as default filter', () => {
      expect(useAppStore.getState().taskFilter).toBe('all')
    })

    it('should update to "active"', () => {
      useAppStore.getState().setTaskFilter('active')
      expect(useAppStore.getState().taskFilter).toBe('active')
    })

    it('should update to "completed"', () => {
      useAppStore.getState().setTaskFilter('completed')
      expect(useAppStore.getState().taskFilter).toBe('completed')
    })

    it('should update back to "all"', () => {
      useAppStore.getState().setTaskFilter('completed')
      useAppStore.getState().setTaskFilter('all')
      expect(useAppStore.getState().taskFilter).toBe('all')
    })
  })

  describe('sortBy', () => {
    it('should have "position" as default sort', () => {
      expect(useAppStore.getState().sortBy).toBe('position')
    })

    it('should update to "title"', () => {
      useAppStore.getState().setSortBy('title')
      expect(useAppStore.getState().sortBy).toBe('title')
    })

    it('should update to "date"', () => {
      useAppStore.getState().setSortBy('date')
      expect(useAppStore.getState().sortBy).toBe('date')
    })
  })

  describe('lastAction', () => {
    it('should have default value', () => {
      expect(useAppStore.getState().lastAction).toBe('No actions yet')
    })

    it('should update lastAction', () => {
      useAppStore.getState().setLastAction('Task created')
      expect(useAppStore.getState().lastAction).toBe('Task created')
    })
  })

  describe('multiple state updates', () => {
    it('should handle multiple state changes', () => {
      const store = useAppStore.getState()
      
      store.setSearchQuery('search term')
      store.setTaskFilter('active')
      store.setSortBy('title')
      store.setLastAction('Updated filters')

      const state = useAppStore.getState()
      expect(state.searchQuery).toBe('search term')
      expect(state.taskFilter).toBe('active')
      expect(state.sortBy).toBe('title')
      expect(state.lastAction).toBe('Updated filters')
    })
  })
})
