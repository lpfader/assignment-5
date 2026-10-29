import { Route, Get, Path, Request } from 'tsoa';
import type { ParameterizedContext } from 'koa';

@Route('hello')
export class HelloRoute {
  @Get('{name}')
  public async sayHello(
    @Path() name: string,
    @Request() request: ParameterizedContext
  ): Promise<string> {
    return `Hello ${name}`;
  }
}
