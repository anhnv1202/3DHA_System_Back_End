import { User } from '@models/user.model';

export interface RatingInfo {
  postedBy: User;
  status: boolean;
  star: number;
}
