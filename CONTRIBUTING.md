# Contributing to KING DESIGNER

Thank you for your interest in contributing to KING DESIGNER! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Report issues responsibly
- Support fellow contributors

## Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/aa2100/KING-DESIGNER-.git
   cd KING-DESIGNER-
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Make your changes**
   ```bash
   # Edit files
   # Run tests
   pnpm run test
   # Format code
   pnpm run format
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

## Commit Message Guidelines

Follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/modifications
- `chore:` Build, CI, dependencies

### Examples
```
feat(profile): add profile verification UI
fix(messages): resolve message ordering issue
docs(readme): update installation steps
test(posts): add like interaction tests
```

## Pull Request Process

1. **Update your branch**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run full test suite**
   ```bash
   pnpm run check
   pnpm run test
   pnpm run format
   ```

3. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Use descriptive title
   - Link related issues
   - Describe changes and rationale
   - Include screenshots for UI changes

5. **Address review feedback**
   - Respond to comments
   - Make requested changes
   - Push updates

## Coding Standards

### TypeScript
- Use strict TypeScript mode
- Define explicit return types
- Avoid `any` types
- Use proper error handling

```typescript
// Good
function getUserProfile(id: string): Promise<UserProfile | null> {
  try {
    return fetchProfile(id);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return null;
  }
}

// Avoid
function getUserProfile(id) {
  return fetchProfile(id);
}
```

### React Components
- Use functional components
- Implement proper prop typing
- Avoid prop drilling (use context)
- Memoize when appropriate

```typescript
interface ProfileCardProps {
  userId: string;
  onFollow?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ userId, onFollow }) => {
  // Component implementation
};
```

### Styling
- Use TailwindCSS utilities
- Follow responsive design patterns
- Support RTL layout
- Maintain accessibility

```typescript
<div className="flex flex-col gap-4 p-4 md:flex-row md:gap-6">
  {/* Content */}
</div>
```

### Testing
- Write tests for new features
- Maintain >80% code coverage
- Test edge cases
- Mock external dependencies

```typescript
describe('ProfileCard', () => {
  it('should display user profile correctly', () => {
    render(<ProfileCard userId="123" />);
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
  });
});
```

## Performance Optimization

- Lazy load components
- Optimize images
- Minimize bundle size
- Use React Query for data fetching
- Implement proper caching

```typescript
const ProfileCard = lazy(() => import('./ProfileCard'));

export function ProfileList() {
  const { data } = useQuery({
    queryKey: ['profiles'],
    queryFn: fetchProfiles,
    staleTime: 5 * 60 * 1000,
  });
}
```

## Accessibility

- Use semantic HTML
- Add proper ARIA labels
- Ensure keyboard navigation
- Test with screen readers
- Maintain proper color contrast

```typescript
<button aria-label="Delete profile" onClick={handleDelete}>
  <TrashIcon />
</button>
```

## Documentation

- Update README for significant changes
- Add JSDoc comments for functions
- Document complex logic
- Update CHANGELOG

```typescript
/**
 * Fetches user profile by ID
 * @param userId - The unique identifier for the user
 * @returns Promise containing the user profile or null if not found
 * @throws Error if the fetch fails
 */
function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  // Implementation
}
```

## Testing Checklist

Before submitting PR:

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] No TypeScript errors
- [ ] Code formatted with Prettier
- [ ] No console errors/warnings
- [ ] Responsive on mobile/tablet
- [ ] Accessibility check
- [ ] Performance check

## Reporting Issues

### Bug Reports

Include:
- Clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details
- Screenshots/recordings if applicable

### Feature Requests

Include:
- Clear description of the feature
- Use case/motivation
- Proposed solution
- Any alternatives considered

## Questions?

- Check existing issues/PRs
- Review documentation
- Ask in discussions
- Contact maintainers

---

Thank you for contributing! 🎉
