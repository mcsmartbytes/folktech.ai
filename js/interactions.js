/**
 * FolkTech.AI - Interactive Features
 * Handles brain node interactions, video modals, particles, and scroll animations
 */

(function() {
    'use strict';

    // ========================================
    // Configuration
    // ========================================
    const CONFIG = {
        // Video sources for each node (placeholder paths - replace with actual videos)
        videos: {
            'node-1': { title: 'Neural Processing', src: 'assets/videos/neural-processing.mp4' },
            'node-2': { title: 'Memory Systems', src: 'assets/videos/memory-systems.mp4' },
            'node-3': { title: 'Pattern Recognition', src: 'assets/videos/pattern-recognition.mp4' },
            'node-4': { title: 'Language Models', src: 'assets/videos/language-models.mp4' },
            'node-5': { title: 'Visual Processing', src: 'assets/videos/visual-processing.mp4' },
            'node-6': { title: 'Data Analytics', src: 'assets/videos/data-analytics.mp4' },
            'node-7': { title: 'Decision Engine', src: 'assets/videos/decision-engine.mp4' },
            'node-8': { title: 'Knowledge Graph', src: 'assets/videos/knowledge-graph.mp4' },
            'node-core': { title: 'AI Core Engine', src: 'assets/videos/ai-core.mp4' }
        },
        particleCount: 50,
        connectionParticleInterval: 100
    };

    // ========================================
    // DOM Elements
    // ========================================
    const brain = document.getElementById('interactiveBrain');
    const nodes = document.querySelectorAll('.brain-node');
    const tooltip = document.getElementById('nodeTooltip');
    const tooltipText = tooltip?.querySelector('.tooltip-text');
    const videoModal = document.getElementById('videoModal');
    const videoModalTitle = videoModal?.querySelector('.video-modal-title');
    const videoPlaceholder = document.getElementById('videoPlaceholder');
    const videoPlayer = document.getElementById('videoPlayer');
    const modalClose = videoModal?.querySelector('.video-modal-close');
    const modalOverlay = videoModal?.querySelector('.video-modal-overlay');
    const particleCanvas = document.getElementById('particleCanvas');

    // ========================================
    // Brain Node Interactions
    // ========================================
    function initBrainNodes() {
        if (!nodes.length || !tooltip) return;

        nodes.forEach(node => {
            // Get node position for tooltip
            const getNodeCenter = () => {
                const nodeBg = node.querySelector('.node-bg');
                if (!nodeBg) return { x: 0, y: 0 };
                const cx = parseFloat(nodeBg.getAttribute('cx'));
                const cy = parseFloat(nodeBg.getAttribute('cy'));
                return { x: cx, y: cy };
            };

            // Mouse enter - show tooltip
            node.addEventListener('mouseenter', (e) => {
                const title = node.dataset.title;
                if (tooltipText) tooltipText.textContent = title;

                // Position tooltip near the node
                const brainRect = brain.getBoundingClientRect();
                const center = getNodeCenter();
                const scaleX = brainRect.width / 400;
                const scaleY = brainRect.height / 400;

                const tooltipX = brainRect.left + (center.x * scaleX);
                const tooltipY = brainRect.top + (center.y * scaleY) - 60;

                tooltip.style.left = `${tooltipX}px`;
                tooltip.style.top = `${tooltipY}px`;
                tooltip.style.transform = 'translateX(-50%)';
                tooltip.classList.add('visible');

                // Add pulse effect to connected lines
                highlightConnections(node.dataset.node);
            });

            // Mouse leave - hide tooltip
            node.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
                clearConnectionHighlights();
            });

            // Click - open video modal
            node.addEventListener('click', () => {
                const nodeId = node.dataset.node;
                const videoData = CONFIG.videos[nodeId];
                if (videoData) {
                    openVideoModal(videoData.title, videoData.src);
                }
            });
        });
    }

    // Highlight connections when hovering over a node
    function highlightConnections(nodeId) {
        const lines = document.querySelectorAll('.circuit-line');
        lines.forEach(line => {
            line.style.strokeWidth = '3';
            line.style.filter = 'url(#glow)';
        });
    }

    function clearConnectionHighlights() {
        const lines = document.querySelectorAll('.circuit-line');
        lines.forEach(line => {
            line.style.strokeWidth = '2';
            line.style.filter = 'none';
        });
    }

    // ========================================
    // Video Modal
    // ========================================
    function openVideoModal(title, videoSrc) {
        if (!videoModal) return;

        // Set title
        if (videoModalTitle) videoModalTitle.textContent = title;

        // Check if video exists (for now, always show placeholder)
        // When you add videos, you can check if the file exists
        const hasVideo = false; // Set to true when videos are available

        if (hasVideo && videoPlayer) {
            videoPlaceholder.style.display = 'none';
            videoPlayer.style.display = 'block';
            videoPlayer.querySelector('source').src = videoSrc;
            videoPlayer.load();
        } else {
            if (videoPlaceholder) videoPlaceholder.style.display = 'flex';
            if (videoPlayer) videoPlayer.style.display = 'none';
        }

        // Show modal
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Add escape key listener
        document.addEventListener('keydown', handleEscapeKey);
    }

    function closeVideoModal() {
        if (!videoModal) return;

        videoModal.classList.remove('active');
        document.body.style.overflow = '';

        // Pause video if playing
        if (videoPlayer) {
            videoPlayer.pause();
            videoPlayer.currentTime = 0;
        }

        // Remove escape key listener
        document.removeEventListener('keydown', handleEscapeKey);
    }

    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            closeVideoModal();
        }
    }

    function initVideoModal() {
        if (modalClose) {
            modalClose.addEventListener('click', closeVideoModal);
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeVideoModal);
        }
    }

    // ========================================
    // Particle Background
    // ========================================
    let particles = [];
    let animationId = null;

    function initParticles() {
        if (!particleCanvas) return;

        const ctx = particleCanvas.getContext('2d');
        let width, height;

        function resize() {
            width = particleCanvas.width = particleCanvas.offsetWidth;
            height = particleCanvas.height = particleCanvas.offsetHeight;
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < CONFIG.particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 2 + 1,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((particle, i) => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Wrap around edges
                if (particle.x < 0) particle.x = width;
                if (particle.x > width) particle.x = 0;
                if (particle.y < 0) particle.y = height;
                if (particle.y > height) particle.y = 0;

                // Draw particle - using cyan color from logo
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
                ctx.fill();

                // Draw connections to nearby particles
                particles.slice(i + 1).forEach(other => {
                    const dx = particle.x - other.x;
                    const dy = particle.y - other.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - distance / 100)})`;
                        ctx.stroke();
                    }
                });
            });

            animationId = requestAnimationFrame(drawParticles);
        }

        // Initialize
        resize();
        createParticles();
        drawParticles();

        // Handle resize
        window.addEventListener('resize', () => {
            resize();
            createParticles();
        });

        // Pause animation when not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                drawParticles();
            }
        });
    }

    // ========================================
    // Data Flow Particles in Brain
    // ========================================
    function initDataFlowParticles() {
        const dataParticlesGroup = document.getElementById('dataParticles');
        if (!dataParticlesGroup) return;

        const paths = [
            { start: { x: 130, y: 160 }, end: { x: 200, y: 180 } },
            { start: { x: 270, y: 160 }, end: { x: 200, y: 180 } },
            { start: { x: 120, y: 200 }, end: { x: 200, y: 180 } },
            { start: { x: 280, y: 200 }, end: { x: 200, y: 180 } },
            { start: { x: 200, y: 180 }, end: { x: 200, y: 240 } },
            { start: { x: 200, y: 240 }, end: { x: 200, y: 300 } }
        ];

        function createFlowParticle() {
            const path = paths[Math.floor(Math.random() * paths.length)];
            const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

            particle.setAttribute('r', '3');
            particle.setAttribute('fill', 'url(#brainGradient)');
            particle.setAttribute('cx', path.start.x);
            particle.setAttribute('cy', path.start.y);
            particle.style.opacity = '0';

            dataParticlesGroup.appendChild(particle);

            // Animate the particle
            const duration = 1000 + Math.random() * 500;
            const startTime = performance.now();

            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease in-out
                const eased = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                const x = path.start.x + (path.end.x - path.start.x) * eased;
                const y = path.start.y + (path.end.y - path.start.y) * eased;

                particle.setAttribute('cx', x);
                particle.setAttribute('cy', y);

                // Fade in and out
                const opacity = progress < 0.2 ? progress * 5 : progress > 0.8 ? (1 - progress) * 5 : 1;
                particle.style.opacity = opacity;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            }

            requestAnimationFrame(animate);
        }

        // Create particles periodically
        setInterval(createFlowParticle, CONFIG.connectionParticleInterval);
    }

    // ========================================
    // Scroll Reveal Animations
    // ========================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.about-card, .service-card, .tech-feature, .section-title');

        if (!revealElements.length) return;

        // Add reveal class
        revealElements.forEach(el => {
            el.classList.add('reveal-up');
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Get delay from data attribute
                    const delay = parseInt(entry.target.dataset.delay) || 0;

                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }

    // ========================================
    // Electric Card Spark Effect
    // ========================================
    function initElectricSparks() {
        const electricCards = document.querySelectorAll('.electric-card');

        electricCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                // Create spark at entry point
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                createSpark(card, x, y);
            });
        });
    }

    function createSpark(card, x, y) {
        const spark = document.createElement('div');
        spark.className = 'spark-effect';
        spark.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 10px;
            height: 10px;
            background: white;
            border-radius: 50%;
            pointer-events: none;
            z-index: 100;
            box-shadow: 0 0 10px #00D4FF, 0 0 20px #00D4FF, 0 0 30px #A855F7;
            animation: sparkAnimation 0.5s ease-out forwards;
        `;

        // Add animation keyframes if not exists
        if (!document.querySelector('#spark-animation-style')) {
            const style = document.createElement('style');
            style.id = 'spark-animation-style';
            style.textContent = `
                @keyframes sparkAnimation {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(3); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        card.appendChild(spark);

        // Remove after animation
        setTimeout(() => spark.remove(), 500);
    }

    // ========================================
    // Mouse Parallax Effect on Hero
    // ========================================
    function initMouseParallax() {
        const heroVisual = document.querySelector('.hero-visual');
        const heroSection = document.querySelector('.hero');

        if (!heroVisual || !heroSection) return;

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            heroVisual.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            heroVisual.style.transform = 'translate(0, 0)';
        });
    }

    // ========================================
    // Typing Effect for Hero Title
    // ========================================
    function initTypingEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.visibility = 'visible';

        let i = 0;
        const speed = 50;

        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }

        // Start typing after a short delay
        setTimeout(typeWriter, 500);
    }

    // ========================================
    // Interactive Logo 3D Effect
    // ========================================
    function initInteractiveLogo() {
        const logo = document.querySelector('.interactive-logo');
        if (!logo) return;

        logo.addEventListener('mousemove', (e) => {
            const rect = logo.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Movement strength
            const moveX = ((x - centerX) / centerX) * 12;
            const moveY = ((y - centerY) / centerY) * 12;

            // Subtle tilt for 3D effect
            const rotateX = ((y - centerY) / centerY) * 6;
            const rotateY = ((x - centerX) / centerX) * -6;

            logo.style.transform = `
                translate(${moveX}px, ${moveY}px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale(1.04)
            `;
        });

        logo.addEventListener('mouseleave', () => {
            logo.style.transform = `
                translate(0px, 0px)
                rotateX(0deg)
                rotateY(0deg)
                scale(1)
            `;
        });
    }

    // ========================================
    // Initialize All Interactions
    // ========================================
    function init() {
        initBrainNodes();
        initVideoModal();
        initParticles();
        initDataFlowParticles();
        initScrollReveal();
        initElectricSparks();
        initMouseParallax();
        initInteractiveLogo();
        // Uncomment for typing effect: initTypingEffect();

        console.log('FolkTech.AI interactions initialized');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
