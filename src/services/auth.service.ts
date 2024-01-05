/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioRepository } from '../repository/usuario.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService,
    private readonly usuarioRepository: UsuarioRepository
    ) {}

    async validateUser(email: string, senha: string): Promise<any> {
      try {
        const user = await this.usuarioRepository.login(email, senha);
        if (user) {
          const passwordMatch = await bcrypt.compare(senha, user.senha);
      
          if (passwordMatch) {
            return user;
          }
        }
        throw new UnauthorizedException('Credenciais inválidas');
      } catch (error) {
        throw new UnauthorizedException('Erro durante a autenticação', error.message);
      }
    }
  

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
