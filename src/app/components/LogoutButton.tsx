import { Button } from '@/components/ui/button';
import { clearSession } from '@/lib/utils/userSession';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = () => {
    clearSession(); // Clear session from localStorage
    queryClient.removeQueries({ queryKey: ['user'] }); // Clear user data from React Query cache
    router.refresh(); // Refresh the page
  };

  return (
    <Button onClick={handleLogout} size="icon" variant="secondary">
      <LogOut />
    </Button>
  );
};

export default LogoutButton;
