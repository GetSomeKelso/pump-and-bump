export default function ProgressRing({ target, logged }) {
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = target > 0 ? Math.min(logged / target, 1) : 1;
  const offset = circumference - progress * circumference;
  const isComplete = logged >= target && target > 0;
  const ringColor = isComplete ? '#6b8f3c' : '#556b2f';
  const remaining = Math.max(target - logged, 0);

  return (
    <div className="flex flex-col items-center my-6">
      <svg width={size} height={size} className="block">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#c2c1a5"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
        />
        {/* Center text */}
        <text
          x="50%"
          y="46%"
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: isComplete ? '42px' : '36px',
            fontWeight: 'bold',
            fill: isComplete ? '#6b8f3c' : '#2a2e1f',
          }}
        >
          {isComplete ? '\u2713' : remaining}
        </text>
        <text
          x="50%"
          y="62%"
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: '13px',
            fill: '#6b6e5a',
          }}
        >
          {isComplete ? 'Complete!' : 'to go'}
        </text>
      </svg>
    </div>
  );
}
