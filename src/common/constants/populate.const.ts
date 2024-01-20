export const userPopulate = [
    { path: 'courseList', select: 'name' },
    { path: 'wishList', select: 'name' },
    { path: 'major', select: 'title' },
  ];
  
  export const coursePopulate = [
    { path: 'quizz', select: 'name' },
    { path: 'chapters', select: 'title' },
    { path: 'major', select: 'title' },
  ];
  
  export const quizzPopulate = [
    { path: 'questions', select: '-outcome' },
    {
      path: 'outcomeList',
      populate: [
        { path: 'user', select: 'email' },
        { path: 'outcome', select: 'score' },
        { path: 'quizz', select: 'name' },
      ],
    },
  ];
  
  export const questionPopulate = [{ path: 'createdBy', select: 'name' }];
  
  export const outcomeListPopulate = [
    { path: 'outcome', select: 'score' },
    { path: 'quizz', select: 'name' },
    { path: 'user', select: 'name' },
  ];