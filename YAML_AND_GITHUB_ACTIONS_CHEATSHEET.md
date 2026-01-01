# YAML & GitHub Actions CI/CD Cheat Sheet

## Table of Contents

1. [YAML Overview](#yaml-overview)
2. [YAML Basics](#yaml-basics)
3. [YAML Use Cases](#yaml-use-cases)
4. [GitHub Actions CI/CD Cheat Sheet](#github-actions-cicd-cheat-sheet)
5. [Project Pipeline Documentation](#project-pipeline-documentation)
6. [Common CI/CD Pipeline Enhancements](#common-cicd-pipeline-enhancements)
7. [Interview Questions](#interview-questions)

---

## YAML Overview

### Full Form

**YAML Ain't Markup Language** (recursive acronym)

- Originally stood for "Yet Another Markup Language"
- Now it's a recursive acronym: "YAML Ain't Markup Language"

### Why YAML is Used

1. **Human-Readable**: Easy to read and write, even for non-programmers
2. **Minimal Syntax**: Uses indentation (spaces/tabs) instead of brackets or tags
3. **Data Structures**: Supports scalars, arrays, lists, and key-value pairs
4. **Language-Agnostic**: Works across many programming languages and tools
5. **Comments**: Supports comments with `#` symbol
6. **Multi-line Strings**: Easy to handle long text blocks

### Key Characteristics

- **Indentation-sensitive**: Uses spaces (typically 2) for nesting
- **Case-sensitive**: `Name` and `name` are different
- **No tabs**: Use spaces only (YAML parsers may reject tabs)
- **Key-value pairs**: `key: value`
- **Lists**: Use `-` for array items

---

## YAML Basics

### Basic Syntax

```yaml
# Scalar values
name: John Doe
age: 30
is_active: true
price: 99.99

# Strings (quotes optional unless needed)
message: Hello World
quoted: "String with: special characters"

# Lists/Arrays
fruits:
  - apple
  - banana
  - orange

# Or inline
fruits: [apple, banana, orange]

# Objects/Maps
person:
  name: John
  age: 30
  city: New York

# Nested structures
company:
  name: Tech Corp
  employees:
    - name: Alice
      role: Developer
    - name: Bob
      role: Designer
  address:
    street: 123 Main St
    city: San Francisco
    zip: 94102

# Multi-line strings
description: |
  This is a multi-line
  string that preserves
  line breaks

# Folded strings (single line)
summary: >
  This is a folded
  string that converts
  newlines to spaces

# Null values
middle_name: null
# or
middle_name: ~

# Booleans
is_active: true
is_deleted: false
# Also accepted: yes, no, on, off

# Numbers
integer: 42
float: 3.14
scientific: 1.2e+10

# Anchors and Aliases (reusability)
# Anchors (&) and Aliases (*) in YAML allow you to define a reusable chunk (anchor), then reference it elsewhere (alias).
# This avoids repeating common settings, making files easier to maintain.

# Here, &defaults sets up common database connection fields (adapter and host).
defaults: &defaults
  adapter: postgres
  host: localhost

# The 'development' and 'production' sections inherit everything from *defaults
# using the merge key (<<: *defaults), but override the 'database' field for their environment.
development:
  <<: *defaults
  database: dev_db

production:
  <<: *defaults
  database: prod_db

# Result:
# - 'development' expands to: adapter: postgres, host: localhost, database: dev_db
# - 'production' expands to: adapter: postgres, host: localhost, database: prod_db
```

---

## YAML Use Cases

### 1. Configuration Files

- Application configs (database, API keys, settings)
- Server configurations
- Build tool configs (webpack, babel, etc.)

### 2. DevOps & CI/CD

- **GitHub Actions** workflows (`.github/workflows/*.yml`)
- **GitLab CI** (`.gitlab-ci.yml`)
- **Jenkins** pipelines
- **Ansible** playbooks
- **Terraform** variables

### 3. Container Orchestration

- **Docker Compose** (`docker-compose.yml`)
- **Kubernetes** manifests (deployments, services, configmaps)
- **Helm** charts

### 4. API Documentation

- **OpenAPI/Swagger** specifications
- API schema definitions

### 5. Data Serialization

- Alternative to JSON/XML for config files
- Logging configurations
- Test data files

### 6. Infrastructure as Code

- **CloudFormation** templates (AWS)
- **Azure Resource Manager** templates
- **Ansible** inventory files

---

## GitHub Actions CI/CD Cheat Sheet

### Basic Workflow Structure

```yaml
name: CI/CD Pipeline

# When workflow runs
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  # The 'schedule' trigger tells GitHub Actions to run this workflow automatically on a recurring basis, based on the given cron syntax.
  # In this example, it triggers the workflow every day at midnight (00:00 UTC).
  # Developers use this for tasks like daily builds, regular tests, backups, dependency updates, or any maintenance jobs that should run on a schedule,
  # regardless of whether there is new code activity.

  schedule:
    - cron: "0 0 * * *" # Runs daily at midnight UTC
  workflow_dispatch: # Manual trigger

# Environment variables available to all jobs
env:
  NODE_VERSION: "18.x"
  DATABASE_URL: ${{ secrets.DATABASE_URL }}

# Jobs run in parallel by default
jobs:
  build:
    runs-on: ubuntu-latest # Most workflows use 'ubuntu-latest' because it is fast, widely supported, open-source, matches most production Linux environments, and has the broadest compatibility with available GitHub Actions and tooling. Other runners (windows-latest, macos-latest) are used only if you specifically need those OSs.

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/
```

### Most Used Actions

```yaml
# Checkout repository
- uses: actions/checkout@v3

# Setup Node.js
- uses: actions/setup-node@v3
  with:
    node-version: "18.x"
    cache: "npm"

# Setup Python
- uses: actions/setup-python@v4
  with:
    python-version: "3.11"
    cache: "pip"

# Setup Docker Buildx
- uses: docker/setup-buildx-action@v2

# Login to Docker Hub
- uses: docker/login-action@v2
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}

# Deploy to AWS
- uses: aws-actions/configure-aws-credentials@v2
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1
```

### Common Workflow Patterns

#### 1. Matrix Strategy (Multiple OS/Node Versions)

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [16.x, 18.x, 20.x]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm test
```

#### 2. Conditional Steps

```yaml
steps:
  - name: Deploy to staging
    if: github.ref == 'refs/heads/develop'
    run: npm run deploy:staging

  - name: Deploy to production
    if: github.ref == 'refs/heads/main'
    run: npm run deploy:prod
```

#### 3. Job Dependencies

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build

  test:
    needs: build # Wait for build to complete
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  deploy:
    needs: [build, test] # Wait for both
    runs-on: ubuntu-latest
    steps:
      - run: npm run deploy
```

#### 4. Caching Dependencies

```yaml
steps:
  - uses: actions/checkout@v3

  - name: Cache node modules
    uses: actions/cache@v3
    with:
      path: ~/.npm
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-

  - run: npm ci
```

#### 5. Environment Variables & Secrets

```yaml
env:
  NODE_ENV: production

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production # Environment protection rules
    steps:
      - name: Use secret
        run: |
          echo "API Key: ${{ secrets.API_KEY }}"
          echo "Token: ${{ secrets.DEPLOY_TOKEN }}"
```

#### 6. Artifacts (Upload/Download)

```yaml
jobs:
  build:
    steps:
      - name: Build
        run: npm run build

      - name: Upload build
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
          retention-days: 7

  deploy:
    needs: build
    steps:
      - name: Download build
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/

      - name: Deploy
        run: ./deploy.sh
```

#### 7. Docker Build & Push

```yaml
jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            user/app:latest
            user/app:${{ github.sha }}
```

#### 8. Notifications

```yaml
steps:
  - name: Notify on failure
    if: failure()
    uses: 8398a7/action-slack@v3
    with:
      status: ${{ job.status }}
      text: "Build failed!"
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Context Variables (Most Used)

```yaml
# Repository info
${{ github.repository }}          # owner/repo
${{ github.ref }}                 # refs/heads/main
${{ github.sha }}                 # Commit SHA
${{ github.event_name }}          # push, pull_request, etc.

# PR info (only in PR events)
${{ github.event.pull_request.number }}
${{ github.event.pull_request.head.sha }}

# Workflow info
${{ github.workflow }}
${{ github.run_id }}
${{ github.run_number }}

# Actor
${{ github.actor }}               # Username who triggered
${{ github.event.pull_request.user.login }}

# Branch name
${{ github.ref_name }}            # main, develop, etc.
${{ github.head_ref }}            # PR branch name

# Secrets
${{ secrets.SECRET_NAME }}

# Environment variables
${{ env.VAR_NAME }}
${{ vars.VAR_NAME }}              # Repository variables
```

### Workflow Triggers

```yaml
on:
  # Push to branches
  push:
    branches: [main, develop]
    tags: ["v*"]
    paths:
      - "src/**"
      - "package.json"

  # Pull requests
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]

  # Manual trigger
  workflow_dispatch:
    inputs:
      environment:
        description: "Environment to deploy"
        required: true
        default: "staging"
        type: choice
        options:
          - staging
          - production

  # Scheduled (cron)
  schedule:
    - cron: "0 0 * * *" # Every day at midnight UTC
    - cron: "0 */6 * * *" # Every 6 hours

  # Other events
  release:
    types: [published]
  issues:
    types: [opened, labeled]
  repository_dispatch:
```

### Common Commands & Patterns

```yaml
# Run commands in different shells
- name: Run script
  shell: bash
  run: |
    echo "Multi-line"
    echo "Commands"

# Set output for other steps
- name: Set output
  id: vars
  run: |
    echo "version=1.0.0" >> $GITHUB_OUTPUT
    echo "timestamp=$(date)" >> $GITHUB_OUTPUT

- name: Use output
  run: echo "Version: ${{ steps.vars.outputs.version }}"

# Working directory
- name: Run in directory
  working-directory: ./frontend
  run: npm install

# Continue on error
- name: May fail
  continue-on-error: true
  run: npm run risky-command

# Timeout
- name: Long running
  timeout-minutes: 30
  run: npm run long-test
```

### Best Practices

1. **Use specific action versions**: `@v3` instead of `@main`
2. **Cache dependencies**: Speed up workflows
3. **Use matrix for multiple versions**: Test across environments
4. **Store secrets properly**: Never hardcode credentials
5. **Use environment protection**: Protect production deployments
6. **Fail fast**: Use `continue-on-error` sparingly
7. **Clean up artifacts**: Set retention periods
8. **Use reusable workflows**: DRY principle
9. **Pin Node.js versions**: Avoid breaking changes
10. **Use `npm ci`**: Faster, more reliable than `npm install`

---

## Project Pipeline Documentation

### Current Pipeline: `.github/workflows/pipeline.yaml`

Our current CI pipeline is a basic setup that runs on every push to the `main` branch. Let's break down what each part does:

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v5

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20.x"

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test
```

#### Line-by-Line Explanation

1. **`name: CI Pipeline`**

   - Workflow name shown in GitHub Actions UI

2. **`on: push: branches: [main]`**

   - Triggers on pushes to `main`
   - Runs automatically on each push

3. **`jobs: build:`**

   - Defines a job named "build"
   - Jobs run in parallel by default

4. **`runs-on: ubuntu-latest`**

   - Runs on GitHub-hosted Ubuntu runner
   - Alternatives: `windows-latest`, `macos-latest`

5. **`steps:`** - Individual actions in sequence:
   - **Checkout code**: Gets repository code
   - **Set up Node.js**: Installs Node.js 20.x
   - **Install dependencies**: Runs `npm install`
   - **Run tests**: Executes test suite

#### What This Pipeline Does

✅ Checks out code from repository  
✅ Sets up Node.js environment (v20.x)  
✅ Installs project dependencies  
✅ Runs test suite

#### Current Limitations

❌ No caching (slower builds)  
❌ No linting/formatting checks  
❌ No security scanning  
❌ No build step  
❌ No deployment  
❌ Only runs on `main` branch (not PRs)  
❌ Uses `npm install` instead of `npm ci`

---

## Common CI/CD Pipeline Enhancements

Developers typically add these features to make pipelines more robust, secure, and efficient:

### 1. **Linting & Code Quality**

```yaml
- name: Run ESLint
  run: npm run lint
  # or
  run: npx eslint .

- name: Check code formatting
  run: npm run format:check
  # or
  run: npx prettier --check .
```

### 2. **Dependency Caching**

```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

- name: Install dependencies
  run: npm ci # Faster than npm install
```

### 3. **Security Scanning**

```yaml
- name: Run security audit
  run: npm audit --audit-level=moderate

- name: Check for vulnerabilities
  run: npm audit --production

# Or use dedicated security tools
- name: Snyk security scan
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### 4. **Build Step**

```yaml
- name: Build application
  run: npm run build
  env:
    NODE_ENV: production

- name: Verify build artifacts
  run: |
    test -d dist || exit 1
    echo "Build successful"
```

### 5. **Code Coverage**

```yaml
- name: Run tests with coverage
  run: npm run test:coverage

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
    flags: unittests
```

### 6. **Pull Request Support**

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]
```

### 7. **Environment Variables**

```yaml
env:
  NODE_ENV: test
  CI: true

jobs:
  build:
    env:
      DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
    steps:
      - name: Run tests
        env:
          API_KEY: ${{ secrets.API_KEY }}
        run: npm test
```

### 8. **Matrix Testing (Multiple Node Versions)**

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x, 22.x]
    os: [ubuntu-latest, windows-latest]
steps:
  - uses: actions/setup-node@v3
    with:
      node-version: ${{ matrix.node-version }}
```

### 9. **Artifact Management**

```yaml
- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: test-results
    path: test-results/
    retention-days: 7

- name: Upload build artifacts
  uses: actions/upload-artifact@v3
  with:
    name: dist
    path: dist/
```

### 10. **Conditional Steps**

```yaml
- name: Deploy to staging
  if: github.ref == 'refs/heads/develop'
  run: npm run deploy:staging

- name: Deploy to production
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  run: npm run deploy:prod
```

### 11. **Database Setup (for Integration Tests)**

```yaml
services:
  mongodb:
    image: mongo:7
    ports:
      - 27017:27017
    options: >-
      --health-cmd "mongosh --eval 'db.runCommand({ ping: 1 })'"
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5

steps:
  - name: Run integration tests
    env:
      MONGODB_URI: mongodb://localhost:27017/test
    run: npm run test:integration
```

### 12. **Notifications**

```yaml
- name: Notify on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: "Build failed on ${{ github.ref }}"
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

- name: Notify on success
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: "Build succeeded! 🎉"
```

### 13. **Docker Build & Push**

```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v2

- name: Login to Docker Hub
  uses: docker/login-action@v2
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}

- name: Build and push Docker image
  uses: docker/build-push-action@v4
  with:
    context: .
    push: ${{ github.event_name != 'pull_request' }}
    tags: |
      user/app:${{ github.sha }}
      user/app:latest
```

### 14. **Deployment Steps**

```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.ORG_ID }}
    vercel-project-id: ${{ secrets.PROJECT_ID }}

# Or deploy to AWS
- name: Deploy to AWS
  uses: aws-actions/configure-aws-credentials@v2
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1

- name: Deploy
  run: |
    aws s3 sync dist/ s3://my-bucket/
    aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"
```

### 15. **Job Dependencies & Parallel Execution**

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm test

  build:
    needs: [lint, test] # Wait for both
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run build

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: npm run deploy
```

### 16. **Timeout & Resource Limits**

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - name: Long running test
        timeout-minutes: 15
        run: npm run test:integration
```

### 17. **Manual Workflow Dispatch**

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: "Deployment environment"
        required: true
        type: choice
        options:
          - staging
          - production
      version:
        description: "Version to deploy"
        required: false
        type: string

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: |
          echo "Deploying to ${{ inputs.environment }}"
          echo "Version: ${{ inputs.version }}"
```

### 18. **Path-Based Triggers**

```yaml
on:
  push:
    branches: [main]
    paths:
      - "src/**"
      - "package.json"
      - ".github/workflows/**"
    paths-ignore:
      - "**.md"
      - "docs/**"
```

### 19. **Concurrency Control**

```yaml
concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: true # Cancel previous runs

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: npm run deploy
```

### 20. **Error Handling & Cleanup**

```yaml
- name: Setup
  run: npm install

- name: Run tests
  run: npm test

- name: Cleanup on failure
  if: failure()
  run: |
    echo "Tests failed, cleaning up..."
    # Cleanup logic here

- name: Always cleanup
  if: always()
  run: |
    echo "Cleaning up resources..."
    # Always runs regardless of success/failure
```

### Enhanced Pipeline Example

Here's what a more complete pipeline might look like for this project:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: "20.x"

jobs:
  lint:
    name: Code Quality Checks
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v5

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint || npx eslint .

      - name: Check code formatting
        run: npx prettier --check . || echo "No prettier config"

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:7
        ports:
          - 27017:27017
        options: >-
          --health-cmd "mongosh --eval 'db.runCommand({ ping: 1 })'"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v5

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        env:
          MONGODB_URI: mongodb://localhost:27017/test
          NODE_ENV: test
        run: npm test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
          retention-days: 7

  security:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v5

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run security audit
        run: npm audit --audit-level=moderate
        continue-on-error: true

  build:
    name: Build Application
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v5

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build || echo "No build script"

      - name: Upload build artifacts
        if: success()
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: |
            dist/
            build/
          retention-days: 7

  deploy:
    name: Deploy to Production
    needs: [build]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://your-app.com
    steps:
      - name: Checkout code
        uses: actions/checkout@v5

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files

      - name: Deploy
        run: |
          echo "Deploying to production..."
          # Add your deployment commands here
          # Example: npm run deploy
```

### Key Improvements in Enhanced Pipeline

✅ **Separate jobs** for lint, test, security, build, deploy  
✅ **Caching** for faster builds  
✅ **Pull request support**  
✅ **MongoDB service** for integration tests  
✅ **Security scanning**  
✅ **Artifact management**  
✅ **Job dependencies** (build waits for lint/test)  
✅ **Conditional deployment** (only on main branch)  
✅ **Environment protection** for production  
✅ **Error handling** with `continue-on-error` and `if: always()`

---

## Interview Questions

### YAML Questions

**Q: What does YAML stand for?**

- YAML Ain't Markup Language (recursive acronym)

**Q: Why use YAML over JSON?**

- More human-readable
- Supports comments
- Better for configuration files
- Multi-line strings are easier

**Q: What are common YAML pitfalls?**

- Indentation errors (must use spaces, not tabs)
- Incorrect boolean values (true/false vs yes/no)
- Forgetting quotes for special characters

**Q: Where is YAML commonly used?**

- CI/CD pipelines (GitHub Actions, GitLab CI)
- Docker Compose
- Kubernetes manifests
- Configuration files
- Infrastructure as Code

### GitHub Actions Questions

**Q: How do you trigger a workflow manually?**

```yaml
on:
  workflow_dispatch:
```

**Q: How do you share data between jobs?**

- Use artifacts (`upload-artifact` / `download-artifact`)
- Use job outputs
- Use environment variables

**Q: How do you run jobs in parallel vs sequentially?**

- Parallel: Jobs run simultaneously by default
- Sequential: Use `needs` keyword

```yaml
job2:
  needs: job1 # Waits for job1
```

**Q: How do you cache dependencies?**

```yaml
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

**Q: How do you access secrets?**

```yaml
${{ secrets.SECRET_NAME }}
```

**Q: What's the difference between `github.ref` and `github.ref_name`?**

- `github.ref`: Full ref path (`refs/heads/main`)
- `github.ref_name`: Short name (`main`)

**Q: How do you test on multiple Node.js versions?**

```yaml
strategy:
  matrix:
    node-version: [16.x, 18.x, 20.x]
```

**Q: How do you conditionally run steps?**

```yaml
- name: Deploy
  if: github.ref == 'refs/heads/main'
  run: npm run deploy
```

**Q: What are GitHub Actions artifacts?**

- Files created during workflow that can be shared between jobs
- Uploaded with `upload-artifact`, downloaded with `download-artifact`

**Q: How do you handle workflow failures?**

- Use `continue-on-error: true` for non-critical steps
- Use `if: failure()` for cleanup steps
- Use `if: always()` to run regardless of status

**Q: What's the difference between `on.push` and `on.pull_request`?**

- `on.push`: Triggers on pushes to branches
- `on.pull_request`: Triggers on PR events (opened, closed, etc.)

**Q: How do you deploy only on specific branches?**

```yaml
- name: Deploy
  if: github.ref == 'refs/heads/main'
  run: npm run deploy
```

**Q: What is a matrix strategy?**

- Runs the same job with different configurations (OS, versions, etc.)
- Useful for testing across multiple environments

**Q: How do you set environment variables?**

```yaml
env:
  NODE_ENV: production
# Or per step
- name: Step
  env:
    API_KEY: ${{ secrets.API_KEY }}
  run: echo $API_KEY
```

**Q: What are reusable workflows?**

- Workflows that can be called from other workflows
- Defined with `workflow_call` trigger
- Promotes DRY (Don't Repeat Yourself) principle

---

## Quick Reference

### YAML Syntax Cheat Sheet

```yaml
# Key-value
key: value

# List
items:
  - item1
  - item2

# Object
person:
  name: John
  age: 30

# Multi-line
text: |
  Line 1
  Line 2

# Comments
# This is a comment
```

### GitHub Actions Quick Reference

```yaml
# Triggers
on: [push, pull_request]
on:
  push:
    branches: [main]

# Jobs
jobs:
  job-name:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: command

# Context
${{ github.sha }}
${{ secrets.NAME }}
${{ env.VAR }}

# Conditions
if: github.ref == 'refs/heads/main'
if: failure()
if: success()
```

---

**Last Updated**: 2024
**Purpose**: Quick reference for YAML and GitHub Actions CI/CD
