# DOdo - Delivery & Artisan Services App

## Overview
DOdo is a Facebook-like platform that connects people for delivery services and artisan work across Nigeria. Users can post when they need packages delivered or require services like barbing, laundry, mechanics, electrical work, and more.

## Features

### Core Features
1. **Delivery Services**
   - Post packages that need to be delivered
   - Accept delivery jobs
   - Track deliveries
   - Price negotiations

2. **Artisan Services**
   - Request services (barbing, laundry, mechanic, electrical, plumbing, carpentry, cleaning)
   - Service providers can accept jobs
   - Location-based matching
   - Budget specification

3. **User Profile**
   - User ratings and reviews
   - Service history
   - Completion statistics
   - Location information

4. **Messaging System**
   - Direct messaging between users
   - Real-time chat
   - Conversation history

5. **Location System**
   - All 36 Nigerian states with major cities
   - Automatic location detection on posting
   - Location-based filtering

### Additional Features
- **Search Functionality** - Search posts and services
- **Feed** - See all available deliveries and services
- **User Ratings** - Rate and review service providers
- **Status Tracking** - Available, Active, Completed statuses

## Technology Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Database:** LocalStorage (Client-side, can be upgraded to cloud)
- **Styling:** CSS3 with responsive design
- **Icons:** Font Awesome

## Project Structure
```
DOdo/
├── index.html      # Main HTML file
├── style.css       # Styling
├── script.js       # Main application logic
├── database.js     # Local database management
└── README.md       # Documentation
```

## Getting Started

### Prerequisites
- Any modern web browser
- No installation required

### Installation
1. Clone or download the repository
2. Open `index.html` in your web browser
3. Sign up for an account
4. Start posting or accepting jobs!

### Demo Credentials
The app comes with sample data:
- **User 1:** chukwu@example.com / password123
- **User 2:** amina@example.com / password123

## Usage

### Creating an Account
1. Click "Sign up" on the login page
2. Fill in your details (name, email, phone, state, city)
3. Create a password
4. Click "Sign Up"

### Posting a Delivery
1. Click on "Deliveries" in the navigation
2. Click the post input area or click "Delivery" button
3. Fill in delivery details (pickup, delivery location, package info, price)
4. Click "Post"

### Posting a Service
1. Click on "Services" in the navigation
2. Click the service option in post creator
3. Select service type from dropdown
4. Fill in location, budget, and description
5. Click "Post"

### Accepting Jobs
1. Browse available posts in Feed or specific sections
2. Click "Accept" or "Details" to view more information
3. Click "Accept" to accept the job
4. Message the poster to coordinate

### Messaging
1. Go to "Messages" section
2. Click on a conversation or message a user after accepting their job
3. Send and receive messages in real-time

## Future Enhancements

### Phase 2
- Payment integration (Flutterwave, Paystack)
- Email verification
- Push notifications
- In-app payments
- Service provider verification

### Phase 3
- Expansion to other African countries
- Multiple language support
- Advanced analytics
- Admin dashboard
- Dispute resolution system

### Phase 4
- Cloud database migration
- Mobile app (React Native)
- API development
- Third-party integrations
- Performance optimization

## Database Structure

### Users Table
- id (unique identifier)
- name
- email
- phone
- state
- city
- password (hashed in production)
- avatar
- rating
- completedDeliveries
- completedServices
- createdAt

### Posts Table
- id
- userId
- type (delivery, service, general)
- title
- content
- state
- city
- status (available, active, completed)
- createdAt
- likes
- comments

### Deliveries Table (inherits from Posts)
- pickupLocation
- deliveryLocation
- price
- packageDescription

### Services Table (inherits from Posts)
- serviceType
- price (budget)
- description
- serviceStartDate

### Messages Table
- id
- senderId
- receiverId
- message
- createdAt
- read

### Ratings Table
- id
- fromUserId
- toUserId
- rating (1-5)
- review
- createdAt

## Nigerian Locations Included
All 36 states with major cities:
- Lagos (8 cities)
- Kano
- Abuja (FCT)
- Rivers
- Katsina
- And 31 more states...

## Security Considerations

### Current (Development)
- LocalStorage for data
- Client-side authentication

### Production (Recommended)
- Password hashing (bcrypt)
- JWT authentication
- HTTPS encryption
- Database encryption
- API rate limiting
- Input validation and sanitization
- CSRF protection

## Performance Tips

1. **Browser Storage**: Clean up old data periodically
2. **Caching**: Use browser caching for assets
3. **Image Optimization**: Compress images before upload
4. **Lazy Loading**: Implement for large lists

## Troubleshooting

### Can't login
- Make sure cookies/localStorage are enabled
- Check browser console for errors
- Try clearing browser cache

### Data not saving
- Check localStorage quota
- Disable browser extensions that might block storage
- Try in private/incognito mode

### UI Issues
- Clear browser cache
- Try different browser
- Check internet connection

## Contributing
To contribute to DOdo:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
MIT License - Feel free to use this project for personal and commercial use.

## Contact & Support
For support, email: support@dodo.app

## Roadmap
- ✅ MVP (Current)
- 🔄 Payment Integration (Q3 2026)
- 🔄 Mobile App (Q4 2026)
- 🔄 Expansion to other African countries (Q1 2027)
- 🔄 Enterprise features (Q2 2027)

## Disclaimer
DOdo is designed to provide a platform for legitimate delivery and service exchanges. Users agree to use the platform responsibly and in accordance with local laws and regulations.

---

**Made with ❤️ for Nigeria's gig economy**