// ============================================
// PORTFOLIO JAVASCRIPT
// ============================================

;(() => {
  // ============================================
  // DOM ELEMENTS
  // ============================================
  const body = document.body
  const themeToggle = document.querySelector(".theme-toggle")
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const mobileMenu = document.querySelector(".mobile-menu")
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-links a")
  const navLinks = document.querySelectorAll(".nav-link")
  const cursor = document.querySelector(".cursor")
  const cursorFollower = document.querySelector(".cursor-follower")
  const contactForm = document.getElementById("contactForm")
  const skillBars = document.querySelectorAll(".skill-bar")

  // ============================================
  // THEME TOGGLE
  // ============================================
  function initTheme() {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme) {
      body.dataset.theme = savedTheme
    } else if (prefersDark) {
      body.dataset.theme = "dark"
    }
  }

  function toggleTheme() {
    const newTheme = body.dataset.theme === "light" ? "dark" : "light"
    body.dataset.theme = newTheme
    localStorage.setItem("theme", newTheme)
  }

  // ============================================
  // MOBILE MENU
  // ============================================
  function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle("active")
    mobileMenu.classList.toggle("active")
    body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : ""
  }

  function closeMobileMenu() {
    mobileMenuBtn.classList.remove("active")
    mobileMenu.classList.remove("active")
    body.style.overflow = ""
  }

  // ============================================
  // CUSTOM CURSOR
  // ============================================
  function initCursor() {
    if (!cursor || !cursorFollower) return

    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0
    let followerX = 0
    let followerY = 0

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    })

    function animateCursor() {
      // Main cursor - follows directly
      cursorX += (mouseX - cursorX) * 0.5
      cursorY += (mouseY - cursorY) * 0.5
      cursor.style.left = cursorX + "px"
      cursor.style.top = cursorY + "px"

      // Follower - smoother movement
      followerX += (mouseX - followerX) * 0.15
      followerY += (mouseY - followerY) * 0.15
      cursorFollower.style.left = followerX + "px"
      cursorFollower.style.top = followerY + "px"

      requestAnimationFrame(animateCursor)
    }

    animateCursor()

    // Scale cursor on hoverable elements
    const hoverables = document.querySelectorAll("a, button, .project-card")
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(2)"
        cursorFollower.style.transform = "translate(-50%, -50%) scale(1.5)"
      })
      el.addEventListener("mouseleave", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1)"
        cursorFollower.style.transform = "translate(-50%, -50%) scale(1)"
      })
    })
  }

  // ============================================
  // SMOOTH SCROLL WITH ACTIVE STATE
  // ============================================
  function initSmoothScroll() {
    const allNavLinks = [...navLinks, ...mobileNavLinks]

    allNavLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("href")
        const targetElement = document.querySelector(targetId)

        if (targetElement) {
          closeMobileMenu()
          targetElement.scrollIntoView({ behavior: "smooth" })
        }
      })
    })
  }

  // ============================================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ============================================
  function initScrollAnimations() {
    const animateElements = document.querySelectorAll(
      ".section-header, .about-content, .project-card, .skill-card, .contact-info, .contact-form",
    )

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"

          // Animate skill bars when visible
          if (entry.target.classList.contains("skill-card")) {
            const bar = entry.target.querySelector(".skill-bar")
            if (bar) {
              bar.style.width = bar.style.getPropertyValue("--level")
            }
          }
        }
      })
    }, observerOptions)

    animateElements.forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      observer.observe(el)
    })

    // Initially hide skill bars
    skillBars.forEach((bar) => {
      bar.style.width = "0"
    })
  }

  // ============================================
  // CONTACT FORM
  // ============================================
  function initContactForm() {
    if (!contactForm) return

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = new FormData(contactForm)
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
      }

      // Simple validation
      if (!data.name || !data.email || !data.message) {
        alert("Por favor, completa todos los campos.")
        return
      }

      // Show success message (in a real app, you'd send this to a server)
      alert("¡Mensaje enviado! Gracias por contactarme.")
      contactForm.reset()
    })
  }

  // ============================================
  // NAVBAR SCROLL EFFECT
  // ============================================
  function initNavbarScroll() {
    const nav = document.querySelector(".main-nav")
    let lastScroll = 0

    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset

      if (currentScroll > 100) {
        nav.style.boxShadow = "var(--shadow-md)"
      } else {
        nav.style.boxShadow = "none"
      }

      lastScroll = currentScroll
    })
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================
  function initEventListeners() {
    // Theme toggle
    if (themeToggle) {
      themeToggle.addEventListener("click", toggleTheme)
    }

    // Mobile menu
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", toggleMobileMenu)
    }

    // Close mobile menu on link click
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu)
    })

    // Close mobile menu on outside click
    document.addEventListener("click", (e) => {
      if (mobileMenu && mobileMenu.classList.contains("active")) {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
          closeMobileMenu()
        }
      }
    })

    // Close mobile menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenu && mobileMenu.classList.contains("active")) {
        closeMobileMenu()
      }
    })
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    initTheme()
    initEventListeners()
    initSmoothScroll()
    initScrollAnimations()
    initContactForm()
    initNavbarScroll()

    // Only init custom cursor on devices with fine pointer
    if (window.matchMedia("(pointer: fine)").matches) {
      initCursor()
    }
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
})()
