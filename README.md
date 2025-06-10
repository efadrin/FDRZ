# FDRZ - Workflow Management Platform

A React-based workflow management system with Microsoft Azure AD authentication.

## Overview

FDRZ is a comprehensive workflow management platform that provides secure authentication via Microsoft Azure AD and a modern React frontend for managing workflows and user data.

## Authentication Flow

### Login Process

The application uses Microsoft Azure AD for authentication with the following flow:

#### 1. Initial State Check
- When the `LoginPage` loads, it automatically checks if the user is already authenticated
- If `isAuthenticated` is `true`, redirects automatically to `/dashboard`
- Authentication state is managed via Redux store

#### 2. Login Options

**Primary Login (New Users):**
- User clicks "Sign in with Microsoft" button
- Triggers Microsoft popup authentication via MSAL
- Requires user interaction and consent

**Silent Login (Returning Users):**
- Available only if previous Microsoft accounts are found (`accounts.length > 0`)
- User can click "Continue with saved account"
- Attempts silent token acquisition without popup

#### 3. Microsoft Authentication Process

```typescript
// New Login Flow
const login = async () => {
  // Step 1: Microsoft popup authentication
  const loginResponse = await instance.loginPopup(loginRequest);
  
  // Step 2: Send Microsoft token to backend
  const result = await microsoftLogin({
    email: loginResponse.account.username,
    name: loginResponse.account.name,
    microsoftId: loginResponse.account.homeAccountId,
    accessToken: loginResponse.accessToken,
  });
  
  // Step 3: Update Redux state with user info and JWT token
  dispatch(setUser(result.user));
  dispatch(setToken(result.token));
};
```

#### 4. Backend Integration

The frontend expects a backend API endpoint:

- **Endpoint:** `POST /auth/microsoft`
- **Headers:** `Authorization: Bearer ${microsoftAccessToken}`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "name": "User Name",
    "microsoftId": "microsoft-account-id"
  }
  ```
- **Expected Response:**
  ```json
  {
    "user": {
      "id": "user-id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "user|admin",
      "department": "Optional Department"
    },
    "token": "your-jwt-token"
  }
  ```

#### 5. Protected Routes

Routes are protected using the `ProtectedRoute` component:

```typescript
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);
  
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/unauthorized" />;
  
  return children;
};
```

## Required Checks for Successful Login

### Frontend Requirements:
1. ✅ **Microsoft Authentication:** Valid response from MSAL popup
2. ✅ **Backend API Success:** `/auth/microsoft` endpoint responds successfully
3. ✅ **Valid Response Data:** Backend returns proper `{ user, token }` structure
4. ✅ **Redux State Update:** Both user and token stored in Redux
5. ✅ **Automatic Navigation:** Redirect to `/dashboard` on success

### Backend Requirements:
1. **Microsoft Token Validation:** Verify the provided `accessToken` with Microsoft Graph API
2. **User Management:** Find existing user or create new user in database
3. **JWT Generation:** Create application-specific JWT token
4. **Response Format:** Return user object and JWT token in expected format

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx              # Main layout wrapper
│   ├── LoginPage.tsx           # Microsoft authentication page
│   ├── ProtectedRoute.tsx      # Route protection component
│   └── WorkflowList.tsx        # Workflow display component
├── contexts/
│   └── AuthContext.tsx         # Authentication context and MSAL integration
├── pages/
│   ├── Dashboard.tsx           # User dashboard
│   ├── Home.tsx               # Landing page
│   └── WorkflowsPage.tsx      # Workflow management page
├── services/
│   └── msalConfig.ts          # Microsoft MSAL configuration
├── store/
│   ├── hooks.ts               # Typed Redux hooks
│   ├── store.ts               # Redux store configuration
│   ├── api/
│   │   ├── authApi.ts         # Authentication API endpoints
│   │   ├── baseApi.ts         # Base RTK Query configuration
│   │   ├── userApi.ts         # User management API
│   │   └── workflowApi.ts     # Workflow API endpoints
│   └── slices/
│       └── authSlice.ts       # Authentication state management
└── types/
    └── auth.types.ts          # TypeScript interfaces
```

## API Endpoints

### Authentication API (`authApi.ts`)
- `POST /auth/login` - Standard login (not currently used)
- `POST /auth/microsoft` - Microsoft OAuth login
- `POST /auth/logout` - User logout
- `GET /auth/validate` - Token validation
- `POST /auth/refresh` - Refresh JWT token

### User API (`userApi.ts`)
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update user profile
- `GET /api/users` - Get all users (admin only)

### Workflow API (`workflowApi.ts`)
- Workflow management endpoints (implementation depends on your backend)

## Environment Configuration

Create a `.env` file with the following variables:

```env
# Microsoft Azure AD Configuration
REACT_APP_AZURE_CLIENT_ID=your-azure-client-id
REACT_APP_AZURE_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
REACT_APP_AZURE_REDIRECT_URI=http://localhost:3000

# Backend API Configuration
REACT_APP_API_URL=http://localhost:5000
```

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   - Copy `.env.example` to `.env`
   - Update Azure AD and API configuration

3. **Start Development Server:**
   ```bash
   npm start
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**Note: this is a one-way operation!** Ejects from Create React App configuration

## State Management

The application uses Redux Toolkit with RTK Query for state management:

- **Auth State:** User authentication, tokens, loading states
- **API Caching:** Automatic caching and invalidation for API calls
- **Type Safety:** Fully typed with TypeScript

## Security Features

- **Token-based Authentication:** JWT tokens for API access
- **Automatic Token Refresh:** Handles token expiration
- **Protected Routes:** Role-based access control
- **Secure Token Storage:** Tokens stored in Redux (consider HTTP-only cookies for production)

## Dependencies

### Core Dependencies:
- React 18+ with TypeScript
- Redux Toolkit & RTK Query
- React Router DOM
- Microsoft MSAL (Browser & React)

### Development Dependencies:
- TypeScript
- ESLint
- React Scripts

## Browser Support

- Modern browsers with ES6+ support
- Microsoft Edge, Chrome, Firefox, Safari
- Popup blocking must be disabled for Microsoft authentication

## Troubleshooting

### Common Issues:

1. **Login Popup Blocked:** Ensure popup blocker is disabled
2. **Token Expired:** Application handles automatic refresh
3. **Backend Not Available:** Check `REACT_APP_API_URL` configuration
4. **Azure AD Issues:** Verify client ID and tenant configuration

### Debug Mode:
Enable Redux DevTools in development for state inspection.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Learn More

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)
- [Microsoft MSAL.js documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications)
- [Redux Toolkit documentation](https://redux-toolkit.js.org/)

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
