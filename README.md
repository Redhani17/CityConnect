# CityConnect - Smart Citizen Super App

A full-stack MERN web application that acts as a unified digital platform connecting citizens, civic authorities, and city services with transparency and real-time updates.

## 🚀 Features

### Core Modules

1. **Authentication System**
   - User registration and login
   - JWT-based authentication
   - Role-based access control (Citizen, Admin, Department)

2. **Civic Complaint Management**
   - Citizens can submit complaints with images
   - Track complaint status (Pending → In Progress → Resolved)
   - Admin can assign departments and update status

3. **Bill Payments (Mock)**
   - View electricity, water, and property tax bills
   - Simulate payment transactions
   - Payment history tracking

4. **Emergency Services**
   - SOS button for emergency requests
   - Emergency contact list
   - Location sharing (conceptual)

5. **AI-Powered Chatbot**
   - Rule-based FAQ system
   - Quick suggestions
   - Interactive chat interface

6. **City Announcements & Events**
   - Admin can create announcements
   - Citizens can view and filter events
   - Categories: Event, Notice, Alert, General

7. **Local Jobs & Opportunities**
   - Admin posts job opportunities
   - Citizens can view and apply/contact
   - Filter by department and location

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB Atlas** with **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads

### Frontend
- **React.js** with **Vite**
- **React Router** for routing
- **Bootstrap 5** + **React Bootstrap** for UI
- **Axios** for API calls

## 📁 Project Structure

```
cityconnect/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 👥 User Roles

### Citizen
- Submit and track complaints
- View and pay bills
- Access emergency services
- Chat with AI assistant
- View announcements and jobs

### Admin
- Manage all complaints
- Create and manage announcements
- Post and manage job opportunities
- Update complaint statuses
- Assign departments

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Complaints
- `POST /api/complaints` - Submit complaint (Citizen)
- `GET /api/complaints/my-complaints` - Get user's complaints
- `GET /api/complaints/all` - Get all complaints (Admin)
- `PUT /api/complaints/:id/status` - Update complaint status (Admin)

### Bills
- `GET /api/bills/my-bills` - Get user's bills
- `POST /api/bills/:id/pay` - Pay bill (Mock)
- `GET /api/bills/payment-history` - Get payment history

### Emergency
- `POST /api/emergency/sos` - Send SOS request
- `GET /api/emergency/contacts` - Get emergency contacts

### Chatbot
- `POST /api/chatbot/chat` - Send message to chatbot
- `GET /api/chatbot/suggestions` - Get FAQ suggestions

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create announcement (Admin)
- `PUT /api/announcements/:id` - Update announcement (Admin)
- `DELETE /api/announcements/:id` - Delete announcement (Admin)

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job (Admin)
- `PUT /api/jobs/:id` - Update job (Admin)
- `DELETE /api/jobs/:id` - Delete job (Admin)

## 🎨 Features Highlights

- **Responsive Design**: Bootstrap-based UI that works on all devices
- **Role-Based Dashboards**: Different views for Citizens and Admins
- **Real-time Updates**: Status tracking for complaints
- **File Uploads**: Image support for complaints
- **Mock Payments**: Simulated payment system for bills
- **Interactive Chatbot**: Rule-based AI assistant
- **Secure Authentication**: JWT tokens with password hashing

## 📝 Notes

- This is a hackathon-ready application with mock payment functionality
- No real payment gateway is integrated
- MongoDB Atlas connection string is required for database
- All images are stored locally in `backend/uploads/` directory
- JWT tokens expire after 7 days

## 🤝 Contributing

This is a hackathon project. Feel free to extend and improve!

## 📄 License

This project is open source and available for hackathon use.

---

**Built with ❤️ for Smart City Hackathons**
