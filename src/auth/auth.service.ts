import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from './../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new ForbiddenException('Credentials not found');

    if (await argon.verify(user.password, dto.password)) {
      // password match
      return this.signToken(user.id, user.email);
    } else {
      // password did not match
      throw new ForbiddenException('Credentials incorrect');
    }
  }

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: { email: dto.email, password: hash },
        // select: { email: true, id: true },
      });
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken');
        }
      }
    }
  }
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
    return { access_token: token };
  }
}
