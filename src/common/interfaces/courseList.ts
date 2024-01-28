import { User } from '@models/user.model';
import { PopulatedDoc, Types } from 'mongoose';

export interface CourseList {
  name: string;
  price: number;
  discount: number;
  lastPrice: number;
  author: PopulatedDoc<User & Document, Types.ObjectId>;
}
