document.addEventListener('DOMContentLoaded', () => {
    // --- Performance optimization: Debounce function ---
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // --- Enhanced Intersection Observer for scroll animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Check if the element is a number to animate
                if (entry.target.classList.contains('number-animate')) {
                    animateNumber(entry.target);
                }
                
                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.fade-in-up');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('is-visible');
                    }, index * 100);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with the 'fade-in-up' class
    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // --- Enhanced Theme Toggle Functionality ---
    const toggleBtn = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    const root = document.documentElement;
    
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        root.classList.add('light');
        icon.textContent = '🌞';
    } else {
        root.classList.remove('light');
        icon.textContent = '🌙';
    }
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isLight = root.classList.contains('light');
            
            // Add transition class for smooth theme switch
            root.classList.add('theme-transitioning');
            
            if (isLight) {
                root.classList.remove('light');
                localStorage.setItem('theme', 'dark');
                icon.textContent = '🌙';
            } else {
                root.classList.add('light');
                localStorage.setItem('theme', 'light');
                icon.textContent = '🌞';
            }
            
            // Remove transition class after animation
            setTimeout(() => {
                root.classList.remove('theme-transitioning');
            }, 300);
        });
    }
    
    // --- Enhanced Animate Number Function ---
    function animateNumber(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const start = 0;
        let startTime = null;

        function step(currentTime) {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            // Easing function for smoother animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentNumber = Math.floor(easeOutQuart * (target - start) + start);
            
            element.innerText = currentNumber.toLocaleString();
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.innerText = target.toLocaleString();
            }
        }
        window.requestAnimationFrame(step);
    }

    // --- Enhanced Hero Image Animation ---
    const heroImage = document.getElementById('hero-image-container');
    if (heroImage) {
        // Using a timeout to ensure the slide-in feels intentional after load
        setTimeout(() => {
            heroImage.style.transform = 'translateX(0)';
            heroImage.style.opacity = '1';
        }, 300);
    }

    // --- Enhanced Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isOpen = !mobileMenu.classList.contains('hidden');
            
            if (isOpen) {
                // Close menu
                mobileMenu.classList.add('mobile-menu-enter');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('mobile-menu-enter');
                }, 300);
            } else {
                // Open menu
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('mobile-menu-enter-active');
            }
            
            // Animate hamburger to X
            const svg = mobileMenuButton.querySelector('svg');
            if (svg) {
                svg.classList.toggle('rotate-90');
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                const svg = mobileMenuButton.querySelector('svg');
                if (svg) {
                    svg.classList.remove('rotate-90');
                }
            }
        });
    }

    // --- Enhanced Form Validation and Submission ---
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            const errors = [];
            if (!data.firstName?.trim()) errors.push('First name is required');
            if (!data.lastName?.trim()) errors.push('Last name is required');
            if (!data.email?.trim()) errors.push('Email is required');
            if (!data.message?.trim()) errors.push('Message is required');
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (data.email && !emailRegex.test(data.email)) {
                errors.push('Please enter a valid email address');
            }
            
            if (errors.length > 0) {
                showNotification(errors.join(', '), 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // --- Notification System ---
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'success' ? 'bg-green-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // --- Enhanced Scroll Progress Bar ---
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        const updateProgress = debounce(() => {
            const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrolled + '%';
        }, 10);

        window.addEventListener('scroll', updateProgress);
    }

    // --- Enhanced Back to Top Button ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        const updateBackToTop = debounce(() => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.remove('opacity-0', 'invisible', 'translate-y-10');
                backToTopBtn.classList.add('opacity-100', 'visible', 'translate-y-0');
            } else {
                backToTopBtn.classList.add('opacity-0', 'invisible', 'translate-y-10');
                backToTopBtn.classList.remove('opacity-100', 'visible', 'translate-y-0');
            }
        }, 10);

        window.addEventListener('scroll', updateBackToTop);
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Enhanced Loading Screen ---
    const loadingScreen = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1000);
        }
    });

    // --- Enhanced Keyboard Navigation ---
    document.addEventListener('keydown', (e) => {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            const svg = mobileMenuButton?.querySelector('svg');
            if (svg) {
                svg.classList.remove('rotate-90');
            }
        }
        
        // Ctrl/Cmd + K for search (placeholder)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            showNotification('Search feature coming soon!', 'info');
        }
    });

    // --- Enhanced Accessibility ---
    // Add focus indicators for keyboard navigation
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
        });
        
        element.addEventListener('blur', () => {
            element.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
        });
    });

    // --- Performance: Lazy loading for images ---
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // --- Enhanced Typewriter Effect (if needed) ---
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // --- Initialize any typewriter effects ---
    const typewriterElements = document.querySelectorAll('[data-typewriter]');
    typewriterElements.forEach(element => {
        const text = element.getAttribute('data-typewriter');
        if (text) {
            typeWriter(element, text);
        }
    });

    // --- Enhanced Error Handling ---
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
        // You could send this to an error tracking service
    });

    // --- Performance monitoring ---
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        });
    }
});