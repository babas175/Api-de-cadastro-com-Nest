/* eslint-disable prettier/prettier */
// app.controller.ts

import { Controller, Get, Post, Body, NotFoundException, Param, Put, Delete } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { Usuario } from 'src/interface/usuario.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/cadastro')
  async cadastrar(@Body() requestBody: { nome: string; email: string; senha: string; id: number }): Promise<{ message: string }> {
    const { nome, email, senha, id } = requestBody;
    await this.appService.cadastrarUsuario(nome, email, senha, id);
    return { message: 'Cadastro realizado com sucesso!' };
  }

  @Get('/usuarios')
  async listarUsuarios(): Promise<Usuario[]> {
    return await this.appService.listarUsuarios();
  }

  @Get('/usuarios/:email')
  async buscarUsuarioPorEmail(@Param('email') email: string): Promise<Usuario> {
    try {
      const usuario = await this.appService.buscarUsuarioPorEmail(email);
      return usuario;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Usuário não encontrado');
      }
      throw error;
    }
  }

  @Put('/usuarios/:email')
  async atualizarUsuario(@Param('email') email: string, @Body() usuarioData: Partial<Usuario>): Promise<Usuario> {
    try {
      const usuarioAtualizado = await this.appService.atualizarUsuario(email, usuarioData);
      if (!usuarioAtualizado) {
        throw new NotFoundException('Usuário não encontrado');
      }
      return usuarioAtualizado;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Usuário não encontrado');
      }
      throw error;
    }
  }

  
  @Delete('/usuarios/:email')
  async deletarUsuario(@Param('email') email: string): Promise<void> {
    try {
      await this.appService.deletarUsuarioPorEmail(email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Usuário não encontrado');
      }
      throw error;
    }
  }
  
}