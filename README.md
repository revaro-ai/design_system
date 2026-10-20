# Revaro React design system

Revaro's design system: semantic light and dark tokens, the Rubik and Pyidaungsu fonts, and focused React components on Base UI and Tailwind CSS v4. Version 2 is the "Counter" look (see [brand guidance](README-brand.md) and `revaro_frontend/docs/specs/2026-10-20-counter-redesign.md`).

## Use

Install React 19, Tailwind v4, `@base-ui/react` and `tailwind-merge` in the consuming app. Next.js consumers use `transpilePackages: ["@revaro/design-system"]` so these source exports compile with the app.

```css
@import "tailwindcss";
@import "@revaro/design-system/styles.css";
```

```tsx
import { Button, buttonClasses } from "@revaro/design-system/components/button";
import { Field, Input } from "@revaro/design-system/components/field";

<Field id="product-name" label="Product name" error={error}>
  <Input name="name" defaultValue={name} />
</Field>
<Button type="submit" variant="primary" disabled={pending}>Save</Button>
<Link href="/stock" className={buttonClasses()}>Stock</Link>
```

`Button` defaults to `type="button"`; always set `type="submit"` for form actions. Native input props, refs, names and values are forwarded. `Field` requires a stable `id`, has one input child, and associates its label, description and error. Client callers can create the id with `useId`; server callers pass their own id. Card, Badge, Alert, Skeleton, Table, MoneyText, Thumbnail and EmptyState are server-compatible. Keep dictionary labels, photo proxy URLs and stock thresholds in the app.

Menu, Dialog, Switch and ThemeScope have explicit client subpaths. Menus and dialogs compose their triggers with Base UI's `render` API. Put the signed-in workspace inside `<ThemeScope theme={account.theme}>` alongside its `data-theme` container: portaled content receives the same theme. Dialog accepts controlled `open`/`onOpenChange` or `defaultOpen`; Menu and Switch follow Base UI's keyboard behavior. Switch supports `name`, `value`, `defaultChecked` and controlled `checked`/`onCheckedChange`; it submits its hidden input in native FormData. Put forms inside a menu popup when their submit controls are portaled, as the account sign-out menu does.

Native selects, checkboxes and route/filter buttons remain native where sufficient. There are no unused custom Select/Checkbox/Tabs wrappers and no client barrel.

## Tokens

`tokens/tokens.json` owns the palette/type/spacing values. Run `npm run build:react-tokens` in this directory after editing tokens and include generated `styles/tokens.css`. Semantic Tailwind utilities reference runtime theme variables; dark follows the account attribute, while signed-out pages stay light. Fonts and their OFL licenses are under `assets/Fonts`.

## Distribution and compatibility

This repository is the source of truth for the React package. Consumers use `styles.css` and the focused component subpaths; `tokens.json` is exported for tools. Version 2.0.0 removed the legacy CSS layer (`tailwind.css`, `tokens.css`, `bundle.css`) and the HTML gallery: the Revaro app was their only consumer.

The package remains private and installs through GitHub, as before. Pin consumers to a reviewed full commit SHA rather than a moving branch:

```sh
npm install 'github:revaro-ai/design_system#<full-commit-sha>'
```

For Next.js, add `transpilePackages: ["@revaro/design-system"]`. The package intentionally ships TSX source; there is no client barrel. Styles include Tailwind source discovery for the package components and relative font paths.

## Verify

Run `npm run build` to regenerate `styles/tokens.css` from `tokens/tokens.json`; CI fails if the committed file differs. `npm pack --dry-run` verifies distribution contents. The consuming Revaro app has lint, typecheck, helper tests and a Playwright fixture matrix for English/Burmese, light/dark and phone/desktop. Its clean Docker production build verifies source compilation and standalone CSS/font assets. The app's development-only design preview is not a production route.
