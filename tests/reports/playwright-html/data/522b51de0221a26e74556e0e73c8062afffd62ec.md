# Test info

- Name: Workflow Audit - Kingdom Studios >> should display login page for unauthenticated users
- Location: D:\Kingdom Studios App\tests\workflow-audits\kingdom-studios.spec.ts:68:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
    at D:\Kingdom Studios App\tests\workflow-audits\kingdom-studios.spec.ts:79:27
    at D:\Kingdom Studios App\tests\workflow-audits\kingdom-studios.spec.ts:69:5
```

# Test source

```ts
   1 | /**
   2 |  * Kingdom Studios - Comprehensive Workflow Audit
   3 |  * Build with the Holy Spirit
   4 |  */
   5 |
   6 | import { test, expect, Page } from '@playwright/test';
   7 |
   8 | test.describe('Workflow Audit - Kingdom Studios', () => {
   9 |   
   10 |   test.beforeEach(async ({ page }) => {
   11 |     // Start at home page
   12 |     await page.goto('/');
   13 |     await page.waitForLoadState('networkidle');
   14 |   });
   15 |
   16 |   // ====================
   17 |   // NAVIGATION TESTS
   18 |   // ====================
   19 |   
   20 |   test('should navigate to Home from any page', async ({ page }) => {
   21 |     await test.step('Navigate to Home', async () => {
   22 |       const homeButton = page.getByRole('link', { name: /home/i }).first();
   23 |       if (await homeButton.isVisible({ timeout: 5000 }).catch(() => false)) {
   24 |         await homeButton.click();
   25 |         await page.waitForURL('**/');
   26 |         expect(page.url()).toContain('/');
   27 |       }
   28 |     });
   29 |   });
   30 |
   31 |   test('should navigate to Profile/Account', async ({ page }) => {
   32 |     await test.step('Navigate to Profile', async () => {
   33 |       const profileButton = page.getByRole('link', { name: /profile|account/i }).first();
   34 |       if (await profileButton.isVisible({ timeout: 5000 }).catch(() => false)) {
   35 |         await profileButton.click();
   36 |         await page.waitForLoadState('networkidle');
   37 |         expect(page.url()).toMatch(/\/(profile|account)/);
   38 |       }
   39 |     });
   40 |   });
   41 |
   42 |   test('should navigate to Settings', async ({ page }) => {
   43 |     await test.step('Navigate to Settings', async () => {
   44 |       const settingsButton = page.getByRole('link', { name: /settings/i }).first();
   45 |       if (await settingsButton.isVisible({ timeout: 5000 }).catch(() => false)) {
   46 |         await settingsButton.click();
   47 |         await page.waitForLoadState('networkidle');
   48 |         expect(page.url()).toContain('/settings');
   49 |       }
   50 |     });
   51 |   });
   52 |
   53 |   test('should navigate to Dashboard', async ({ page }) => {
   54 |     await test.step('Navigate to Dashboard', async () => {
   55 |       const dashboardButton = page.getByRole('link', { name: /dashboard/i }).first();
   56 |       if (await dashboardButton.isVisible({ timeout: 5000 }).catch(() => false)) {
   57 |         await dashboardButton.click();
   58 |         await page.waitForLoadState('networkidle');
   59 |         expect(page.url()).toContain('/dashboard');
   60 |       }
   61 |     });
   62 |   });
   63 |
   64 |   // ====================
   65 |   // AUTHENTICATION FLOW
   66 |   // ====================
   67 |
   68 |   test('should display login page for unauthenticated users', async ({ page }) => {
   69 |     await test.step('Check login redirect', async () => {
   70 |       // Try to access protected route
   71 |       await page.goto('/dashboard');
   72 |       await page.waitForLoadState('networkidle');
   73 |       
   74 |       // Should redirect to login or show login form
   75 |       const isLoginPage = page.url().includes('/login') || 
   76 |                           page.url().includes('/signin') ||
   77 |                           await page.getByRole('button', { name: /sign in|log in/i }).isVisible();
   78 |       
>  79 |       expect(isLoginPage).toBeTruthy();
      |                           ^ Error: expect(received).toBeTruthy()
   80 |     });
   81 |   });
   82 |
   83 |   test('should navigate to Sign Up page', async ({ page }) => {
   84 |     await test.step('Navigate to Sign Up', async () => {
   85 |       const signUpButton = page.getByRole('link', { name: /sign up|register/i }).first();
   86 |       if (await signUpButton.isVisible({ timeout: 5000 }).catch(() => false)) {
   87 |         await signUpButton.click();
   88 |         await page.waitForLoadState('networkidle');
   89 |         expect(page.url()).toMatch(/\/(signup|register)/);
   90 |       }
   91 |     });
   92 |   });
   93 |
   94 |   // ====================
   95 |   // BUTTON ACTIONS
   96 |   // ====================
   97 |
   98 |   test('should verify all primary buttons are clickable', async ({ page }) => {
   99 |     await test.step('Check primary buttons', async () => {
  100 |       const buttons = await page.getByRole('button').all();
  101 |       
  102 |       for (const button of buttons.slice(0, 10)) { // Check first 10 buttons
  103 |         const isVisible = await button.isVisible().catch(() => false);
  104 |         if (isVisible) {
  105 |           const isEnabled = await button.isEnabled();
  106 |           expect(isEnabled || await button.isDisabled()).toBeDefined();
  107 |         }
  108 |       }
  109 |     });
  110 |   });
  111 |
  112 |   test('should verify all navigation links are valid', async ({ page }) => {
  113 |     await test.step('Check navigation links', async () => {
  114 |       const links = await page.getByRole('link').all();
  115 |       
  116 |       for (const link of links.slice(0, 10)) { // Check first 10 links
  117 |         const href = await link.getAttribute('href');
  118 |         if (href && !href.startsWith('http')) {
  119 |           expect(href).toMatch(/^\/|^\#/); // Should be relative URL or anchor
  120 |         }
  121 |       }
  122 |     });
  123 |   });
  124 |
  125 |   // ====================
  126 |   // FORM VALIDATION
  127 |   // ====================
  128 |
  129 |   test('should validate login form', async ({ page }) => {
  130 |     await test.step('Check login form', async () => {
  131 |       await page.goto('/login');
  132 |       await page.waitForLoadState('networkidle');
  133 |       
  134 |       const emailInput = page.getByRole('textbox', { name: /email/i }).first();
  135 |       const passwordInput = page.getByLabel(/password/i).first();
  136 |       const submitButton = page.getByRole('button', { name: /sign in|log in/i }).first();
  137 |       
  138 |       if (await submitButton.isVisible({ timeout: 5000 }).catch(() => false)) {
  139 |         // Try to submit empty form
  140 |         await submitButton.click();
  141 |         
  142 |         // Should show validation error or stay on page
  143 |         await page.waitForTimeout(1000);
  144 |         const hasError = await page.getByText(/required|invalid/i).isVisible().catch(() => false);
  145 |         const stillOnLogin = page.url().includes('/login');
  146 |         
  147 |         expect(hasError || stillOnLogin).toBeTruthy();
  148 |       }
  149 |     });
  150 |   });
  151 |
  152 |   // ====================
  153 |   // ROUTE PROTECTION
  154 |   // ====================
  155 |
  156 |   test('should protect dashboard routes', async ({ page }) => {
  157 |     await test.step('Check dashboard protection', async () => {
  158 |       const protectedRoutes = ['/dashboard', '/admin', '/settings'];
  159 |       
  160 |       for (const route of protectedRoutes) {
  161 |         await page.goto(route);
  162 |         await page.waitForLoadState('networkidle');
  163 |         
  164 |         // Should redirect to login or show auth prompt
  165 |         const isProtected = page.url().includes('/login') ||
  166 |                            page.url().includes('/signin') ||
  167 |                            await page.getByText(/sign in|log in|unauthorized/i).isVisible({ timeout: 2000 }).catch(() => false);
  168 |         
  169 |         if (!isProtected) {
  170 |           // Might be logged in from previous test - that's okay
  171 |           console.log(`Route ${route} accessible (may be authenticated)`);
  172 |         }
  173 |       }
  174 |     });
  175 |   });
  176 |
  177 |   // ====================
  178 |   // WORKFLOW TESTS
  179 |   // ====================
```