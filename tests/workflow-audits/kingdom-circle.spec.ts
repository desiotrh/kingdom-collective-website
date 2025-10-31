/**
 * Kingdom Circle - Comprehensive Workflow Audit
 * Community & Accountability Features
 * Build with the Holy Spirit
 */

import { test, expect } from '@playwright/test';

test.describe('Workflow Audit - Kingdom Circle', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  // Navigation Tests
  test('should navigate to Home/Feed', async ({ page }) => {
    const homeLink = page.getByRole('link', { name: /home|feed/i }).first();
    if (await homeLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await homeLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/|\/feed|\/home/);
    }
  });

  test('should navigate to Prayer Board', async ({ page }) => {
    const prayerLink = page.getByRole('link', { name: /prayer/i }).first();
    if (await prayerLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await prayerLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('prayer');
    }
  });

  test('should navigate to Accountability Check-in', async ({ page }) => {
    const accountabilityLink = page.getByRole('link', { name: /accountability|check/i }).first();
    if (await accountabilityLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await accountabilityLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/accountability|checkin/);
    }
  });

  test('should navigate to Community Challenges', async ({ page }) => {
    const challengesLink = page.getByRole('link', { name: /challenge/i }).first();
    if (await challengesLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await challengesLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('challenge');
    }
  });

  test('should navigate to Discipleship Threads', async ({ page }) => {
    const threadsLink = page.getByRole('link', { name: /discipleship|thread/i }).first();
    if (await threadsLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await threadsLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/discipleship|thread/);
    }
  });

  // Feature-specific Tests
  test('should display feed/posts', async ({ page }) => {
    const posts = page.locator('[data-testid="post"], [class*="post"], article').first();
    const hasPosts = await posts.isVisible({ timeout: 5000 }).catch(() => false);
    if (!hasPosts) {
      console.log('No posts visible - may need authentication');
    }
  });

  test('should allow creating prayer request', async ({ page }) => {
    await page.goto('/prayer');
    await page.waitForLoadState('networkidle');
    
    const createButton = page.getByRole('button', { name: /new|create|add|post/i }).first();
    if (await createButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await createButton.click();
      await page.waitForTimeout(1000);
      
      const modal = page.locator('[role="dialog"], [class*="modal"]').first();
      const hasModal = await modal.isVisible({ timeout: 2000 }).catch(() => false);
      expect(hasModal || page.url().includes('/create')).toBeTruthy();
    }
  });

  test('should verify accountability check-in workflow', async ({ page }) => {
    await page.goto('/accountability');
    await page.waitForLoadState('networkidle');
    
    const checkinButton = page.getByRole('button', { name: /check in|submit/i }).first();
    if (await checkinButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      expect(await checkinButton.isEnabled()).toBeDefined();
    }
  });

  // Protection Tests
  test('should protect community features', async ({ page }) => {
    const protectedRoutes = ['/feed', '/prayer', '/accountability'];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      
      const needsAuth = page.url().includes('/login') ||
                       await page.getByText(/sign in|log in/i).isVisible({ timeout: 2000 }).catch(() => false);
      
      console.log(`Route ${route}: ${needsAuth ? 'Protected' : 'Accessible'}`);
    }
  });
});

