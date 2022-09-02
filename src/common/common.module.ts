import { Module } from '@nestjs/common';
import { WrapResponseInterceptor } from './interceptors/wrap-response.interceptor';

@Module({
  providers: [WrapResponseInterceptor],
  exports: [WrapResponseInterceptor],
})
export class CommonModule {}
