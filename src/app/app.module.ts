import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassModule } from './modules/class/class.module';
import { SectionModule } from './modules/section/section.module';
import { ModuleModule } from './modules/module/module.module';
import { DatabaseModule } from '@infra/database/database.module';
import { ProfileModule } from './modules/profile/profile.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    DatabaseModule,
    ModuleModule,
    ClassModule,
    SectionModule,
    ProfileModule,
    AuthenticationModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
