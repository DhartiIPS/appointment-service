import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomDecoderService {
  decode(payload: string): any {
    // Example: Base64 decoding
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  }
}