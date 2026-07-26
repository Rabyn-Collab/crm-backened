import {
  Body,
  Controller,
  Post,
  Req,
  Res,
} from "@nestjs/common";

import type { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import Cookies from 'cookies';

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post("login")
  async login(
    @Req() req: Request,
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookies = new Cookies(req, res);
    const result = await this.authService.login(dto);

    cookies.set("jwt", result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result;
  }


  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return { message: "Logged out" };
  }

}

