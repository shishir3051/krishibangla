# Security Policy

## Supported versions

Only the latest code on the `master` branch (the deployed site) receives security fixes.

## Reporting a vulnerability

Please report security issues **privately** through GitHub: open the repository's **Security** tab and choose **Report a vulnerability**. Do not open a public issue for security problems.

Please include what you found, how to reproduce it, and the impact you expect. You can expect an acknowledgement within a week; we will keep you updated while a fix is prepared and credit you if you wish.

## How the site handles secrets and data

- API keys are read only from environment variables on the server (`GEMINI_API_KEY`, optional Upstash credentials). None are shipped to the browser, and `.env*` files are git-ignored (except `.env.example`).
- Older commits contained hardcoded API keys. Those keys have been removed from the code and must be treated as compromised: revoke them at the provider.
- The AI endpoints (`/api/chat`, `/api/detect`) validate input size and type and are rate limited per IP (shared via Upstash Redis in production).
- AI replies are rendered as markdown without raw HTML.
- Photos sent to the disease scan and chat messages are forwarded to Google Gemini to generate a reply; KrishiBangla does not store them.
- No accounts, cookies for tracking, or personal data are collected. The only cookie is `NEXT_LOCALE`, which remembers your language choice; the theme choice is kept in your browser's local storage.
