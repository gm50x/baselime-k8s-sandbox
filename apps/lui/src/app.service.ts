import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly http: HttpService) {}

  async getHello(): Promise<string> {
    await this.http.axiosRef.post('http://localhost:3000/foo');
    return 'Hello World!';
  }
}
