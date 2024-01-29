import { User } from '@models/user.model';
import { Document, PopulatedDoc, Types } from 'mongoose';

export interface LikeStatus {
  user: PopulatedDoc<User & Document, Types.ObjectId>[];
  status: boolean;
}
