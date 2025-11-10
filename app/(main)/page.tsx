import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect users to /pages/restaurants by default
  redirect('/pages/restaurants');

  return null; // This never renders
}
