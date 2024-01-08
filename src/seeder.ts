// import { UsersSeeder } from './seeders/users.seeder';
// import { UserSchema } from 'src/database/models/user.model';
// import 'dotenv/config';
// import { seeder } from 'nestjs-seeder';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Roles, RoleSchema } from '@models/role.model';
// import { RolesSeeder } from './seeders/roles.seeder';
// import { User } from '@models/user.model';

// seeder({
//   imports: [
//     MongooseModule.forRoot(process.env.DB_URL),
//     MongooseModule.forFeature([
//       { name: Roles.name, schema: RoleSchema },
//       { name: User.name, schema: UserSchema },
//     ]),
//   ],
// }).run([RolesSeeder, UsersSeeder]);
