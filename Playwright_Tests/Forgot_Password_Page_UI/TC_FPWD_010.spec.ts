import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_010 - Verify no UI elements overlap or are clipped at default desktop resolution', async ({ page }) => {

  // Set desktop resolution: 1920x1080
  await page.setViewportSize({
    width: 1920,
    height: 1080
  });

  // Open Forgot Password page
  await page.goto(reportingTool.forgotPasswordUrl);

  // Important UI elements
  const elements = [
    page.getByRole('heading', { name: /reset your password/i }),
    page.getByRole('textbox', { name: /email/i }),
    page.getByRole('button', { name: /send recovery link/i }),
    page.getByRole('button', { name: /back to login/i })
  ];

  // Check each element
  for (const element of elements) {

    // Element should exist and be visible
    await expect(element).toBeVisible();

    const box = await element.boundingBox();

    expect(box).not.toBeNull();

    if (box) {

      // Check element is not clipped outside viewport
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);

      expect(box.x + box.width).toBeLessThanOrEqual(1920);
      expect(box.y + box.height).toBeLessThanOrEqual(1080);

      // Element must have valid dimensions
      expect(box.width).toBeGreaterThan(0);
      expect(box.height).toBeGreaterThan(0);
    }
  }

  // Check for overlap between the selected UI elements
  for (let i = 0; i < elements.length; i++) {

    const box1 = await elements[i].boundingBox();

    if (!box1) continue;

    for (let j = i + 1; j < elements.length; j++) {
      const box2 = await elements[j].boundingBox();

      if (!box2) continue;
      const isOverlapping =
        box1.x < box2.x + box2.width &&
        box1.x + box1.width > box2.x &&
        box1.y < box2.y + box2.height &&
        box1.y + box1.height > box2.y;

      expect(isOverlapping).toBe(false);
    }
  }
});