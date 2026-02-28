import { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import BeamCalculator from './components/BeamCalculator';

export default function App() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const canvasRef = useRef(null);
  const svgPathRef = useRef(null);
  const horizontalRef = useRef(null);
  const horizontalContainerRef = useRef(null);
  const isFinePointer = useRef(false);

  // --- Custom Cursor HUD ---
  useEffect(() => {
    isFinePointer.current = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer.current) return;

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // --- SVG Blueprint Draw-on-Scroll ---
  useEffect(() => {
    const path = svgPathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = path.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          if (rect.top < windowHeight && rect.bottom > 0) {
            const scrollPercentage = (windowHeight - rect.top) / (windowHeight + rect.height);
            const clamped = Math.min(Math.max(scrollPercentage, 0), 1);
            path.style.strokeDashoffset = length * (1 - clamped);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Horizontal Scroll Mechanics ---
  useEffect(() => {
    const section = horizontalRef.current;
    const container = horizontalContainerRef.current;
    if (!section || !container || window.innerWidth <= 768) return;

    const handleWheel = (e) => {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    };

    section.addEventListener('wheel', handleWheel, { passive: false });
    return () => section.removeEventListener('wheel', handleWheel);
  }, []);

  // --- p5.js Background ---
  useEffect(() => {
    if (!canvasRef.current) return;

    const sketch = (p) => {
      let nodes = [];

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(canvasRef.current);
        p.stroke(161, 160, 160, 50);
        p.strokeWeight(1);
        p.fill(229, 33, 101, 150);

        for (let i = 0; i < 80; i++) {
          nodes.push({
            x: Math.random() * p.windowWidth,
            y: Math.random() * p.windowHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
          });
        }
      };

      p.draw = () => {
        p.clear();
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0) node.x = p.width;
          if (node.x > p.width) node.x = 0;
          if (node.y < 0) node.y = p.height;
          if (node.y > p.height) node.y = 0;

          p.noStroke();
          p.fill(229, 33, 101, 150);
          p.ellipse(node.x, node.y, 3, 3);

          p.stroke(161, 160, 160, 40);
          for (let j = i + 1; j < nodes.length; j++) {
            const other = nodes[j];
            const d = p.dist(node.x, node.y, other.x, other.y);
            if (d < 120) {
              p.line(node.x, node.y, other.x, other.y);
            }
          }

          const mouseDist = p.dist(p.mouseX, p.mouseY, node.x, node.y);
          if (mouseDist < 150) {
            p.stroke(229, 33, 101, 80);
            p.line(p.mouseX, p.mouseY, node.x, node.y);
          }
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    const p5Instance = new p5(sketch);
    return () => p5Instance.remove();
  }, []);

  return (
    <>
      {/* p5.js Canvas Container */}
      <div ref={canvasRef} className="canvas-container" />

      {/* Custom Cursor HUD */}
      <div
        className="cursor-line crosshair-x"
        style={{ transform: `translateY(${mousePos.y}px)` }}
      />
      <div
        className="cursor-line crosshair-y"
        style={{ transform: `translateX(${mousePos.x}px)` }}
      />
      <div
        className="hud-coordinates"
        style={{ transform: `translate(${mousePos.x + 15}px, ${mousePos.y + 15}px)` }}
      >
        <span className="hud-label">E:</span>
        <span>{mousePos.x.toFixed(1).padStart(6, '0')}</span>
        <br />
        <span className="hud-label">N:</span>
        <span>{mousePos.y.toFixed(1).padStart(6, '0')}</span>
      </div>

      <main className="smooth-scroll-wrapper">
        {/* Hero Section */}
        <section className="flex-center">
          <div className="glass-panel text-center">
            <h1 className="tech-heading">DURDANTA HALDER</h1>
            <h2 className="sub-heading">Civil Engineering // Computational Analytics</h2>
            <p className="mono-text accent-color">
              Bipradas Pal Chowdhury Institute of Technology | 2025
            </p>
            <div className="hero-skills">
              <span className="skill-badge">Python</span>
              <span className="skill-badge">JavaScript</span>
              <span className="skill-badge">AutoCAD</span>
              <span className="skill-badge">Revit</span>
            </div>
          </div>
        </section>

        {/* Bento Grid - Technical Competencies */}
        <section className="bento-section">
          <h2 className="section-title">Technical Competencies &amp; Tools</h2>
          <div className="bento-grid">
            <div className="bento-item span-6-col span-2-row glass-panel hover-glow">
              <h3>Core Engineering Concepts</h3>
              <div className="flex-column gap-small">
                <div className="concept-item">Safety Engineering</div>
                <div className="concept-item">Environmental Engineering</div>
                <div className="concept-item">Public Health Engineering</div>
                <div className="concept-item">Project Management</div>
                <div className="concept-item">Construction Management</div>
              </div>
            </div>

            <div className="bento-item span-3-col glass-panel hover-tilt">
              <h3 className="bento-title">Surveying Equipment</h3>
              <ul className="clean-list mono-text">
                <li>Total Station</li>
                <li>Theodolite</li>
                <li>Laser Distance Measurer</li>
              </ul>
            </div>

            <div className="bento-item span-3-col glass-panel hover-tilt">
              <h3 className="bento-title">Material Diagnostics</h3>
              <ul className="clean-list mono-text">
                <li>Concrete Testing Machine (CTM)</li>
                <li>Rebound Hammer</li>
                <li>Slump Cone</li>
                <li>Hydrological Equipment</li>
              </ul>
            </div>

            <div className="bento-item span-6-col glass-panel highlight-border">
              <h3 className="bento-title">Computational Processing</h3>
              <p className="body-text">
                Proficient in <strong>Python</strong> with a focus on biological data analysis
                and big data handling. Utilizes <strong>JavaScript</strong> for data processing,
                scripting, and automating complex analytical tasks.
              </p>
            </div>
          </div>
        </section>

        {/* Horizontal Scroll Timeline */}
        <section className="horizontal-wrapper" ref={horizontalRef}>
          <h2 className="section-title sticky-title">Project Experience Timeline</h2>
          <div className="horizontal-container flex-row" ref={horizontalContainerRef}>
            <div className="project-panel glass-panel flex-column">
              <div className="project-header">
                <span className="project-date mono-text">2023 - 2024</span>
                <h3>Field Operations &amp; Inspections</h3>
              </div>
              <div className="project-body">
                <h4>Amghata-Krishnanagar Railway Track</h4>
                <p>
                  Inspected track conditions, including alignment, leveling, ballast,
                  sleepers, and rails under site engineer guidance. Studied rail
                  specifications and manufacturing processes.
                </p>
                <h4>Mother&apos;s Hut Restaurant Project</h4>
                <p>
                  Observed modern construction techniques prioritizing durability and
                  aesthetic appeal. Analyzed the implementation of stringent safety standards
                  and PPE utilization.
                </p>
              </div>
            </div>

            <div className="project-panel glass-panel flex-column">
              <div className="project-header">
                <span className="project-date mono-text">April 2024</span>
                <h3>Planning of G+2 Residential Building</h3>
              </div>
              <div className="project-body">
                <p>
                  Conducted extensive site analysis and surveys to gather essential data on
                  topography, soil conditions, and environmental factors. Developed detailed
                  architectural drawings including floor plans, elevations, and sections using
                  AutoCAD.
                </p>
                <div className="svg-container">
                  <svg
                    className="blueprint-svg"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      ref={svgPathRef}
                      className="draw-path"
                      d="M10,90 L10,10 L50,10 L50,90 Z M50,10 L90,10 L90,90 L50,90 M10,50 L90,50 M30,10 L30,90 M70,10 L70,90"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="project-panel glass-panel flex-column">
              <div className="project-header">
                <span className="project-date mono-text">November 2024</span>
                <h3>G+2 Residential Complex for MIG</h3>
              </div>
              <div className="project-body">
                <p>
                  Designed a comprehensive Middle-Income Group complex. Conducted thorough
                  geotechnical investigations and environmental impact assessments. Developed
                  architectural plans using advanced CAD software.
                </p>
                <p>
                  Designed structural frameworks and load-bearing elements ensuring safety
                  and compliance with building regulations. Incorporated cost-effective and
                  sustainable building materials.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Beam Calculator */}
        <BeamCalculator />
      </main>
    </>
  );
}
