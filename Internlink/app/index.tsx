import { Redirect } from 'expo-router';

export default function Index() {
  console.log("Redirecting to /auth/UserTypeSelectionScreen");
  return <Redirect href="/auth/UserTypeSelectionScreen" />;
}

