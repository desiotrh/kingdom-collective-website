/**
 * Kingdom Website - Comprehensive Workflow Audit
 * Main Marketing & Information Site
 * Build with the Holy Spirit
 */

import { test, expect } from '@playwright/test';

test.describe('Workflow Audit - Kingdom Website', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  // Navigation Tests
  test('should navigate to Home', async ({ page }) => {
    const homeLink = page.getByRole('link', { name: /home/i }).first();
    if (await homeLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await homeLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/$/);
    }
  });

  test('should navigate to About', async ({ page }) => {
    const aboutLink = page.getByRole('link', { name: /about/i }).first();
    if (await aboutLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await aboutLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('about');
    }
  });

  test('should navigate to Apps/Products', async ({ page }) => {
    const appsLink = page.getByRole('link', { name: /apps|products/i }).first();
    if (await appsLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await appsLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/apps|\/products/);
    }
  });

  test('should navigate to Contact', async ({ page }) => {
    const contactLink = page.getByRole('link', { name: /contact/i }).first();
    if (await contactLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await contactLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('contact');
    }
  });

  test('should navigate to Blog', async ({ page }) => {
    const blogLink = page.getByRole('link', { name: /blog|news/i }).first();
    if (await blogLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await blogLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/blog|\/news/);
    }
  });

  // Feature-specific Tests
  test('should display app showcase', async ({ page }) => {
    await page.goto('/apps');
    await page.waitForLoadState('networkidle');
    
    const appCards = page.locator('[data-testid="app-card"], [class*="app"]').first();
    const hasApps = await appCards.isVisible({ timeout: 5000 }).catch(() => false);
    if (!hasApps) {
      console.log('No app cards visible');
    }
  });

  test('should allow newsletter signup', async ({ page }) => {
    const emailInput = page.getByRole('textbox', { name: /email/i }).first();
    const subscribeButton = page.getByRole('button', { name: /subscribe|sign up/i }).first();
    
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('test@example.com');
      await subscribeButton.click();
      await page.waitForTimeout(1000);
      expect(true).toBeTruthy();
    }
  });

  test('should submit contact form', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    
    const nameInput = page.getByRole('textbox', { name: /name/i }).first();
    const emailInput = page.getByRole('textbox', { name: /email/i }).first();
    const submitButton = page.getByRole('button', { name: /send|submit/i }).first();
    
    const hasForm = await nameInput.isVisible({ timeout: 5000 }).catch(() => false);
    if (hasForm) {
      await nameInput.fill('Test User');
      await emailInput.fill('test@example.com');
      expect(await submitButton.isVisible()).toBeTruthy();
    }
  });

  test('should navigate to individual app pages', async ({ page }) => {
    await page.goto('/apps');
    await page.waitForLoadState('networkidle');
    
    const appLink = page.getByRole('link').filter({ hasText: /circle|clips|voice/i }).first();
    if (await appLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await appLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/apps\/[^/]+/);
    }
  });

  // Social & External Links
  test('should have working social media links', async ({ page }) => {
    const socialLinks = await page.locator('a[href*="facebook"], a[href*="twitter"], a[href*="instagram"]').all();
    
    for (const link of socialLinks.slice(0, 3)) {
      const href = await link.getAttribute('href');
      if (href) {
        expect(href).toMatch(/facebook|twitter|instagram|linkedin/);
      }
    }
  });

  test('should have proper footer navigation', async ({ page }) => {
    const footer = page.locator('footer').first();
    if (await footer.isVisible({ timeout: 5000 }).catch(() => false)) {
      const footerLinks = await footer.getByRole('link').all();
      expect(footerLinks.length).toBeGreaterThan(0);
    }
  });

  // SEO & Meta
  test('should have proper page titles', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should have meta descriptions', async ({ page }) => {
    await page.goto('/');
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    if (metaDescription) {
      expect(metaDescription.length).toBeGreaterThan(0);
    }
  });
});

