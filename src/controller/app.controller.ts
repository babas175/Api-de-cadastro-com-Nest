/* eslint-disable prettier/prettier */
// app.controller.ts

import { Controller, Get, Post, Body, NotFoundException, Param, Put, Delete,  UseGuards, Request, BadRequestException, InternalServerErrorException, Query } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { AuthService } from '../services/auth.service';
import { Usuario } from 'src/interface/usuario.interface';
import { AuthGuard } from '@nestjs/passport';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
    ) {}

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

  @Post('/login')
  async login(@Body() requestBody: { email: string; senha: string }) {
    const { email, senha } = requestBody;
    const user = await this.authService.validateUser(email, senha);
    if (!user) {
      return { message: 'Credenciais inválidas', error: 'Unauthorized', statusCode: 401 };
    }
    return this.authService.login(user);
  }

  @Get('/rota-protegida')
  @UseGuards(AuthGuard('jwt'))
    rotaProtegida(@Request() req) {
      return { message: 'Rota protegida', user: req.user };
  }
  

  @Get('/BuscarPorFiltroNome')
  async buscarPorFiltroNome(@Query('filtro') filtro: string): Promise<Usuario[]> {
    try {
      // Verifique se o filtro foi fornecido
      if (!filtro || typeof filtro !== 'string') {
        throw new BadRequestException('Filtro inválido');
      }

      // Realize a busca no banco de dados (exemplo usando o TypeORM)
      const usuarios = await this.appService.buscarPorFiltroNome(filtro);

      // Ordene os resultados por nome
      const usuariosOrdenados = usuarios.sort((a, b) => a.nome.localeCompare(b.nome));

      return usuariosOrdenados;
    } catch (error) {
      // Você pode personalizar a resposta de acordo com o tipo de erro
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException('Erro interno');
      }
    }
  }


  
}
