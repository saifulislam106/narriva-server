// types/express.d.ts
import { Request } from 'express';

declare module 'express' {
  export interface Request {
    rawBody: Buffer;
  }
}
