import type { Request, Response, RequestHandler } from 'express'
import type { MockResponse, RequestOptions, ResponseOptions } from 'node-mocks-http'

declare function expressRequestMock(
  callback: RequestHandler,
  requestOptions?: RequestOptions,
  responseOptions?: ResponseOptions,
  decorators?: Record<string, unknown>
): Promise<{
  req: Request
  res: MockResponse<Response<any, Record<string, any>>>
  request: Request
  response: MockResponse<Response<any, Record<string, any>>>
}>

export = expressRequestMock
