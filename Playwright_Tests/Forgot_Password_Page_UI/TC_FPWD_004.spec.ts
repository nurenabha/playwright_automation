import { test, expect } from '@playwright/test';
import { reportingTool } from '../../config/config';

test('TC_FPWD_004 - Verify envelope icon is displayed at the top-left of the heading', async ({ page }) => {
  await page.goto(reportingTool.forgotPasswordUrl);

  const heading = page.locator('div.public-flow-heading');
  const envelopeIcon = heading.locator('svg.lucide-mail');

  // Verify heading & icon are visible
  await expect(heading).toBeVisible();
  await expect(envelopeIcon).toBeVisible();

  // Verify envelope icon is positioned at the top-left of the heading
  const headingBox = await heading.boundingBox();
  const iconBox = await envelopeIcon.boundingBox();

  expect(headingBox).not.toBeNull();
  expect(iconBox).not.toBeNull();

  if (headingBox && iconBox) {
    expect(Math.abs(iconBox.x - headingBox.x)).toBeLessThanOrEqual(5);
		expect(Math.abs(iconBox.y - headingBox.y)).toBeLessThanOrEqual(5);
  }
});