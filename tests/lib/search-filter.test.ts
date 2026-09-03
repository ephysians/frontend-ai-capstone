import { describe, it, expect } from 'vitest';
import { filterItems, highlightMatches, escapeRegExp } from '@/lib/search-filter';

interface MockItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

const mockItems: MockItem[] = [
  {
    id: '1',
    title: 'Building a repeatable AI-assisted workflow',
    description: 'Caught a browser CommonJS/ESM module mismatch.',
    tags: ['workflow', 'review', 'ai'],
  },
  {
    id: '2',
    title: 'Signature Hero: A Fullscreen WebGL Shader',
    description: 'Custom procedural GLSL landscape noise and FBM.',
    tags: ['webgl', 'threejs', 'shader'],
  },
  {
    id: '3',
    title: 'Interactive 3D Review Pipeline',
    description: 'React Three Fiber scene demonstrating verification stages.',
    tags: ['3d', 'threejs', 'testing'],
  },
];

describe('search-filter utility', () => {
  describe('escapeRegExp', () => {
    it('escapes all standard regular expression special characters', () => {
      const specialChars = '.*+?^${}()|[]\\';
      const escaped = escapeRegExp(specialChars);
      expect(escaped).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
    });
  });

  describe('filterItems', () => {
    const getFields = (item: MockItem) => [item.title, item.description, ...item.tags];

    it('returns all items when query is empty or whitespace', () => {
      expect(filterItems(mockItems, '', getFields)).toEqual(mockItems);
      expect(filterItems(mockItems, '   ', getFields)).toEqual(mockItems);
    });

    it('filters items case-insensitively by title', () => {
      const results = filterItems(mockItems, 'shader', getFields);
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('2');
    });

    it('filters items by description and tag', () => {
      const descResults = filterItems(mockItems, 'commonjs', getFields);
      expect(descResults).toHaveLength(1);
      expect(descResults[0].id).toBe('1');

      const tagResults = filterItems(mockItems, 'threejs', getFields);
      expect(tagResults).toHaveLength(2);
      expect(tagResults.map((r) => r.id)).toEqual(['2', '3']);
    });

    it('returns an empty array when no fields match', () => {
      const results = filterItems(mockItems, 'nonexistent query 12345', getFields);
      expect(results).toEqual([]);
    });
  });

  describe('highlightMatches', () => {
    it('returns empty array when text is empty', () => {
      expect(highlightMatches('', 'test')).toEqual([]);
    });

    it('returns single non-matching segment when query is empty or whitespace', () => {
      expect(highlightMatches('Hello world', '')).toEqual([{ text: 'Hello world', isMatch: false }]);
      expect(highlightMatches('Hello world', '   ')).toEqual([{ text: 'Hello world', isMatch: false }]);
    });

    it('splits text correctly around a single match while preserving case', () => {
      const result = highlightMatches('I ship what AI writes', 'ai');
      expect(result).toEqual([
        { text: 'I ship what ', isMatch: false },
        { text: 'AI', isMatch: true },
        { text: ' writes', isMatch: false },
      ]);
    });

    it('splits text correctly with multiple matches', () => {
      const result = highlightMatches('test the test runner test', 'test');
      expect(result).toEqual([
        { text: 'test', isMatch: true },
        { text: ' the ', isMatch: false },
        { text: 'test', isMatch: true },
        { text: ' runner ', isMatch: false },
        { text: 'test', isMatch: true },
      ]);
    });

    it('safely handles regex special characters without crashing or throwing SyntaxError', () => {
      // Unescaped regex would throw SyntaxError on unclosed parentheses or brackets
      expect(() => highlightMatches('Learning (AI) in 2026', '(AI)')).not.toThrow();
      expect(highlightMatches('Learning (AI) in 2026', '(AI)')).toEqual([
        { text: 'Learning ', isMatch: false },
        { text: '(AI)', isMatch: true },
        { text: ' in 2026', isMatch: false },
      ]);

      expect(() => highlightMatches('Search for [work] items', '[work]')).not.toThrow();
      expect(highlightMatches('Search for [work] items', '[work]')).toEqual([
        { text: 'Search for ', isMatch: false },
        { text: '[work]', isMatch: true },
        { text: ' items', isMatch: false },
      ]);

      expect(() => highlightMatches('Price: $100 + $20 tax', '$100 + $20')).not.toThrow();
      expect(highlightMatches('Price: $100 + $20 tax', '$100 + $20')).toEqual([
        { text: 'Price: ', isMatch: false },
        { text: '$100 + $20', isMatch: true },
        { text: ' tax', isMatch: false },
      ]);

      expect(() => highlightMatches('C++ programming language', 'c++')).not.toThrow();
      expect(highlightMatches('C++ programming language', 'c++')).toEqual([
        { text: 'C++', isMatch: true },
        { text: ' programming language', isMatch: false },
      ]);
    });
  });
});
