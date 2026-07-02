document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // 1. Light/Dark Theme Switcher
    // ----------------------------------------------------
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const htmlElement = document.documentElement;
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem("theme") || "dark";
    htmlElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener("click", () => {
        const currentTheme = htmlElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        htmlElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const moonIcon = themeToggleBtn.querySelector(".fa-moon");
        const sunIcon = themeToggleBtn.querySelector(".fa-sun");
        if (theme === "light") {
            moonIcon.style.display = "none";
            sunIcon.style.display = "block";
        } else {
            moonIcon.style.display = "block";
            sunIcon.style.display = "none";
        }
    }

    // ----------------------------------------------------
    // 2. Mobile Menu Toggle
    // ----------------------------------------------------
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const navMenu = document.getElementById("nav-menu");

    mobileMenuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("open");
        const icon = mobileMenuBtn.querySelector("i");
        if (navMenu.classList.contains("open")) {
            icon.className = "fas fa-times";
        } else {
            icon.className = "fas fa-bars";
        }
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll("#nav-menu a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
            mobileMenuBtn.querySelector("i").className = "fas fa-bars";
        });
    });

    // ----------------------------------------------------
    // 3. Header Scrolled Effect & Active Link Highlight
    // ----------------------------------------------------
    const header = document.getElementById("header");
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("#nav-menu a");

    window.addEventListener("scroll", () => {
        // Sticky Header class addition
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Active Section link marking
        let currentSection = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSection}`) {
                link.classList.add("active");
            }
        });
    });

    // ----------------------------------------------------
    // 4. Typing Effect animation
    // ----------------------------------------------------
    const words = ["Aspiring Full Stack Developer", "Python Developer", "Computer Science Student"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedTextSpan = document.getElementById("typed-text");

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typedTextSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typingSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Brief pause before typing next
        }

        setTimeout(type, typingSpeed);
    }

    if (typedTextSpan) {
        type();
    }

    // ----------------------------------------------------
    // 5. Scroll Reveals and Animated Progress Bars
    // ----------------------------------------------------
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

    // Progress bar animation triggers on entry
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fillElement = entry.target;
                const widthPercent = fillElement.getAttribute("data-progress");
                fillElement.style.width = widthPercent;
                progressObserver.unobserve(fillElement);
            }
        });
    }, observerOptions);

    document.querySelectorAll(".progress-bar-fill").forEach(el => progressObserver.observe(el));

    // ----------------------------------------------------
    // 6. Contact Form Backend Integration & Toast System
    // ----------------------------------------------------
    const form = document.getElementById("contactForm");
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");
    const toastIcon = document.getElementById("toast-icon");

    function showToast(message, isSuccess = true) {

    console.log("Toast called:", message);
    alert(message);   // test kosam

    toastMessage.textContent = message;

    if (isSuccess) {
        toast.className = "toast show toast-success";
        toastIcon.className = "fas fa-check-circle";
    } else {
        toast.className = "toast show toast-error";
        toastIcon.className = "fas fa-exclamation-circle";
    }

    setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const data = {
                name: document.getElementById("name").value.trim(),
                email: document.getElementById("email").value.trim(),
                message: document.getElementById("message").value.trim()
            };

            try {
                const response = await fetch("http://localhost:5000/contact", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    showToast(result.message || "Message Received Successfully!", true);
                    form.reset();
                } else {
                    showToast(result.message || "Something went wrong.", false);
                }
            } catch (error) {
                console.error("Connection failed:", error);
                showToast("Backend server offline. Message saved locally (simulated).", false);
            }
        });
    }
});