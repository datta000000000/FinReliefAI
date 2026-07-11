# FinRelief AI React Frontend

**AI-Powered Debt Relief & Financial Recovery Platform**

This is the complete frontend for **FinRelief AI**, built using React.js, Vite, and Tailwind CSS. It communicates seamlessly with the FastAPI backend through a configured dev proxy to execute user registration, loan tracking, profile updates, risk score views, priority sorting, and AI strategies/letters generation.

---

## Technical Stack

- **Framework**: React.js (functional components & custom hooks)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (with Protected route boundary checks)
- **API Request Client**: Axios (with custom JWT authorization request interceptors and auto-logout on 401 response interceptors)
- **Charts**: Chart.js & `react-chartjs-2`
- **Icons**: `lucide-react`

---

## Folder Structure

```text
frontend/
│
├── src/
│   ├── components/       # Reusable components (ProtectedRoute, Layout, UI elements, Modals)
│   ├── hooks/            # Custom React hooks (Toast notifications provider context)
│   ├── pages/            # View pages (Login, Register, Dashboard, Loans, Profile, Health, Settlement, Negotiation, Letter, AIHistory)
│   ├── services/         # Axios API connection layers (auth, loans, profiles, health, settlement, ai)
│   ├── App.jsx           # Routes and provider setups
│   ├── main.jsx          # Mounting script
│   └── index.css         # Tailwind compiler definitions and animations
│
├── index.html            # Entry layout and Google font loader
├── tailwind.config.js    # Tailwind theme coordinates
├── postcss.config.js     # PostCSS configurations
├── vite.config.js        # Vite build configurations and server proxy
└── package.json          # Dependencies manifest
```

---

## Setup & Running Locally

Follow these steps to initialize and launch the frontend:

### 1. Prerequisites
- Node.js (v18 or higher) installed on your system.
- The FastAPI backend must be running locally on `http://127.0.0.1:8000` (refer to the backend's README for backend setup instructions).

### 2. Install Node Packages
Navigate to the `frontend/` directory and install dependencies:
```bash
cd frontend
npm install
```

### 3. Run Dev Server
Launch the Vite development server:
```bash
npm run dev
```
Vite will start the server, typically at:
- **Local URL**: [http://localhost:5173](http://localhost:5173)

---

## Key Core Components

1. **Vite API Server Proxy**: The development proxy in `vite.config.js` forwards all `/auth` and `/api` requests automatically to `http://localhost:8000`. This avoids CORS blocking policies during local testing.
2. **Global Toast System (`hooks/useToast.jsx`)**: A lightweight, custom React notification context enabling easy alerts (`showToast("Success!", "success")` or `"error"`).
3. **Markdown Parser (`pages/Negotiation.jsx`)**: A lightweight, native React Markdown renderer that parses headings (`#`, `##`), bold markings (`**`), and bullet listings (`-`) returned by Gemini or the Fallback engine, styled with responsive Tailwind CSS.
4. **Dynamic Data Charts (`pages/Dashboard.jsx`)**: Displays loan balances and cash buffers using react-chartjs-2 and Chart.js, rendering custom responsive charts that adapt to dark themes.
