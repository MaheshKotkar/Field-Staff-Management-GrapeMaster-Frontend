# Field Staff Management Frontend

A premium, high-performance React application built with Vite and Material UI. This dashboard provides a seamless experience for field staff to log visits and for administrators to manage regional operations.

## 🌟 Key Features

- **Dynamic Dashboard**: Personalized overview for both staff and administrators.
- **Farmer Directory**: Comprehensive management of farmer database with search and history.
- **Visit Logger**: Multi-step "New Visit" wizard with image upload support.
- **Verification Center**: Dedicated admin UI for reviewing and verifying field evidence.
- **EOD Reporting**: Simplified End-of-Day submission flow for field consultants.
- **Premium UI**: Smooth animations via Framer Motion and consistent theme branding.
- **Mobile Optimized**: Intelligent responsive design featuring mobile-specific navigation.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) 19 (Vite)
- **UI Architecture**: [Material UI (MUI)](https://mui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data Visualization**: [Chart.js](https://www.chartjs.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)

## 🔧 Installation & Usage

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Ensure the backend is running at `http://localhost:5000` (default target for API services).

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## 📂 Internal Structure

- **src/pages/**: Main views (Dashboard, Farmers, Admin, Contact Us, About Us).
- **src/components/layout/**: Navigation, Sidebar, and Mobile Bottom Nav.
- **src/components/farmers/**: Modular farmer-specific UI components.
- **src/components/animations/**: Reusable Framer Motion animation wrappers.
- **src/context/**: Global state management for Authentication.
- **src/services/**: API integration using Axios interceptors.
- **src/theme/**: Custom MUI theme configuration (Premium Green theme).

## 📱 Mobile Experience
The application automatically switches to a Card-based layout and bottom navigation on mobile devices to ensure readability and ease of use in the field.

## 📄 License
ISC License
