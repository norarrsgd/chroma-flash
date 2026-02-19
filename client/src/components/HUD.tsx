
interface Props {
  lives: number;
  level: number;
  score: number;
}

export default function HUD({ lives, level, score }: Props) {
  return (
    <div className="hud">
      <div className="hud-hearts">
        {Array.from({ length: lives }, (_, i) => (
          <span key={i} className="heart">&#10084;&#65039;</span>
        ))}
        {Array.from({ length: 3 - lives }, (_, i) => (
          <span key={`empty-${i}`} className="heart heart-empty">&#10084;&#65039;</span>
        ))}
      </div>
      <div className="hud-level">Level {level}</div>
      <div className="hud-score">Score: {score}</div>
    </div>
  );
}
