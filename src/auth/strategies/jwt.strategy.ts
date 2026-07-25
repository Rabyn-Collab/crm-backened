import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";

import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { UsersService } from "src/users/users.service";

// Extract JWT from cookie
const cookieExtractor = (req: Request): string | null => {
  if (req && req.cookies) {
    return req.cookies.jwt ?? null; // cookie name: jwt
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {


    const secret = configService.get<string>("JWT_SECRET");

    if (!secret) {
      throw new Error("JWT_SECRET is missing.");
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
      ]),
      secretOrKey: secret,
      algorithms: ["HS256"],
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload?.sub) {
      throw new UnauthorizedException("Invalid token.");
    }

    const user = await this.usersService.findById(payload.sub.toString());

    if (!user) {
      throw new UnauthorizedException("User not found.");
    }

    if (user.tenantId !== payload.tenantId) {
      throw new UnauthorizedException("Invalid tenant.");
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,

    };
  }
}