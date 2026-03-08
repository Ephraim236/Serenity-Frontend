# Serenity Mobile App

React Native mobile app for the Serenity spa booking platform, built with Expo SDK.

## Features

- **Authentication**: Email/password login & signup with role selection (client/business)
- **Client Booking Flow**: 3-step wizard (Service → Specialist → Date & Time)
- **My Bookings**: View, reschedule, and cancel appointments
- **Profile**: User settings and preferences
- **Admin Dashboard**: Revenue analytics, staff utilization, appointment stats
- **Admin Appointments**: Calendar view with CRUD operations
- **Admin Services**: Service management with toggle/edit/delete

## Tech Stack

- **Expo SDK 51** (React Native)
- **TypeScript** with strict mode
- **React Navigation** (bottom tabs + drawer)
- **Expo SecureStore** for JWT token storage
- **date-fns** for date formatting
- Custom UI components matching web app design

## Setup

```bash
cd serenity-mobile
npm install
npx expo start
```

## API

Connects to the same backend as the web app:
```
https://serenity-production-bafc.up.railway.app
```

## Project Structure

```
serenity-mobile/
├── App.tsx                         # Entry point
├── app.json                        # Expo config
├── src/
│   ├── api/
│   │   └── client.ts               # API helpers
│   ├── components/
│   │   └── ui/                     # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Skeleton.tsx
│   │       └── StatusBadge.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx         # Auth state with SecureStore
│   ├── navigation/
│   │   ├── index.tsx               # Root navigator
│   │   ├── AuthNavigator.tsx       # Login/Signup stack
│   │   ├── ClientNavigator.tsx     # Bottom tab navigator
│   │   └── AdminNavigator.tsx      # Drawer navigator
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── SignupScreen.tsx
│   │   ├── client/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── BookingScreen.tsx
│   │   │   ├── MyBookingsScreen.tsx
│   │   │   └── ProfileScreen.tsx
│   │   └── admin/
│   │       ├── DashboardScreen.tsx
│   │       ├── AppointmentsScreen.tsx
│   │       └── ServicesScreen.tsx
│   ├── theme/
│   │   └── index.ts                # Colors, spacing, typography
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   └── utils/
│       └── storage.ts              # SecureStore wrapper
└── assets/                         # App icons and splash
```

## Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Design Notes

- Matches web app's indigo (#4f46e5) color scheme
- Uses rounded corners (borderRadius 12-24) consistent with web
- Card-based layouts with subtle shadows
- Bottom tab navigation for clients, drawer for admin
