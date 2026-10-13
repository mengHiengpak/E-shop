# E-shop

A React Native (Expo) e-commerce mobile app with a Khmer/English UI, product catalog, cart, wallet top-up via Bakong KHQR, and customer account management.

## Tech stack

- [Expo](https://expo.dev) + React Native + TypeScript
- [React Navigation](https://reactnavigation.org) (native stack + bottom tabs)
- [NativeWind](https://www.nativewind.dev) (Tailwind CSS for React Native)
- [axios](https://axios-http.com) for API requests
- `@react-native-async-storage/async-storage` for token/language persistence
- `react-native-qrcode-svg` for Bakong payment QR codes

## Getting started

```bash
npm install
npm start
```

Then press `a` for Android, `i` for iOS, or `w` for web.

## Scripts

- `npm start` — start the Expo dev server
- `npm run android` / `npm run ios` / `npm run web` — start on a specific platform
- `npm run lint` — run oxlint
- `npm run typecheck` — run the TypeScript compiler without emitting

## Project structure

```
src/
  components/
    assets/      # cart, checkout, address, profile components
    auth/        # sign in / sign up / password reset forms
    hook/        # data-fetching hooks, language + auth contexts
    languages/   # en/kh translation dictionaries
    template/    # account, address, order, product detail screens
    theme/       # header, hero, banner, footer, wallets
  config/        # api client, env, token storage, events, toast, errors
  navigation/    # navigators and route param types
  page/          # bottom tab screens (home, products, contact, account)
  types/         # shared domain + api types
```

## Environment

The API base URL is configured in `src/config/env.ts`. Set `EXPO_PUBLIC_URL_BASE`
in a `.env` file to override the default hosted API during development.
