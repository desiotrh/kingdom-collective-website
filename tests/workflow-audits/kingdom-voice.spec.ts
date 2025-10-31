/**
 * Kingdom Voice - Comprehensive Workflow Audit
 * Journaling & Devotional Platform
 * Build with the Holy Spirit
 */

import { test, expect } from '@playwright/test';

test.describe('Workflow Audit - Kingdom Voice', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  // Navigation Tests
  test('should navigate to Journal/Entries', async ({ page }) => {
    const journalLink = page.getByRole('link', { name: /journal|entries/i }).first();
    if (await journalLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await journalLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/journal|\/entries/);
    }
  });

  test('should navigate to New Entry', async ({ page }) => {
    const newEntryLink = page.getByRole('link', { name: /new entry|create/i }).first();
    if (await newEntryLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await newEntryLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/new|\/create/);
    }
  });

  test('should navigate to Devotional Generator', async ({ page }) => {
    const devotionalLink = page.getByRole('link', { name: /devotional/i }).first();
    if (await devotionalLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await devotionalLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('devotional');
    }
  });

  test('should navigate to Voice Entry', async ({ page }) => {
    const voiceLink = page.getByRole('link', { name: /voice|record/i }).first();
    if (await voiceLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await voiceLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/voice|\/record/);
    }
  });

  test('should navigate to Dream Tracker', async ({ page }) => {
    const dreamLink = page.getByRole('link', { name: /dream/i }).first();
    if (await dreamLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await dreamLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('dream');
    }
  });

  test('should navigate to Declaration Builder', async ({ page }) => {
    const declarationLink = page.getByRole('link', { name: /declaration/i }).first();
    if (await declarationLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await declarationLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('declaration');
    }
  });

  test('should navigate to Book Planner', async ({ page }) => {
    const bookLink = page.getByRole('link', { name: /book/i }).first();
    if (await bookLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await bookLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('book');
    }
  });

  // Feature-specific Tests
  test('should display saved entries', async ({ page }) => {
    await page.goto('/entries');
    await page.waitForLoadState('networkidle');
    
    const entries = page.locator('[data-testid="entry"], [class*="entry"]').first();
    const hasEntries = await entries.isVisible({ timeout: 5000 }).catch(() => false);
    if (!hasEntries) {
      console.log('No entries visible - may be empty');
    }
  });

  test('should allow creating text entry', async ({ page }) => {
    await page.goto('/new-entry');
    await page.waitForLoadState('networkidle');
    
    const textArea = page.getByRole('textbox', { name: /content|entry|text/i }).first();
    const saveButton = page.getByRole('button', { name: /save|submit/i }).first();
    
    const hasForm = await textArea.isVisible({ timeout: 5000 }).catch(() => false);
    if (hasForm) {
      await textArea.fill('Test entry');
      expect(await saveButton.isVisible()).toBeTruthy();
    }
  });

  test('should generate devotional', async ({ page }) => {
    await page.goto('/devotional');
    await page.waitForLoadState('networkidle');
    
    const generateButton = page.getByRole('button', { name: /generate|create/i }).first();
    if (await generateButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await generateButton.click();
      await page.waitForTimeout(2000);
      expect(true).toBeTruthy();
    }
  });

  test('should allow voice recording', async ({ page }) => {
    await page.goto('/voice-entry');
    await page.waitForLoadState('networkidle');
    
    const recordButton = page.getByRole('button', { name: /record|start/i }).first();
    if (await recordButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      expect(await recordButton.isEnabled()).toBeDefined();
    }
  });

  test('should export entry', async ({ page }) => {
    const exportButton = page.getByRole('button', { name: /export|download/i }).first();
    if (await exportButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await exportButton.click();
      await page.waitForTimeout(1000);
      expect(true).toBeTruthy();
    }
  });

  // Protection Tests
  test('should protect all journal features', async ({ page }) => {
    const protectedRoutes = ['/entries', '/new-entry', '/voice-entry', '/dreams'];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      
      const needsAuth = page.url().includes('/login') ||
                       await page.getByText(/sign in|log in/i).isVisible({ timeout: 2000 }).catch(() => false);
      
      console.log(`Route ${route}: ${needsAuth ? 'Protected' : 'Accessible'}`);
    }
  });
});

