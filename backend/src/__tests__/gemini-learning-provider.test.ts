import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { sanitizeGeminiSchema } from '../providers/gemini-learning-provider.js';

describe('sanitizeGeminiSchema', () => {
  it('removes unsupported string constraints recursively', () => {
    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: {
        title: { type: 'string', minLength: 3, maxLength: 100, format: 'uri' },
        techniques: {
          type: 'array',
          minItems: 5,
          maxItems: 8,
          items: {
            type: 'object',
            properties: {
              description: { type: 'string', minLength: 10, maxLength: 320 },
            },
          },
        },
      },
      required: ['title', 'techniques'],
    };

    assert.deepEqual(sanitizeGeminiSchema(schema), {
      type: 'object',
      properties: {
        title: { type: 'string' },
        techniques: {
          type: 'array',
          minItems: 5,
          maxItems: 8,
          items: {
            type: 'object',
            properties: {
              description: { type: 'string' },
            },
          },
        },
      },
      required: ['title', 'techniques'],
    });
  });
});
