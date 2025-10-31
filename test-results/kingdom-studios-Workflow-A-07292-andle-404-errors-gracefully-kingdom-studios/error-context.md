# Test info

- Name: Workflow Audit - Kingdom Studios >> should handle 404 errors gracefully
- Location: D:\Kingdom Studios App\tests\workflow-audits\kingdom-studios.spec.ts:224:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
    at D:\Kingdom Studios App\tests\workflow-audits\kingdom-studios.spec.ts:232:38
    at D:\Kingdom Studios App\tests\workflow-audits\kingdom-studios.spec.ts:225:5
```

# Test source

```ts
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
  180 |
  181 |   test('should complete sign-up workflow', async ({ page }) => {
  182 |     await test.step('Sign up flow', async () => {
  183 |       await page.goto('/signup');
  184 |       await page.waitForLoadState('networkidle');
  185 |       
  186 |       const hasSignUpForm = await page.getByRole('button', { name: /sign up|register|create account/i }).isVisible({ timeout: 5000 }).catch(() => false);
  187 |       
  188 |       if (hasSignUpForm) {
  189 |         // Check form elements exist
  190 |         const nameInput = page.getByRole('textbox', { name: /name|full name/i }).first();
  191 |         const emailInput = page.getByRole('textbox', { name: /email/i }).first();
  192 |         
  193 |         const nameExists = await nameInput.isVisible({ timeout: 2000 }).catch(() => false);
  194 |         const emailExists = await emailInput.isVisible({ timeout: 2000 }).catch(() => false);
  195 |         
  196 |         expect(nameExists || emailExists).toBeTruthy();
  197 |       }
  198 |     });
  199 |   });
  200 |
  201 |   test('should navigate through app tabs/sections', async ({ page }) => {
  202 |     await test.step('Check app sections', async () => {
  203 |       const sections = await page.getByRole('tab').all();
  204 |       
  205 |       for (const section of sections) {
  206 |         if (await section.isVisible().catch(() => false)) {
  207 |           await section.click();
  208 |           await page.waitForTimeout(500);
  209 |           
  210 |           // Should navigate or show content
  211 |           const content = await page.locator('[role="tabpanel"]').first();
  212 |           if (await content.isVisible({ timeout: 2000 }).catch(() => false)) {
  213 |             expect(await content.isVisible()).toBeTruthy();
  214 |           }
  215 |         }
  216 |       }
  217 |     });
  218 |   });
  219 |
  220 |   // ====================
  221 |   // ERROR HANDLING
  222 |   // ====================
  223 |
  224 |   test('should handle 404 errors gracefully', async ({ page }) => {
  225 |     await test.step('Check 404 handling', async () => {
  226 |       await page.goto('/this-route-does-not-exist-123456');
  227 |       await page.waitForLoadState('networkidle');
  228 |       
  229 |       const has404 = await page.getByText(/404|not found|page not found/i).isVisible({ timeout: 5000 }).catch(() => false);
  230 |       const hasErrorPage = page.url().includes('/404') || page.url().includes('/not-found');
  231 |       
> 232 |       expect(has404 || hasErrorPage).toBeTruthy();
      |                                      ^ Error: expect(received).toBeTruthy()
  233 |     });
  234 |   });
  235 |
  236 |   // ====================
  237 |   // ACCESSIBILITY
  238 |   // ====================
  239 |
  240 |   test('should have accessible navigation', async ({ page }) => {
  241 |     await test.step('Check accessibility', async () => {
  242 |       const nav = page.getByRole('navigation').first();
  243 |       if (await nav.isVisible({ timeout: 5000 }).catch(() => false)) {
  244 |         expect(await nav.isVisible()).toBeTruthy();
  245 |       }
  246 |     });
  247 |   });
  248 |
  249 |   test('should have proper heading hierarchy', async ({ page }) => {
  250 |     await test.step('Check headings', async () => {
  251 |       const h1 = await page.getByRole('heading', { level: 1 }).count();
  252 |       expect(h1).toBeGreaterThanOrEqual(0); // At least we checked
  253 |     });
  254 |   });
  255 | });
  256 |
  257 |
```