# 🌍 GlobeHub

**GlobeHub** is a premium, interactive global dashboard built with Next.js. It features a stunning 3D WebGL globe and aggregates real-time data across four major domains: Weather, News, Financial Markets, and Flight Tracking—all presented in a sleek, unified glassmorphism UI.

![GlobeHub Hero](/public/hero_bg.png)

## ✨ Key Features

- **Interactive 3D Globe**: A highly optimized, rotatable WebGL Earth. Click on any coordinate to instantly fetch hyper-local weather and regional news using reverse-geocoding.
- **Global Weather**: Real-time atmospheric data, Air Quality Indices (AQI), and 5-day forecasts powered by OpenWeatherMap.
- **Breaking News**: A dedicated global news hub with category filtering and keyword search, sourcing the latest headlines worldwide.
- **Financial Markets**: Live tracking of top cryptocurrencies (via CoinGecko) with historical trend charts, alongside top stock market gainers (via AlphaVantage).
- **Live Flight Tracker**: A real-time aviation dashboard. Enter any flight number or IATA airport code to track active commercial flights, delays, and terminal gates.
- **Premium UI/UX**: Cinematic splash screens, frosted-glass components, smart scrolling controls, and a fully responsive design tailored for both desktop and mobile.

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Frontend**: [React 18](https://react.dev/)
- **3D Rendering**: [Three.js](https://threejs.org/) & [react-globe.gl](https://globe.gl/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Styling**: Vanilla CSS Modules (CSS3 Variables, Glassmorphism, Animations)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/chamuwa1/GlobeHub.git
cd GlobeHub
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env.local` file in the root directory of the project and add your API keys:

```env
OPENWEATHER_API_KEY=your_openweathermap_api_key
NEWSDATA_API_KEY=your_newsdata_api_key
ALPHAVANTAGE_API_KEY=your_alphavantage_api_key
AVIATIONSTACK_API_KEY=your_aviationstack_api_key
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🔐 Security Note
All third-party API requests are securely proxied through Next.js backend API routes (`app/api/*`). Your private API keys are never exposed to the client-side browser, preventing unauthorized access.

## 📜 License
This project is open-source and available under the MIT License.
