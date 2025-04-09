
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        toast.error(error.message);
        navigate('/login');
        return;
      }
      
      // Successfully authenticated
      toast.success('Successfully signed in!');
      navigate('/dashboard');
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="h-12 w-12 rounded-full border-4 border-t-primary border-r-transparent border-l-transparent border-b-transparent animate-spin mx-auto"></div>
        <p className="mt-4 text-lg">Finishing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
