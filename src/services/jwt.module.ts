/* eslint-disable prettier/prettier */
// jwt.module.ts
import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    NestJwtModule.register({
      secret: 'seuSegredoAqui',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  exports: [NestJwtModule],
})
export class JwtModule {}
