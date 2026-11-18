/**
 * SKYNET SOLUSINDO — script.js
 * Landing Page Premium v2.0
 * Fitur: Loader, Particle Canvas, Multi-Page Navigation,
 *        Stats Counter, Scroll Reveal, FAQ, Filter Portofolio, Form Handler, Back To Top
 */

    (function () {
        'use strict';

        /* ═══════════════════════════════════════════════════
           1. PAGE DATA / ROUTES
        ════════════════════════════════════════════════════ */
        const PAGES = ['home', 'layanan', 'harga', 'portofolio', 'tim', 'kontak'];
        const PAGE_TITLES = {
            home: 'Beranda',
            layanan: 'Layanan',
            harga: 'Paket Harga',
            portofolio: 'Portofolio',
            tim: 'Tim Kami',
            kontak: 'Kontak',
        };

            /* ═══════════════════════════════════════════════════
               2. DOM HELPERS
            ════════════════════════════════════════════════════ */
            const $ = (s, ctx = document) => ctx.querySelector(s);
            const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

            /* ═══════════════════════════════════════════════════
               3. LOADER SCREEN
            ════════════════════════════════════════════════════ */
            function initLoader() {
                const loader = $('#loader');
                if (!loader) return;
                // Hide after animation finishes (1.8s fill + 0.4s delay)
                setTimeout(() => {
                    loader.classList.add('hidden');
                    document.body.style.overflow = '';
                }, 2400);
                document.body.style.overflow = 'hidden';
            }

            /* ═══════════════════════════════════════════════════
               4. PARTICLE CANVAS (Network Nodes Background)
            ════════════════════════════════════════════════════ */
            function initParticles() {
                const canvas = $('#particleCanvas');
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                let W, H, particles = [], animId;

                function resize() {
                    W = canvas.width = window.innerWidth;
                    H = canvas.height = window.innerHeight;
                }

                function Particle() {
                    this.x = Math.random() * W;
                    this.y = Math.random() * H;
                    this.r = Math.random() * 1.8 + 0.5;
                    this.vx = (Math.random() - 0.5) * 0.4;
                    this.vy = (Math.random() - 0.5) * 0.4;
                    this.alpha = Math.random() * 0.5 + 0.1;
                }

                Particle.prototype.update = function () {
                    this.x += this.vx;
                    this.y += this.vy;
                    if (this.x < 0 || this.x > W) this.vx *= -1;
                    if (this.y < 0 || this.y > H) this.vy *= -1;
                };

                    function spawn(n = 90) {
                        for (let i = 0; i < n; i++) particles.push(new Particle());
                    }

                    function draw() {
                        ctx.clearRect(0, 0, W, H);
                        // Draw connections
                        for (let i = 0; i < particles.length; i++) {
                            for (let j = i + 1; j < particles.length; j++) {
                                const dx = particles[i].x - particles[j].x;
                                const dy = particles[i].y - particles[j].y;
                                const dist = Math.sqrt(dx * dx + dy * dy);
                                if (dist < 130) {
                                    const alpha = (1 - dist / 130) * 0.2;
                                    ctx.beginPath();
                                    ctx.moveTo(particles[i].x, particles[i].y);
                                    ctx.lineTo(particles[j].x, particles[j].y);
                                    ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
                                    ctx.lineWidth = 0.6;
                                    ctx.stroke();
                                }
                            }
                        }
                        // Draw dots
                        particles.forEach(p => {
                            p.update();
                            ctx.beginPath();
                            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                            ctx.fillStyle = `rgba(0,212,255,${p.alpha})`;
                            ctx.fill();
                        });
                        animId = requestAnimationFrame(draw);
                    }

                    resize();
                    spawn();
                    draw();
                    window.addEventListener('resize', () => {
                        resize();
                        cancelAnimationFrame(animId);
                        particles = [];
                        spawn();
                        draw();
                    });
                }

                /* ═══════════════════════════════════════════════════
                   5. MULTI-PAGE NAVIGATION SYSTEM
                ════════════════════════════════════════════════════ */
                let currentPage = 'home';
                let statsAnimated = false;

                function switchPage(pageId, pushState = true) {
                    if (!PAGES.includes(pageId)) pageId = 'home';
                    if (pageId === currentPage && document.getElementById(`page-${pageId}`)?.classList.contains('active-page')) return;

                    // Hide all pages
                    $$('.page').forEach(p => {
                        p.classList.remove('active-page', 'page-enter');
                    });

                    // Show target page
                    const target = $(`#page-${pageId}`);
                    if (target) {
                        target.classList.add('active-page', 'page-enter');
                        target.style.display = 'block';
                    }

                        // Update nav items
                        $$('.nav-item, .mnav-item').forEach(el => {
                            el.classList.toggle('active', el.getAttribute('data-page') === pageId);
                        });

                        // Update page indicator dots
                        $$('.pi-dot').forEach(d => {
                            d.classList.toggle('active', d.getAttribute('data-page') === pageId);
                        });

                            // Update document title
                            document.title = `${PAGE_TITLES[pageId]} — SkyNet Solusindo`;

                            // URL hash
                            if (pushState && window.location.hash !== `#${pageId}`) {
                                history.pushState(null, '', `#${pageId}`);
                            }

                            // Scroll to top
                            window.scrollTo({ top: 0, behavior: 'smooth' });

                                // Close mobile nav
                                closeMobileNav();

                                // Trigger scroll reveal for new page
                                setTimeout(() => {
                                    observeAnimations();
                                    // Animate stats if home page
                                    if (pageId === 'home' && !statsAnimated) {
                                        setTimeout(animateStats, 400);
                                    }
                                }, 50);

                                currentPage = pageId;
                            }

                            /* ═══════════════════════════════════════════════════
                               6. BIND ALL [data-page] TRIGGERS
                            ════════════════════════════════════════════════════ */
                            function bindNavigation() {
                                document.addEventListener('click', function (e) {
                                    // Nav page triggers
                                    const trigger = e.target.closest('[data-page]');
                                    if (trigger) {
                                        const page = trigger.getAttribute('data-page');
                                        if (PAGES.includes(page)) {
                                            e.preventDefault();
                                            switchPage(page);
                                            addClickRipple(e, trigger);
                                        }
                                    }
                                });

                                // Browser back/forward
                                window.addEventListener('popstate', () => {
                                    const hash = location.hash.replace('#', '');
                                    switchPage(hash || 'home', false);
                                });

                            // Initial page from hash
                            const initHash = location.hash.replace('#', '');
                            switchPage(PAGES.includes(initHash) ? initHash : 'home', false);
                        }

                        /* ═══════════════════════════════════════════════════
                           7. HEADER SCROLL EFFECT
                        ════════════════════════════════════════════════════ */
                        function initHeaderScroll() {
                            const header = $('#mainHeader');
                            if (!header) return;
                            window.addEventListener('scroll', () => {
                                header.classList.toggle('scrolled', window.scrollY > 50);
                            }, { passive: true });
                        }

                            /* ═══════════════════════════════════════════════════
                               8. MOBILE HAMBURGER MENU
                            ════════════════════════════════════════════════════ */
                            function initMobileNav() {
                                const btn = $('#hamburger');
                                const nav = $('#mobileNav');
                                if (!btn || !nav) return;
                                btn.addEventListener('click', () => {
                                    const isOpen = nav.classList.toggle('open');
                                    btn.classList.toggle('open', isOpen);
                                    document.body.style.overflow = isOpen ? 'hidden' : '';
                                });
                            }

                                function closeMobileNav() {
                                    const btn = $('#hamburger');
                                    const nav = $('#mobileNav');
                                    if (!nav) return;
                                    nav.classList.remove('open');
                                    if (btn) btn.classList.remove('open');
                                    document.body.style.overflow = '';
                                }

                                /* ═══════════════════════════════════════════════════
                                   9. STATS COUNTER ANIMATION
                                ════════════════════════════════════════════════════ */
                                function animateStats() {
                                    const statEls = $$('[data-count]');
                                    if (!statEls.length) return;
                                    statsAnimated = true;

                                    statEls.forEach(el => {
                                        const target = parseInt(el.getAttribute('data-count'), 10);
                                        let start = 0;
                                        const duration = 1800;
                                        const startTime = performance.now();

                                        function step(now) {
                                            const elapsed = now - startTime;
                                            const progress = Math.min(elapsed / duration, 1);
                                            const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart
                                            start = Math.round(eased * target);
                                            el.textContent = start;
                                            if (progress < 1) requestAnimationFrame(step);
                                        }
                                        requestAnimationFrame(step);
                                    });
                                }

                                /* ═══════════════════════════════════════════════════
                                   10. SCROLL REVEAL (IntersectionObserver)
                                ════════════════════════════════════════════════════ */
                                function observeAnimations() {
                                    const els = $$('[data-anim]:not(.animated)');
                                    if (!els.length) return;

                                    if (!window.IntersectionObserver) {
                                        els.forEach(el => el.classList.add('animated'));
                                        return;
                                    }

                                            const obs = new IntersectionObserver((entries) => {
                                                entries.forEach(entry => {
                                                    if (entry.isIntersecting) {
                                                        entry.target.classList.add('animated');
                                                        obs.unobserve(entry.target);
                                                    }
                                                });
                                            }, { threshold: 0.12 });

                                            els.forEach(el => obs.observe(el));
                                        }

                                        /* ═══════════════════════════════════════════════════
                                           11. FAQ ACCORDION
                                        ════════════════════════════════════════════════════ */
                                        function initFAQ() {
                                            document.addEventListener('click', function (e) {
                                                const btn = e.target.closest('.faq-q');
                                                if (!btn) return;
                                                const item = btn.closest('.faq-item');
                                                const isOpen = item.classList.contains('open');

                                                // Close all
                                                $$('.faq-item.open').forEach(open => open.classList.remove('open'));

                                                // Toggle clicked
                                                if (!isOpen) item.classList.add('open');
                                            });
                                        }

                                                /* ═══════════════════════════════════════════════════
                                                   12. PORTFOLIO FILTER TABS
                                                ════════════════════════════════════════════════════ */
                                                function initPortfolioFilter() {
                                                    document.addEventListener('click', function (e) {
                                                        const tab = e.target.closest('.ftab');
                                                        if (!tab) return;

                                                        const filter = tab.getAttribute('data-filter');
                                                        $$('.ftab').forEach(t => t.classList.remove('active'));
                                                        tab.classList.add('active');

                                                    $$('.port-card').forEach(card => {
                                                        const cat = card.getAttribute('data-cat');
                                                        const show = filter === 'all' || cat === filter;
                                                        card.style.opacity = show ? '1' : '0.2';
                                                        card.style.transform = show ? 'scale(1)' : 'scale(0.95)';
                                                        card.style.pointerEvents = show ? 'auto' : 'none';
                                                        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                                                    });
                                                });
                                        }

                                        /* ═══════════════════════════════════════════════════
                                           13. CONTACT FORM HANDLER
                                        ════════════════════════════════════════════════════ */
                                        function initContactForm() {
                                            const form = $('#contactForm');
                                            const submitBtn = $('#submitBtn');
                                            const successEl = $('#formSuccess');
                                            if (!form) return;

                                                    form.addEventListener('submit', function (e) {
                                                        e.preventDefault();

                                                        const nama = $('#inp-nama')?.value.trim();
                                                        const telepon = $('#inp-wa')?.value.trim();
                                                        const layanan = $('#inp-layanan')?.value;
                                                        const area = $('#inp-area')?.value;
                                                        const pesan = $('#inp-pesan')?.value.trim();

                                                        if (!nama || !telepon || !layanan || !area || !pesan) {
                                                            shakeElement(submitBtn);
                                                            return;
                                                        }

                                                        // Loading state
                                                        submitBtn.disabled = true;
                                                        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';

                                                            setTimeout(() => {
                                                                // Show success
                                                                if (successEl) successEl.classList.remove('hidden');
                                                                submitBtn.disabled = false;
                                                                submitBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Kirim ke WhatsApp Teknisi';
                                                                submitBtn.classList.add('btn-wa-override');

                                                                // Build WA message
                                                                const msg = encodeURIComponent(
                                                                    `Halo SkyNet Solusindo Surakarta!\n\nSaya ingin memesan layanan jaringan:\n- Nama: ${nama}\n- WhatsApp: ${telepon}\n- Layanan: ${layanan}\n- Wilayah: ${area}\n- Deskripsi: ${pesan}\n\nMohon info jadwal survei/estimasi biaya. Terima kasih!`
                                                                );

                                                                submitBtn.onclick = () => window.open(`https://wa.me/qr/WSGMEMKXIIWIF1`, '_blank');

                                                                setTimeout(() => {
                                                                    if (confirm('Pesan tersimpan! Buka WhatsApp teknisi kami sekarang untuk respons lebih cepat?')) {
                                                                        window.open(`https://wa.me/qr/WSGMEMKXIIWIF1`, '_blank');
                                                                    }
                                                                }, 600);
                                                            }, 1400);
                                                        });
                                                    }

                                    function shakeElement(el) {
                                        if (!el) return;
                                        el.style.animation = 'none';
                                        el.offsetHeight; // reflow
                                        el.style.animation = 'shake 0.4s ease';
                                        if (!document.getElementById('shake-style')) {
                                            const s = document.createElement('style');
                                            s.id = 'shake-style';
                                            s.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`;
                                            document.head.appendChild(s);
                                        }
                                        setTimeout(() => { el.style.animation = ''; }, 400);
                                    }

                                        /* ═══════════════════════════════════════════════════
                                           14. CLICK RIPPLE LIGHT EFFECT
                                        ════════════════════════════════════════════════════ */
                                        function addClickRipple(e, el) {
                                            if (!el) return;
                                            const rect = el.getBoundingClientRect();
                                            const size = Math.max(rect.width, rect.height) * 2;
                                            const ripple = document.createElement('span');
                                            ripple.style.cssText = `
      position:absolute;border-radius:50%;pointer-events:none;z-index:99;
      width:${size}px;height:${size}px;
      left:${(e.clientX || rect.left + rect.width / 2) - rect.left - size / 2}px;
      top:${(e.clientY || rect.top + rect.height / 2) - rect.top - size / 2}px;
      background:radial-gradient(circle, rgba(0,212,255,0.6) 0%, rgba(26,86,219,0.3) 40%, transparent 70%);
      animation:rippleOut 0.6s ease-out forwards;
    `;
                                            el.appendChild(ripple);
                                            setTimeout(() => ripple.remove(), 650);

                                            if (!document.getElementById('ripple-anim')) {
                                                const s = document.createElement('style');
                                                s.id = 'ripple-anim';
                                                s.textContent = `@keyframes rippleOut{from{transform:scale(0);opacity:1}to{transform:scale(1.3);opacity:0}}`;
                                                document.head.appendChild(s);
                                            }
                                        }

                        /* ═══════════════════════════════════════════════════
                           15. BACK TO TOP
                        ════════════════════════════════════════════════════ */
                        function initBackToTop() {
                            const btn = $('#backTop');
                            if (!btn) return;
                            btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
                        }

                        /* ═══════════════════════════════════════════════════
                           16. MIRROR CSS TO /CSS/style.css (for legacy link)
                        ════════════════════════════════════════════════════ */
                        // (Handled server-side, no JS needed)

                        /* ═══════════════════════════════════════════════════
                           17. INIT ALL
                        ════════════════════════════════════════════════════ */
                        document.addEventListener('DOMContentLoaded', function () {
                            initLoader();
                            initParticles();
                            initHeaderScroll();
                            initMobileNav();
                            bindNavigation();
                            initFAQ();
                            initPortfolioFilter();
                            initContactForm();
                            initBackToTop();
                            observeAnimations();

                            // Trigger stats on initial home load
                            setTimeout(() => {
                                if (currentPage === 'home') animateStats();
                            }, 2600);

                            console.log('SkyNet Solusindo v2.0 — Landing Page Premium Loaded ✓');
                        });

                    })();
