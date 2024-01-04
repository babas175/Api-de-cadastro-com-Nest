/* eslint-disable prettier/prettier */
// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './controller/app.controller';
import { AppService } from './services/app.service';
import { UsuarioRepository } from './repository/usuario.repository';
import { Usuario } from './interface/usuario.interface';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Chapeco2022',
      database: 'apiTeste',
      entities: [Usuario],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Usuario]), 
  ],
  controllers: [AppController],
  providers: [AppService, UsuarioRepository],
})
export class AppModule {}
