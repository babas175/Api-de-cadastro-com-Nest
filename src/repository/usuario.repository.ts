/* eslint-disable prettier/prettier */
// database.connection.ts

import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
    try {
      const usuarios = await this.usuarioRepository.find();
      return usuarios;
    } catch (error) {
      throw new NotFoundException('Erro ao listar usuários');
    }
  }
  

  async buscarUsuarioPorEmail(email: string): Promise<Usuario | null> {
    try {
      if (!email) {
        throw new NotFoundException('Email não fornecido!');
      }
      const usuario = await this.usuarioRepository.findOne({ where: { email } });
      if (!usuario) {
        throw new NotFoundException('Usuário não encontrado');
      }
      return usuario;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new NotFoundException('Erro ao buscar usuário por email');
      }
    }
  }
  

  async atualizarUsuario(email: string, usuarioData: Partial<Usuario>): Promise<Usuario | null> {
    try {
      const usuarioExistente = await this.usuarioRepository.findOne({ where: { email } });
      if (!usuarioExistente) {
        throw new NotFoundException('Usuário não encontrado');
      }
      await this.usuarioRepository.update({ email }, usuarioData);
      const usuarioAtualizado = await this.usuarioRepository.findOne({ where: { email } });
      return usuarioAtualizado || null;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; 
      } else {
        throw new InternalServerErrorException('Erro ao atualizar usuário');
      }
    }
  }
  

  async deletarUsuarioPorEmail(email: string): Promise<string> {
    try {
      if (!email) {
        throw new NotFoundException('Email inexistente!');
      }
      await this.usuarioRepository.delete({ email });
      return 'Usuário deletado com sucesso!';
      } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new NotFoundException('Erro ao deletar usuário por email');
      }
    }
  }
  

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
