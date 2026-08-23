# Rayn Admin Website

Rayn Admin is the Next.js + Firebase website and content-management application for the Rayn public site.

## Includes

- Public Rayn homepage plus About and Contact pages
- Live Firestore-backed site theme
- Multi-page content editor with sections and publish state
- Media library using Firebase Storage
- Project management
- Google sign-in with server-verified Firebase session cookies
- Firebase custom-claim authorization (`admin: true`)
- Vercel-friendly Next.js deployment

## Authorised admin

The intended administrator is `reezahbassier@gmail.com`. The account must sign in with Google once so that it exists in Firebase Authentication, then the Firebase Admin SDK script can grant the `admin` custom claim.

## Local setup

1. Copy `.env.local.example` to `.env.local`.
2. Fill in the Firebase web configuration and server-only Admin SDK credentials.
3. Run `npm install`.
4. Run `npm run dev`.
5. Sign in once with Google.
6. Run `npm run set-admin-claim -- reezahbassier@gmail.com`.
7. Sign out and back in so the refreshed Firebase token contains the admin claim.

Never commit `.env.local`, service-account JSON, or real credentials.

## Deploy

The project is intended to deploy to Vercel as a normal Next.js application. Configure the same Firebase environment variables as Vercel project environment variables, deploy the Firestore/Storage rules, and then set the admin claim.
