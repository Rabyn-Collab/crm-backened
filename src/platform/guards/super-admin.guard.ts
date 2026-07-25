import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';


@Injectable()
export class SuperAdminGuard
  implements CanActivate {


  canActivate(
    context: ExecutionContext
  ) {

    const request =
      context.switchToHttp()
        .getRequest();


    const user = request.user;


    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException(
        'Platform admin access required'
      );
    }


    return true;

  }

}