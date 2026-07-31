<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:front-end-rules -->

# Front-End Coding Rules (always apply)

## Stack

Next.js + TypeScript, Tailwind CSS + Shadcn/Radix, Zustand, TanStack Query, React Hook Form + Zod, Jest + RTL.

## Architecture: Feature-Sliced Design

```
app → src/views → src/widgets → src/features → src/entities → src/shared
```

- Lower layers MUST NOT import from upper layers. No cross-imports within the same layer.
- Exception: global/shared features (e.g. `LanguageSwitcher`, `ThemeSwitcher`, modals) may be imported into views/widgets — intentional, not a violation.

## File Convention — closed set, ask before adding a new suffix

Atomic components, ~100 lines/file target (exceptions: config, generated, barrel files). Only add per-component files when complexity warrants it — a simple view/component can be a single `.tsx`.

- `.tsx` — view/render only, no business logic
- `.conf.ts` — business logic hook `useXConfig`. Over ~100 lines → split into a `hooks/` subfolder (e.g. `ProgramBasicsForm/hooks/useProgramBasicsForm.ts`), not one giant `.conf.ts`
- `.utils.ts` — pure utility functions. Over ~100 lines → split into a `lib/` subfolder
- `.types.ts` — type definitions (`type` over `interface` unless extension is needed)
- `.constants.ts` — constants only, NEVER i18n strings (see i18n below)
- `.schema.ts` — Zod schemas only. Never `.validation.ts`, never Yup/Formik
- `index.ts` — barrel export
- `*.test.ts(x)` / `__tests__/mocks/*.mock.ts` — standard test files
- Do NOT invent a new suffix (`.styled.ts`, `.helpers.ts`, `.model.ts`, etc.) without asking the user first.

## Styling

Tailwind classNames + `cva()` (class-variance-authority) + `cn()` (`src/shared/lib/styles/cn.ts`). No MUI, no `styled()`, no `.styled.ts` files.

## i18n

next-intl `useTranslations()` (client) / `getTranslations()` (server) reading `i18n/messages/{locale}/*.json`. Never a `.constants.ts` "i18n object".

## Validation

Zod only, via `.schema.ts` (`createXSchema(...)`), bridged with `@hookform/resolvers` `zodResolver`. Never Yup/Formik.

## Code Style

- Early returns over nested conditionals
- Functional style: pure functions, immutable transforms (map/filter/reduce), no class components
- Import order: React → third-party → `@/` aliases → relative. Combine same-module imports
- Event handlers prefixed `handle`: `handleClick`, `handleKeyDown`
- Components: `export const ComponentName: React.FC<Props> = (...) => { ... }`
- NO `any`, NO `as` type assertions — use generics, discriminated unions, `unknown` + type guards
- Comments only for non-obvious intent or business rules

## Principles

SOLID, KISS, YAGNI, DRY — write smart, scalable code. Dumb components (render only, logic in `.conf.ts`). No todos/placeholders — finish what you start.

## Testing

Jest + RTL is configured; proactively write tests for new/changed logic (hooks, utils, schemas) even though none exist yet — don't wait for precedent. Priority: business logic → hooks → component behavior → pure rendering. `userEvent` over `fireEvent`. Tests in `__tests__/` or colocated `*.test.ts(x)`. Mocks in `__tests__/mocks/*.mock.ts` via factory functions (`createMockX(overrides)`). Target 80% coverage.

## Accessibility (WCAG 2.2 AA)

Semantic HTML, proper heading hierarchy, landmarks. Keyboard-operable, visible focus indicators. Every input has an explicit label; errors via `aria-describedby`/`aria-live`. 4.5:1 text contrast, 3:1 for UI elements. Min touch target 24×24px. Never color-only meaning.

## Commits (Conventional Commits)

`<type>: <description>`, imperative mood, no period, ≤72 chars. Types: feat, fix, refactor, perf, style, test, docs, build, ci, chore, revert.

<!-- END:front-end-rules -->
