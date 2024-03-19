import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import {
  Links, Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import styles from '~/tailwind.css?url';
import { Toaster } from "./components/ui/toaster";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { ClerkApp, ClerkErrorBoundary } from '@clerk/remix';
import { frFR } from '@clerk/localizations';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles }
];

export const loader: LoaderFunction = (args) => rootAuthLoader(args, { publishableKey: process.env.CLERK_PUBLISHABLE_KEY, secretKey: process.env.CLERK_SECRET_KEY })

export const ErrorBoundary = ClerkErrorBoundary()

function App() {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <Toaster />
      </body>
    </html>
  );
}

export default ClerkApp(App, { localization: frFR, appearance: { variables: { colorPrimary: '#7c3aed' } } })