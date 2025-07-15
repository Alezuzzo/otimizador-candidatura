import type { VercelRequest, VercelResponse } from '@vercel/node';

// A única alteração foi aqui: request -> _request
export default function handler(
  _request: VercelRequest,
  response: VercelResponse,
) {
  response.status(200).send('Olá do endpoint de teste!');
}