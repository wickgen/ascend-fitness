// Mobile Menu Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navbar = document.getElementById('navbar');
    const menuOverlay = document.getElementById('menu-overlay');

    function openMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('pointer-events-none');
        mobileMenu.classList.add('pointer-events-auto');
        // Trigger reflow for smooth animation
        requestAnimationFrame(() => {
            if (menuOverlay) menuOverlay.classList.add('active');
            mobileMenu.classList.add('menu-open');
            // Animate links staggered
            const links = mobileMenu.querySelectorAll('.mobile-nav-link');
            links.forEach((link, i) => {
                setTimeout(() => {
                    link.classList.add('active');
                }, 80 * i);
            });
        });
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (!mobileMenu) return;
        const links = mobileMenu.querySelectorAll('.mobile-nav-link');
        // Reverse animate links
        links.forEach((link, i) => {
            setTimeout(() => {
                link.classList.remove('active');
            }, 30 * (links.length - 1 - i));
        });
        if (menuOverlay) menuOverlay.classList.remove('active');
        mobileMenu.classList.remove('menu-open');
        setTimeout(() => {
            mobileMenu.classList.remove('pointer-events-auto');
            mobileMenu.classList.add('pointer-events-none');
        }, 400);
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // Close menu when clicking a link
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // Navbar scroll effect - throttled with requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (!navbar) { ticking = false; return; }
                if (window.scrollY > 50) {
                    navbar.classList.add('navbar-scrolled');
                } else {
                    navbar.classList.remove('navbar-scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Intersection Observer for Scroll Animations - optimized
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    revealElements.forEach(el => observer.observe(el));


    // Contact Form Logic (Web3Forms Integrated)
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerText;

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            submitBtn.innerText = 'SENDING...';
            submitBtn.disabled = true;
            submitBtn.classList.remove('hover:bg-white');

            const formData = new FormData(contactForm);

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    submitBtn.innerText = 'MESSAGE SENT!';
                    submitBtn.classList.add('bg-green-600', 'text-white', 'border-transparent');
                    submitBtn.classList.remove('bg-brand-silver', 'text-brand-black');

                    contactForm.reset();
                } else {
                    alert("Error: " + data.message);
                }

            } catch (error) {
                alert("Something went wrong. Please try again.");
            } finally {
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('bg-green-600', 'text-white', 'border-transparent');
                    submitBtn.classList.add('bg-brand-silver', 'text-brand-black', 'hover:bg-white');
                }, 3000);
            }
        });
    }
});
