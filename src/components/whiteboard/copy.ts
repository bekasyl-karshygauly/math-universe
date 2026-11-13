import type { Language } from '../../lib/storage';

const labels = {
  open: { ru: 'Решить на доске', kz: 'Тақтада шығару', en: 'Work on the board' },
  board: { ru: 'Доска', kz: 'Тақта', en: 'Whiteboard' },
  close: { ru: 'Закрыть доску', kz: 'Тақтаны жабу', en: 'Close board' },
  problem: { ru: 'Условие задачи', kz: 'Есептің шарты', en: 'Problem statement' },
  tools: { ru: 'Инструменты рисования', kz: 'Сурет салу құралдары', en: 'Drawing tools' },
  pan: { ru: 'Переместить доску', kz: 'Тақтаны жылжыту', en: 'Pan board' },
  pen: { ru: 'Перо', kz: 'Қалам', en: 'Pen' },
  line: { ru: 'Линия', kz: 'Сызық', en: 'Line' },
  arrow: { ru: 'Стрелка', kz: 'Көрсеткі', en: 'Arrow' },
  rect: { ru: 'Прямоугольник', kz: 'Тіктөртбұрыш', en: 'Rectangle' },
  ellipse: { ru: 'Эллипс', kz: 'Эллипс', en: 'Ellipse' },
  text: { ru: 'Текст', kz: 'Мәтін', en: 'Text' },
  eraser: { ru: 'Ластик', kz: 'Өшіргіш', en: 'Eraser' },
  undo: { ru: 'Отменить', kz: 'Болдырмау', en: 'Undo' },
  redo: { ru: 'Повторить', kz: 'Қайталау', en: 'Redo' },
  grid: { ru: 'Сетка', kz: 'Торкөз', en: 'Grid' },
  clear: { ru: 'Очистить доску', kz: 'Тақтаны тазарту', en: 'Clear board' },
  color: { ru: 'Цвет', kz: 'Түс', en: 'Color' },
  ink: { ru: 'Основной', kz: 'Негізгі', en: 'Ink' },
  teal: { ru: 'Бирюзовый', kz: 'Көгілдір', en: 'Teal' },
  red: { ru: 'Красный', kz: 'Қызыл', en: 'Red' },
  blue: { ru: 'Синий', kz: 'Көк', en: 'Blue' },
  thickness: { ru: 'Толщина', kz: 'Қалыңдық', en: 'Stroke width' },
  thin: { ru: 'Тонкая', kz: 'Жіңішке', en: 'Thin' },
  medium: { ru: 'Средняя', kz: 'Орташа', en: 'Medium' },
  thick: { ru: 'Толстая', kz: 'Қалың', en: 'Thick' },
  write: { ru: 'Введите формулу или текст', kz: 'Формула немесе мәтін енгізіңіз', en: 'Enter a formula or text' },
  insert: { ru: 'Вставить', kz: 'Қою', en: 'Insert' },
  textHint: { ru: 'Нажмите на доску, чтобы разместить текст.', kz: 'Мәтінді қою үшін тақтаны басыңыз.', en: 'Click the board to place text.' },
  drawHint: { ru: 'Пишите мышью, пальцем или стилусом.', kz: 'Тінтуірмен, саусақпен немесе қаламұшпен жазыңыз.', en: 'Draw with a mouse, finger or stylus.' },
  panHint: { ru: 'Перетащите доску или используйте клавиши со стрелками. Home вернёт к началу.', kz: 'Тақтаны сүйреңіз немесе бағыттау пернелерін басыңыз. Home бастапқы орынға қайтарады.', en: 'Drag the board or use the arrow keys. Home returns to the origin.' },
  unavailable: { ru: 'Браузер не смог открыть доску.', kz: 'Браузер тақтаны аша алмады.', en: 'The browser could not open the board.' },
};

export type BoardLabel = keyof typeof labels;
export const boardLabel = (lang: Language, key: BoardLabel) => labels[key][lang];
