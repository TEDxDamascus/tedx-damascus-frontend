# Contributing to TEDx Damascus Frontend

Thank you for contributing to the TEDx Damascus website and dashboard!

## 🌿 Branch Structure

- `main` - Production branch (protected)
- `development` - Integration branch for testing
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Urgent production fixes

## 🚀 Development Workflow

### 1. Create a Feature Branch

Always branch from `development`:
```bash
git checkout development
git pull origin development
git checkout -b feature/your-feature-name
```

**Branch Naming Convention:**
- Features: `feature/add-speaker-page`
- Bug fixes: `bugfix/fix-navigation-menu`
- Hotfixes: `hotfix/fix-broken-link`

### 2. Make Your Changes

- Write clean, readable code
- Follow Next.js best practices
- Test your changes locally
- Keep commits atomic and meaningful

**Commit Message Format:**
```
type: brief description

Detailed explanation (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat: add speaker registration form
fix: resolve mobile menu overlay issue
docs: update README with setup instructions
```

### 3. Push and Create Pull Request
```bash
git add .
git commit -m "feat: add speaker bio section"
git push origin feature/your-feature-name
```

Then on GitHub:
1. Go to the repository
2. Click **Pull Request**
3. Set base to `development`
4. Fill in the PR template
5. Request review from team members

### 4. Pull Request Guidelines

**Your PR should:**
- Have a clear title and description
- Reference any related issues (#issue-number)
- Include screenshots for UI changes
- Pass all checks (if CI/CD is set up)
- Be reviewed by at least 1 team member

**PR Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Refactoring

## Screenshots (if applicable)
Add screenshots here

## Testing
How did you test these changes?

## Related Issues
Closes #123
```

### 5. Code Review Process

- Address all review comments
- Make requested changes in new commits
- Re-request review when ready
- Merge only after approval

### 6. Merging

**To Development:**
- Squash and merge is preferred
- Delete branch after merge

**To Main (Production):**
- Only merge from `development`
- Requires admin approval
- Create a release tag

## 📋 Code Standards

### Next.js Project Structure
```
/website
  /app or /pages
  /components
  /styles
  /public
  
/dashboard
  /app or /pages
  /components
  /styles
```

### Component Guidelines
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript when possible
- Follow naming conventions: `PascalCase` for components

### Styling
- Use CSS Modules or Tailwind CSS
- Keep styles modular
- Ensure responsive design

## 🚫 Never Commit

- Environment files (`.env*`)
- API keys or secrets
- `node_modules/`
- Build folders (`/.next`, `/out`)
- IDE configs (`.vscode/`, `.idea/`)

## 🆘 Getting Help

- Ask in team chat
- Tag reviewers in PR comments
- Check existing issues and PRs

## 📱 Contact

For questions about contributing, contact the development team lead.

---

Happy coding! 🎉
