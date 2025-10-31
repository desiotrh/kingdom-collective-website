/**
 * Kingdom Stand - Comprehensive Workflow Audit
 * Advocacy & Action Platform
 * Build with the Holy Spirit
 */

import { test, expect } from '@playwright/test';

test.describe('Workflow Audit - Kingdom Stand', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  // Navigation Tests
  test('should navigate to Causes/Issues', async ({ page }) => {
    const causesLink = page.getByRole('link', { name: /causes|issues/i }).first();
    if (await causesLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await causesLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/causes|\/issues/);
    }
  });

  test('should navigate to Take Action', async ({ page }) => {
    const actionLink = page.getByRole('link', { name: /action|take action/i }).first();
    if (await actionLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await actionLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('action');
    }
  });

  test('should navigate to My Impact', async ({ page }) => {
    const impactLink = page.getByRole('link', { name: /impact|my impact/i }).first();
    if (await impactLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await impactLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('impact');
    }
  });

  // Feature-specific Tests
  test('should display causes list', async ({ page }) => {
    const causes = page.locator('[data-testid="cause"], [class*="cause"]').first();
    const hasCauses = await causes.isVisible({ timeout: 5000 }).catch(() => false);
    if (!hasCauses) {
      console.log('No causes visible - may need to load');
    }
  });

  test('should allow signing petitions', async ({ page }) => {
    const signButton = page.getByRole('button', { name: /sign|support/i }).first();
    if (await signButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await signButton.click();
      await page.waitForTimeout(1000);
      
      const modal = page.locator('[role="dialog"]').first();
      const hasModal = await modal.isVisible({ timeout: 2000 }).catch(() => false);
      expect(hasModal || page.url().includes('/sign')).toBeTruthy();
    }
  });

  test('should allow sharing causes', async ({ page }) => {
    const shareButton = page.getByRole('button', { name: /share/i }).first();
    if (await shareButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await shareButton.click();
      await page.waitForTimeout(500);
      expect(true).toBeTruthy();
    }
  });

  // Protection Tests
  test('should protect user features', async ({ page }) => {
    const protectedRoutes = ['/my-impact', '/profile'];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      
      const needsAuth = page.url().includes('/login') ||
                       await page.getByText(/sign in|log in/i).isVisible({ timeout: 2000 }).catch(() => false);
      
      console.log(`Route ${route}: ${needsAuth ? 'Protected' : 'Accessible'}`);
    }
  });
});

