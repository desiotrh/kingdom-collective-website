# 👑 Kingdom Collective Developer Manifesto — Create with Purpose. Share with Authority. Build What Matters.

## PURPOSE

This is a non-negotiable, repo-level standard. Apply it to ALL work (websites, apps, services, content). Use it to plan, code, review, QA, and gate releases. Fail any item = block release and propose concrete fixes.

## OPERATING PRINCIPLES (Scripture + Culture)

- **Proverbs 27:12** — Security is stewardship.
- **Psalm 150:6** — Accessibility includes everyone.
- **Colossians 3:23** — Performance honors the user's time.
- **Proverbs 24:3** — Architecture by wisdom and understanding.
- **1 Corinthians 14:40** — Design in order and clarity.
- **Matthew 5:14** — SEO/visibility with purpose.
- **Romans 12:17** — Legal + data honesty.
- **Habakkuk 2:2** — Ship only what's made plain and tested.
- **Luke 16:10** — Maintain faithfully.
- **Psalm 127:1** — Dedicate work to God; refuse corner-cutting.

---

## MANDATORY CHECKLIST (PASS ALL BEFORE MERGE/DEPLOY)

### 1) SECURITY — Built in Integrity

**Network & Transport Security**

- [ ] Enforce HTTPS + HSTS preload; security headers (CSP, X-Frame-Options, HSTS)
- [ ] Subresource Integrity (SRI) for CDN scripts and styles
- [ ] WAF/CDN firewall (Cloudflare, Vercel protection enabled)

**Secrets Management**

- [ ] Secrets in env/vault (Vercel/Netlify env vars, never in .env committed to repo)
- [ ] Consider HashiCorp Vault or AWS Secrets Manager for production
- [ ] Rotate API keys and credentials quarterly
- [ ] Never log secrets (use redaction tools like bunyan)
- [ ] Git secrets scanning with gitleaks or git-secrets (required in CI)
- [ ] Audit secret access logs monthly

**Data Protection**

- [ ] bcrypt/argon2 for passwords; AES-256 for sensitive DB fields
- [ ] Database encryption at rest (cloud provider managed keys)
- [ ] Input validation/sanitization; CSRF/XSS/SQLi protections
- [ ] Secure cookies (HttpOnly, SameSite, Secure)

**Access Control**

- [ ] MFA on admin accounts (required, no exceptions)
- [ ] Principle of least privilege for all services
- [ ] API key rotation policy documented and enforced
- [ ] Rate limiting per endpoint; test bypass attempts
- [ ] Rate limit headers exposed (X-RateLimit-Limit, X-RateLimit-Remaining)

**Dependency & Supply Chain Security**

- [ ] Dependency scans: npm audit + Snyk or Socket.dev (required in CI)
- [ ] Dependabot or Renovate bot for automated updates
- [ ] Lockfile verification in CI (npm ci --audit)
- [ ] Audit new dependencies before adding (research, license check)
- [ ] SBOM (Software Bill of Materials) generation for compliance
- [ ] Verify package signatures when available

**Security Testing & Audits**

- [ ] OWASP ZAP audit for penetration testing
- [ ] Automated security tests in CI (header checks, SSL verification)
- [ ] Code reviews via CODEOWNERS (required for all PRs)
- [ ] Annual third-party security audit for production apps
- [ ] Real-time logs/alerts (Sentry, CloudWatch, or similar)

### 2) ACCESSIBILITY — Designed for All

**Design-Phase Accessibility**

- [ ] Figma plugins: Stark, A11y - Color Contrast Checker
- [ ] Design system tokens include WCAG-compliant color pairs (≥4.5:1 contrast)
- [ ] Accessibility annotations in Figma handoff to developers
- [ ] Designer training on WCAG 2.2 AA/AAA requirements

**Code-Level Accessibility**

- [ ] WCAG 2.2 AA minimum (aim for AAA where possible)
- [ ] Alt text on all images (descriptive, not decorative)
- [ ] Proper h1–h6 hierarchy (logical structure, no skipped levels)
- [ ] Full keyboard access; ARIA roles/labels; visible focus states
- [ ] Labels on all inputs; "skip to content" link on every page
- [ ] Captions + transcripts for video/audio media

**Testing & Validation**

- [ ] Honor prefers-reduced-motion in CSS
- [ ] Screen reader audit (VoiceOver/NVDA/JAWS tested)
- [ ] Automated accessibility testing with axe-core in CI
- [ ] Lighthouse accessibility score ≥ 90
- [ ] Color contrast verification automated (axe, pa11y)
- [ ] Keyboard navigation tested on all interactive elements

### 3) PERFORMANCE — Excellence in Motion

**Asset Optimization**

- [ ] Images via CDN as WebP/AVIF; lazy-load below-the-fold media
- [ ] Minify CSS/JS/HTML in production builds
- [ ] Image compression and sizing (responsive images with srcset)
- [ ] SVG optimization (SVGO) for icons and graphics

**Loading Strategy**

- [ ] Preload critical CSS/fonts; defer non-critical JS
- [ ] Code-split JS bundles per route
- [ ] HTTP/3 + edge caching (Vercel, Cloudflare, or CDN)
- [ ] Resource hints: dns-prefetch, preconnect for third-party domains

**Performance Budgets (Enforced in CI)**

- [ ] Total JS bundle: ≤ 250 KB gzipped per route
- [ ] Total CSS: ≤ 50 KB gzipped
- [ ] Images per page: ≤ 500 KB total
- [ ] Fonts: ≤ 100 KB total (WOFF2 format)
- [ ] First Contentful Paint (FCP): ≤ 1.5s
- [ ] Largest Contentful Paint (LCP): ≤ 2.5s
- [ ] Time to Interactive (TTI): ≤ 3.5s
- [ ] Cumulative Layout Shift (CLS): ≤ 0.1
- [ ] First Input Delay (FID): ≤ 100ms

**Monitoring & Metrics**

- [ ] TTFB < 500 ms measured and monitored
- [ ] Lighthouse ≥ 90 on all categories (performance, a11y, best practices, SEO)
- [ ] Core Web Vitals tracked in production (Vercel Analytics, Cloudflare, or RUM)
- [ ] Bundle size monitoring with bundlesize or @next/bundle-analyzer
- [ ] Block deploys that exceed performance budgets

### 4) CODE QUALITY & ARCHITECTURE — Stewardship in Structure

**Type Safety & Linting**

- [ ] TypeScript everywhere with strict mode enabled
- [ ] ESLint + Prettier configured and enforced
- [ ] TSDoc/JSDoc enforcement in ESLint for public APIs
- [ ] No `any` types without explicit justification in PR

**Testing Standards**

- [ ] Unit tests (Jest, Vitest) for business logic
- [ ] Integration tests for API endpoints and data flows
- [ ] E2E tests (Playwright, Cypress) for critical user paths
- [ ] Minimum 80% code coverage for critical paths
- [ ] Code coverage reports in CI (Codecov, Coveralls, or built-in)
- [ ] Block PRs that decrease coverage below threshold

**Git Workflow & Commit Standards**

- [ ] Git hooks with Husky (pre-commit, pre-push, commit-msg)
- [ ] Pre-commit: ESLint, Prettier, type checking
- [ ] Pre-push: Unit tests, build verification
- [ ] Commit-msg: Conventional Commits enforcement (commitlint)
- [ ] Semantic versioning + Conventional Commits for changelog generation
- [ ] Never skip hooks (--no-verify) unless approved by lead

**API Documentation & Testing**

- [ ] OpenAPI/Swagger spec for REST APIs (auto-generated preferred)
- [ ] Postman collections for all API endpoints
- [ ] Newman for automated API tests in CI
- [ ] Contract testing with Pact or similar for microservices
- [ ] API load testing with k6 or Artillery
- [ ] GraphQL: Query performance and depth limiting tested

**Code Quality Metrics**

- [ ] SonarQube, Code Climate, or similar for quality tracking
- [ ] Maintainability rating of A or B required
- [ ] Track and reduce technical debt
- [ ] Code smell detection and remediation
- [ ] Cyclomatic complexity limits enforced

**Architecture & Documentation**

- [ ] Modular, scalable structure (feature-based or domain-driven)
- [ ] Architecture Decision Records (ADRs) for major decisions
- [ ] Auto-generated API docs from code (TypeDoc, Docusaurus)
- [ ] Living documentation (update docs in same PR as code)
- [ ] Runbook for common operations (deployment, rollback, debugging)
- [ ] PR peer review required (minimum 1 approval, ideally 2)

### 5) DESIGN & UX — Beauty with Purpose

**Design System**

- [ ] Single source of truth design system (Figma + Storybook/Ladle)
- [ ] Tokenized colors, typography, spacing, and shadows
- [ ] Component library with variants and states documented
- [ ] Design system versioning synced with code releases

**Responsive & Adaptive Design**

- [ ] Responsive across devices (mobile, tablet, desktop, large screens)
- [ ] Accessible font sizes (≥16px base, fluid typography)
- [ ] Touch-friendly targets (≥44px for mobile)
- [ ] Purposeful micro-interactions with performance consideration
- [ ] Dark mode support (if applicable to brand)

**Visual QA & Testing**

- [ ] Visual regression testing: Percy, Chromatic, or BackstopJS
- [ ] Screenshot comparisons on every PR to main branch
- [ ] Test across multiple viewports and browsers
- [ ] Cross-browser QA: Chrome, Firefox, Safari, Edge
- [ ] BrowserStack or similar for device testing

**User Experience**

- [ ] Clear conversion flow (analyze funnel metrics)
- [ ] Custom 404, 500, and maintenance pages
- [ ] Loading states and skeleton screens
- [ ] Error states with helpful messages and recovery paths
- [ ] Empty states with calls-to-action
- [ ] UX copy aligned with Faith Mode / Marketplace Mode tone
- [ ] User feedback mechanisms (surveys, feedback widgets)

### 6) SEO & DISCOVERABILITY — Seen with Purpose

**Technical SEO**

- [ ] Per-page unique title and meta description
- [ ] sitemap.xml (auto-generated, submitted to search engines)
- [ ] robots.txt with proper directives
- [ ] Canonical URLs on all pages
- [ ] Clean URL structure (semantic, no unnecessary parameters)
- [ ] SSL certificate (HTTPS everywhere)

**Structured Data & Social**

- [ ] JSON-LD schema: Organization, WebSite, Product, Article, etc.
- [ ] Open Graph tags (og:title, og:description, og:image, og:type)
- [ ] Twitter Cards (twitter:card, twitter:title, twitter:image)
- [ ] Dynamic OG image generation for social sharing
- [ ] Schema validation with Google Rich Results Test

**Internationalization & Performance**

- [ ] hreflang tags for multi-language content (if applicable)
- [ ] Core Web Vitals tracked and optimized (LCP, FID, CLS)
- [ ] Mobile-first indexing compliance
- [ ] Page speed optimization (target Lighthouse SEO ≥ 90)

**Content & Discoverability**

- [ ] Semantic HTML (proper heading hierarchy, landmarks)
- [ ] Image alt text optimization (descriptive, keyword-aware)
- [ ] Internal linking strategy
- [ ] 404 error handling with helpful navigation
- [ ] XML sitemap submitted to Google Search Console, Bing Webmaster Tools

### 7) LEGAL & ETHICAL COMPLIANCE — Honoring Truth

**Privacy Regulations**

- [ ] GDPR compliance (EU users)
- [ ] CCPA compliance (California residents)
- [ ] ADA compliance (accessibility as legal requirement)
- [ ] Privacy Policy visible and accessible (footer link, easy to find)
- [ ] Terms of Service clearly stated
- [ ] Disclaimer/Legal notices where applicable

**Consent & Tracking**

- [ ] Cookie consent banner (required before non-essential tracking)
- [ ] Opt-in tracking (no tracking before consent)
- [ ] Granular consent options (necessary, analytics, marketing)
- [ ] Honor Do Not Track (DNT) headers
- [ ] Respect prefers-reduced-data browser preference

**Privacy-First Analytics**

- [ ] Prefer Plausible, Fathom, or Vercel Analytics over Google Analytics
- [ ] Anonymous analytics where possible (no PII collection)
- [ ] GDPR-compliant data processing agreements with third parties
- [ ] No third-party tracking pixels without explicit consent
- [ ] Clear opt-out mechanisms for all tracking

**Data Management**

- [ ] Data retention policy documented and enforced
- [ ] Right-to-be-Forgotten API endpoints (/api/user/delete-account)
- [ ] User data export functionality (GDPR Article 20)
- [ ] Clear data-use disclosures in contracts and privacy policy
- [ ] Encryption for data in transit and at rest

**Third-Party Integrations**

- [ ] Audit all third-party scripts and services
- [ ] Verify GDPR/CCPA compliance of vendors
- [ ] Signed Data Processing Agreements (DPAs) with vendors
- [ ] Regular review of third-party access and permissions
- [ ] Subprocessor list maintained and disclosed

### 8) DEPLOYMENT & LAUNCH — Released in Excellence

**Pre-Launch QA**

- [ ] Cross-browser testing: Chrome, Firefox, Safari, Edge (latest 2 versions)
- [ ] Device testing: Mobile (iOS, Android), Tablet, Desktop
- [ ] DNS configuration verified (A records, CNAMEs, nameservers)
- [ ] SSL certificate installed and auto-renewal configured
- [ ] Security headers verified in production environment

**CI/CD Pipeline**

- [ ] Automated CI/CD with GitHub Actions, Vercel, or Netlify
- [ ] All tests pass before deploy (unit, integration, E2E)
- [ ] Lighthouse CI runs and meets thresholds
- [ ] Bundle size checks and performance budgets enforced
- [ ] No HIGH or CRITICAL security vulnerabilities
- [ ] Automated deployment to staging before production

**Monitoring & Observability**

- [ ] Error tracking: Sentry (required, configured before launch)
- [ ] Uptime monitoring: UptimeRobot, Better Uptime, or Vercel (≥99.9% SLA)
- [ ] Real User Monitoring (RUM): Vercel Analytics, Cloudflare, or similar
- [ ] Log aggregation: Consider LogRocket for session replay
- [ ] Status page: Atlassian Statuspage or similar (optional but recommended)
- [ ] Alert channels: Slack/Discord webhooks for critical issues
- [ ] Performance monitoring: Core Web Vitals tracked in production

**Backup & Recovery**

- [ ] Database backups automated (daily minimum, retention policy defined)
- [ ] Backup verification: Test restore process monthly
- [ ] Rollback plan documented and tested
- [ ] Disaster recovery runbook prepared
- [ ] Failover strategy for critical services

**Feature Management**

- [ ] Feature flags system: LaunchDarkly, Flagsmith, or env-based
- [ ] Gradual rollouts capability (1% → 10% → 50% → 100%)
- [ ] Kill switch for problematic features
- [ ] A/B testing capability for UX experiments
- [ ] Feature adoption metrics tracked

**Launch Protocol**

- [ ] Client handoff documentation prepared
- [ ] Training session completed (for client-managed sites)
- [ ] Password manager setup (1Password, Bitwarden) with shared vault
- [ ] Credentials documented securely (no plaintext emails)
- [ ] DNS propagation verified globally
- [ ] Final smoke test on production URL
- [ ] Final prayer/dedication before go-live
- [ ] Post-launch monitoring for first 48 hours

### 9) MAINTENANCE & ACCOUNTABILITY — Faithful Stewardship

**Backup & Recovery**

- [ ] Automated daily database backups (retention: 30 days minimum)
- [ ] Weekly full system backups (code, assets, configs)
- [ ] Backup verification: Test restore monthly, document results
- [ ] Off-site backup storage (different provider/region from primary)
- [ ] Backup encryption and access controls

**Database Management**

- [ ] Migration system: Prisma Migrate, Knex, TypeORM, or similar
- [ ] Database schema versioning and change tracking
- [ ] Query performance monitoring (pg_stat_statements for Postgres)
- [ ] Connection pooling: PgBouncer, PgPool, or cloud-managed
- [ ] Index optimization and query analysis
- [ ] Database encryption at rest (cloud provider managed keys)

**Dependency Management**

- [ ] Dependabot or Renovate bot enabled and configured
- [ ] Weekly dependency update reviews
- [ ] Automated security patches for LOW/MODERATE vulnerabilities
- [ ] Manual review required for MAJOR version updates
- [ ] Unused dependency detection (depcheck) quarterly
- [ ] License compliance monitoring

**Monitoring & Analytics**

- [ ] Error tracking: Sentry or similar (required)
- [ ] User analytics: Plausible, Fathom, or Vercel Analytics
- [ ] Heatmaps/session recordings: Hotjar, LogRocket (optional)
- [ ] Uptime monitoring with alerts
- [ ] Performance monitoring: Core Web Vitals
- [ ] User feedback loop: surveys, feedback widgets

**Audit Schedule**

- [ ] Quarterly security audits (dependencies, headers, penetration testing)
- [ ] Quarterly performance audits (Lighthouse, bundle size, Core Web Vitals)
- [ ] Quarterly accessibility audits (axe, WAVE, manual screen reader testing)
- [ ] Quarterly SEO audits (rankings, indexing, schema validation)
- [ ] Annual comprehensive third-party security audit

**Version Control & Releases**

- [ ] Semantic versioning (MAJOR.MINOR.PATCH)
- [ ] Git tags for releases
- [ ] CHANGELOG.md maintained (conventional-changelog)
- [ ] Release notes published (GitHub Releases)
- [ ] Version tracking in application (footer, API response headers)

**Post-Launch Review**

- [ ] Post-launch thanksgiving session within 48 hours
- [ ] Retrospective within 1 week (what went well, what to improve)
- [ ] Document lessons learned
- [ ] Update runbooks based on launch experience
- [ ] Celebrate wins with team

### 10) SPIRITUAL CULTURE — Built with the Holy Spirit

- [ ] Dedicate project at start; begin milestones with prayer
- [ ] Maintain peace, integrity, and gratitude; refuse shortcuts; end with thanks

---

## AUTOMATED AUDIT ROUTINE

When the user types: **"run kingdom audit"** or **"kc:audit"**, do ALL of the following on the current repo:

### 1. Generate Checklist Report

- Check all 10 categories above with PASS/FAIL per bullet
- Score each category (0-100)
- Calculate overall repository score
- Flag critical blockers (must fix before deploy)

### 2. Run Programmatic Checks

**Security Checks**

- [ ] npm audit (block on HIGH/CRITICAL vulnerabilities)
- [ ] Snyk or Socket.dev scan (if configured)
- [ ] gitleaks secret scanning (block if secrets found)
- [ ] Security headers verification (CSP, HSTS, X-Frame-Options, etc.)
- [ ] SSL/TLS configuration check
- [ ] SBOM generation and vulnerability report

**Code Quality Checks**

- [ ] ESLint (all projects)
- [ ] Prettier formatting verification
- [ ] TypeScript tsc --noEmit (strict type checking)
- [ ] Unit test suite (Jest/Vitest)
- [ ] Code coverage report (flag if <80%)
- [ ] Integration tests
- [ ] E2E tests (Playwright/Cypress)
- [ ] Unused dependencies (depcheck)
- [ ] Code quality metrics (SonarQube/Code Climate if configured)

**Performance Checks**

- [ ] Lighthouse CI on key routes (performance, a11y, SEO, best practices)
- [ ] Bundle size analysis (flag routes >250KB gzipped)
- [ ] Performance budget compliance (bundlesize)
- [ ] Core Web Vitals thresholds (LCP, FID, CLS)
- [ ] Image optimization verification
- [ ] Asset minification verification

**Accessibility Checks**

- [ ] axe-core automated accessibility scan
- [ ] pa11y accessibility testing
- [ ] Color contrast verification (≥4.5:1)
- [ ] Keyboard navigation verification
- [ ] ARIA label completeness
- [ ] Heading hierarchy validation
- [ ] Lighthouse accessibility score (≥90)

**SEO Checks**

- [ ] sitemap.xml presence and validity
- [ ] robots.txt presence and configuration
- [ ] Canonical URL implementation
- [ ] Meta tags (title, description) on all pages
- [ ] Open Graph tags validation
- [ ] JSON-LD schema validation (Google Rich Results Test)
- [ ] Lighthouse SEO score (≥90)

**Visual & UI Checks**

- [ ] Visual regression tests (Percy/Chromatic if configured)
- [ ] Screenshot comparisons across viewports
- [ ] Storybook build verification (if present)
- [ ] Component visual consistency

**API & Integration Checks**

- [ ] API contract tests (Postman/Newman if configured)
- [ ] OpenAPI spec validation
- [ ] API load testing results (k6/Artillery if configured)
- [ ] GraphQL query depth limiting
- [ ] Rate limiting verification

**Dependency & Supply Chain**

- [ ] Dependency vulnerability scan (all workspaces)
- [ ] License compliance check
- [ ] Outdated dependencies report
- [ ] Lockfile integrity verification
- [ ] Package signature verification

**Database & Infrastructure**

- [ ] Database migration verification
- [ ] Backup system status check
- [ ] Connection pooling configuration
- [ ] Query performance analysis (if applicable)

### 3. Generate Detailed Findings

**For each FAIL:**

- Provide exact code location (file, line numbers)
- Propose specific diffs or code changes
- Include code snippets showing before/after
- Explain why it fails and impact of not fixing
- Suggest priority level (High/Med/Low)

### 4. Output Comprehensive Report

**Generate `./KINGDOM_AUDIT.md` containing:**

**Executive Summary**

- Overall score (0-100) with visual indicator
- Score per category (10 categories)
- Critical blockers list (must fix before deploy)
- High priority items count
- Medium priority items count
- Low priority items count

**Detailed Category Analysis**
For each of 10 categories:

- Score and status (PASSING, NEEDS ATTENTION, FAILING, EXCELLENT)
- ✅ Passing items (with verification notes)
- ❌ Failing items (with exact locations)
- Recommended fixes (numbered, with code examples)
- Priority assignment (High/Med/Low)

**Security Vulnerability Report**

- CVE numbers and severity levels
- Affected packages and versions
- Fix commands
- Workarounds if no fix available

**Performance Report**

- Lighthouse scores (all categories, all tested routes)
- Bundle size breakdown by route
- Core Web Vitals measurements
- Performance budget compliance
- Recommendations for optimization

**Code Coverage Report**

- Overall coverage percentage
- Coverage by file/module
- Uncovered critical paths
- Recommendations to improve coverage

**Visual Regression Report**

- Changed components/pages
- Screenshot comparisons
- Breaking changes flagged

**Action Plan**

- Week 1: Critical items (security, SEO, performance blockers)
- Week 2: High priority items
- Week 3: Medium priority items
- Week 4: Documentation and tooling
- Ongoing: Maintenance and monitoring

**Prayer of Dedication**

- Opening prayer for the improvement work
- Scripture reference (Psalm 127:1)
- Team commitment declaration

**Next Steps**

- Review checklist
- Create GitHub issues (one per fix)
- Assign owners and priorities
- Schedule sprint planning
- Hold dedication prayer
- Begin implementation

---

## MERGE GATE

Before allowing any "ready to deploy" recommendation, confirm ALL of the following:

### Required Checks (All Must Pass)

- [ ] All mandatory checklist items marked PASS (or waived with written rationale + risk + mitigation date)
- [ ] No HIGH or CRITICAL security vulnerabilities
- [ ] No secrets detected in codebase (gitleaks scan passed)
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code coverage ≥ 80% for critical paths
- [ ] TypeScript compilation successful (no errors)
- [ ] ESLint passed (no errors, warnings acceptable if documented)
- [ ] Lighthouse all categories ≥ 90 (performance, a11y, best practices, SEO)
- [ ] WCAG 2.2 AA compliance verified (axe-core passed)
- [ ] Performance budgets met (bundle size, Core Web Vitals)
- [ ] Visual regression tests passed (no unexpected UI changes)
- [ ] API contract tests passed (if applicable)

### Code Review Requirements

- [ ] Minimum 1 approval from CODEOWNERS
- [ ] 2 approvals for security-sensitive changes
- [ ] All PR comments resolved or explicitly deferred
- [ ] No merge conflicts with target branch

### Documentation Requirements

- [ ] README updated (if public API changed)
- [ ] CHANGELOG.md entry added (if versioned release)
- [ ] API documentation updated (if endpoints changed)
- [ ] Architecture Decision Record (ADR) created for major changes

### Pre-Production Checklist

- [ ] Staging deployment successful
- [ ] Smoke tests passed on staging
- [ ] Database migrations tested (if applicable)
- [ ] Environment variables configured
- [ ] Rollback plan documented

### Client Handoff (if applicable)

- [ ] Training materials prepared
- [ ] Password manager populated (1Password, Bitwarden)
- [ ] Credentials documented securely
- [ ] Support documentation provided
- [ ] Handoff meeting scheduled

### Spiritual Preparation

- [ ] Final prayer/dedication completed
- [ ] Team alignment on release
- [ ] Thanksgiving planned for post-launch

---

## DEFAULT BEHAVIOR

- Apply this standard to every task unless the user writes: **"override kingdom rule: \<reason\>"**
- If any conflict arises between speed and excellence, choose excellence and propose phased delivery

---

## SCAFFOLD CONFIGS

If not present, scaffold minimal configs for the following tools. Use existing repo setups where possible. For missing tools, propose configuration files and installation commands.

### Security & Secrets

- [ ] `.github/dependabot.yml` - Automated dependency updates
- [ ] `.github/CODEOWNERS` - Required code reviewers
- [ ] `.gitleaksignore` or `.gitleaks.toml` - Secret scanning config
- [ ] Snyk or Socket.dev integration (if budget allows)

### Code Quality

- [ ] `eslint.config.js` or `.eslintrc.js` - Linting rules
- [ ] `.prettierrc` - Code formatting
- [ ] `tsconfig.json` - TypeScript configuration (strict mode)
- [ ] `.husky/` - Git hooks directory
  - `pre-commit` - ESLint, Prettier, type check
  - `pre-push` - Unit tests, build verification
  - `commit-msg` - Commitlint (Conventional Commits)
- [ ] `commitlint.config.js` - Commit message standards
- [ ] `jest.config.js` or `vitest.config.ts` - Test configuration
- [ ] `playwright.config.ts` or `cypress.config.ts` - E2E tests

### Performance

- [ ] `.lighthouserc.json` - Lighthouse CI thresholds
- [ ] `.bundlesizerc` or `bundlesize` in package.json - Bundle limits
- [ ] Performance budgets in Lighthouse config
- [ ] `next.config.js` with bundle analyzer (Next.js)
- [ ] `vite.config.ts` with bundle analyzer (Vite)

### Accessibility

- [ ] `.axe.yml` or axe config in test files
- [ ] `pa11y.config.js` - Automated a11y testing
- [ ] Accessibility test suite in E2E tests

### Visual Testing

- [ ] `.percy.yml` or Percy config (if using Percy)
- [ ] `.chromatic.json` or Chromatic config (if using Chromatic)
- [ ] `backstop.json` (if using BackstopJS)
- [ ] Storybook configuration (`.storybook/`)

### API Testing

- [ ] Postman collection exports in `postman/` or `api-tests/`
- [ ] Newman configuration for CI
- [ ] OpenAPI/Swagger spec in `docs/api/openapi.yaml`
- [ ] k6 or Artillery scripts in `performance/`

### CI/CD

- [ ] `.github/workflows/ci.yml` - Main CI pipeline
- [ ] `.github/workflows/lighthouse.yml` - Performance testing
- [ ] `.github/workflows/security.yml` - Security scans
- [ ] `.github/workflows/quarterly-audit.yml` - Scheduled audits
- [ ] `vercel.json` or `netlify.toml` - Deployment config

### Monitoring & Observability

- [ ] `sentry.client.config.js` - Frontend error tracking
- [ ] `sentry.server.config.js` - Backend error tracking
- [ ] Health check endpoint (`/api/health`)
- [ ] Status page configuration (if using Statuspage.io)

### Documentation

- [ ] `CHANGELOG.md` - Version history
- [ ] `CONTRIBUTING.md` - Contribution guidelines
- [ ] `docs/ADRs/` - Architecture Decision Records directory
- [ ] `docs/ROLLBACK_PROCEDURE.md` - Emergency procedures
- [ ] `docs/RUNBOOK.md` - Operational procedures
- [ ] API documentation (auto-generated from code)

### Database

- [ ] Database migration files directory (`migrations/`, `prisma/`, etc.)
- [ ] Seed data scripts (`seeds/`)
- [ ] Database connection pooling config
- [ ] Query performance monitoring setup

### Version Control

- [ ] `.gitignore` - Comprehensive ignore patterns
- [ ] `.gitattributes` - Line ending and diff settings
- [ ] `.nvmrc` or `.node-version` - Node.js version
- [ ] `.editorconfig` - Editor consistency

### Dependency Management

- [ ] `package.json` with proper scripts and metadata
- [ ] `package-lock.json` or `yarn.lock` or `pnpm-lock.yaml`
- [ ] Workspace configuration (if monorepo)
- [ ] License file (`LICENSE`)

---

### Configuration Priority

**Phase 1: Foundation (Week 1)**

1. ESLint + Prettier + TypeScript
2. Husky + Commitlint
3. Jest/Vitest for testing
4. Basic CI/CD workflow

**Phase 2: Quality (Week 2)** 5. Lighthouse CI 6. axe-core accessibility 7. Dependabot 8. CODEOWNERS

**Phase 3: Advanced (Week 3)** 9. Sentry error tracking 10. Visual regression testing 11. API testing (Postman/Newman) 12. Performance budgets

**Phase 4: Comprehensive (Week 4)** 13. gitleaks secret scanning 14. OpenAPI documentation 15. Quarterly audit workflow 16. Advanced monitoring

---

**Note**: Do NOT introduce external accounts without authorization. Use existing services (Vercel, GitHub, etc.) where possible. For paid services (Sentry, Percy, BrowserStack), propose free tiers first or discuss with stakeholder.

---

**Kingdom Collective** — Building digital products with purpose, integrity, and excellence.
