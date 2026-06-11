// Main Application Script - Enhanced and Fully Functional

let currentUser = null;
let currentPage = 'feed';
let currentChatUserId = null;

// Initialize app on page load
window.addEventListener('load', () => {
    initializeApp();
});

function initializeApp() {
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

function setupAuthListeners() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    const profilePicInput = document.getElementById('signupProfilePic');
    if (profilePicInput) {
        profilePicInput.addEventListener('change', (e) => handleProfilePicUpload(e, 'signupProfilePreview'));
    }
}

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
        alert('❌ Invalid email or password');
    }
}

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

    if (!state || !city) {
        alert('⚠️ Please select state and city');
        return;
    }

    if (password !== confirmPassword) {
        alert('❌ Passwords do not match');
        return;
    }

    if (DB.getUser(email)) {
        alert('❌ Email already registered');
        return;
    }

    const profilePicture = profilePicPreview.src !== 'https://via.placeholder.com/80?text=Photo' 
        ? profilePicPreview.src 
        : 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70);

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
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showPage('feed');
    loadDashboard();
    setupEventListeners();
    alert('✅ Account created successfully!');
}

function showSignup() {
    showPage('signup');
    populateLocationSelects('signupState', 'signupCity');
    setupAuthListeners();
}

function showLogin() {
    showPage('login');
    setupAuthListeners();
}

function populateLocationSelects(stateSelectId, citySelectId) {
    const stateSelect = document.getElementById(stateSelectId);
    const citySelect = document.getElementById(citySelectId);

    if (!stateSelect || !citySelect) return;

    stateSelect.innerHTML = '<option value="">Select State</option>';
    citySelect.innerHTML = '<option value="">Select City</option>';

    DB.getStates().forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });

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

function setupEventListeners() {
    document.querySelectorAll('.nav-icon').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page) {
                document.querySelectorAll('.nav-icon').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                showPage(page);
            }
        });
    });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }

    const postInput = document.getElementById('postInput');
    if (postInput) {
        postInput.addEventListener('click', () => {
            showCreatePost('general');
        });
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    const profilePicInput = document.getElementById('profilePicInput');
    if (profilePicInput) {
        profilePicInput.addEventListener('change', (e) => handleProfilePictureUpdate(e));
    }

    // Sidebar navigation
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const action = item.getAttribute('onclick');
            if (action && action.includes('showPage')) {
                const pageMatch = action.match(/showPage\('([^']+)'\)/);
                if (pageMatch) showPage(pageMatch[1]);
            } else if (action && action.includes('showCreatePost')) {
                const typeMatch = action.match(/showCreatePost\('([^']+)'\)/);
                if (typeMatch) showCreatePost(typeMatch[1]);
            }
        });
    });
}

function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

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

    currentPage = page;
}

function loadDashboard() {
    const sidebarUserName = document.getElementById('sidebarUserName');
    const sidebarUserStatus = document.getElementById('sidebarUserStatus');
    const sidebarUserAvatar = document.getElementById('sidebarUserAvatar');
    const composerUserAvatar = document.getElementById('composerUserAvatar');

    if (sidebarUserName) sidebarUserName.textContent = currentUser.name;
    if (sidebarUserStatus) sidebarUserStatus.textContent = `Verified customer • ${currentUser.city}, ${currentUser.state}`;
    if (sidebarUserAvatar) sidebarUserAvatar.src = currentUser.avatar || 'https://i.pravatar.cc/50';
    if (composerUserAvatar) composerUserAvatar.src = currentUser.avatar || 'https://i.pravatar.cc/44';

    const posts = DB.getPosts();
    const openPosts = posts.filter(p => p.status === 'available').length;
    const deliveryPosts = posts.filter(p => p.type === 'delivery').length;
    const artisanPosts = posts.filter(p => p.type === 'service').length;

    document.getElementById('openPostsCount').textContent = openPosts;
    document.getElementById('deliveriesCount').textContent = deliveryPosts;
    document.getElementById('servicesCount').textContent = artisanPosts;
    document.getElementById('escrowCount').textContent = '₦' + (Math.random() * 500000 | 0).toLocaleString();

    const locations = DB.getLocations();
    document.getElementById('totalLocationsCount').textContent = locations.length;
    document.getElementById('nigeriaLocationsCount').textContent = Object.keys(DB.getNigerianLocations()).reduce((sum, state) => sum + DB.getCitiesByState(state).length, 0);

    loadCategories();
    loadPeople();
    loadFeed();
}

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
        { emoji: '🧵', name: 'Tailoring', type: 'artisan' },
        { emoji: '📱', name: 'Phone Repair', type: 'artisan' }
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
            <p class="person-trust">${(Math.random() * 20 + 75 | 0)}%</p>
        `;
        peopleList.appendChild(div);
    });
}

function loadFeed() {
    const postsFeed = document.getElementById('postsFeed');
    if (!postsFeed) return;
    
    postsFeed.innerHTML = '';

    const posts = DB.getPosts();
    if (posts.length === 0) {
        postsFeed.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><p class="empty-state-text">No posts available yet</p></div>';
        return;
    }

    posts.forEach(post => {
        const postElement = createPostElement(post);
        postsFeed.appendChild(postElement);
    });
}

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
                    <span class="post-details-label">📍 Location:</span>
                    <span class="post-details-value">${post.city}, ${post.state}</span>
                </div>
                <div class="post-details-item">
                    <span class="post-details-label">💰 Budget:</span>
                    <span class="post-details-value post-price">₦${post.price.toLocaleString()}</span>
                </div>
            </div>
        `;
    }

    div.innerHTML = `
        <div class="post-header">
            <div class="post-author">
                <img src="${user.avatar}" alt="Profile">
                <div class="post-author-info">
                    <h3>${user.name}</h3>
                    <p>${formatDate(post.createdAt)}</p>
                </div>
            </div>
            <div class="post-meta">
                <span>${typeIcon}</span>
                <span class="status-badge">Available</span>
            </div>
        </div>
        <div class="post-content">
            <h4>${post.title}</h4>
            <p>${post.content}</p>
            ${details}
        </div>
        <div class="post-actions">
            <button class="btn btn-success" onclick="acceptPost('${post.id}')" title="Accept this job">✅ Accept</button>
            <button class="btn btn-secondary" onclick="viewPostDetail('${post.id}')" title="View details">👁️ Details</button>
        </div>
    `;

    return div;
}

function loadDeliveries() {
    const deliveriesList = document.getElementById('deliveriesList');
    if (!deliveriesList) return;
    
    deliveriesList.innerHTML = '';
    const posts = DB.getPostsByType('delivery');
    
    if (posts.length === 0) {
        deliveriesList.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><p class="empty-state-text">No deliveries available yet</p></div>';
        return;
    }

    posts.forEach(post => {
        const postElement = createPostElement(post);
        deliveriesList.appendChild(postElement);
    });
}

function loadServices() {
    const servicesList = document.getElementById('servicesList');
    if (!servicesList) return;
    
    servicesList.innerHTML = '';
    const posts = DB.getPostsByType('service');
    
    if (posts.length === 0) {
        servicesList.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><p class="empty-state-text">No services available yet</p></div>';
        return;
    }

    posts.forEach(post => {
        const postElement = createPostElement(post);
        servicesList.appendChild(postElement);
    });
}

function loadMessages() {
    const conversationsList = document.getElementById('conversationsList');
    if (!conversationsList) return;
    
    conversationsList.innerHTML = '';
    const conversations = DB.getConversations(currentUser.id);
    
    if (Object.keys(conversations).length === 0) {
        conversationsList.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-secondary);">No conversations yet</div>';
        return;
    }

    Object.keys(conversations).forEach(userId => {
        const otherUser = DB.getUserById(userId);
        const lastMessage = conversations[userId][conversations[userId].length - 1];
        
        const div = document.createElement('div');
        div.className = 'conversation';
        div.style.cursor = 'pointer';
        div.onclick = () => loadChat(userId);
        div.innerHTML = `
            <div class="conversation-name">${otherUser.name}</div>
            <div class="conversation-preview">${lastMessage.message.substring(0, 40)}...</div>
        `;
        conversationsList.appendChild(div);
    });
}

function loadChat(userId) {
    currentChatUserId = userId;
    const chatArea = document.getElementById('chatArea');
    const messages = DB.getMessages(currentUser.id, userId);
    const otherUser = DB.getUserById(userId);

    chatArea.innerHTML = `
        <div style="padding: 1rem; border-bottom: 2px solid var(--border-color); font-weight: 700; color: var(--text-primary);">${otherUser.name}</div>
        <div style="flex: 1; overflow-y: auto; padding: 1rem;" id="messagesContainer">
        </div>
        <div style="padding: 1rem; border-top: 2px solid var(--border-color);" id="messageInput">
            <form onsubmit="sendMessage(event)" style="display: flex; gap: 0.5rem;">
                <input type="text" placeholder="Message..." id="messageText" required style="flex: 1; padding: 0.8rem; border: 2px solid var(--border-color); border-radius: 8px; outline: none; color: var(--text-primary);" />
                <button type="submit" class="btn btn-primary" style="flex: 0; padding: 0.8rem 1.5rem;">Send</button>
            </form>
        </div>
    `;

    const messagesContainer = document.getElementById('messagesContainer');
    if (messages.length === 0) {
        messagesContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No messages yet. Start the conversation!</p>';
    } else {
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
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function sendMessage(e) {
    e.preventDefault();
    const messageText = document.getElementById('messageText');
    const message = messageText.value;

    if (message.trim() && currentChatUserId) {
        DB.addMessage(currentUser.id, currentChatUserId, message);
        messageText.value = '';
        loadChat(currentChatUserId);
    }
}

function loadProfile() {
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileLocation').textContent = `${currentUser.city}, ${currentUser.state}`;
    document.getElementById('profileAvatar').src = currentUser.avatar || 'https://i.pravatar.cc/150';
    document.getElementById('deliveriesCompleted').textContent = currentUser.completedDeliveries || 0;
    document.getElementById('servicesCompleted').textContent = currentUser.completedServices || 0;
    document.getElementById('userRating').textContent = (currentUser.rating || 0).toFixed(1);

    const userPostsList = document.getElementById('userPostsList');
    userPostsList.innerHTML = '';

    const userPosts = DB.getPostsByUser(currentUser.id);
    if (userPosts.length === 0) {
        userPostsList.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📝</div><p class="empty-state-text">You haven\'t created any posts yet</p></div>';
    } else {
        userPosts.forEach(post => {
            const postElement = createPostElement(post);
            userPostsList.appendChild(postElement);
        });
    }
}

function showCreatePost(type) {
    const modal = document.getElementById('createPostModal');
    const form = document.getElementById('createPostForm');
    const modalTitle = document.getElementById('modalTitle');

    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });

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
        modalTitle.textContent = '✍️ Create a Post';
        form.onsubmit = (e) => handleCreatePost(e);
    }

    modal.classList.add('active');
}

function handleCreateDelivery(e) {
    e.preventDefault();
    
    const title = document.getElementById('postContent').value;
    const pickupLocation = document.getElementById('pickupLocation').value;
    const deliveryLocation = document.getElementById('deliveryLocation').value;
    const state = document.getElementById('deliveryState').value;
    const city = document.getElementById('deliveryCity').value;
    const price = parseInt(document.getElementById('deliveryPrice').value);

    if (!title || !pickupLocation || !deliveryLocation || !state || !city || !price) {
        alert('⚠️ Please fill all fields');
        return;
    }

    const post = DB.addPost({
        userId: currentUser.id,
        type: 'delivery',
        title: title,
        content: title,
        state: state,
        city: city,
        pickupLocation: pickupLocation,
        deliveryLocation: deliveryLocation,
        price: price,
        packageDescription: document.getElementById('packageDescription').value
    });

    closeModal('createPostModal');
    document.getElementById('createPostForm').reset();
    loadFeed();
    alert('✅ Delivery posted successfully!');
}

function handleCreateService(e) {
    e.preventDefault();
    
    const title = document.getElementById('postContent').value;
    const serviceType = document.getElementById('serviceType').value;
    const state = document.getElementById('serviceState').value;
    const city = document.getElementById('serviceCity').value;
    const price = parseInt(document.getElementById('servicePrice').value);
    const description = document.getElementById('serviceDescription').value;

    if (!title || !serviceType || !state || !city || !price) {
        alert('⚠️ Please fill all fields');
        return;
    }

    const post = DB.addPost({
        userId: currentUser.id,
        type: 'service',
        title: title,
        content: description || title,
        state: state,
        city: city,
        serviceType: serviceType,
        price: price,
        description: description
    });

    closeModal('createPostModal');
    document.getElementById('createPostForm').reset();
    loadFeed();
    alert('✅ Service posted successfully!');
}

function handleCreatePost(e) {
    e.preventDefault();
    
    const content = document.getElementById('postContent').value;
    if (!content.trim()) {
        alert('⚠️ Please enter some content');
        return;
    }

    const post = DB.addPost({
        userId: currentUser.id,
        type: 'general',
        title: 'Post',
        content: content,
        state: currentUser.state,
        city: currentUser.city
    });

    closeModal('createPostModal');
    document.getElementById('createPostForm').reset();
    loadFeed();
    alert('✅ Post created successfully!');
}

function acceptPost(postId) {
    const post = DB.getPostById(postId);
    alert(`✅ You accepted the ${post.type}!\n\n📞 Message ${DB.getUserById(post.userId).name} to proceed.`);
    showPage('messages');
    loadMessages();
}

function viewPostDetail(postId) {
    const post = DB.getPostById(postId);
    const user = DB.getUserById(post.userId);
    const modal = document.getElementById('postDetailModal');
    const content = document.getElementById('postDetailContent');

    let details = '';
    if (post.type === 'delivery') {
        details = `
            <p><strong>📍 From:</strong> ${post.pickupLocation}</p>
            <p><strong>🏁 To:</strong> ${post.deliveryLocation}</p>
            <p><strong>📦 Package:</strong> ${post.packageDescription}</p>
            <p><strong>💰 Price:</strong> <span style="color: var(--primary-color); font-weight: 900;">₦${post.price.toLocaleString()}</span></p>
        `;
    } else if (post.type === 'service') {
        details = `
            <p><strong>Service Type:</strong> ${post.serviceType}</p>
            <p><strong>📍 Location:</strong> ${post.city}, ${post.state}</p>
            <p><strong>💰 Budget:</strong> <span style="color: var(--primary-color); font-weight: 900;">₦${post.price.toLocaleString()}</span></p>
            <p><strong>Details:</strong> ${post.description}</p>
        `;
    }

    content.innerHTML = `
        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
            <img src="${user.avatar}" alt="Profile" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary-color);">
            <div>
                <h3 style="margin: 0; color: var(--text-primary);">${user.name}</h3>
                <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary);">⭐ ${user.rating || 0} • ${(user.completedDeliveries + user.completedServices)} completions</p>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">${user.city}, ${user.state}</p>
            </div>
        </div>
        <div>
            <h2 style="color: var(--text-primary);">${post.title}</h2>
            <p style="color: var(--text-primary);">${post.content}</p>
            ${details}
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap;">
            <button class="btn btn-success" onclick="acceptPost('${post.id}'); closeModal('postDetailModal');" style="flex: 1;">✅ Accept</button>
            <button class="btn btn-secondary" onclick="startChat('${post.userId}')" style="flex: 1;">💬 Message</button>
        </div>
    `;

    modal.classList.add('active');
}

function startChat(userId) {
    closeModal('postDetailModal');
    showPage('messages');
    loadMessages();
    setTimeout(() => loadChat(userId), 500);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

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
        postsFeed.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔍</div><p class="empty-state-text">No results found for "' + query + '"</p></div>';
        return;
    }

    results.forEach(post => {
        const postElement = createPostElement(post);
        postsFeed.appendChild(postElement);
    });
}

function handleProfilePictureUpdate(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            currentUser.avatar = event.target.result;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            document.getElementById('profileAvatar').src = event.target.result;
            loadDashboard();
            alert('✅ Profile picture updated!');
        };
        reader.readAsDataURL(file);
    }
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showPage('login');
    setupAuthListeners();
    alert('✅ Logged out successfully!');
}

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

document.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Initialize navigation on load
window.addEventListener('load', () => {
    const feedLink = document.querySelector('[data-page="feed"]');
    if (feedLink) feedLink.classList.add('active');
});
