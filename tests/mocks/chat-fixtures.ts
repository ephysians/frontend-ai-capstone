export const assistantTextMessage = {
  id: 'assistant-text',
  role: 'assistant',
  parts: [{ type: 'text', text: 'The workflow is documented and reviewable.' }],
};

export const userTextMessage = {
  id: 'user-text',
  role: 'user',
  parts: [{ type: 'text', text: 'Tell me about the workflow project' }],
};

export const toolInputStreamingMessage = {
  id: 'tool-input-streaming',
  role: 'assistant',
  parts: [{ type: 'tool-getCaseStudy', toolCallId: 'tool-1', state: 'input-streaming' }],
};

export const toolInputAvailableMessage = {
  id: 'tool-input-available',
  role: 'assistant',
  parts: [
    {
      type: 'tool-getCaseStudy',
      toolCallId: 'tool-2',
      state: 'input-available',
      input: { topic: 'workflow' },
    },
  ],
};

export const toolOutputAvailableMessage = {
  id: 'tool-output-available',
  role: 'assistant',
  parts: [
    {
      type: 'tool-getCaseStudy',
      toolCallId: 'tool-3',
      state: 'output-available',
      output: {
        id: 'workflow-discipline',
        title: 'Building a repeatable AI-assisted engineering workflow',
        problem: 'The process did not scale.',
        decision: 'Adopted a deliberate workflow.',
        outcome: 'Caught a browser module mismatch before shipping.',
      },
    },
  ],
};

export const toolOutputErrorMessage = {
  id: 'tool-output-error',
  role: 'assistant',
  parts: [
    {
      type: 'tool-getCaseStudy',
      toolCallId: 'tool-4',
      state: 'output-error',
    },
  ],
};
