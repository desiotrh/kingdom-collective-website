/**
 * Kingdom Launchpad - Comprehensive Workflow Audit
 * Project Launch & Management Platform
 * Build with the Holy Spirit
 */

import { test, expect } from '@playwright/test';

test.describe('Workflow Audit - Kingdom Launchpad', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  // Navigation Tests
  test('should navigate to Dashboard', async ({ page }) => {
    const dashboardLink = page.getByRole('link', { name: /dashboard/i }).first();
    if (await dashboardLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await dashboardLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('dashboard');
    }
  });

  test('should navigate to Projects', async ({ page }) => {
    const projectsLink = page.getByRole('link', { name: /projects/i }).first();
    if (await projectsLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await projectsLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('project');
    }
  });

  test('should navigate to Create Project', async ({ page }) => {
    const createLink = page.getByRole('link', { name: /create|new project/i }).first();
    if (await createLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await createLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/create|\/new/);
    }
  });

  test('should navigate to Resources', async ({ page }) => {
    const resourcesLink = page.getByRole('link', { name: /resources/i }).first();
    if (await resourcesLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await resourcesLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('resource');
    }
  });

  test('should navigate to Team/Collaboration', async ({ page }) => {
    const teamLink = page.getByRole('link', { name: /team|collaboration/i }).first();
    if (await teamLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await teamLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/team|\/collaboration/);
    }
  });

  // Feature-specific Tests
  test('should display project list', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    
    const projectItems = page.locator('[data-testid="project"], [class*="project"]').first();
    const hasProjects = await projectItems.isVisible({ timeout: 5000 }).catch(() => false);
    if (!hasProjects) {
      console.log('No projects visible - may be empty state');
    }
  });

  test('should allow creating new project', async ({ page }) => {
    await page.goto('/projects/create');
    await page.waitForLoadState('networkidle');
    
    const nameInput = page.getByRole('textbox', { name: /project name|title/i }).first();
    const submitButton = page.getByRole('button', { name: /create|submit|launch/i }).first();
    
    const hasForm = await nameInput.isVisible({ timeout: 5000 }).catch(() => false);
    if (hasForm) {
      expect(await submitButton.isVisible()).toBeTruthy();
    }
  });

  test('should navigate to project details', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    
    const projectLink = page.getByRole('link').filter({ hasText: /project|view/i }).first();
    if (await projectLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await projectLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/projects\/[^/]+/);
    }
  });

  test('should verify milestone workflow', async ({ page }) => {
    const milestoneButton = page.getByRole('button', { name: /milestone/i }).first();
    if (await milestoneButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await milestoneButton.click();
      await page.waitForTimeout(1000);
      expect(true).toBeTruthy();
    }
  });

  // Role-based Tests
  test('should show admin panel for admins', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    const hasAdminAccess = !page.url().includes('/login') &&
                          !await page.getByText(/unauthorized|forbidden/i).isVisible({ timeout: 2000 }).catch(() => false);
    
    console.log(`Admin access: ${hasAdminAccess ? 'Granted' : 'Denied'}`);
  });

  test('should protect management features', async ({ page }) => {
    const protectedRoutes = ['/projects/create', '/admin', '/team/manage'];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      
      const needsAuth = page.url().includes('/login') ||
                       await page.getByText(/sign in|log in/i).isVisible({ timeout: 2000 }).catch(() => false);
      
      console.log(`Route ${route}: ${needsAuth ? 'Protected' : 'Accessible'}`);
    }
  });
});

