import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {

  handleRequest(
    err: Error | null,
    user: any,
  ) {
    if (err || !user) {
      return null;
    }

    return user;
  }
}