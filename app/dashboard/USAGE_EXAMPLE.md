# Token Management Usage Guide

## How to Access Token in Components

### Using Redux (Recommended)
```typescript
import { useAppSelector } from "@/app/dashboard/redux/hooks";

function MyComponent() {
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  
  // Use token and user data
  console.log(token, user);
}
```

### Using localStorage (Fallback)
```typescript
const token = localStorage.getItem("token");
```

## How to Logout
```typescript
import { useAppDispatch } from "@/app/dashboard/redux/hooks";
import { logout } from "@/app/dashboard/redux/slices/authSlice";
import { useRouter } from "next/navigation";

function LogoutButton() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const handleLogout = () => {
    dispatch(logout()); // Clears Redux + localStorage
    router.push("/auth/login");
  };
  
  return <button onClick={handleLogout}>Logout</button>;
}
```

## API Calls
All API calls automatically include the token via the interceptor in `api.ts`.
Just use the helper functions:

```typescript
import { getRequest, postRequest } from "@/app/services/api";

// Token is automatically added to headers
const data = await getRequest("/employees");
const result = await postRequest("/attendance", { date: "2024-01-01" });
```
