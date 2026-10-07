import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { detectAiBot } from './lib/botDetection';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip static assets, next internal paths, images, and telemetry endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/api/admin/crawlers') ||
    pathname.startsWith('/placeholder-') ||
    (pathname.includes('.') && !pathname.endsWith('.txt'))
  ) {
    return NextResponse.next();
  }

  const userAgent = request.headers.get('user-agent') || '';
  const bot = detectAiBot(userAgent);

  const response = NextResponse.next();

  if (bot) {
    // Add AI-friendly response headers
    response.headers.set('X-AI-Agent-Detected', bot.botName);
    response.headers.set('X-AI-Lab', bot.aiLab);
    response.headers.set('X-AI-LLMs-Txt', '/llms.txt');

    // Asynchronously log to database without blocking request
    const origin = request.nextUrl.origin;
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Fire and forget
    fetch(`${origin}/api/admin/crawlers/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bot_name: bot.botName,
        ai_lab: bot.aiLab,
        agent_type: bot.agentType,
        user_agent: userAgent,
        path: pathname,
        ip_address: ip,
        method: request.method,
        status_code: 200,
      }),
    }).catch(() => {
      // Ignore background logging errors to ensure zero reader disruption
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
