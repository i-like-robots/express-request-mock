import { Request, Response, RequestHandler } from "express";
import { RequestOptions } from "node-mocks-http";

export default function (
    callback: RequestHandler,
    options?: RequestOptions,
    decorators?: Record<string, unknown>
): Promise<{ req: Request; res: Response, request: Request, response: Response }>;

