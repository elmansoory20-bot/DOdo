// Database Management System
// Using localStorage as the database for now

const DB = {
    // Initialize database with sample data
    init() {
        if (!localStorage.getItem('dodo_db_initialized')) {
            this.createTables();
            this.addSampleData();
            localStorage.setItem('dodo_db_initialized', 'true');
        }
    },

    // Create database tables
    createTables() {
        localStorage.setItem('users', JSON.stringify([]));
        localStorage.setItem('posts', JSON.stringify([]));
        localStorage.setItem('deliveries', JSON.stringify([]));
        localStorage.setItem('services', JSON.stringify([]));
        localStorage.setItem('messages', JSON.stringify([]));
        localStorage.setItem('ratings', JSON.stringify([]));
        localStorage.setItem('locations', JSON.stringify(this.getNigerianLocations()));
    },

    // Get Nigerian states and cities
    getNigerianLocations() {
        return {
            'Abia': ['Aba', 'Umuahia', 'Ohafia', 'Arochukwu'],
            'Adamawa': ['Yola', 'Girei', 'Mayo-Belwa', 'Mubi'],
            'Akwa Ibom': ['Uyo', 'Eket', 'Oron', 'Ikot Ekpene'],
            'Anambra': ['Onitsha', 'Awka', 'Nnewi', 'Ekwulobia'],
            'Bauchi': ['Bauchi', 'Jigawa', 'Azare', 'Misau'],
            'Bayelsa': ['Yenagoa', 'Brass', 'Ogbia', 'Ekeremor'],
            'Benue': ['Makurdi', 'Gboko', 'Otukpo', 'Katsina-Ala'],
            'Borno': ['Maiduguri', 'Biu', 'Damaturu', 'Jere'],
            'Cross River': ['Calabar', 'Buea', 'Ikom', 'Obudu'],
            'Delta': ['Warri', 'Asaba', 'Effurun', 'Agbor'],
            'Ebonyi': ['Abakaliki', 'Ebonyi', 'Ishielu', 'Onicha'],
            'Edo': ['Benin City', 'Midwestern', 'Okada', 'Auchi'],
            'Ekiti': ['Ado-Ekiti', 'Ikere', 'Ijero', 'Oye'],
            'Enugu': ['Enugu', 'Nsukka', 'Enugu Town', 'Agbani'],
            'FCT': ['Abuja', 'Kuje', 'Gwagwalada', 'Bwari'],
            'Gombe': ['Gombe', 'Akko', 'Balanga', 'Dukku'],
            'Imo': ['Owerri', 'Orlu', 'Onitsha', 'Aba'],
            'Jigawa': ['Dutse', 'Hadejia', 'Gumel', 'Kafin Hausa'],
            'Kaduna': ['Kaduna', 'Zaria', 'Kafanchan', 'Saminaka'],
            'Kano': ['Kano', 'Kano City', 'Tarauni', 'Garko'],
            'Katsina': ['Katsina', 'Katsina City', 'Daura', 'Dutsin-Ma'],
            'Kebbi': ['Birnin Kebbi', 'Argungu', 'Zuru', 'Jega'],
            'Kogi': ['Lokoja', 'Okene', 'Idah', 'Okehi'],
            'Kwara': ['Ilorin', 'Offa', 'Kwara', 'Pategi'],
            'Lagos': ['Lagos Island', 'Ikeja', 'Victoria Island', 'Lekki', 'Surulere', 'Yaba', 'Shomolu', 'Mushin'],
            'Nasarawa': ['Lafia', 'Nasarawa', 'Keffi', 'Obi'],
            'Niger': ['Minna', 'Niger', 'Suleja', 'Bida'],
            'Ogun': ['Abeokuta', 'Ijebu-Ode', 'Sagamu', 'Ibadan'],
            'Ondo': ['Akure', 'Ondo', 'Ore', 'Owo'],
            'Osun': ['Osogbo', 'Ile-Ife', 'Iwo', 'Ijesha'],
            'Oyo': ['Ibadan', 'Oyo', 'Ogbomoso', 'Oyo State'],
            'Plateau': ['Jos', 'Pankshin', 'Barkin Ladi', 'Kanang'],
            'Rivers': ['Port Harcourt', 'Obio-Akpor', 'Bonny', 'Okrika'],
            'Sokoto': ['Sokoto', 'Tambuwal', 'Bodinga', 'Wamakko'],
            'Taraba': ['Jalingo', 'Wukari', 'Takum', 'Zing'],
            'Yobe': ['Damaturu', 'Potiskum', 'Gashua', 'Karasuwa'],
            'Zamfara': ['Gusau', 'Kaura-Namoda', 'Talata-Mafara', 'Bakura']
        };
    },

    // Add sample data
    addSampleData() {
        const sampleUsers = [
            {
                id: 'user_1',
                name: 'Chukwu Emmanuel',
                email: 'chukwu@example.com',
                phone: '08012345678',
                state: 'Lagos',
                city: 'Lagos Island',
                password: 'password123',
                avatar: 'https://via.placeholder.com/150?text=Chukwu',
                createdAt: new Date().toISOString(),
                rating: 4.8,
                completedDeliveries: 15,
                completedServices: 5
            },
            {
                id: 'user_2',
                name: 'Amina Hassan',
                email: 'amina@example.com',
                phone: '08098765432',
                state: 'Kano',
                city: 'Kano',
                password: 'password123',
                avatar: 'https://via.placeholder.com/150?text=Amina',
                createdAt: new Date().toISOString(),
                rating: 4.9,
                completedDeliveries: 22,
                completedServices: 8
            }
        ];

        const samplePosts = [
            {
                id: 'post_1',
                userId: 'user_1',
                type: 'delivery',
                title: 'Need urgent delivery from Ikeja to VI',
                content: 'I have a package that needs to be delivered urgently from Ikeja to Victoria Island. Package is important documents, small and lightweight.',
                state: 'Lagos',
                city: 'Lagos Island',
                pickupLocation: 'Ikeja',
                deliveryLocation: 'Victoria Island',
                price: 5000,
                packageDescription: 'Important documents',
                status: 'available',
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                likes: 3,
                comments: 1
            },
            {
                id: 'post_2',
                userId: 'user_2',
                type: 'service',
                title: 'Need professional laundry service',
                content: 'Looking for a reliable and professional laundry service. I have about 50kg of clothes that need washing and pressing.',
                state: 'Kano',
                city: 'Kano',
                serviceType: 'laundry',
                price: 8000,
                description: 'Professional laundry service needed for 50kg of clothes',
                status: 'available',
                createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                likes: 2,
                comments: 0
            }
        ];

        localStorage.setItem('users', JSON.stringify(sampleUsers));
        localStorage.setItem('posts', JSON.stringify(samplePosts));
    },

    // User functions
    addUser(userData) {
        const users = JSON.parse(localStorage.getItem('users'));
        const newUser = {
            id: 'user_' + Date.now(),
            ...userData,
            createdAt: new Date().toISOString(),
            rating: 0,
            completedDeliveries: 0,
            completedServices: 0
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return newUser;
    },

    getUser(email) {
        const users = JSON.parse(localStorage.getItem('users'));
        return users.find(u => u.email === email);
    },

    getUserById(id) {
        const users = JSON.parse(localStorage.getItem('users'));
        return users.find(u => u.id === id);
    },

    // Post functions
    addPost(postData) {
        const posts = JSON.parse(localStorage.getItem('posts'));
        const newPost = {
            id: 'post_' + Date.now(),
            ...postData,
            createdAt: new Date().toISOString(),
            likes: 0,
            comments: 0,
            status: 'available'
        };
        posts.push(newPost);
        localStorage.setItem('posts', JSON.stringify(posts));
        return newPost;
    },

    getPosts() {
        const posts = JSON.parse(localStorage.getItem('posts'));
        return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    getPostById(id) {
        const posts = JSON.parse(localStorage.getItem('posts'));
        return posts.find(p => p.id === id);
    },

    getPostsByUser(userId) {
        const posts = JSON.parse(localStorage.getItem('posts'));
        return posts.filter(p => p.userId === userId);
    },

    getPostsByType(type) {
        const posts = JSON.parse(localStorage.getItem('posts'));
        return posts.filter(p => p.type === type);
    },

    getPostsByService(serviceType) {
        const posts = JSON.parse(localStorage.getItem('posts'));
        return posts.filter(p => p.type === 'service' && p.serviceType === serviceType);
    },

    getPostsByLocation(state, city) {
        const posts = JSON.parse(localStorage.getItem('posts'));
        return posts.filter(p => p.state === state && p.city === city);
    },

    updatePost(id, updates) {
        const posts = JSON.parse(localStorage.getItem('posts'));
        const postIndex = posts.findIndex(p => p.id === id);
        if (postIndex !== -1) {
            posts[postIndex] = { ...posts[postIndex], ...updates };
            localStorage.setItem('posts', JSON.stringify(posts));
            return posts[postIndex];
        }
        return null;
    },

    // Message functions
    addMessage(senderId, receiverId, message) {
        const messages = JSON.parse(localStorage.getItem('messages'));
        const newMessage = {
            id: 'msg_' + Date.now(),
            senderId,
            receiverId,
            message,
            createdAt: new Date().toISOString(),
            read: false
        };
        messages.push(newMessage);
        localStorage.setItem('messages', JSON.stringify(messages));
        return newMessage;
    },

    getMessages(userId1, userId2) {
        const messages = JSON.parse(localStorage.getItem('messages'));
        return messages.filter(m => 
            (m.senderId === userId1 && m.receiverId === userId2) || 
            (m.senderId === userId2 && m.receiverId === userId1)
        ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },

    getConversations(userId) {
        const messages = JSON.parse(localStorage.getItem('messages'));
        const conversations = {};

        messages.forEach(m => {
            const otherUserId = m.senderId === userId ? m.receiverId : m.senderId;
            if (!conversations[otherUserId]) {
                conversations[otherUserId] = [];
            }
            conversations[otherUserId].push(m);
        });

        return conversations;
    },

    // Rating functions
    addRating(fromUserId, toUserId, rating, review) {
        const ratings = JSON.parse(localStorage.getItem('ratings'));
        const newRating = {
            id: 'rating_' + Date.now(),
            fromUserId,
            toUserId,
            rating,
            review,
            createdAt: new Date().toISOString()
        };
        ratings.push(newRating);
        localStorage.setItem('ratings', JSON.stringify(ratings));
        return newRating;
    },

    getRatings(userId) {
        const ratings = JSON.parse(localStorage.getItem('ratings'));
        return ratings.filter(r => r.toUserId === userId);
    },

    // Location functions
    getLocations() {
        return JSON.parse(localStorage.getItem('locations'));
    },

    getStates() {
        const locations = JSON.parse(localStorage.getItem('locations'));
        return Object.keys(locations).sort();
    },

    getCitiesByState(state) {
        const locations = JSON.parse(localStorage.getItem('locations'));
        return locations[state] || [];
    },

    // Search functions
    searchPosts(query) {
        const posts = this.getPosts();
        const lowerQuery = query.toLowerCase();
        return posts.filter(p => 
            p.title.toLowerCase().includes(lowerQuery) ||
            p.content.toLowerCase().includes(lowerQuery) ||
            (p.serviceType && p.serviceType.toLowerCase().includes(lowerQuery))
        );
    },

    searchUsers(query) {
        const users = JSON.parse(localStorage.getItem('users'));
        const lowerQuery = query.toLowerCase();
        return users.filter(u => 
            u.name.toLowerCase().includes(lowerQuery) ||
            u.email.toLowerCase().includes(lowerQuery)
        );
    }
};

// Initialize database when script loads
DB.init();