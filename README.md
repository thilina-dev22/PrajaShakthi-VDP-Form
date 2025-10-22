# PrajaShakthi VDP Form 🇱🇰

A comprehensive web application for managing Village Development Plan (VDP) submissions and Community Development Council (CDC) information in Sri Lanka. This system provides bilingual support (Sinhala/English) with advanced features for data collection, management, and reporting.

## 🌟 Features

### User Features
- **Bilingual Interface**: Full support for Sinhala and English languages
- **Location-Based Forms**: Three-tier location selector (District → DS Division → GN Division)
- **Community Council Form**: Manage CDC member information with three categories:
  - Committee Members (කාරක සභා සාමාජිකයින්) - 5 members
  - Community Representatives (ප්‍රජා නියෝජිත කණ්ඩායම) - 15 members
  - Strategic Members (උපාය මාර්ගික සාමාජික කණ්ඩායම) - 5 members
- **Development Planning Form**: Sector-based development proposals with multi-level categorization
- **Dynamic Data Entry**: Tables with fixed rows, dynamic rows, and hybrid configurations

### Admin Features
- **Secure Authentication**: JWT-based authentication with HTTP-only cookies
- **Advanced Filtering**: Filter submissions by District, DS Division, and GN Division
- **Dual View Tabs**: 
  - Council Info Data (ප්‍රජා සභා තොරතුරු)
  - Main Form Data (සංවර්ධන සැලැස්ම)
- **Export Capabilities**:
  - **Excel Export**: Full data export with structured worksheets
  - **PDF Export**: Individual submission PDFs with Unicode font support (Sinhala/Tamil)
- **Data Management**: View, filter, and delete submissions
- **Unicode Support**: Proper rendering of Sinhala and Tamil text in PDFs using canvas-based rendering

## 🏗️ Tech Stack

### Frontend
- **React 19.1.1**: Modern UI with hooks and context
- **Vite 7.1.2**: Lightning-fast build tool and dev server
- **Tailwind CSS 4.1.14**: Utility-first CSS framework with modern oklch colors
- **React Router**: Client-side routing
- **Export Libraries**:
  - `xlsx 0.18.5`: Excel/CSV generation
  - `jspdf 3.0.3` + `jspdf-autotable 5.0.2`: PDF generation with table support

### Backend
- **Node.js**: Runtime environment (requires >=22.0.0)
- **Express 5.1.0**: Web application framework
- **MongoDB 8.18.3**: NoSQL database with Mongoose ODM
- **Authentication**: JWT with bcryptjs password hashing
- **CORS**: Cross-origin resource sharing with secure cookie handling

### Development Tools
- **ESLint**: Code quality and consistency
- **Nodemon**: Auto-restart during development
- **Cookie Parser**: Secure cookie management

## 📦 Project Structure

```
PrajaShakthi-VDP-Form/
├── PrajaShakthi-VDP-Form-backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   └── submissionController.js  # Submission CRUD operations
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   └── loggingMiddleware.js     # Request logging
│   ├── models/
│   │   ├── UserModel.js             # User schema
│   │   └── SubmissionModel.js       # Submission schema
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   └── submissionRoutes.js      # Submission endpoints
│   ├── .env.example                 # Environment variables template
│   ├── server.js                    # Express app entry point
│   ├── vercel.json                  # Vercel deployment config
│   └── package.json
│
└── PrajaShakthi-VDP-Form-frontend/
    ├── public/                      # Static assets
    ├── src/
    │   ├── api/
    │   │   └── auth.js              # API service layer
    │   ├── components/
    │   │   ├── AppRoutes.jsx        # Route configuration
    │   │   ├── CommunityCouncilForm.jsx
    │   │   ├── CommunityCouncilTable.jsx
    │   │   ├── DevelopmentForm.jsx
    │   │   ├── DevelopmentFormLocation.jsx
    │   │   ├── DynamicContent.jsx
    │   │   ├── LocationSelectorBase.jsx
    │   │   ├── Login.jsx
    │   │   ├── Navigation.jsx
    │   │   ├── Proposals.jsx
    │   │   ├── SectorSelector.jsx
    │   │   └── SubmissionList.jsx   # Admin dashboard
    │   ├── context/
    │   │   └── AuthContext.jsx      # Authentication state
    │   ├── data/
    │   │   ├── provincial_data.json # Sri Lankan administrative data
    │   │   └── sectors_data.js      # Development sectors
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    ├── vercel.json
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 22.0.0
- MongoDB (local or Atlas)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd PrajaShakthi-VDP-Form-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/prajashakthi?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start development server**
   ```bash
   npm start
   ```
   
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd PrajaShakthi-VDP-Form-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update API endpoint (if needed)**
   
   Edit `src/api/auth.js` and set:
   ```javascript
   const API_BASE_URL = "http://localhost:5000";
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Application runs on `http://localhost:5173`

### Create Admin User

Use MongoDB Compass or mongo shell to create an admin user:

```javascript
// Connect to your database and insert:
db.users.insertOne({
  username: "admin",
  password: "$2a$10$your-bcrypt-hashed-password",
  role: "admin",
  createdAt: new Date()
})
```

Or use bcrypt to hash a password:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('yourpassword', 10));"
```

## 🌐 Deployment

### Vercel Deployment

Both frontend and backend can be deployed to Vercel. See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for detailed instructions.

**Quick Summary:**

1. **Backend Deployment**
   - Deploy `PrajaShakthi-VDP-Form-backend` folder
   - Set environment variables in Vercel dashboard
   - Note the backend URL (e.g., `https://your-backend.vercel.app`)

2. **Frontend Deployment**
   - Update `API_BASE_URL` in `src/api/auth.js` to backend URL
   - Deploy `PrajaShakthi-VDP-Form-frontend` folder
   - Set `CORS_ORIGIN` in backend to frontend URL

3. **Environment Variables** (Backend)
   ```
   MONGO_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<secure-random-string>
   NODE_ENV=production
   CORS_ORIGIN=<your-frontend-vercel-url>
   ```

## 📊 Data Export Features

### Excel Export
- Exports all filtered submissions to `.xlsx` format
- Includes complete data structure:
  - Council Info: All member details with sections
  - Main Form: Proposals with costs and agencies
- Timestamp-based filenames

### PDF Export
- Individual PDF per submission (Council Info only)
- **Unicode Support**: Properly renders Sinhala (සිංහල) and Tamil (தமிழ்) text
- Three-section tables:
  1. Committee Members (1-5) with positions
  2. Community Representatives (6-20)
  3. Strategic Members (21-25)
- Professional formatting with borders and alternating row colors
- Canvas-based rendering for Unicode characters to ensure clarity

### Technical Implementation
- **Unicode Detection**: Regex pattern `/[\u0D80-\u0DFF\u0B80-\u0BFF]/` detects Sinhala/Tamil
- **Canvas Rendering**: 24px font size rendered to canvas, scaled to 0.12x in PDF
- **Table Generation**: Uses `jspdf-autotable` for clean, structured layouts
- **Column Width Optimization**: 10mm for row numbers to support two-digit values

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Password Hashing**: bcryptjs with salt rounds
- **CORS Protection**: Restricted origins
- **Environment Variables**: Sensitive data isolated
- **Middleware Protection**: Routes protected with auth middleware

## 🌍 Localization

The application supports bilingual content:
- **Sinhala**: Primary language for forms and labels
- **English**: Secondary language for technical terms
- **Unicode Rendering**: Full support in PDFs and exports

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token

### Submissions
- `POST /api/submissions` - Create new submission
- `GET /api/submissions` - Get all submissions (admin, with filters)
- `DELETE /api/submissions/:id` - Delete submission (admin)

### Query Parameters
- `district`: Filter by district
- `divisionalSec`: Filter by DS division
- `gnDivision`: Filter by GN division
- `formType`: Filter by form type (`council_info` or `main_form`)

## 🐛 Known Issues & Solutions

### PDF Export Issues (Resolved)
- ✅ **oklch Color Parsing**: Switched from html2canvas to jspdf-autotable
- ✅ **Unicode Rendering**: Implemented canvas-based image embedding
- ✅ **Row Number Wrapping**: Increased column width from 8mm to 10mm

### Browser Compatibility
- Tested on Chrome, Firefox, Edge
- Requires modern browser with ES6+ support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software developed for PrajaShakthi initiative.

## 👥 Authors

- Development Team - Initial work and maintenance

## 🙏 Acknowledgments

- Provincial administrative data based on Sri Lankan government divisions
- Development sectors aligned with national development priorities
- Community development framework based on grassroots governance models

## 📞 Support

For issues, questions, or contributions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for Sri Lankan communities**
