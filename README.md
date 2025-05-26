# TimeOff - Employment Leave Management System

A comprehensive leave management solution for organizations to streamline leave requests, approvals, and tracking.

## Features

- **User Authentication**: Secure login, registration, and role-based access control
- **Employee Dashboard**: Apply for leave, track request status, and view leave balances
- **Admin Dashboard**: Review and manage leave requests, employee management, and reporting
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Notification System**: Email notifications for leave status updates
- **Multiple Leave Types**: Support for various leave categories (Annual, Sick, Personal, etc.)
- **Profile Management**: User profile customization and settings

## Technology Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Chart.js for data visualization
- React Hook Form for form handling
- Jotai for state management
- Lucide React for icons

### Backend (Recommendations)
- Node.js with Express
- MongoDB or PostgreSQL for database
- JWT for authentication
- RESTful API design

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/leave-management-system.git
cd leave-management-system
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to http://localhost:5173

## Project Structure

```
leave-management-system/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React contexts for state management
│   ├── data/             # Mock data for development
│   ├── layouts/          # Page layout components
│   ├── pages/            # Page components
│   ├── services/         # API service functions
│   ├── App.tsx           # Main App component
│   └── main.tsx          # Application entry point
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

## Demo Accounts

The application includes demo accounts for testing:

- **Admin**
  - Email: admin@example.com
  - Password: password

- **Employee**
  - Email: employee@example.com
  - Password: password

## Deployment

### Frontend
- The React frontend can be deployed to Netlify, Vercel, or GitHub Pages

### Backend
- For Node.js/Express backend, consider Render, Railway, or Heroku
- For database, consider MongoDB Atlas (MongoDB) or Supabase (PostgreSQL)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Lucide Icons](https://lucide.dev/)