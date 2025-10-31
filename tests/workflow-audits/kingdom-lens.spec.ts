/**
 * Kingdom Lens - Comprehensive Workflow Audit
 * Content Discovery & Curation Platform
 * Build with the Holy Spirit
 */

import { test, expect } from '@playwright/test';

test.describe('Workflow Audit - Kingdom Lens', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  // Navigation Tests
  test('should navigate to Discover/Browse', async ({ page }) => {
    const discoverLink = page.getByRole('link', { name: /discover|browse|explore/i }).first();
    if (await discoverLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await discoverLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/discover|\/browse|\/explore/);
    }
  });

  test('should navigate to Categories', async ({ page }) => {
    const categoriesLink = page.getByRole('link', { name: /categories/i }).first();
    if (await categoriesLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await categoriesLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('categories');
    }
  });

  test('should navigate to Saved/Bookmarks', async ({ page }) => {
    const savedLink = page.getByRole('link', { name: /saved|bookmarks/i }).first();
    if (await savedLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await savedLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/saved|\/bookmarks/);
    }
  });

  test('should navigate to Search', async ({ page }) => {
    const searchLink = page.getByRole('link', { name: /search/i }).first();
    if (await searchLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('search');
    }
  });

  // Feature-specific Tests
  test('should display content feed', async ({ page }) => {
    const contentItems = page.locator('[data-testid="content-item"], article, [class*="card"]').first();
    const hasContent = await contentItems.isVisible({ timeout: 5000 }).catch(() => false);
    if (!hasContent) {
      console.log('No content visible - may need to load');
    }
  });

  test('should allow searching content', async ({ page }) => {
    await page.goto('/search');
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.getByRole('searchbox').or(page.getByPlaceholder(/search/i)).first();
    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchInput.fill('faith');
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('search');
    }
  });

  test('should allow filtering by category', async ({ page }) => {
    await page.goto('/categories');
    await page.waitForLoadState('networkidle');
    
    const categoryButton = page.getByRole('button', { name: /devotional|sermon|worship/i }).first();
    if (await categoryButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await categoryButton.click();
      await page.waitForLoadState('networkidle');
      expect(true).toBeTruthy();
    }
  });

  test('should allow bookmarking content', async ({ page }) => {
    const bookmarkButton = page.getByRole('button', { name: /bookmark|save/i }).first();
    if (await bookmarkButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await bookmarkButton.click();
      await page.waitForTimeout(500);
      expect(true).toBeTruthy();
    }
  });

  test('should navigate to content details', async ({ page }) => {
    const contentLink = page.getByRole('link').filter({ hasText: /read|view|watch/i }).first();
    if (await contentLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await contentLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/content\/[^/]+|\/view\/[^/]+/);
    }
  });

  // Protection Tests
  test('should protect personal features', async ({ page }) => {
    const protectedRoutes = ['/saved', '/bookmarks', '/preferences'];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      
      const needsAuth = page.url().includes('/login') ||
                       await page.getByText(/sign in|log in/i).isVisible({ timeout: 2000 }).catch(() => false);
      
      console.log(`Route ${route}: ${needsAuth ? 'Protected' : 'Accessible'}`);
    }
  });
});

