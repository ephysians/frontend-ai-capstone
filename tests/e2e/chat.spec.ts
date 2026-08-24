import { expect, test } from '@playwright/test';

test('user can ask about the work and see the assistant response', async ({ page }) => {
  await page.route('**/api/chat', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/event-stream',
      body: [
        'data: {"type":"start","messageId":"test-message"}\n\n',
        'data: {"type":"text-start","id":"text-1"}\n\n',
        'data: {"type":"text-delta","id":"text-1","delta":"The workflow response is available in this test."}\n\n',
        'data: {"type":"text-end","id":"text-1"}\n\n',
        'data: {"type":"finish","finishReason":"stop"}\n\n',
        'data: [DONE]\n\n',
      ].join(''),
    });
  });

  await page.goto('/chat');
  const message = page.getByRole('textbox', { name: 'Message' });
  await message.pressSequentially('Tell me about the workflow project');
  const sendButton = page.getByRole('button', { name: 'Send message' });
  await expect(sendButton).toBeEnabled();
  await sendButton.click();

  await expect(page.getByText('The workflow response is available in this test.')).toBeVisible();
});
