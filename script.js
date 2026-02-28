/**
 * Durdanta Halder Portfolio - Interaction Scripts
 * Emphasizes computational analytics and civil engineering simulations.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Digital Total Station Cursor [3, 31] ---
    const crossX = document.getElementById('crosshair-x');
    const crossY = document.getElementById('crosshair-y');
    const hud = document.getElementById('hud-coordinates');
    const coordX = document.getElementById('coord-x');
    const coordY = document.getElementById('coord-y');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Track mouse position passively
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    // Render loop using requestAnimationFrame for 60fps performance without layout thrashing
    function renderCursor() {
        crossX.style.transform = `translateY(${mouseY}px)`;
        crossY.style.transform = `translateX(${mouseX}px)`;
        hud.style.transform = `translate(${mouseX + 15}px, ${mouseY + 15}px)`;
        
        // Update HUD text simulating Total Station Easting (X) and Northing (Y) data
        coordX.innerText = mouseX.toFixed(1).padStart(6, '0');
        coordY.innerText = mouseY.toFixed(1).padStart(6, '0');
        
        requestAnimationFrame(renderCursor);
    }
    
    // Initialize cursor only if the user is on a precise pointer device (mouse), not touch screens
    if (window.matchMedia("(pointer: fine)").matches) {
        requestAnimationFrame(renderCursor);
    }

    // --- 2. SVG Blueprint Drawing on Scroll  ---
    const paths = document.querySelectorAll('.draw-path');

    // Initialize paths by calculating exact geometric length
    paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        // Store length as a data attribute for quick retrieval during scroll
        path.setAttribute('data-length', length);
    });

    // Scroll event listener (Optimized with requestAnimationFrame)
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                drawSVGOnScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    function drawSVGOnScroll() {
        paths.forEach(path => {
            const length = parseFloat(path.getAttribute('data-length'));
            const rect = path.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Determine percentage of element visible in the viewport
            if (rect.top < windowHeight && rect.bottom > 0) {
                // Calculate how far the element has progressed through the viewport
                const scrollPercentage = (windowHeight - rect.top) / (windowHeight + rect.height);
                // Clamp value between 0 (just appeared) and 1 (fully scrolled past)
                const clampedPercentage = Math.min(Math.max(scrollPercentage, 0), 1);
                
                // Draw path backwards (offset goes from length down to 0)
                const drawLength = length * (1 - clampedPercentage);
                path.style.strokeDashoffset = drawLength;
            }
        });
    }

    // --- 3. Horizontal Scroll Mechanics  ---
    // Translates vertical wheel scrolling into horizontal container scrolling
    const horizontalSection = document.querySelector('.horizontal-wrapper');
    const horizontalContainer = document.querySelector('.horizontal-container');

    if (horizontalSection && window.innerWidth > 768) {
        horizontalSection.addEventListener('wheel', (e) => {
            // Prevent default vertical scroll while hovering over the timeline section
            e.preventDefault();
            // Scroll the container horizontally by the amount of the vertical wheel delta
            horizontalContainer.scrollLeft += e.deltaY;
            
            // Allow vertical scrolling to resume if the user reaches the absolute start or end of the horizontal track
            const atStart = horizontalContainer.scrollLeft === 0 && e.deltaY < 0;
            const atEnd = horizontalContainer.scrollLeft >= (horizontalContainer.scrollWidth - horizontalContainer.clientWidth) && e.deltaY > 0;
            
            if (atStart |

| atEnd) {
                window.scrollBy(0, e.deltaY);
            }
        }, { passive: false });
    }

    // --- 4. Interactive Structural Calculator (JavaScript Engineering Demo) [7, 12, 36] ---
    const calcBtn = document.getElementById('calc-btn');
    const resultDisplay = document.getElementById('calc-result');
    const outputContainer = document.querySelector('.calc-output');

    if (calcBtn) {
        calcBtn.addEventListener('click', () => {
            const loadInput = parseFloat(document.getElementById('beam-load').value);
            const spanInput = parseFloat(document.getElementById('beam-span').value);
            
            // Input Validation
            if (isNaN(loadInput) |

| isNaN(spanInput) |
| loadInput <= 0 |
| spanInput <= 0) {
                resultDisplay.innerText = "ERR: Invalid Parameters. Require positive numerical inputs.";
                outputContainer.style.borderLeftColor = "var(--accent-red)";
                return;
            }
            
            // Analytical computation: Deflection of a simply supported beam with a central point load
            // Formula: Deflection = (P * L^3) / (48 * E * I)
            // Assuming a standard W-Shape Steel Beam for simulation context (E = 200 GPa, I = 8.36e-6 m^4)
            const E = 200 * Math.pow(10, 9); // Modulus of Elasticity in N/m^2
            const I = 8.36 * Math.pow(10, -6); // Moment of Inertia in m^4
            const P = loadInput * 1000; // Convert load from kN to Newtons
            const L = spanInput; // Span length in meters
            
            // Execute calculation
            const deflectionMeters = (P * Math.pow(L, 3)) / (48 * E * I);
            const deflectionMm = (deflectionMeters * 1000).toFixed(3); // Convert to millimeters for readability
            
            // Display Result
            resultDisplay.innerText = `${deflectionMm} mm`;
            outputContainer.style.borderLeftColor = "#4CAF50"; // Success Green border
            
            // Add brief CSS pulse animation to draw attention to the processed result
            outputContainer.animate([
                { backgroundColor: 'rgba(76, 175, 80, 0.3)' },
                { backgroundColor: 'rgba(0,0,0,0.3)' }
            ], { duration: 600, easing: 'ease-out' });
        });
    }
});

// --- 5. Generative Topographical Network Background (p5.js) [8, 37] ---
// This standalone function leverages the globally included p5 library
function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    // Configure drawing settings
    stroke(161, 160, 160, 50); // Structural Gray with low opacity
    strokeWeight(1);
    fill(229, 33, 101, 150); // Safety Laser Red nodes
}

// Generate an array of nodes representing survey points
let nodes =;
for (let i = 0; i < 100; i++) {
    nodes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
    });
}

function draw() {
    clear(); // Clear canvas each frame for transparency over CSS background
    
    // Update and draw nodes
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        
        // Move nodes
        node.x += node.vx;
        node.y += node.vy;
        
        // Wrap around screen edges
        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;
        
        // Draw the physical node point
        noStroke();
        ellipse(node.x, node.y, 3, 3);
        
        // Draw connecting lines if nodes are within a specific proximity threshold
        // Simulates triangulated network generation in geomatics
        stroke(161, 160, 160, 40);
        for (let j = i + 1; j < nodes.length; j++) {
            let other = nodes[j];
            let d = dist(node.x, node.y, other.x, other.y);
            if (d < 120) {
                line(node.x, node.y, other.x, other.y);
            }
        }
        
        // Interactive element: Nodes react to the mouse (Total Station cursor)
        let mouseDist = dist(mouseX, mouseY, node.x, node.y);
        if (mouseDist < 150) {
            stroke(229, 33, 101, 80); // Red lines connect to the cursor area
            line(mouseX, mouseY, node.x, node.y);
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
