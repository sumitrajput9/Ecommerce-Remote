import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'newpassword',
  database: 'product_order_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, 
  autoLoadEntities: true, 
  logging: true, 
};
