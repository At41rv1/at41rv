// Starfield background
(function starfield() {
    const canvas = document.getElementById('stars');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let width = 0,
        height = 0,
        dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
        width = canvas.clientWidth || window.innerWidth;
        height = canvas.clientHeight || window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        spawn();
    }

    function spawn() {
        const count = Math.floor((width * height) / 9000);
        stars = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * 0.6 + 0.4,
            a: Math.random() * Math.PI * 2,
            s: Math.random() * 0.6 + 0.2
        }));
    }

    function tick(t) {
        ctx.clearRect(0, 0, width, height);
        for (const st of stars) {
            st.a += 0.0015 * st.z;
            const flicker = 0.6 + Math.sin(st.a) * 0.4;
            ctx.fillStyle = `rgba(230,230,255,${0.2 + 0.8 * st.z * flicker})`;
            ctx.fillRect(st.x, st.y, st.s, st.s);
        }
        requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(tick);
})();

// Reveal on scroll
(function revealOnScroll() {
    const items = Array.from(document.querySelectorAll('[data-animate]'));
    if (!('IntersectionObserver' in window) || items.length === 0) {
        items.forEach(el => el.classList.add('in-view'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in-view');
                io.unobserve(e.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    items.forEach(el => io.observe(el));
})();

// Parallax for hero copy
(function parallax() {
    const el = document.querySelector('[data-parallax]');
    if (!el) return;
    let sx = 0,
        sy = 0;

    function onMove(e) {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        sx = x * 10;
        sy = y * 10;
        el.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
    }
    window.addEventListener('mousemove', onMove);
})();

// 3D tilt cards
(function tiltCards() {
    const cards = Array.from(document.querySelectorAll('[data-tilt]'));
    const maxTilt = 10; // degrees
    const perspective = 700;
    cards.forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        card.style.transform = `perspective(${perspective}px)`;
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;
            const rx = ((cy / rect.height) - 0.5) * -2 * maxTilt;
            const ry = ((cx / rect.width) - 0.5) * 2 * maxTilt;
            card.style.transform = `perspective(${perspective}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(0)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(${perspective}px) rotateX(0) rotateY(0)`;
        });
    });
})();

// Smooth scroll for internal links
(function smoothScroll() {
    const links = Array.from(document.querySelectorAll('a[href^="#"]'));
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - 68, behavior: 'smooth' });
        });
    });
})();

// Modal handling for case studies
(function caseModal() {
    const modal = document.getElementById('modal');
    if (!modal) return;
    const titleEl = document.getElementById('modalTitle');
    const bodyEl = document.getElementById('modalBody');
    const closeBtn = document.getElementById('modalClose');
    const opens = Array.from(document.querySelectorAll('[data-modal-open]'));

    function openModal(title, body) {
        titleEl.textContent = title || 'Case Study';
        bodyEl.textContent = body || '';
        modal.classList.add('open');
    }

    function closeModal() { modal.classList.remove('open'); }
    opens.forEach(el => el.addEventListener('click', (e) => {
        e.preventDefault();
        const t = el.getAttribute('data-modal-title');
        const b = el.getAttribute('data-modal-body');
        openModal(t, b);
    }));
    closeBtn && closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
})();

// Testimonials slider
(function testimonials() {
    const track = document.getElementById('tTrack');
    const prev = document.getElementById('tPrev');
    const next = document.getElementById('tNext');
    if (!track || !prev || !next) return;
    let index = 0;
    const slides = track.children.length;

    function update() { track.style.transform = `translateX(-${index * 100}%)`; }
    prev.addEventListener('click', () => {
        index = (index - 1 + slides) % slides;
        update();
    });
    next.addEventListener('click', () => {
        index = (index + 1) % slides;
        update();
    });
})();

// Flow-field animated background
(function flowField() {
    const canvas = document.getElementById('field');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = 0,
        height = 0,
        dpr = Math.min(window.devicePixelRatio || 1, 2);
    let t = 0;

    function resize() {
        width = canvas.clientWidth || window.innerWidth;
        height = canvas.clientHeight || window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function noise(x, y, z) {
        return Math.sin(x * 0.003 + z * 0.9) + Math.cos(y * 0.004 - z * 1.3);
    }

    function tick() {
        t += 0.003;
        ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = 1;
        for (let y = 0; y < height; y += 24) {
            ctx.beginPath();
            for (let x = 0; x < width; x += 24) {
                const a = noise(x, y, t) * Math.PI;
                const nx = x + Math.cos(a) * 14;
                const ny = y + Math.sin(a) * 14;
                ctx.strokeStyle = `rgba(180,180,255,${0.06 + 0.08*Math.abs(Math.sin(a))})`;
                ctx.moveTo(x, y);
                ctx.lineTo(nx, ny);
            }
            ctx.stroke();
        }
        requestAnimationFrame(tick);
    }
    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(tick);
})();

// Contact form handler
function handleContact(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');

    // Demo only: show a toast
    const toast = document.createElement('div');
    toast.textContent = 'Thanks! I will reply at ' + email + ' soon.';
    toast.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#11121a;border:1px solid rgba(255,255,255,.14);color:#e8e8ea;padding:12px 16px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.5);z-index:1000;';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
    form.reset();
    return false;
}

// Year in footer
(function year() {
    const y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());
})();