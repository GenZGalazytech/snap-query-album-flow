
// Simulated Edge Function for image analysis
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// For demo purposes, this returns mock data
// In a real implementation, this would connect to an AI service
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();
    
    // Mock data - in a real implementation, this would analyze the image
    const mockTags = ['landscape', 'nature', 'mountain', 'sky', 'outdoor'];
    const randomTags = [...mockTags].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    // Generate a random embedding vector of 1536 dimensions (common for image embeddings)
    const mockEmbedding = Array.from({ length: 1536 }, () => Math.random() - 0.5);
    
    // Generate a contextual description
    const mockContext = "A beautiful outdoor scene with natural elements.";
    
    return new Response(
      JSON.stringify({
        context: mockContext,
        tags: randomTags,
        embedding: mockEmbedding
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
