export const userPopulate = [
  // { path: 'enroll', select: 'name' },
  // { path: 'wishlist', select: 'name' },
  { path: 'major', select: 'title' },
];

export const coursePopulate = [
  // { path: 'quizz', select: 'name' },
  // { path: 'chapters', select: 'title' },
  { path: 'major', select: 'title' },
];

export const quizzPopulate = [
  // { path: 'questions', select: '-outcome' },
  { path: 'course', select: 'name' },
  // {
  //   path: 'outcomeList',
  //   populate: [
  //     { path: 'user', select: 'email' },
  //     { path: 'outcome', select: 'score' },
  //     { path: 'quizz', select: 'name' },
  //   ],
  // },
];

export const questionPopulate = [{ path: 'createdBy', select: 'name' }];

export const outcomeListPopulate = [
  { path: 'outcome', select: 'score' },
  { path: 'quizz', select: 'name' },
  { path: 'user', select: 'name' },
];

export const chapterPopulate = [
  // { path: 'lessons', select: '-outcome' },
  { path: 'course', select: 'name' },
];

export const discountPopulate = [{ path: 'course', select: 'name' }];

export const enrollmentPopulate = [{ path: 'courseList', select: 'orderBy' }];

export const authorFromCoursePopulate = [{ path: 'course', populate: 'author' }];

export const wishlistFromUserPopulate = [{ path: 'wishlist', populate: [{ path: 'discount', select: 'promotion' }] }];

export const enrollmentFromUserPopulate = [{ path: 'enrollment' }];
