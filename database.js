// Database Module - In-Memory Database

const DB = {
    // Sample Data
    states: ['Lagos', 'FCT', 'Rivers', 'Oyo', 'Kano', 'Kaduna', 'Katsina', 'Osun', 'Ekiti', 'Ondo', 'Edo', 'Delta', 'Cross River', 'Bayelsa', 'Akwa Ibom', 'Enugu', 'Ebonyi', 'Abia', 'Imo', 'Anambra'],
    
    cities: {
        'Lagos': ['Ikeja', 'Lekki', 'Victoria Island', 'Surulere', 'Yaba', 'Ikoyi', 'Ajah', 'Badagry'],
        'FCT': ['Abuja', 'Garki', 'Wuse', 'Guzape', 'Asokoro'],
        'Rivers': ['Port Harcourt', 'Obio Akpor', 'Bonny', 'Okrika'],
        'Oyo': ['Ibadan', 'Ogbomoso', 'Oyo', 'Iseyin'],
        'Kano': ['Kano City', 'Nassarawa', 'Wudil'],
        'Kaduna': ['Kaduna City', 'Zaria', 'Kafanchan'],
        'Katsina': ['Katsina', 'Daura', 'Jibia'],
        'Osun': ['Osogbo', 'Ife', 'Ijesha'],
        'Ekiti': ['Ado Ekiti', 'Ikere'],
        'Ondo': ['Akure', 'Owo', 'Ondo City'],
        'Edo': ['Benin City', 'Auchi'],
        'Delta': ['Asaba', 'Warri', 'Sapele'],
        'Cross River': ['Calabar', 'Ogoja'],
        'Bayelsa': ['Yenagoa', 'Brass'],
        'Akwa Ibom': ['Uyo', 'Eket'],
        'Enugu': ['Enugu City', 'Nsukka'],
        'Ebonyi': ['Abakaliki', 'Onuebonyi'],
        'Abia': ['Aba', 'Umuahia'],
        'Imo': ['Owerri', 'Orlu'],
        'Anambra': ['Onitsha', 'Awka']
    },

    users: [
        {
            id: '1',
            name: 'Chukwu Okafor',
            email: 'chukwu@example.com',
            password: 'password123',
            phone: '08012345678',
            state: 'Lagos',
            city: 'Ikeja',
            avatar: 'https://i.pravatar.cc/150?img=1',
            completedDeliveries: 12,
            completedServices: 5,
            rating: 4.8,
            role: 'customer'
        },
        {
            id: '2',
            name: 'Tunde Rider',
            email: 'tunde@example.com',
            password: 'password123',
            phone: '08087654321',
            state: 'Lagos',
            city: 'Lekki',
            avatar: 'https://i.pravatar.cc/150?img=2',
            completedDeliveries: 45,
            completedServices: 0,
            rating: 4.9,
            role: 'rider'
        },
        {
            id: '3',
            name: 'Amaka Laundry Services',
            email: 'amaka@example.com',
            password: 'password123',
            phone: '08098765432',
            state: 'Lagos',
            city: 'Surulere',
            avatar: 'https://i.pravatar.cc/150?img=3',
            completedDeliveries: 0,
            completedServices: 87,
            rating: 4.7,
            role: 'artisan'
        }
    ],

    posts: [
        {
            id: '1',
            userId: '1',
            type: 'delivery',
            title: 'Send package from Computer Village to Yaba',
            content: 'Need to send sealed phone accessories package. Light weight, should arrive today.',
            state: 'Lagos',
            city: 'Ikeja',
            pickupLocation: 'Computer Village, Ikeja',
            deliveryLocation: 'Sabo, Yaba',
            price: 3500,
            status: 'available',
            createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: '2',
            userId: '3',
            type: 'service',
            title: 'Professional Laundry & Ironing Service',
            content: 'We offer pickup, wash, iron and delivery service within 48 hours. Quality guaranteed!',
            state: 'Lagos',
            city: 'Surulere',
            serviceType: 'laundry',
            price: 2500,
            description: 'Shirts, native wears, delicate fabrics - all handled professionally',
            status: 'available',
            createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
            id: '3',
            userId: '1',
            type: 'service',
            title: 'Need a Barber for Home Visit',
            content: 'Looking for experienced barber around Lekki for quick haircut.',
            state: 'Lagos',
            city: 'Lekki',
            serviceType: 'barbing',
            price: 5000,
            description: 'Professional barber with sterilized tools needed for home visit this evening',
            status: 'available',
            createdAt: new Date(Date.now() - 10800000).toISOString()
        },
        {
            id: '4',
            userId: '1',
            type: 'delivery',
            title: 'Deliver documents to FCT, Abuja',
            content: 'Important business documents need to reach Abuja office by tomorrow morning.',
            state: 'FCT',
            city: 'Abuja',
            pickupLocation: 'VI, Lagos',
            deliveryLocation: 'Garki, Abuja',
            price: 8500,
            status: 'available',
            createdAt: new Date(Date.now() - 14400000).toISOString()
        }
    ],

    conversations: {},

    messages: {},

    // Get all users
    getUsers() {
        return this.users;
    },

    // Get user by ID
    getUserById(id) {
        return this.users.find(u => u.id === id);
    },

    // Get user by email
    getUser(email) {
        return this.users.find(u => u.email === email);
    },

    // Add new user
    addUser(userData) {
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            completedDeliveries: 0,
            completedServices: 0,
            rating: 0,
            role: 'customer'
        };
        this.users.push(newUser);
        return newUser;
    },

    // Get all posts
    getPosts() {
        return this.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    // Get posts by type
    getPostsByType(type) {
        return this.posts.filter(p => p.type === type).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    // Get posts by user
    getPostsByUser(userId) {
        return this.posts.filter(p => p.userId === userId);
    },

    // Get post by ID
    getPostById(id) {
        return this.posts.find(p => p.id === id);
    },

    // Add new post
    addPost(postData) {
        const newPost = {
            id: Date.now().toString(),
            ...postData,
            status: 'available',
            createdAt: new Date().toISOString()
        };
        this.posts.push(newPost);
        return newPost;
    },

    // Search posts
    searchPosts(query) {
        const q = query.toLowerCase();
        return this.posts.filter(p => 
            p.title.toLowerCase().includes(q) || 
            p.content.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q)
        );
    },

    // Get states
    getStates() {
        return this.states;
    },

    // Get cities by state
    getCitiesByState(state) {
        return this.cities[state] || [];
    },

    // Get Nigerian locations
    getNigerianLocations() {
        return this.cities;
    },

    // Get locations
    getLocations() {
        const locations = [];
        Object.keys(this.cities).forEach(state => {
            this.cities[state].forEach(city => {
                locations.push({ state, city });
            });
        });
        return locations;
    },

    // Get conversations
    getConversations(userId) {
        if (!this.conversations[userId]) {
            this.conversations[userId] = {};
        }
        return this.conversations[userId];
    },

    // Add message
    addMessage(senderId, receiverId, message) {
        const conversationKey = `${senderId}-${receiverId}`;
        
        if (!this.messages[conversationKey]) {
            this.messages[conversationKey] = [];
        }

        this.messages[conversationKey].push({
            senderId,
            receiverId,
            message,
            timestamp: new Date().toISOString()
        });

        // Update conversations
        if (!this.conversations[senderId]) this.conversations[senderId] = {};
        if (!this.conversations[senderId][receiverId]) {
            this.conversations[senderId][receiverId] = [];
        }
        this.conversations[senderId][receiverId] = this.messages[conversationKey];

        if (!this.conversations[receiverId]) this.conversations[receiverId] = {};
        if (!this.conversations[receiverId][senderId]) {
            this.conversations[receiverId][senderId] = [];
        }
        this.conversations[receiverId][senderId] = this.messages[conversationKey];
    },

    // Get messages between two users
    getMessages(userId1, userId2) {
        const key1 = `${userId1}-${userId2}`;
        const key2 = `${userId2}-${userId1}`;
        return this.messages[key1] || this.messages[key2] || [];
    }
};

// Initialize with sample conversations
DB.addMessage('1', '2', 'Hi Tunde, can you help with this delivery?');
DB.addMessage('2', '1', 'Yes! I can help. What time?');
DB.addMessage('1', '2', 'Around 3 PM');

DB.addMessage('1', '3', 'Hi Amaka, do you offer laundry service?');
DB.addMessage('3', '1', 'Yes! We do. Send us your clothes and we deliver within 48 hours');
