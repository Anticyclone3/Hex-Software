
        // Scroll Animation
        document.addEventListener('DOMContentLoaded', function() {
            // Navigation scroll effect
            window.addEventListener('scroll', function() {
                const nav = document.querySelector('.nav');
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            });

            // Animate elements when they come into view
            const animateOnScroll = function() {
                const elements = document.querySelectorAll('.service-card, .booking-info, .booking-form');
                
                elements.forEach(element => {
                    const elementPosition = element.getBoundingClientRect().top;
                    const screenPosition = window.innerHeight / 1.2;
                    
                    if (elementPosition < screenPosition) {
                        element.classList.add('animate');
                    }
                });
            };

            // Run animation check on load and scroll
            window.addEventListener('scroll', animateOnScroll);
            animateOnScroll(); // Run once on page load

            // Form submission placeholder (for future MySQL integration)
            const bookingForm = document.getElementById('bookingForm');
            bookingForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Thank you for your booking request! We will contact you shortly to confirm your session.');
                // In the future, this would connect to MySQL database
                bookingForm.reset();
            });

            // Add more interactive animations
            const notes = document.querySelectorAll('.note');
            notes.forEach(note => {
                note.addEventListener('mouseover', function() {
                    this.style.transform = 'scale(1.5) rotate(20deg)';
                    this.style.opacity = '0.8';
                    this.style.transition = 'all 0.3s ease';
                });
                
                note.addEventListener('mouseout', function() {
                    this.style.transform = '';
                    this.style.opacity = '0.3';
                });
            });
        });
