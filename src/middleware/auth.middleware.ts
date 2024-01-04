/* eslint-disable prettier/prettier */
import { Request, Response, NextFunction } from 'express';

export function Middleware(req: Request, res: Response<any>, next: NextFunction) {
  // Coloque a lógica de verificação do token JWT aqui
  // Exemplo básico: Verificar se o token está presente nos cabeçalhos da requisição
  const token = req.headers.authorization;

  if (!token) {
    (res as any).status(401).json({ message: 'Token de autenticação ausente', error: 'Unauthorized', statusCode: 401 });
  } else {
    next();
  }
}
