# 🐾 Pet Adoption System

A comprehensive, production-ready full-stack web application for managing pet adoptions. Built with modern technologies and following MVC architecture patterns.

## 📋 Overview

This system enables users to browse pets available for adoption, submit adoption applications, and allows administrators to manage the entire adoption process. The application features role-based access control, advanced search/filtering, and a beautiful modern UI.

## ✨ Features

### 👥 User Roles

#### **Visitor (Public)**
- Browse available pets
- Search pets by name or breed
- Filter pets by species, breed, age, gender, and size
- View detailed pet information
- Pagination on pet listings

#### **Registered User**
- All visitor features
- Register and login
- Submit adoption applications
- View application status
- Track application history
- Update profile information
- Cancel pending applications

#### **Administrator**
- All user features
- Add new pets to the system
- Edit pet information
- Delete pets
- Upload pet photos
- View all adoption applications
- Approve or reject applications
- Add notes to applications
- Automatic pet status management
- View system statistics

### 🚀 Technical Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Authorization**: Different permissions for users and admins
- **RESTful API**: Well-structured API endpoints
- **MVC Architecture**: Clean separation of concerns
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Centralized error management
- **Responsive Design**: Mobile-first, works on all devices
- **Image Support**: Photo uploads for pets
- **Search & Filter**: Advanced filtering capabilities
- **Pagination**: Efficient data loading
- **Real-time Updates**: Status updates and notifications

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **Validation**: express-validator
- **File Upload**: Multer (local storage)

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3 (Custom)
- **State Management**: Context API
- **Build Tool**: Create React App

## 📁 Project Structure

```
pet-ado-app/
├── backend/
│   ├── config/              # Configuration files
│   ├── controllers/         # Business logic
│   ├── models/              # Database models
│   ├── middleware/          # Custom middleware
│   ├── routes/              # API routes
│   ├── utils/               # Helper functions
│   ├── uploads/             # Local file storage
│   ├── .env                 # Environment variables
│   ├── server.js            # Entry point
│   └── package.json
├── frontend/
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # Context providers
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   ├── .env                 # Environment variables
│   └── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pet-adoption
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # Linux/Mac
   sudo systemctl start mongod
   
   # Or using mongod directly
   mongod
   ```

5. **Run the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm start
   ```

   App will open at `http://localhost:3000`

## 📖 Usage Guide

### For Regular Users

1. **Register an Account**
   - Go to Register page
   - Fill in name, email, password, phone, and address
   - Submit form

2. **Browse Pets**
   - Visit the pets page
   - Use search bar to find pets by name/breed
   - Apply filters (species, age, gender, size)
   - Click on any pet for details

3. **Apply for Adoption**
   - Login to your account
   - Go to pet details page
   - Click "Apply to Adopt"
   - Fill in application form
   - Submit application

4. **Track Applications**
   - Go to "My Applications" dashboard
   - View all your applications
   - Check status (Pending/Approved/Rejected)
   - Cancel pending applications if needed

### For Administrators

1. **Create Admin Account**
   First, register normally, then update role in database:
   ```javascript
   // MongoDB Shell
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

2. **Manage Pets**
   - Login with admin account
   - Go to Admin Dashboard
   - Click "Manage Pets" tab
   - Add new pets with details and photos
   - Edit or delete existing pets

3. **Review Applications**
   - Go to "Review Applications" tab
   - View applicant details
   - Read application information
   - Approve or reject applications
   - Add notes when rejecting

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/me` | Get current user |
| PUT | `/auth/profile` | Update profile |

### Pet Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/pets` | Get all pets | Public |
| GET | `/pets/:id` | Get pet by ID | Public |
| POST | `/pets` | Create pet | Admin |
| PUT | `/pets/:id` | Update pet | Admin |
| DELETE | `/pets/:id` | Delete pet | Admin |

### Application Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/applications` | Create application | User |
| GET | `/applications` | Get applications | Private |
| GET | `/applications/:id` | Get application | Private |
| PUT | `/applications/:id/status` | Update status | Admin |
| DELETE | `/applications/:id` | Delete application | Private |

Detailed API documentation is available in `backend/README.md`

## 🎨 Design Features

- **Modern Gradient UI**: Purple/blue gradient theme
- **Card-Based Layout**: Clean, organized content presentation
- **Responsive Grid**: Adapts to all screen sizes
- **Smooth Animations**: Hover effects and transitions
- **Mobile Navigation**: Hamburger menu on small screens
- **Status Badges**: Color-coded status indicators
- **Loading States**: User feedback during operations
- **Form Validation**: Client and server-side validation

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Secure HTTP headers
- XSS protection

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['user', 'admin'],
  phone: String,
  address: String,
  createdAt: Date
}
```

### Pet Model
```javascript
{
  name: String,
  species: Enum ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'],
  breed: String,
  age: Number,
  gender: Enum ['Male', 'Female'],
  size: Enum ['Small', 'Medium', 'Large'],
  color: String,
  description: String,
  medicalHistory: String,
  vaccinated: Boolean,
  neutered: Boolean,
  photos: [String],
  status: Enum ['Available', 'Pending', 'Adopted'],
  adoptionFee: Number,
  location: String,
  addedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Application Model
```javascript
{
  pet: ObjectId (ref: Pet),
  applicant: ObjectId (ref: User),
  status: Enum ['Pending', 'Approved', 'Rejected'],
  applicantInfo: {
    phone: String,
    address: String,
    housingType: Enum,
    hasYard: Boolean,
    hasPets: Boolean,
    petsDescription: String,
    experience: String,
    reason: String
  },
  notes: String,
  reviewedBy: ObjectId (ref: User),
  reviewedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚢 Deployment

### Backend Deployment (Example with Heroku)

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create pet-adoption-api

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongodb_atlas_uri

# Deploy
git push heroku main
```

### Frontend Deployment (Example with Netlify)

1. Build the app:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy build folder to Netlify:
   - Drag and drop `build` folder to Netlify
   - Or connect GitHub repository
   - Set environment variable: `REACT_APP_API_URL`

### Recommended Services

- **Backend**: Heroku, Railway, Render, AWS EC2
- **Frontend**: Netlify, Vercel, AWS S3 + CloudFront
- **Database**: MongoDB Atlas (free tier available)
- **Images**: Cloudinary (free tier available)

## 🧪 Testing

### Test with Sample Data

1. Create admin user
2. Add sample pets through admin dashboard
3. Register regular user
4. Submit test applications
5. Review and approve/reject as admin

### API Testing

Use tools like:
- Postman
- Insomnia
- Thunder Client
- cURL

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for pet adoption and animal welfare.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, email your-email@example.com or open an issue.

## 🎯 Future Enhancements

- Email notifications
- Real-time chat between users and admins
- Payment integration for adoption fees
- Pet medical records management
- Foster program support
- Donation system
- Social media integration
- Advanced analytics dashboard
- Mobile app (React Native)
- Multi-language support

---

**Note**: This is a production-ready application with all essential features implemented. Make sure to configure environment variables properly before deployment and use strong secrets in production.

# Pet-Adoption
