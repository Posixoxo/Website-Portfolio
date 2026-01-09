// hamburger and theme toggle functionality //

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
        // listed items for seamless infinite scroll
        document.querySelectorAll('.language-scroll').forEach(scroll => {
          const direction = scroll.dataset.direction;
          
          // Get all direct children (language-rows or flex-textimg)
          const children = Array.from(scroll.children);
          
          // Clone content 3 times total (original + 3 copies = 4x content)
          // This ensures smooth scrolling even with large gaps
          for (let i = 0; i < 3; i++) {
              children.forEach(child => {
                  const clone = child.cloneNode(true);
                  scroll.appendChild(clone);
              });
          }
      });

      



            // Select all filter buttons and project cards
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






      // Contact form submission handling //

      document.addEventListener('DOMContentLoaded', function() {
        const forms = document.querySelectorAll('.contact-form');
        
        forms.forEach(form => {
            form.addEventListener('submit', async function(e) {
                e.preventDefault(); // Stop normal form submission
                
                const formData = new FormData(this);
                const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    message: formData.get('message')
                };
                
                console.log('Submitting data:', data);
                
                try {
                    const response = await fetch('/api/contact', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                    
                    console.log('Response status:', response.status);
                    
                    if (response.redirected) {
                        window.location.href = response.url;
                    } else if (response.ok) {
                        window.location.href = '/thankyou.html';
                    } else {
                        alert('Error submitting form. Please try again.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error submitting form. Please try again.');
                }
            });
        });
    });
        
        