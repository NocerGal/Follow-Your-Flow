import { getAuthSession } from '@/src/lib/auth';
import LogginButton from './LogginButton';
import LoggedInButton from './LoggedInButton';

export default async function AuthButton() {
  const session = await getAuthSession();

  // if user is not connected, Loggin is displayed
  if (!session?.user) {
    return <LogginButton />;
  }
  // Displaye LoggedInButton if user is already connected
  return <LoggedInButton user={session.user} />;
}
