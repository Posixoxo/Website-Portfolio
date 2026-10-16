// --- hamburger and theme toggle functionality ---

const navHeader = document.getElementById('navHeader');
const hamburgerIcon = document.getElementById('hamburgerIcon');
const closeIcon = document.getElementById('closeIcon');
const navLinks = document.getElementById('navLinks');

// Get ALL theme toggle buttons (both mobile and desktop)
const themeToggleButtons = document.querySelectorAll('.theme-toggle');

// Initialize theme from localStorage or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// Theme toggle - works for BOTH buttons
themeToggleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
});

// Toggle navigation (HAMBURGER FUNCTIONALITY - UNCHANGED)
hamburgerIcon.addEventListener('click', () => {
    navHeader.classList.add('expanded');
    navLinks.classList.add('active');
});

closeIcon.addEventListener('click', () => {
    navHeader.classList.remove('expanded');
    navLinks.classList.remove('active');
});

// Close nav when clicking on a link
const links = navLinks.querySelectorAll('a');
links.forEach(link => {
    link.addEventListener('click', () => {
        navHeader.classList.remove('expanded');
        navLinks.classList.remove('active');
    });
});

// About fog-item //

document.addEventListener('DOMContentLoaded', () => {
    // Select all items that need to be animated on scroll
    const itemsToAnimate = document.querySelectorAll('.fog-item');

    // Create a new Intersection Observer instance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Check if the element is currently visible in the viewport
        if (entry.isIntersecting) {
          // Add 'visible' class to trigger the CSS transition/animation
          entry.target.classList.add('visible');
          // Stop observing this element after it has appeared (optional)
          observer.unobserve(entry.target); 
        }
      });
    }, {
      // Options: Start observing when 10% of the item is visible
      threshold: 0.1 
    });

    // Loop through all items and set up the observer
    itemsToAnimate.forEach(item => observer.observe(item));
  });

// Language scroll cloning for infinite scroll //
document.querySelectorAll('.language-scroll').forEach(scroll => {
    // CHECK: Only apply animation/cloning if it's NOT in the desktop-version container
    if (scroll.closest('.desktop-version')) {
        return; // Skip this one (Desktop)
    }

    const direction = scroll.dataset.direction;
    
    // Get all direct children (language-rows or flex-textimg)
    const children = Array.from(scroll.children);
    
    // Clone content 3 times total (original + 3 copies = 4x content)
    for (let i = 0; i < 3; i++) {
        children.forEach(child => {
            const clone = child.cloneNode(true);
            scroll.appendChild(clone);
        });
    }
});

// Project Filters //
const buttons = document.querySelectorAll('.project-filters button');
const cards = document.querySelectorAll('.project-card');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        // 1. Update active button state
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.dataset.filter.toLowerCase();

        // 2. Loop through cards
        cards.forEach(card => {
            // Target ONLY the tech badges container
            const techBadges = card.querySelector('.tech-badges').innerText.toLowerCase();

            if (filter === 'all' || techBadges.includes(filter)) {
                card.style.display = 'block'; 
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Contact form submission handling with Firebase Realtime Database
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('.contact-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault(); 
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'SENDING...';
            submitBtn.disabled = true;

            const formData = new FormData(this);
            const contactData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                message: formData.get('message'),
                createdAt: Date.now()
            };
            
            try {
                // Direct Firebase REST push to your database
                const dbURL = 'https://website-portfolio-c8b26-default-rtdb.firebaseio.com/contacts.json';
                const response = await fetch(dbURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(contactData)
                });
                
                if (response.ok) {
                    window.location.href = 'thankyou.html'; // Or success view
                } else {
                    alert('Error submitting form. Please try again.');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error submitting form. Please try again.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    });
});


// --- IT Berries Dynamic Shuffler & Linker with Smooth Animation ---
document.addEventListener('DOMContentLoaded', () => {
    const widget = document.getElementById('it-berries-widget');
    if (!widget) return;

    const categoryEl = document.getElementById('berry-category');
    const titleEl = document.getElementById('berry-title');
    const excerptEl = document.getElementById('berry-excerpt');
    const bodyPreviewEl = document.getElementById('berry-body-preview');
    const readMoreBtn = document.getElementById('berry-readmore');
    const shuffleBtn = document.getElementById('shuffle-berry-btn');

    let postsCache = [];
    let currentPostId = null;
    let autoRotateInterval;

    // Smooth transition injection helper for widget card contents
    function animateBerryUpdate(updateFn) {
        widget.style.opacity = '0';
        widget.style.transform = 'translateY(8px)';
        widget.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        setTimeout(() => {
            updateFn();
            widget.style.opacity = '1';
            widget.style.transform = 'translateY(0)';
        }, 300);
    }

    // 1. Fetch posts once and store them in memory
    async function initBerriesStream() {
        try {
            const dbURL = 'https://website-portfolio-c8b26-default-rtdb.firebaseio.com/posts.json';
            const response = await fetch(dbURL);
            const data = await response.json();
            
            if (data) {
                postsCache = Object.entries(data)
                    .map(([id, post]) => ({ id, ...post }))
                    .filter(p => p.status === 'published');

                if (postsCache.length > 0) {
                    renderRandomBerry();
                    startAutoRotate();
                } else {
                    showFallback("No Dispatches Available", "Check back later for new IT Berries transmissions.");
                }
            } else {
                showFallback("Database Empty", "No published records found.");
            }
        } catch (err) {
            console.error('Database connection error:', err);
            showFallback("Stream Offline", "Unable to load database records.");
        }
    }

    function showFallback(title, message) {
        if (titleEl) titleEl.textContent = title;
        if (excerptEl) excerptEl.textContent = message;
        if (bodyPreviewEl) bodyPreviewEl.textContent = "";
        if (readMoreBtn) readMoreBtn.style.display = 'none';
    }

    // 2. Render instantly from local memory cache with smooth transition and true randomness
    function renderRandomBerry(isManual = false) {
        if (!postsCache || postsCache.length === 0) return;
        
        const updateContent = () => {
            // Filter out the currently displayed post if there's more than 1 post, preventing immediate repeats
            let availablePosts = postsCache;
            if (postsCache.length > 1 && currentPostId) {
                availablePosts = postsCache.filter(p => p.id !== currentPostId);
            }

            const randomIndex = Math.floor(Math.random() * availablePosts.length);
            const post = availablePosts[randomIndex];

            currentPostId = post.id;
            if (categoryEl) categoryEl.textContent = `// ${post.category.toUpperCase()}`;
            if (titleEl) titleEl.textContent = post.title;
            if (excerptEl) excerptEl.textContent = post.excerpt || "No summary provided.";
            if (bodyPreviewEl) {
                bodyPreviewEl.textContent = post.content.length > 350 ? post.content.substring(0, 350) + '...' : post.content;
            }
            
            if (readMoreBtn) {
                readMoreBtn.style.display = 'inline-block';
                readMoreBtn.href = `stories.html?id=${post.id}`;
            }
        };

        if (isManual) {
            animateBerryUpdate(updateContent);
        } else {
            updateContent();
        }
    }

    // 3. Instant Shuffle Button Handler with Smooth Animation
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (postsCache.length === 0) {
                alert("Cache empty. No posts to shuffle yet.");
                return;
            }

            // Visual feedback state
            shuffleBtn.textContent = 'SHUFFLING...';
            shuffleBtn.style.opacity = '0.6';
            shuffleBtn.style.pointerEvents = 'none';

            renderRandomBerry(true);
            resetAutoRotate();

            // Restore button state after animation finishes
            setTimeout(() => {
                shuffleBtn.textContent = 'Shuffle Next Berry ↻';
                shuffleBtn.style.opacity = '1';
                shuffleBtn.style.pointerEvents = 'auto';
            }, 400);
        });
    }

    // 4. Automatic 1-Minute-30-Seconds Shuffler (90,000 ms)
    function startAutoRotate() {
        clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(() => {
            renderRandomBerry(true); // Smooth auto-rotation animation
        }, 90000); // 90,000 ms = 1 minute 30 seconds
    }

    function resetAutoRotate() {
        startAutoRotate();
    }

    // Initialize stream on load
    initBerriesStream();
});