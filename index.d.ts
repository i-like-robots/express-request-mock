import type { Request, Response, RequestHandler } from 'express'
import type { MockRequest, MockResponse, RequestOptions, ResponseOptions } from 'node-mocks-http'

declare function expressRequestMock<Req extends Request = Request, Res extends Response = Response>(
  callback: RequestHandler,
  requestOptions?: RequestOptions,
  responseOptions?: ResponseOptions,
  decorators?: Record<string, unknown>,
): Promise<{
  req: MockRequest<Req>
  res: MockResponse<Res>
  request: MockRequest<Req>
  response: MockResponse<Res>
}>

export = expressRequestMock
