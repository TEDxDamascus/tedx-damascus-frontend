import { redirect } from 'next/navigation';

// ApiClient's 401 handler (lib/api/generic-api-service.ts) hard-redirects to
// this bare, non-locale-prefixed path. Routes here live under [locale], so
// this shell just forwards to the default-locale login page, same pattern
// as the root app/page.tsx redirect to /en/home.
export default function RootLoginPage() {
    redirect('/en/login');
}
