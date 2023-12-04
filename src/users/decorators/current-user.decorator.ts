import { createParamDecorator } from '@nestjs/common/decorators';
import { ExecutionContext } from '@nestjs/common';

// custom param decorator to get the user fromt the req
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.currentUser;
  },
);
