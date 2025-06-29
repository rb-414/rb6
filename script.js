document.addEventListener('DOMContentLoaded', () => {
  // --- Global UI Elements ---
  const loadingSpinner = document.getElementById('loadingSpinner');
  const messageModal = document.getElementById('messageModal');
  const messageModalTitle = document.getElementById('messageModalTitle');
  const messageModalText = document.getElementById('messageModalText');
  const messageModalClose = document.getElementById('messageModalClose');
  const messageModalOK = document.getElementById('messageModalOK');

  // --- Utility Functions ---
  /**
   * Displays a custom message modal instead of alert().
   * @param {string} title - The title of the message.
   * @param {string} message - The message content.
   */
  function showMessageModal(title, message) {
    messageModalTitle.innerText = title;
    messageModalText.innerText = message;
    messageModal.style.display = 'flex'; // Use flex to center
  }

  // Close message modal event listeners
  if (messageModalClose) {
    messageModalClose.onclick = () => {
      messageModal.style.display = 'none';
    };
  }
  if (messageModalOK) {
    messageModalOK.onclick = () => {
      messageModal.style.display = 'none';
    };
  }
  window.addEventListener('click', (event) => {
    if (event.target === messageModal) {
      messageModal.style.display = 'none';
    }
  });


  // --- Theme Switching Logic ---
  const themePaletteBtn = document.getElementById('themePaletteBtn');
  const themeOptions = document.getElementById('themeOptions');
  const themeLinks = document.querySelectorAll('.theme-options a');

  // Function to apply a specific theme
  function selectTheme(themeName) {
    // Remove all existing theme classes
    document.body.classList.remove('light-theme', 'dark-theme', 'chat-movie-theme', 'event-theme', 'onam-theme');
    // Add the new theme class
    document.body.classList.add(themeName + '-theme');
    // Store the selected theme in local storage
    localStorage.setItem('theme', themeName);

    // Handle Onam flower animation
    if (themeName === 'onam') {
      startOnamFlowerShower();
    } else {
      stopOnamFlowerShower();
    }
  }

  // Toggle theme palette dropdown
  if (themePaletteBtn && themeOptions) {
    themePaletteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent document click from closing immediately
      themeOptions.closest('.theme-palette-dropdown').classList.toggle('active');
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', (e) => {
      if (!themePaletteBtn.contains(e.target) && !themeOptions.contains(e.target)) {
        themeOptions.closest('.theme-palette-dropdown').classList.remove('active');
      }
    });

    // Add event listeners for each theme option
    themeLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const themeName = e.target.getAttribute('data-theme');
        selectTheme(themeName);
        themeOptions.closest('.theme-palette-dropdown').classList.remove('active'); // Close dropdown after selection
      });
    });
  }

  // Apply saved theme on load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    selectTheme(savedTheme); // Use the function to apply saved theme
  } else {
    document.body.classList.add('light-theme'); // Default if no preference saved
  }


  // --- Onam Flower Shower Animation ---
  let flowerInterval;
  const flowerEmojis = ['🌸', '🌼', '🌺', '🌻', '🏵', '🌷', '🌹']; // More flower emojis
  const flowerContainer = document.getElementById('flowerContainer');

  function createFlower() {
    const flower = document.createElement('div');
    flower.classList.add('flower');
    flower.innerText = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
    flower.style.left = Math.random() * 100 + 'vw'; // Random horizontal position
    flower.style.animationDuration = (Math.random() * 3 + 4) + 's'; // 4-7s duration
    flower.style.animationDelay = (Math.random() * 0.5) + 's'; // Slight delay for varied start
    flower.style.fontSize = (Math.random() * 1.5 + 1) + 'em'; // Random size
    // Add a random horizontal drift
    flower.style.setProperty('--flower-x-offset', (Math.random() - 0.5) * 50 + 'vw'); // -25vw to +25vw drift

    flowerContainer.appendChild(flower);

    // Remove flower after animation ends to prevent DOM bloat
    flower.addEventListener('animationend', () => {
      flower.remove();
    });
  }

  function startOnamFlowerShower() {
    stopOnamFlowerShower(); // Ensure no multiple intervals running
    flowerInterval = setInterval(createFlower, 300); // Create a new flower every 300ms
  }

  function stopOnamFlowerShower() {
    if (flowerInterval) {
      clearInterval(flowerInterval);
      flowerInterval = null;
    }
    // Remove all existing flowers
    while (flowerContainer.firstChild) {
      flowerContainer.removeChild(flowerContainer.firstChild);
    }
  }


  // --- Sidebar Logic ---
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const closeSidebar = document.getElementById('closeSidebar');
  const sidebarLinks = document.querySelectorAll('#sidebar a[data-section], #sidebar a[data-action]'); // Select all actionable links in sidebar

  // Toggle sidebar visibility
  if (sidebarToggle && sidebar && closeSidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      sidebarToggle.classList.toggle('active'); // Add/remove active class for gem icon animation
    });

    closeSidebar.addEventListener('click', () => {
      sidebar.classList.remove('active');
      sidebarToggle.classList.remove('active');
    });

    // Close sidebar if clicked outside (optional, but good UX)
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('active');
        sidebarToggle.classList.remove('active');
      }
    });
  }


  // --- Navigation and Section Switching (for both main nav and sidebar) ---
  const allNavLinks = document.querySelectorAll('.navbar a[data-section], .bottom-nav a[data-section], #sidebar a[data-section]');
  const contentSections = document.querySelectorAll('.content-section');

  function showSection(targetSectionId) {
    // Hide all sections
    contentSections.forEach(section => {
      section.classList.remove('active');
      section.style.display = 'none';
    });

    // Show the target section
    const targetSection = document.getElementById(targetSectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      targetSection.style.display = 'block'; // Or 'flex', 'grid'
      targetSection.scrollIntoView({ behavior: 'smooth' }); // Scroll to the section
    }
  }

  // Handle clicks on data-section links (main nav & sidebar)
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSectionId = link.getAttribute('data-section');
      showSection(targetSectionId);

      // Close sidebar if clicked from inside
      if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        sidebarToggle.classList.remove('active');
      }
    });
  });

  // Handle clicks on data-action links (sidebar for mock features)
  document.querySelectorAll('#sidebar a[data-action]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const action = link.getAttribute('data-action');
      let title = "Feature Coming Soon!";
      let message = "This feature is currently under development. Stay tuned for updates!";

      switch (action) {
        case 'upload-visibility':
          title = "Set Visibility";
          message = "Options to set paper visibility (Public/Private/Restricted) will be available soon.";
          break;
        case 'add-coauthors':
          title = "Add Co-authors";
          message = "Invite and manage co-authors for your research papers.";
          break;
        case 'ai-improve-paper':
          title = "AI Assistant: Improve Paper";
          message = "Our AI will analyze your paper and suggest improvements for grammar, style, and clarity.";
          break;
        case 'blockchain-seal':
          title = "Blockchain Timestamp & Seal";
          message = "Your paper will be timestamped on the blockchain for tamper-proof verification!";
          break;
        case 'tamper-proof':
          title = "Tamper-Proof Verification";
          message = "Leveraging blockchain technology, we ensure the integrity and authenticity of all published research.";
          break;
        case 'encryption-info':
          title = "End-to-End Encryption";
          message = "Your data and communications are protected with robust end-to-end encryption.";
          break;
        case 'phd-helpdesk':
          title = "PhD Harassment & Whistleblower Helpdesk";
          message = "A confidential and secure channel for reporting academic misconduct and harassment. We are here to support you.";
          break;
        case 'confidential-submission':
            title = "Confidential Submission";
            message = "Submit your sensitive research with options for restricted access and anonymity.";
            break;
        case 'report-misuse':
            title = "Report Incident";
            message = "Please describe the incident you wish to report. We take all reports seriously.";
            break;
        case 'ai-improver':
            title = "Research Improver Bot";
            message = "The AI will help refine your writing and suggest enhancements.";
            break;
        case 'ai-related':
            title = "Related Work Generator";
            message = "AI will find and suggest highly relevant research papers to your work.";
            break;
        case 'ai-collaborate':
            title = "Collaboration Suggestions";
            message = "AI will analyze your profile and suggest potential collaborators.";
            break;
        case 'ai-translate':
            title = "Translate Abstract";
            message = "Translate your abstract into multiple languages using AI.";
            break;
        case 'ai-reference':
            title = "Reference Generator";
            message = "Generate citations in various academic styles automatically.";
            break;
        case 'join-projects':
            title = "Join Projects";
            message = "Browse available research projects and apply to join.";
            break;
        case 'invite-collaborators':
            title = "Invite Collaborators";
            message = "Send invitations to other researchers to collaborate on your work.";
            break;
        case 'interdisciplinary-hubs':
            title = "Interdisciplinary Hubs";
            message = "Explore and join communities focused on specific interdisciplinary fields.";
            break;
        case 'engagement-analytics':
            title = "Engagement Analytics";
            message = "Detailed insights into how users interact with your publications.";
            break;
        case 'follower-count':
            title = "Follower Count";
            message = "Track your followers and expand your academic network.";
            break;
        case 'my-collaborators':
            title = "My Collaborators";
            message = "View and manage your current and past collaborations.";
            break;
        case 'certificates':
            title = "Certificates & Credentials";
            message = "Showcase your academic achievements and verified credentials.";
            break;
        case 'theme-customization': // This will effectively reopen the theme dropdown
        case 'open-theme-settings':
        case 'open-theme-settings-sidebar':
            themePaletteBtn.click(); // Simulate click on the theme palette button
            sidebar.classList.remove('active'); // Close sidebar
            sidebarToggle.classList.remove('active');
            return; // Exit function as we opened another UI element
        case 'your-college-page':
            title = "Your College / University Page";
            message = "Access your institution's dedicated ResearchBook portal.";
            break;
        case 'verified-clubs':
            title = "Verified Clubs & Departments";
            message = "Explore official academic groups and innovation cells at institutions.";
            break;
        case 'view-competitions':
            title = "Research Competitions";
            message = "Discover upcoming research competitions and participate to win!";
            break;
        case 'call-for-papers':
            title = "Call for Papers";
            message = "View current calls for papers from various journals and conferences.";
            break;
        case 'hackathons':
            title = "Hackathons / Seminars / Webinars";
            message = "Find and register for upcoming academic events.";
            break;
        case 'settings-language':
            title = "Language Settings";
            message = "Change the display language of the application.";
            break;
        case 'notification-settings':
            title = "Notification Settings";
            message = "Configure your preferences for email and in-app notifications.";
            break;
        case 'account-security':
            title = "Account & Security";
            message = "Manage your account details, password, and security preferences.";
            break;
        case 'sidebarLogoutLink': // This specific action is handled below but included here for completeness
        case 'logoutLink':
            // Handled by specific logout logic below
            return;
      }

      showMessageModal(title, message);
      // Close sidebar if clicked from inside
      if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        sidebarToggle.classList.remove('active');
      }
    });
  });


  // Initially show the home section
  const homeSection = document.getElementById('home');
  if (homeSection) {
    homeSection.classList.add('active');
    homeSection.style.display = 'block';
  }


  // --- Profile Dropdown ---
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');

  if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent document click from closing immediately
      profileDropdown.classList.toggle('active'); // Toggle 'active' class
      profileDropdown.style.display = profileDropdown.classList.contains('active') ? 'block' : 'none';
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', (e) => {
      if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.classList.remove('active');
        profileDropdown.style.display = 'none';
      }
    });
  }

  // Mock Logout Links (both in top nav and sidebar)
  const logoutLink = document.getElementById('logoutLink');
  const sidebarLogoutLink = document.getElementById('sidebarLogoutLink');

  function handleLogout(e) {
    e.preventDefault();
    showMessageModal("Logged Out", "You have been successfully logged out.");
    if (profileDropdown) profileDropdown.style.display = 'none'; // Hide dropdown
    if (sidebar) sidebar.classList.remove('active'); // Hide sidebar
    if (sidebarToggle) sidebarToggle.classList.remove('active');
    // In a real app, clear session/token here and redirect to login page
  }

  if (logoutLink) logoutLink.addEventListener('click', handleLogout);
  if (sidebarLogoutLink) sidebarLogoutLink.addEventListener('click', handleLogout);


  // --- Carousel / Slider Functionality ---
  function setupCarousel(carouselId, leftArrowId, rightArrowId) {
    const carousel = document.getElementById(carouselId);
    const leftArrow = document.getElementById(leftArrowId);
    const rightArrow = document.getElementById(rightArrowId);

    if (carousel && leftArrow && rightArrow) {
      const scrollAmount = 300; // Pixels to scroll

      leftArrow.addEventListener('click', () => {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });

      rightArrow.addEventListener('click', () => {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });

      // Optional: Hide/show arrows based on scroll position (more advanced)
      carousel.addEventListener('scroll', () => {
        // Implement logic to hide arrows if at start/end
      });
    }
  }

  setupCarousel('trendingPapersCarousel', 'trending-left', 'trending-right');
  setupCarousel('topAuthorsCarousel', 'authors-left', 'authors-right');


  // --- Search Filter ---
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      // Filter visible cards in relevant sections (e.g., Explore, Home's paper cards)
      // For now, let's assume it primarily filters the "Explore" section's paper cards
      document.querySelectorAll('.explore-card').forEach(card => {
        const title = card.querySelector('h3')?.innerText.toLowerCase() || '';
        const author = card.querySelector('p')?.innerText.toLowerCase() || ''; // Gets first <p>, might need refinement
        const abstract = card.querySelector('p:nth-of-type(3)')?.innerText.toLowerCase() || ''; // Get abstract, assuming it's the 3rd p tag
        const institution = card.querySelector('.institution-badge')?.innerText.toLowerCase() || '';


        if (title.includes(query) || author.includes(query) || abstract.includes(query) || institution.includes(query)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }


  // --- Like / Bookmark / Share (Mock Functionality) ---
  document.querySelectorAll('.like-btn').forEach(button => {
    button.addEventListener('click', () => {
      const icon = button.querySelector('i');
      const countSpan = button.querySelector('.like-count');
      let currentCount = parseInt(countSpan.innerText.replace('K', '00')) || 0; // Basic parsing

      if (icon.classList.contains('liked')) {
        icon.classList.remove('liked');
        icon.classList.remove('fas');
        icon.classList.add('far'); // Change to regular heart
        currentCount = Math.max(0, currentCount - 1);
      } else {
        icon.classList.add('liked');
        icon.classList.remove('far');
        icon.classList.add('fas'); // Change to solid heart
        currentCount += 1;
      }
      countSpan.innerText = currentCount >= 1000 ? (currentCount / 1000).toFixed(1) + 'K' : currentCount;
      // In a real app, send data to backend
      showMessageModal("Action", "Paper Liked/Unliked!");
    });
  });

  document.querySelectorAll('.bookmark-btn').forEach(button => {
    button.addEventListener('click', () => {
      const icon = button.querySelector('i');
      if (icon.classList.contains('fa-bookmark')) {
        icon.classList.remove('fa-bookmark');
        icon.classList.add('fa-solid', 'fa-bookmark'); // Change to solid bookmark
        showMessageModal("Action", "Paper Bookmarked!");
      } else {
        icon.classList.remove('fa-solid', 'fa-bookmark');
        icon.classList.add('fa-bookmark'); // Change back to outline bookmark
        showMessageModal("Action", "Bookmark Removed!");
      }
      // In a real app, send data to backend
    });
  });

  document.querySelectorAll('.share-btn').forEach(button => {
    button.addEventListener('click', () => {
      const paperTitle = button.closest('.paper-card').querySelector('h3').innerText;
      // Use document.execCommand('copy') for clipboard in sandbox
      const dummyUrl = "https://researchbook.com/paper/" + encodeURIComponent(paperTitle.replace(/\s/g, '-').toLowerCase());
      const tempInput = document.createElement('textarea');
      tempInput.value = dummyUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showMessageModal("Share", Link to "${paperTitle}" copied to clipboard!);
    });
  });


  // --- Category Tabs (Explore Section) ---
  const categoryTabs = document.querySelectorAll('.tab-btn');
  const exploreCards = document.querySelectorAll('.explore-card');

  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove 'active' from all tabs
      categoryTabs.forEach(t => t.classList.remove('active'));
      // Add 'active' to clicked tab
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');

      exploreCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // --- AI Suggest Button (Sticky Assistant and Modal) ---
  const stickyAssistant = document.getElementById('stickyAssistant');
  const aiSuggestionModal = document.getElementById('aiSuggestionModal');
  const aiModalClose = document.getElementById('aiModalClose');
  const aiSuggestOK = document.getElementById('aiSuggestOK');
  const aiSuggestionText = document.getElementById('aiSuggestionText');

  if (stickyAssistant) {
    stickyAssistant.addEventListener('click', () => {
      aiSuggestionText.innerText = "AI is thinking of a suggestion...";
      aiSuggestionModal.style.display = 'flex'; // Use flex to center
      loadingSpinner.style.display = 'block'; // Show spinner

      setTimeout(() => {
        loadingSpinner.style.display = 'none'; // Hide spinner
        aiSuggestionText.innerText = "🔮 AI Suggestion: Consider exploring interdisciplinary research topics like 'AI in sustainable agriculture' or 'Neuroscience of virtual reality'.";
      }, 1500); // Simulate AI thinking time
    });
  }

  if (aiModalClose) {
    aiModalClose.onclick = () => {
      aiSuggestionModal.style.display = 'none';
    };
  }
  if (aiSuggestOK) {
    aiSuggestOK.onclick = () => {
      aiSuggestionModal.style.display = 'none';
    };
  }
  window.addEventListener('click', (event) => {
    if (event.target === aiSuggestionModal) {
      aiSuggestionModal.style.display = 'none';
    }
  });


  // --- Profile Page Mock Actions ---
  document.querySelectorAll('.view-profile-btn').forEach(button => {
    button.addEventListener('click', () => {
      // Simulate navigating to a profile page (for now, just show the profile section)
      showSection('profile');
      showMessageModal("Profile View", "Viewing author's profile.");
    });
  });

  document.querySelectorAll('.accept-btn').forEach(button => {
    button.addEventListener('click', () => {
      showMessageModal("Collaboration Request", "Collaboration request accepted!");
      button.closest('.request-item').remove(); // Remove item after action
    });
  });

  document.querySelectorAll('.reject-btn').forEach(button => {
    button.addEventListener('click', () => {
      showMessageModal("Collaboration Request", "Collaboration request rejected.");
      button.closest('.request-item').remove(); // Remove item after action
    });
  });

  document.querySelectorAll('.edit-profile-btn').forEach(button => {
    button.addEventListener('click', () => {
      showMessageModal("Profile Edit", "Edit profile functionality coming soon!");
    });
  });

});