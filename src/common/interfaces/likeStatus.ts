import { User } from '@models/user.model';
import { PopulatedDoc } from 'mongoose';

export interface LikeStatus {
  user: PopulatedDoc<User>;
  status: boolean;
}
