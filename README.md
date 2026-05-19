# PatnaAQI Frontend Application

This is the main frontend application for the **PatnaAQI** project, a hyper-local environmental intelligence platform for Patna, Bihar.

## 🏛️ Architecture
This application is built with:
- **React 19**
- **Vite**
- **TypeScript**
- **Tailwind CSS v4**
- **React Router DOM**
- **Lucide React** (Icons)

The application follows a **Static-Sync Architecture**, meaning it is designed to fetch static JSON files generated periodically by a backend job, ensuring blazing-fast performance and extremely low operating costs.

## 🚀 Getting Started

To run the development server locally:

1. Ensure you have Node.js installed.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the provided local URL (typically `http://localhost:5173`) in your browser.

## 🎨 Design System
This project strictly adheres to the PatnaAQI design guidelines:
- **Mobile-first** layout with bottom navigation.
- **Inter** font family.
- Custom light and dark mode implementation.
- Specific AQI severity color schemes.

*For more detailed project rules, constraints, and the full roadmap, please refer to the `Master README.md` in the root workspace folder.*
