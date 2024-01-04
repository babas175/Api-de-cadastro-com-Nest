/* eslint-disable prettier/prettier */
// usuario.entity.ts

import { Entity, Column } from 'typeorm';

@Entity()
export class Usuario {
  @Column({ primary: true, type: 'bigint', comment: 'ID fornecido pelo usuário' })
  id: number;

  @Column({ comment: 'Nome do usuário' })
  nome: string;

  @Column({ comment: 'E-mail do usuário' })
  email: string;

  @Column({ comment: 'Senha do usuário' })
  senha: string;
}

