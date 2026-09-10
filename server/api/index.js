import connectDB from '../config/db.js';
import app from '../server.js';

let databaseConnection;

export default async function handler(request, response) {
  const requestUrl = new URL(
    request.url,
    `https://${request.headers.host ?? 'localhost'}`
  );
  const rewrittenPath = requestUrl.searchParams.get('path');
  const pathname = rewrittenPath
    ? `/api${rewrittenPath}`
    : requestUrl.pathname;

  if (rewrittenPath) {
    request.url = pathname;
  }

  if (pathname === '/api/health') {
    return app(request, response);
  }

  try {
    databaseConnection ??= connectDB();
    await databaseConnection;
    return app(request, response);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return response.status(503).json({
      success: false,
      message: 'Database connection is not configured or unavailable',
    });
  }
}