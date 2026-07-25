import {
  Body,
  Controller,
  Post,
  Res,
} from "@nestjs/common";

import type { Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post("login")
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    res.cookie("jwt", result.accessToken, {
      httpOnly: true,
      secure: true,      // Required
      sameSite: "none",  // Required for cross-site
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
    //
    return { message: "Logged out" };
  }

}

