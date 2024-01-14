/* eslint-disable prettier/prettier */
// app.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsuarioRepository } from '../repository/usuario.repository';
import { Usuario } from 'src/interface/usuario.interface';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AppService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository
    ) {}

  async cadastrarUsuario(nome: string, email: string, senha: string, id: number): Promise<void> {
    if (!nome || !email || !senha) {
      throw new BadRequestException('Nome, e-mail e senha são obrigatórios');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('E-mail inválido');
    }
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const usuario: Usuario = { 
                          nome, 
                          email, 
                          senha: senhaCriptografada, 
                          id 
                            };
    await this.usuarioRepository.cadastrarUsuario(usuario);
  }
  

  async listarUsuarios(): Promise<Usuario[]> {
    return await this.usuarioRepository.listarUsuarios();
  }

  async buscarUsuarioPorEmail(email: string): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository.buscarUsuarioPorEmail(email);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  async atualizarUsuario(email: string, usuarioData: Partial<Usuario>): Promise<Usuario | null> {
    const usuarioExistente = await this.usuarioRepository.buscarUsuarioPorEmail(email);
    if (!usuarioExistente) {
      throw new NotFoundException('Usuário não encontrado');
    }
    await this.usuarioRepository.atualizarUsuario(email, usuarioData);
    const usuarioAtualizado = await this.usuarioRepository.buscarUsuarioPorEmail(email);
    return usuarioAtualizado || null;
  }

  async deletarUsuarioPorEmail(email: string): Promise<void> {
    const usuarioExistente = await this.buscarUsuarioPorEmail(email);
    if (!usuarioExistente) {
      throw new NotFoundException('Usuário não encontrado');
    }
    await this.usuarioRepository.deletarUsuarioPorEmail(email);
  }

  async buscarPorFiltroNome(filtro: string): Promise<Usuario[]> {
    return this.usuarioRepository.buscarPorFiltroNome(filtro);
  }
  
}

