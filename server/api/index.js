import connectDB from '../config/db.js';
import app from '../server.js';

let databaseConnection;

export default async function handler(request, response) {
  databaseConnection ??= connectDB();
  await databaseConnection;
  return app(request, response);
}