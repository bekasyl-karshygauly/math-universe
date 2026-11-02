export interface AchievementDef {
  key: string;
  icon: string;
  title: { ru: string; en: string; kz: string };
  description: { ru: string; en: string; kz: string };
  xpReward: number;
  condition: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    key: 'first_lesson',
    icon: '🎓',
    title: { ru: 'Первый шаг', en: 'First Step', kz: 'Бірінші қадам' },
    description: { ru: 'Завершил первый урок', en: 'Completed first lesson', kz: 'Бірінші сабақты бітірді' },
    xpReward: 50,
    condition: 'complete_1_lesson',
  },
  {
    key: 'streak_3',
    icon: '🔥',
    title: { ru: '3 дня подряд', en: '3-Day Streak', kz: '3 күн қатарынан' },
    description: { ru: 'Заходил 3 дня подряд', en: 'Logged in 3 days in a row', kz: '3 күн қатарынан кірді' },
    xpReward: 75,
    condition: 'streak_3',
  },
  {
    key: 'streak_7',
    icon: '⚡',
    title: { ru: 'Неделя без пауз', en: 'Week Streak', kz: 'Апта үздіксіз' },
    description: { ru: 'Заходил 7 дней подряд', en: 'Logged in 7 days in a row', kz: '7 күн қатарынан кірді' },
    xpReward: 150,
    condition: 'streak_7',
  },
  {
    key: 'streak_30',
    icon: '🌟',
    title: { ru: 'Месяц упорства', en: 'Month Streak', kz: 'Ай бойы' },
    description: { ru: 'Заходил 30 дней подряд', en: '30-day streak!', kz: '30 күн қатарынан!' },
    xpReward: 500,
    condition: 'streak_30',
  },
  {
    key: 'quiz_10',
    icon: '🎯',
    title: { ru: '10 квизов', en: '10 Quizzes', kz: '10 тест' },
    description: { ru: 'Прошёл 10 квизов', en: 'Completed 10 quizzes', kz: '10 тест өтті' },
    xpReward: 100,
    condition: 'quiz_10',
  },
  {
    key: 'quiz_perfect',
    icon: '💯',
    title: { ru: 'Идеально!', en: 'Perfect Score!', kz: 'Мінсіз!' },
    description: { ru: 'Ответил на все вопросы правильно', en: 'Got 100% on a quiz', kz: 'Тестте 100% алды' },
    xpReward: 200,
    condition: 'quiz_perfect',
  },
  {
    key: 'lessons_10',
    icon: '📚',
    title: { ru: '10 уроков', en: '10 Lessons', kz: '10 сабақ' },
    description: { ru: 'Завершил 10 уроков', en: 'Completed 10 lessons', kz: '10 сабақты бітірді' },
    xpReward: 100,
    condition: 'lessons_10',
  },
  {
    key: 'lessons_50',
    icon: '🏆',
    title: { ru: '50 уроков', en: '50 Lessons', kz: '50 сабақ' },
    description: { ru: 'Завершил 50 уроков', en: 'Completed 50 lessons', kz: '50 сабақты бітірді' },
    xpReward: 300,
    condition: 'lessons_50',
  },
  {
    key: 'course_complete',
    icon: '🎖️',
    title: { ru: 'Курс завершён', en: 'Course Complete', kz: 'Курс аяқталды' },
    description: { ru: 'Завершил весь курс полностью', en: 'Completed an entire course', kz: 'Бүкіл курсты аяқтады' },
    xpReward: 250,
    condition: 'course_complete',
  },
  {
    key: 'level_5',
    icon: '🚀',
    title: { ru: 'Уровень 5', en: 'Level 5', kz: '5-деңгей' },
    description: { ru: 'Достиг 5-го уровня', en: 'Reached level 5', kz: '5-деңгейге жетті' },
    xpReward: 200,
    condition: 'level_5',
  },
  {
    key: 'level_10',
    icon: '👑',
    title: { ru: 'Мастер', en: 'Master', kz: 'Шебер' },
    description: { ru: 'Достиг 10-го уровня', en: 'Reached level 10', kz: '10-деңгейге жетті' },
    xpReward: 500,
    condition: 'level_10',
  },
  {
    key: 'algebra_master',
    icon: '∑',
    title: { ru: 'Мастер алгебры', en: 'Algebra Master', kz: 'Алгебра шебері' },
    description: { ru: 'Завершил весь курс алгебры', en: 'Completed Algebra course', kz: 'Алгебра курсын аяқтады' },
    xpReward: 300,
    condition: 'course_algebra',
  },
];
