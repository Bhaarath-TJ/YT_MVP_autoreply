import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const from = (location.state as any)?.from?.pathname || '/';

  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome to CommentQuick</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to comment 10X faster</p>
        </div>

        <Auth
          supabaseClient={supabase}
          redirectTo="https://commentquick.com/reply/youtube"
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#9333ea',
                  brandAccent: '#7e22ce',
                }
              }
            },
            className: {
              container: 'w-full',
              button: 'w-full px-4 py-2 rounded-md',
              label: 'text-sm font-medium text-gray-700',
              input: 'mt-1 block w-full rounded-md border-gray-300 shadow-sm',
            }
          }}
          providers={['google']}
        />
      </div>
    </div>
  );
};

export default Login;