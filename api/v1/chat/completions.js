// =============================================================================
// EDGE RUNTIME PROXY — Solves the Vercel 10-second Serverless timeout
// Edge functions support 30s+ execution and native streaming.
// =============================================================================

export const config = { runtime: 'edge' };

export default async function handler(req) {
  // CORS headers used in every response
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Provider',
  };

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const provider = req.headers.get('X-Provider') || 'nvidia';
    const body = await req.json();
    const isStreaming = body.stream === true;

    let targetUrl;
    if (provider === 'google') {
      targetUrl = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
    } else {
      targetUrl = 'https://integrate.api.nvidia.com/v1/chat/completions';
    }

    const aiResponse = await fetch(
      targetUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.get('authorization') || '',
          Accept: isStreaming ? 'text/event-stream' : 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      return new Response(errorText, {
        status: aiResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ----- Non-streaming: return JSON directly -----
    if (!isStreaming) {
      const data = await aiResponse.text();
      return new Response(data, {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ----- Streaming: pipe the SSE body straight through -----
    // This keeps the connection alive chunk-by-chunk, preventing timeouts.
    return new Response(aiResponse.body, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Error connecting to NVIDIA API',
        detail: { message: error.message },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}
