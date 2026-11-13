export type Tool = 'pan' | 'pen' | 'line' | 'arrow' | 'rect' | 'ellipse' | 'text' | 'eraser';
export type Point = { x: number; y: number };
export type Ink = 'ink' | 'teal' | 'red' | 'blue';
export type StrokeWidth = 2 | 4 | 7;
type Style = { ink: Ink; width: StrokeWidth };
type Stroke = Style & { tool: 'pen' | 'eraser'; points: Point[] };
type Shape = Style & { tool: 'line' | 'arrow' | 'rect' | 'ellipse'; start: Point; end: Point };
type TextMark = Style & { tool: 'text'; start: Point; value: string };
export type Mark = Stroke | Shape | TextMark;
export type Action = Mark | { tool: 'clear' };
export type History = { done: Action[]; undone: Action[] };
export const emptyHistory: History = { done: [], undone: [] };

export const inkTokens: Record<Ink, string> = {
  ink: '--text-primary',
  teal: '--primary',
  red: '--accent-rose',
  blue: '--chart-3',
};

export function drawMark(ctx: CanvasRenderingContext2D, mark: Mark, colors: Record<Ink, string>) {
  ctx.save();
  ctx.strokeStyle = colors[mark.ink];
  ctx.fillStyle = ctx.strokeStyle;
  ctx.lineWidth = mark.tool === 'eraser' ? 8 + mark.width * 4 : mark.width;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (mark.tool === 'text') {
    ctx.font = '22px Arial, sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(mark.value, mark.start.x, mark.start.y);
  } else if ('points' in mark) {
    if (mark.tool === 'eraser') ctx.globalCompositeOperation = 'destination-out';
    const [first, ...points] = mark.points;
    if (points.length) {
      ctx.moveTo(first.x, first.y);
      for (const point of points) ctx.lineTo(point.x, point.y);
      ctx.stroke();
    } else {
      ctx.arc(first.x, first.y, ctx.lineWidth / 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  } else {
    const { start, end } = mark;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    if (mark.tool === 'rect') {
      ctx.rect(start.x, start.y, dx, dy);
    } else if (mark.tool === 'ellipse') {
      ctx.ellipse(start.x + dx / 2, start.y + dy / 2, Math.abs(dx / 2), Math.abs(dy / 2), 0, 0, 2 * Math.PI);
    } else {
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      if (mark.tool === 'arrow') {
        const angle = Math.atan2(dy, dx);
        const head = Math.min(10 + mark.width, Math.hypot(dx, dy) / 2);
        ctx.moveTo(end.x - head * Math.cos(angle - Math.PI / 6), end.y - head * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(end.x, end.y);
        ctx.lineTo(end.x - head * Math.cos(angle + Math.PI / 6), end.y - head * Math.sin(angle + Math.PI / 6));
      }
    }
    ctx.stroke();
  }
  ctx.restore();
}
