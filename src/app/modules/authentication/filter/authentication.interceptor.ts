import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

export class AuthenticationInterceptor implements NestInterceptor {
  constructor(private jwtService: JwtService) {}

  // eslint-disable-next-line @typescript-eslint/ban-types
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (request['user']) {
      return next.handle();
    }
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return next.handle();
    }
    try {
      request['user'] = this.jwtService.verify(token, {
        secret: 'ssshhhh',
      });
    } catch {
      return next.handle();
    }
    return next.handle();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
