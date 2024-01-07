/* eslint-disable prettier/prettier */
// database.connection.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Usuario } from '../interface/usuario.interface';


@Injectable()
export class UsuarioRepository {
  findOne: any;
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async cadastrarUsuario(usuario: Usuario): Promise<void> {
    await this.usuarioRepository.save(usuario);
  }

  async listarUsuarios(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  async buscarUsuarioPorEmail(email: string): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository.findOne({ where: { email } });
    return usuario || null;
  }

  async atualizarUsuario(email: string, usuarioData: Partial<Usuario>): Promise<Usuario | null> {
    const usuarioExistente = await this.usuarioRepository.findOne({ where: { email } });
    if (!usuarioExistente) {
      return null; 
    }
    await this.usuarioRepository.update({ email }, usuarioData);
    const usuarioAtualizado = await this.usuarioRepository.findOne({ where: { email } });
    return usuarioAtualizado || null;
  }

  async deletarUsuarioPorEmail(email: string): Promise<void> {
    await this.usuarioRepository.delete({ email });
  }

  // auth.service.ts
  async login(email: string, senha: string): Promise<Usuario | null> {
    try {
  
      const usuario = await this.usuarioRepository.findOne({ where: { email } });
      const usuario1 = await this.usuarioRepository.findOne({ where: { senha } });
      return usuario  || usuario1;

    } catch (error) {
      console.error('Error during login:', error);
      throw new UnauthorizedException('Erro durante o login', error.message);
    }
  }

  buscarPorFiltroNome(filtro: string): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      where: {
        nome: Like(`%${filtro}%`),
      },
    });
  }
  


}
