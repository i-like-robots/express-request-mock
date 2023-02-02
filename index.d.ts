import { Request, Response, RequestHandler } from 'express'
import { MockResponse, RequestOptions } from 'node-mocks-http'

declare function expressRequestMock(
  callback: RequestHandler | Array<RequestHandler>,
  options?: RequestOptions,
  decorators?: Record<string, unknown>
): Promise<{
  req: Request
  res: MockResponse<Response<any, Record<string, any>>>
  request: Request
  response: MockResponse<Response<any, Record<string, any>>>
}>

export = expressRequestMock
