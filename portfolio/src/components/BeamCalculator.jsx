import { useState, useRef } from 'react';

export default function BeamCalculator() {
  const [load, setLoad] = useState(50);
  const [span, setSpan] = useState(10);
  const [loadPosition, setLoadPosition] = useState(5);
  const [result, setResult] = useState('Awaiting input parameters...');
  const [status, setStatus] = useState('');
  const outputRef = useRef(null);

  const compute = () => {
    const P = parseFloat(load);
    const L = parseFloat(span);
    const a = parseFloat(loadPosition);

    if (isNaN(P) || isNaN(L) || isNaN(a) || P <= 0 || L <= 0 || a <= 0) {
      setResult('ERR: Invalid Parameters. Require positive numerical inputs.');
      setStatus('error');
      return;
    }

    if (a > L) {
      setResult('ERR: Load position cannot exceed span length.');
      setStatus('error');
      return;
    }

    // Simply supported beam with off-center point load
    // Max deflection formula for off-center load:
    // b = L - a (distance from load to right support)
    // E = 200 GPa, I = 8.36e-6 m^4 (standard W-shape steel beam)
    const E = 200e9;
    const I = 8.36e-6;
    const Pn = P * 1000; // kN to N
    const b = L - a;

    // Maximum deflection for simply supported beam with off-center point load
    // delta_max = (P * b * (L^2 - b^2)^(3/2)) / (9 * sqrt(3) * L * E * I)
    // This occurs at x = sqrt((L^2 - b^2) / 3) from the nearest support
    const L2 = L * L;
    const b2 = b * b;
    const numerator = Pn * b * Math.pow(L2 - b2, 1.5);
    const denominator = 9 * Math.sqrt(3) * L * E * I;
    const deflectionMeters = numerator / denominator;
    const deflectionMm = (deflectionMeters * 1000).toFixed(3);

    setResult(`${deflectionMm} mm`);
    setStatus('success');

    if (outputRef.current) {
      outputRef.current.animate(
        [
          { backgroundColor: 'rgba(76, 175, 80, 0.3)' },
          { backgroundColor: 'rgba(0,0,0,0.3)' }
        ],
        { duration: 600, easing: 'ease-out' }
      );
    }
  };

  return (
    <section className="flex-center" style={{ paddingTop: 'var(--spacing-xl)' }}>
      <h2 className="section-title">Computational Engineering Demo</h2>
      <div className="glass-panel calculator-wrapper flex-column">
        <div className="calc-header">
          <h3>Interactive Beam Deflection Simulator</h3>
          <p className="mono-text sub-text">{'// Simply supported beam with off-center point load'}</p>
        </div>
        <div className="flex-row wrap-mobile" style={{ gap: 'var(--spacing-md)', alignItems: 'flex-end' }}>
          <div className="input-group flex-column">
            <label className="mono-text">Point Load (kN):</label>
            <input
              type="number"
              value={load}
              min="1"
              step="1"
              onChange={(e) => setLoad(e.target.value)}
            />
          </div>
          <div className="input-group flex-column">
            <label className="mono-text">Span Length (m):</label>
            <input
              type="number"
              value={span}
              min="1"
              step="0.5"
              onChange={(e) => setSpan(e.target.value)}
            />
          </div>
          <div className="input-group flex-column">
            <label className="mono-text">Load Position from End (m):</label>
            <input
              type="number"
              value={loadPosition}
              min="0.1"
              step="0.5"
              onChange={(e) => setLoadPosition(e.target.value)}
            />
          </div>
          <button className="tech-btn" onClick={compute}>Compute</button>
        </div>
        <div ref={outputRef} className={`calc-output ${status}`}>
          <span className="mono-text">{'> Output: '}</span>
          <span className="mono-text result-display">{result}</span>
        </div>
      </div>
    </section>
  );
}
