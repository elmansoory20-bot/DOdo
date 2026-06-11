// Main Application Script - Enhanced with Dashboard

let currentUser = null;
let currentPage = 'feed';

// Initialize app on page load
window.addEventListener('load', () => {
    initializeApp();
});

function initializeApp() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showPage('feed');
        loadDashboard();
        setupEventListeners();
    } else {
        showPage('login');
        setupAuthListeners();
    }
}

// Setup authentication listeners
function setupAuthListeners() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Profile picture upload on signup
    const profilePicInput = document.getElementById('signupProfilePic');
    if (profilePicInput) {
        profilePicInput.addEventListener('change', (e) => handleProfilePicUpload(e, 'signupProfilePreview'));
    }
}

// Handle profile picture upload
function handleProfilePicUpload(e, previewId) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const preview = document.getElementById(previewId);
            if (preview) {
                preview.src = event.target.result;
            }
        };
        reader.readAsDataURL(file);
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = DB.getUser(email);
    if (user && user.password === password) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showPage('feed');
        loadDashboard();
        setupEventListeners();
    } else {
        alert('Invalid email or password');
    }
}

// Handle signup
function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const state = document.getElementById('signupState').value;
    const city = document.getElementById('signupCity').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const profilePicPreview = document.getElementById('signupProfilePreview');

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (DB.getUser(email)) {
        alert('Email already registered');
        return;
    }

    const profilePicture = profilePicPreview.src !== 'https://via.placeholder.com/80?text=Photo' 
        ? profilePicPreview.src 
        : 'https://via.placeholder.com/150?text=' + name.split(' ')[0];

    const newUser = DB.addUser({
        name,
        email,
        phone,
        state,
        city,
        password,
        avatar: profilePicture
    });

    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    showPage('feed');
    loadDashboard();
    setupEventListeners();
}

// Show signup page
function showSignup() {
    showPage('signup');
    populateLocationSelects('signupState', 'signupCity');
    setupAuthListeners();
}

// Show login page
function showLogin() {
    showPage('login');
    setupAuthListeners();
}

// Populate location selects
function populateLocationSelects(stateSelectId, citySelectId) {
    const stateSelect = document.getElementById(stateSelectId);
    const citySelect = document.getElementById(citySelectId);
    const locations = DB.getLocations();
    const states = DB.getStates();

    if (!stateSelect || !citySelect) return;

    // Clear existing options
    stateSelect.innerHTML = '<option value="">Select State</option>';
    citySelect.innerHTML = '<option value="">Select City</option>';

    // Populate states
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });

    // Update cities when state changes
    stateSelect.addEventListener('change', () => {
        citySelect.innerHTML = '<option value="">Select City</option>';
        const cities = DB.getCitiesByState(stateSelect.value);
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-icon').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page) showPage(page);
        });
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }

    // Post input click
    const postInput = document.getElementById('postInput');
    if (postInput) {
        postInput.addEventListener('click', () => {
            showCreatePost('general');
        });
    }

    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Profile picture update
    const profilePicInput = document.getElementById('profilePicInput');
    if (profilePicInput) {
        profilePicInput.addEventListener('change', (e) => handleProfilePictureUpdate(e));
    }
}

// Handle profile picture update
function handleProfilePictureUpdate(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            currentUser.avatar = event.target.result;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            document.getElementById('profileAvatar').src = event.target.result;
            loadDashboard();
        };
        reader.readAsDataURL(file);
    }
}

// Show page
function showPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show selected page
    let pageElement;
    switch(page) {
        case 'login':
            pageElement = document.getElementById('loginPage');
            break;
        case 'signup':
            pageElement = document.getElementById('signupPage');
            break;
        case 'feed':
            pageElement = document.getElementById('dashboardPage');
            loadDashboard();
            break;
        case 'deliveries':
            pageElement = document.getElementById('deliveriesPage');
            loadDeliveries();
            break;
        case 'services':
            pageElement = document.getElementById('servicesPage');
            loadServices();
            break;
        case 'messages':
            pageElement = document.getElementById('messagesPage');
            loadMessages();
            break;
        case 'profile':
            pageElement = document.getElementById('profilePage');
            loadProfile();
            break;
    }

    if (pageElement) {
        pageElement.classList.add('active');
    }

    // Update active nav link
    document.querySelectorAll('.nav-icon').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });

    currentPage = page;
}

// Load Dashboard
function loadDashboard() {
    // Update sidebar user info
    const sidebarUserName = document.getElementById('sidebarUserName');
    const sidebarUserStatus = document.getElementById('sidebarUserStatus');
    const sidebarUserAvatar = document.getElementById('sidebarUserAvatar');
    const composerUserAvatar = document.getElementById('composerUserAvatar');
    const feedUserAvatar = document.getElementById('feedUserAvatar');

    if (sidebarUserName) sidebarUserName.textContent = currentUser.name;
    if (sidebarUserStatus) sidebarUserStatus.textContent = `Verified customer • ${currentUser.city}, ${currentUser.state}`;
    if (sidebarUserAvatar) sidebarUserAvatar.src = currentUser.avatar || 'https://via.placeholder.com/50';
    if (composerUserAvatar) composerUserAvatar.src = currentUser.avatar || 'https://via.placeholder.com/44';
    if (feedUserAvatar) feedUserAvatar.src = currentUser.avatar || 'https://via.placeholder.com/40';

    // Load stats
    const posts = DB.getPosts();
    const openPosts = posts.filter(p => p.status === 'available').length;
    const deliveryPosts = posts.filter(p => p.type === 'delivery').length;
    const artisanPosts = posts.filter(p => p.type === 'service').length;

    document.getElementById('openPostsCount').textContent = openPosts;
    document.getElementById('deliveriesCount').textContent = deliveryPosts;
    document.getElementById('servicesCount').textContent = artisanPosts;
    document.getElementById('escrowCount').textContent = '₦' + (Math.random() * 50000).toFixed(0);

    // Load locations
    const locations = DB.getLocations();
    document.getElementById('totalLocationsCount').textContent = locations.length;
    const nigeriaLocations = Object.keys(DB.getNigerianLocations()).reduce((sum, state) => sum + DB.getCitiesByState(state).length, 0);
    document.getElementById('nigeriaLocationsCount').textContent = nigeriaLocations;

    // Load categories
    loadCategories();

    // Load people
    loadPeople();

    // Load feed
    loadFeed();
}

// Load categories
function loadCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;
    
    categoriesGrid.innerHTML = '';
    const categories = [
        { emoji: '📦', name: 'Package Delivery', type: 'delivery' },
        { emoji: '💈', name: 'Barbing', type: 'artisan' },
        { emoji: '🧺', name: 'Laundry', type: 'artisan' },
        { emoji: '🔧', name: 'Mechanic', type: 'artisan' },
        { emoji: '💡', name: 'Electrical', type: 'artisan' },
        { emoji: '🚰', name: 'Plumbing', type: 'artisan' },
        { emoji: '🪵', name: 'Carpentry', type: 'artisan' },
        { emoji: '🧹', name: 'Cleaning', type: 'artisan' }
    ];

    categories.forEach(cat => {
        const div = document.createElement('div');
        div.className = 'category-item';
        div.innerHTML = `
            <div class="category-icon">${cat.emoji}</div>
            <p class="category-name">${cat.name}</p>
            <p class="category-type">${cat.type}</p>
        `;
        categoriesGrid.appendChild(div);
    });
}

// Load people
function loadPeople() {
    const peopleList = document.getElementById('peopleList');
    if (!peopleList) return;

    peopleList.innerHTML = '';
    const users = DB.getUsers();
    const otherUsers = users.filter(u => u.id !== currentUser.id).slice(0, 5);

    otherUsers.forEach(user => {
        const div = document.createElement('div');
        div.className = 'person-item';
        div.innerHTML = `
            <img src="${user.avatar}" alt="Profile" class="person-avatar">
            <div class="person-info">
                <p class="person-name">${user.name}</p>
                <p class="person-status">${user.city}</p>
            </div>
            <p class="person-trust">${(Math.random() * 20 + 70).toFixed(0)}%</p>
        `;
        peopleList.appendChild(div);
    });
}

// Load feed
function loadFeed() {
    const postsFeed = document.getElementById('postsFeed');
    if (!postsFeed) return;
    
    postsFeed.innerHTML = '';

    const posts = DB.getPosts();
    posts.forEach(post => {
        const postElement = createPostElement(post);
        postsFeed.appendChild(postElement);
    });
}

// Create post element
function createPostElement(post) {
    const user = DB.getUserById(post.userId);
    const div = document.createElement('div');
    div.className = 'post';

    let typeIcon = post.type === 'delivery' ? '📦' : '🛠️';
    let details = '';

    if (post.type === 'delivery') {
        details = `
            <div class="post-details">
                <div class="post-details-item">
                    <span class="post-details-label">📍 From:</span>
                    <span class="post-details-value">${post.pickupLocation}</span>
                </div>
                <div class="post-details-item">
                    <span class="post-details-label">🏁 To:</span>
                    <span class="post-details-value">${post.deliveryLocation}</span>
                </div>
                <div class="post-details-item">
                    <span class="post-details-label">💰 Price:</span>
                    <span class="post-details-value post-price">₦${post.price.toLocaleString()}</span>
                </div>
            </div>
        `;
    } else if (post.type === 'service') {
        details = `
            <div class="post-details">
                <div class="post-details-item">
                    <span class="post-details-label">Service:</span>
                    <span class="post-details-value">${post.serviceType.charAt(0).toUpperCase() + post.serviceType.slice(1)}</span>
                </div>
                <div class="post-details-item">
                    <span class="post-details-label">Location:</span>
                    <span class="post-details-value">${post.city}, ${post.state}</span>
                </div>
                <div class="post-details-item">
                    <span class="post-details-label">Budget:</span>
                    <span class="post-details-value post-price">₦${post.price.toLocaleString()}</span>
                </div>
            </div>
        `;
    }

    div.innerHTML = `
        <div class="post-header">
            <div class="post-author">
                <img src="${user.avatar}" alt="Profile" class="post-avatar">
                <div class="post-author-info">
                    <h3>${user.name}</h3>
                    <p>${formatDate(post.createdAt)}</p>
                </div>
            </div>
            <div class="post-meta">
                <span>${typeIcon}</span>
                <span class="status-badge status-${post.status}">${post.status.charAt(0).toUpperCase() + post.status.slice(1)}</span>
            </div>
        </div>
        <div class="post-content">
            <h4>${post.title}</h4>
            <p>${post.content}</p>
            ${details}
        </div>
        <div class="post-actions">
            <button class="btn btn-success" onclick="acceptPost('${post.id}')">
                👍 Accept
            </button>
            <button class="btn btn-secondary" onclick="viewPostDetail('${post.id}')">
                👁️ Details
            </button>
        </div>
    `;

    return div;
}

// Load deliveries
function loadDeliveries() {
    const deliveriesList = document.getElementById('deliveriesList');
    if (!deliveriesList) return;
    
    deliveriesList.innerHTML = '';

    const posts = DB.getPostsByType('delivery');
    posts.forEach(post => {
        const postElement = createPostElement(post);
        deliveriesList.appendChild(postElement);
    });
}

// Load services
function loadServices() {
    const servicesList = document.getElementById('servicesList');
    if (!servicesList) return;
    
    servicesList.innerHTML = '';

    const posts = DB.getPostsByType('service');
    posts.forEach(post => {
        const postElement = createPostElement(post);
        servicesList.appendChild(postElement);
    });
}

// Load messages
function loadMessages() {
    const conversationsList = document.getElementById('conversationsList');
    if (!conversationsList) return;
    
    conversationsList.innerHTML = '';

    const conversations = DB.getConversations(currentUser.id);
    
    Object.keys(conversations).forEach(userId => {
        const otherUser = DB.getUserById(userId);
        const lastMessage = conversations[userId][conversations[userId].length - 1];
        
        const div = document.createElement('div');
        div.className = 'conversation';
        div.onclick = () => loadChat(userId);
        div.innerHTML = `
            <div class="conversation-name">${otherUser.name}</div>
            <div class="conversation-preview">${lastMessage.message.substring(0, 40)}...</div>
        `;
        conversationsList.appendChild(div);
    });
}

// Load chat
function loadChat(userId) {
    const chatArea = document.getElementById('chatArea');
    const messages = DB.getMessages(currentUser.id, userId);
    const otherUser = DB.getUserById(userId);

    chatArea.innerHTML = `
        <div style="padding: 1rem; border-bottom: 1px solid var(--light-bg); font-weight: 600;">${otherUser.name}</div>
        <div style="flex: 1; overflow-y: auto; padding: 1rem;" id="messagesContainer">
        </div>
        <div style="padding: 1rem; border-top: 1px solid var(--light-bg);" id="messageInput">
            <form onsubmit="sendMessage(event, '${userId}')" style="display: flex; gap: 0.5rem;">
                <input type="text" placeholder="Message..." id="messageText" required style="flex: 1; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 8px;">
                <button type="submit" class="btn btn-primary" style="flex: 0;">Send</button>
            </form>
        </div>
    `;

    const messagesContainer = document.getElementById('messagesContainer');
    messages.forEach(message => {
        const div = document.createElement('div');
        div.style.marginBottom = '1rem';
        div.style.textAlign = message.senderId === currentUser.id ? 'right' : 'left';
        div.innerHTML = `
            <div style="display: inline-block; background: ${message.senderId === currentUser.id ? 'var(--primary-color)' : 'var(--light-bg)'}; color: ${message.senderId === currentUser.id ? 'white' : 'var(--text-primary)'}; padding: 0.8rem 1rem; border-radius: 10px; max-width: 300px;">
                ${message.message}
            </div>
        `;
        messagesContainer.appendChild(div);
    });
}

// Send message
function sendMessage(e, receiverId) {
    e.preventDefault();
    const messageText = document.getElementById('messageText');
    const message = messageText.value;

    if (message.trim()) {
        DB.addMessage(currentUser.id, receiverId, message);
        messageText.value = '';
        loadChat(receiverId);
    }
}

// Load profile
function loadProfile() {
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileLocation').textContent = `${currentUser.city}, ${currentUser.state}`;
    document.getElementById('profileAvatar').src = currentUser.avatar || 'https://via.placeholder.com/150';
    document.getElementById('deliveriesCompleted').textContent = currentUser.completedDeliveries || 0;
    document.getElementById('servicesCompleted').textContent = currentUser.completedServices || 0;
    document.getElementById('userRating').textContent = (currentUser.rating || 0).toFixed(1);

    const userPostsList = document.getElementById('userPostsList');
    userPostsList.innerHTML = '';

    const userPosts = DB.getPostsByUser(currentUser.id);
    userPosts.forEach(post => {
        const postElement = createPostElement(post);
        userPostsList.appendChild(postElement);
    });
}

// Show create post modal
function showCreatePost(type) {
    const modal = document.getElementById('createPostModal');
    const form = document.getElementById('createPostForm');
    const modalTitle = document.getElementById('modalTitle');

    // Hide all form sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show relevant form section
    if (type === 'delivery') {
        modalTitle.textContent = '📦 Send a Package';
        document.getElementById('deliveryFields').classList.add('active');
        form.onsubmit = (e) => handleCreateDelivery(e);
        populateLocationSelects('deliveryState', 'deliveryCity');
    } else if (type === 'service') {
        modalTitle.textContent = '🛠️ Find a Service';
        document.getElementById('serviceFields').classList.add('active');
        form.onsubmit = (e) => handleCreateService(e);
        populateLocationSelects('serviceState', 'serviceCity');
    } else {
        modalTitle.textContent = 'Create a Post';
        form.onsubmit = (e) => handleCreatePost(e);
    }

    modal.classList.add('active');
}

// Handle create delivery
function handleCreateDelivery(e) {
    e.preventDefault();
    
    const post = DB.addPost({
        userId: currentUser.id,
        type: 'delivery',
        title: document.getElementById('postContent').value,
        content: document.getElementById('postContent').value,
        state: document.getElementById('deliveryState').value,
        city: document.getElementById('deliveryCity').value,
        pickupLocation: document.getElementById('pickupLocation').value,
        deliveryLocation: document.getElementById('deliveryLocation').value,
        price: parseInt(document.getElementById('deliveryPrice').value),
        packageDescription: document.getElementById('packageDescription').value
    });

    closeModal('createPostModal');
    loadFeed();
    alert('📦 Delivery posted successfully!');
}

// Handle create service
function handleCreateService(e) {
    e.preventDefault();
    
    const post = DB.addPost({
        userId: currentUser.id,
        type: 'service',
        title: document.getElementById('postContent').value,
        content: document.getElementById('serviceDescription').value,
        state: document.getElementById('serviceState').value,
        city: document.getElementById('serviceCity').value,
        serviceType: document.getElementById('serviceType').value,
        price: parseInt(document.getElementById('servicePrice').value),
        description: document.getElementById('serviceDescription').value
    });

    closeModal('createPostModal');
    loadFeed();
    alert('🛠️ Service posted successfully!');
}

// Handle create general post
function handleCreatePost(e) {
    e.preventDefault();
    
    const post = DB.addPost({
        userId: currentUser.id,
        type: 'general',
        title: 'Post',
        content: document.getElementById('postContent').value,
        state: currentUser.state,
        city: currentUser.city
    });

    closeModal('createPostModal');
    loadFeed();
    alert('Post created successfully!');
}

// Accept post
function acceptPost(postId) {
    const post = DB.getPostById(postId);
    alert(`✅ You accepted the ${post.type}!\nPlease message ${DB.getUserById(post.userId).name} to proceed.`);
}

// View post detail
function viewPostDetail(postId) {
    const post = DB.getPostById(postId);
    const user = DB.getUserById(post.userId);
    const modal = document.getElementById('postDetailModal');
    const content = document.getElementById('postDetailContent');

    let details = '';
    if (post.type === 'delivery') {
        details = `
            <p><strong>From:</strong> ${post.pickupLocation}</p>
            <p><strong>To:</strong> ${post.deliveryLocation}</p>
            <p><strong>Package:</strong> ${post.packageDescription}</p>
            <p><strong>Price:</strong> ₦${post.price.toLocaleString()}</p>
        `;
    } else if (post.type === 'service') {
        details = `
            <p><strong>Service Type:</strong> ${post.serviceType}</p>
            <p><strong>Location:</strong> ${post.city}, ${post.state}</p>
            <p><strong>Budget:</strong> ₦${post.price.toLocaleString()}</p>
            <p><strong>Details:</strong> ${post.description}</p>
        `;
    }

    content.innerHTML = `
        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
            <img src="${user.avatar}" alt="Profile" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;">
            <div>
                <h3 style="margin: 0;">${user.name}</h3>
                <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary);">⭐ ${user.rating || 0} • ${user.completedDeliveries + user.completedServices} completions</p>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">${user.city}, ${user.state}</p>
            </div>
        </div>
        <div>
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            ${details}
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button class="btn btn-success" onclick="acceptPost('${post.id}'); closeModal('postDetailModal');">✅ Accept</button>
            <button class="btn btn-secondary" onclick="startChat('${post.userId}')">💬 Message</button>
        </div>
    `;

    modal.classList.add('active');
}

// Start chat
function startChat(userId) {
    showPage('messages');
    loadMessages();
    loadChat(userId);
    closeModal('postDetailModal');
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Handle search
function handleSearch(e) {
    const query = e.target.value;
    if (query.trim() === '') {
        loadFeed();
        return;
    }

    const results = DB.searchPosts(query);
    const postsFeed = document.getElementById('postsFeed');
    postsFeed.innerHTML = '';

    if (results.length === 0) {
        postsFeed.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No results found</p>';
        return;
    }

    results.forEach(post => {
        const postElement = createPostElement(post);
        postsFeed.appendChild(postElement);
    });
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showPage('login');
    setupAuthListeners();
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});