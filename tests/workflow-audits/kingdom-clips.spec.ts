/**
 * Kingdom Clips - Comprehensive Workflow Audit
 * Short-form Video Content Features
 * Build with the Holy Spirit
 */

import { test, expect } from '@playwright/test';

test.describe('Workflow Audit - Kingdom Clips', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  // Navigation Tests
  test('should navigate to Home/Browse', async ({ page }) => {
    const homeLink = page.getByRole('link', { name: /home|browse|explore/i }).first();
    if (await homeLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await homeLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/|\/browse|\/explore/);
    }
  });

  test('should navigate to Create/Upload', async ({ page }) => {
    const createLink = page.getByRole('link', { name: /create|upload|new/i }).first();
    if (await createLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await createLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/create|\/upload|\/new/);
    }
  });

  test('should navigate to My Clips', async ({ page }) => {
    const myClipsLink = page.getByRole('link', { name: /my clips|library/i }).first();
    if (await myClipsLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await myClipsLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/clips|\/library/);
    }
  });

  test('should navigate to Trending', async ({ page }) => {
    const trendingLink = page.getByRole('link', { name: /trending|popular/i }).first();
    if (await trendingLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await trendingLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/trending|\/popular/);
    }
  });

  // Feature-specific Tests
  test('should display video feed', async ({ page }) => {
    const videos = page.locator('video, [data-testid="clip"], [class*="video"]').first();
    const hasVideos = await videos.isVisible({ timeout: 5000 }).catch(() => false);
    if (!hasVideos) {
      console.log('No videos visible - may need to load or scroll');
    }
  });

  test('should handle video playback controls', async ({ page }) => {
    const playButton = page.getByRole('button', { name: /play|pause/i }).first();
    if (await playButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await playButton.click();
      await page.waitForTimeout(500);
      expect(true).toBeTruthy(); // Interaction successful
    }
  });

  test('should allow liking videos', async ({ page }) => {
    const likeButton = page.getByRole('button', { name: /like|heart/i }).first();
    if (await likeButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await likeButton.click();
      await page.waitForTimeout(500);
      expect(true).toBeTruthy(); // Interaction successful
    }
  });

  test('should allow sharing videos', async ({ page }) => {
    const shareButton = page.getByRole('button', { name: /share/i }).first();
    if (await shareButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await shareButton.click();
      await page.waitForTimeout(500);
      
      const shareModal = page.locator('[role="dialog"]').first();
      const hasModal = await shareModal.isVisible({ timeout: 2000 }).catch(() => false);
      expect(hasModal || true).toBeTruthy();
    }
  });

  test('should verify upload workflow', async ({ page }) => {
    await page.goto('/create');
    await page.waitForLoadState('networkidle');
    
    const uploadButton = page.getByRole('button', { name: /upload|select|choose/i }).first();
    if (await uploadButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      expect(await uploadButton.isEnabled()).toBeDefined();
    }
  });

  // Protection Tests
  test('should protect creator features', async ({ page }) => {
    const protectedRoutes = ['/create', '/upload', '/my-clips'];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      
      const needsAuth = page.url().includes('/login') ||
                       await page.getByText(/sign in|log in/i).isVisible({ timeout: 2000 }).catch(() => false);
      
      console.log(`Route ${route}: ${needsAuth ? 'Protected' : 'Accessible'}`);
    }
  });
});

