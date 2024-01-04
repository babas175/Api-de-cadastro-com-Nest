/* eslint-disable prettier/prettier */
// jwt.service.ts
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secretKey = 'seu-segredo-aqui'; // Substitua pelo seu segredo

  generateToken(payload: any): string {
    return jwt.sign(payload, this.secretKey);
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      return null;
    }
  }
}
