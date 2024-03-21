import { getAuthSession } from '@/src/lib/auth';
import LogginButton from './LogginButton';
import LoggedInButton from './LoggedInButton';

export default async function AuthButton() {
  const session = await getAuthSession();

  console.log(session);
  if (!session?.user) {
    return <LogginButton />;
  }
  return <LoggedInButton user={session.user} />;
}
