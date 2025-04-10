
// Simulated Edge Function for face verification
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// For demo purposes, this returns mock data
// In a real implementation, this would perform face verification
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { selfieImageUrl, eventId } = await req.json();
    
    // For demo purposes, approve 80% of requests randomly
    const hasAccess = Math.random() < 0.8;
    
    return new Response(
      JSON.stringify({
        hasAccess,
        message: hasAccess ? "Access granted" : "Face not recognized"
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
