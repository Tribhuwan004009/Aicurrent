// Main JavaScript functionality for AI Current

class AICurrentApp {
  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    // Initialize components when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.init();
      });
    } else {
      this.init();
    }
  }

  init() {
    this.initTheme();
    this.initMobileMenu();
    this.initSearch();
    this.initForms();
    this.initDropdowns();
    this.initLazyLoading();
  }

  // Theme Management
  initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
      });
    }
  }

  updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
  }

  // Mobile Menu
  initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    
    if (mobileMenuToggle && mobileMenuOverlay) {
      mobileMenuToggle.addEventListener('click', () => {
        mobileMenuOverlay.classList.toggle('active');
        document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
      });
      
      // Close menu when clicking overlay
      mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
          mobileMenuOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
      
      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
          mobileMenuOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  }

  // Search Functionality
  initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchResults || typeof Fuse === 'undefined') {
      return;
    }

    // Initialize Fuse.js for search
    this.initFuseSearch();
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();
      
      if (query.length < 2) {
        searchResults.classList.add('hidden');
        return;
      }
      
      // Debounce search
      searchTimeout = setTimeout(() => {
        this.performSearch(query);
      }, 300);
    });
    
    // Hide results when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.add('hidden');
      }
    });
  }

  async initFuseSearch() {
    try {
      // Get all posts data for search
      const posts = this.getPostsData();
      
      // Fuse.js configuration
      const fuseOptions = {
        keys: [
          { name: 'title', weight: 0.7 },
          { name: 'summary', weight: 0.3 },
          { name: 'content', weight: 0.1 }
        ],
        threshold: 0.3,
        includeScore: true,
        includeMatches: true
      };
      
      this.fuse = new Fuse(posts, fuseOptions);
    } catch (error) {
      console.error('Failed to initialize search:', error);
    }
  }

  getPostsData() {
    // Extract post data from the current page
    const articles = document.querySelectorAll('.article-card');
    const posts = [];
    
    articles.forEach((article, index) => {
      const titleElement = article.querySelector('.card-title a');
      const summaryElement = article.querySelector('.card-summary');
      const linkElement = article.querySelector('.card-title a');
      
      if (titleElement && linkElement) {
        posts.push({
          id: index,
          title: titleElement.textContent.trim(),
          summary: summaryElement ? summaryElement.textContent.trim() : '',
          url: linkElement.getAttribute('href'),
          element: article
        });
      }
    });
    
    return posts;
  }

  performSearch(query) {
    if (!this.fuse) {
      return;
    }
    
    const results = this.fuse.search(query);
    this.displaySearchResults(results);
  }

  displaySearchResults(results) {
    const searchResults = document.getElementById('search-results');
    
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-result">No articles found</div>';
    } else {
      const resultsHTML = results.slice(0, 5).map(result => {
        const post = result.item;
        return `
          <div class="search-result" onclick="window.location.href='${post.url}'">
            <div class="search-result-title">${post.title}</div>
            <div class="search-result-summary">${post.summary}</div>
          </div>
        `;
      }).join('');
      
      searchResults.innerHTML = resultsHTML;
    }
    
    searchResults.classList.remove('hidden');
  }

  // Form Handling
  initForms() {
    // Hero form
    const heroForm = document.getElementById('hero-form');
    if (heroForm) {
      heroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleEmailSignup(heroForm);
      });
    }
    
    // Footer form
    const footerForm = document.getElementById('footer-form');
    if (footerForm) {
      footerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleEmailSignup(footerForm);
      });
    }
  }

  handleEmailSignup(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (!emailInput || !emailInput.value) {
      this.showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    // Disable form during submission
    submitButton.disabled = true;
    submitButton.textContent = 'Joining...';
    
    // Simulate API call
    setTimeout(() => {
      this.showNotification('Thank you for subscribing to AI Current!', 'success');
      emailInput.value = '';
      submitButton.disabled = false;
      submitButton.textContent = form.id === 'hero-form' ? 'Join Free' : 'Subscribe';
    }, 1000);
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      zIndex: '1000',
      maxWidth: '400px',
      animation: 'slideDown 0.3s ease-out'
    });
    
    // Set background color based on type
    switch (type) {
      case 'success':
        notification.style.backgroundColor = '#38A169';
        break;
      case 'error':
        notification.style.backgroundColor = '#E53E3E';
        break;
      default:
        notification.style.backgroundColor = '#3182CE';
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }

  // Dropdown Menus
  initDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const dropdown = toggle.closest('.nav-dropdown');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        // Toggle aria-expanded
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
      });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown')) {
        dropdownToggles.forEach(toggle => {
          toggle.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // Lazy Loading for Images
  initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      });
      
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  // Smooth scrolling for anchor links
  initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Analytics placeholder (ready for implementation)
  trackEvent(eventName, properties = {}) {
    // Placeholder for analytics implementation
    console.log('Analytics Event:', eventName, properties);
    
    // Example implementation:
    // if (window.gtag) {
    //   window.gtag('event', eventName, properties);
    // }
  }

  // Performance monitoring
  initPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      // LCP (Largest Contentful Paint)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.log('LCP:', entry.startTime);
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // FID (First Input Delay) would be measured here
      // CLS (Cumulative Layout Shift) would be measured here
    }
  }
}

// Add CSS for animations that aren't in the main CSS
const additionalStyles = `
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  .notification {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the application
const app = new AICurrentApp();

// Export for potential use in other scripts
window.AICurrentApp = AICurrentApp;
