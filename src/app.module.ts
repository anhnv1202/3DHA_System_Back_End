import { GoogleDriveModule } from 'nestjs-google-drive';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';

import { CronJobModule } from '@modules/cron-job/cron-job.module';
import { MailModule } from '@modules/mail/mail.module';
import { BullModule } from '@nestjs/bull';
import { MongooseConfigService } from './config/mongo-config.service';
import { ThrottlerConfigService } from './config/throttler-config.service';
import { AuthModule } from './modules/auth/auth.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { TokenModule } from './modules/token/token.module';
import { UserModule } from './modules/user/user.module';
import { MajorModule } from './modules/major/major.module';
import { CourseModule } from './modules/course/course.module';
import { QuestionModule } from './modules/question/question.module';
import { QuizzModule } from './modules/quizz/quizz.module';
import { OutcomeModule } from './modules/outcome/outcome.module';
import { OutcomeListModule } from './modules/outcome-list/outcome-list.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { DiscountModule } from './modules/discount/discount.module';
import { FileModule } from './modules/file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    GoogleDriveModule.register({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUrl: process.env.GOOGLE_REDIRECT_URL,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigService,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ThrottlerConfigService,
    }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'public'),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        verifyOptions: {
          ignoreExpiration: false,
        },
        global: true,
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: +configService.get<number>('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    MailModule,
    UserModule,
    CloudinaryModule,
    AuthModule,
    TokenModule,
    CronJobModule,
    MajorModule,
    CourseModule,
    QuestionModule,
    QuizzModule,
    OutcomeModule,
    OutcomeListModule,
    ChapterModule,
    WishlistModule,
    CouponModule,
    DiscountModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
