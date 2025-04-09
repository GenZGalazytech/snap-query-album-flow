
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const SupabaseCredentialsWarning = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-amber-50 dark:bg-amber-900/20">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center space-x-3 text-amber-600 dark:text-amber-500">
          <AlertCircle className="h-10 w-10" />
          <h1 className="text-2xl font-bold">Supabase Configuration Required</h1>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            To use this application, you need to provide your Supabase URL and anon key.
          </p>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md space-y-4">
            <h3 className="font-semibold">How to get your Supabase credentials:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Log in to your <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Supabase dashboard</a></li>
              <li>Select your project</li>
              <li>Go to Project Settings &gt; API</li>
              <li>Copy the URL and anon key</li>
              <li>Set them in your Lovable project settings</li>
            </ol>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
            <p className="font-medium mb-2">Add these environment variables to your Lovable project:</p>
            <code className="block bg-black text-white p-2 rounded overflow-x-auto">
              VITE_SUPABASE_URL=your_supabase_url<br />
              VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
            </code>
          </div>
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Reload Application
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupabaseCredentialsWarning;
