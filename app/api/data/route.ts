import { NextResponse } from "next/server";

// Mock data structure for demonstration
interface AlertData {
  id: string;
  timestamp: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  signal: string;
  [key: string]: any; // Allow additional properties
}

interface ApiResponse {
  im_alerts: AlertData[];
  im_hf_alerts: AlertData[];
  im_magic_alerts: AlertData[];
  timestamp: string;
}

// Mock data generators - you can customize these based on your actual data structure
function generateMockIMAlerts(): AlertData[] {
  const symbols = [
    "RELIANCE",
    "TCS",
    "HDFC",
    "INFY",
    "ITC",
    "WIPRO",
    "BHARTI",
    "SBIN",
  ];
  const signals = ["FII-R1", "FII-R2", "FII-S1", "FII-S2"];

  return Array.from({ length: Math.floor(Math.random() * 10) + 5 }, (_, i) => ({
    id: `im_${Date.now()}_${i}`,
    timestamp: new Date().toISOString(),
    symbol: symbols[Math.floor(Math.random() * symbols.length)],
    price: Math.round((Math.random() * 3000 + 100) * 100) / 100,
    change: Math.round((Math.random() * 20 - 10) * 100) / 100,
    changePercent: Math.round((Math.random() * 10 - 5) * 100) / 100,
    volume: Math.floor(Math.random() * 1000000),
    signal: signals[Math.floor(Math.random() * signals.length)],
  }));
}

function generateMockIMHFAlerts(): AlertData[] {
  const symbols = ["NIFTY", "BANKNIFTY", "SENSEX", "FINNIFTY"];
  const signals = ["OCP/Matrix", "Up/Fall", "Point/Value"];

  return Array.from({ length: Math.floor(Math.random() * 8) + 3 }, (_, i) => ({
    id: `hf_${Date.now()}_${i}`,
    timestamp: new Date().toISOString(),
    symbol: symbols[Math.floor(Math.random() * symbols.length)],
    price: Math.round((Math.random() * 20000 + 15000) * 100) / 100,
    change: Math.round((Math.random() * 500 - 250) * 100) / 100,
    changePercent: Math.round((Math.random() * 5 - 2.5) * 100) / 100,
    volume: Math.floor(Math.random() * 5000000),
    signal: signals[Math.floor(Math.random() * signals.length)],
  }));
}

function generateMockIMMagicAlerts(): AlertData[] {
  const symbols = [
    "ADANIPORTS",
    "ASIANPAINT",
    "AXISBANK",
    "BAJAJ",
    "COALINDIA",
  ];
  const wpSignals = ["Watch", "Close", "Must"];
  const mpSignals = ["Watch", "Close", "Must"];

  return Array.from({ length: Math.floor(Math.random() * 12) + 8 }, (_, i) => ({
    id: `magic_${Date.now()}_${i}`,
    timestamp: new Date().toISOString(),
    symbol: symbols[Math.floor(Math.random() * symbols.length)],
    price: Math.round((Math.random() * 2500 + 500) * 100) / 100,
    change: Math.round((Math.random() * 30 - 15) * 100) / 100,
    changePercent: Math.round((Math.random() * 8 - 4) * 100) / 100,
    volume: Math.floor(Math.random() * 2000000),
    wpSignal: wpSignals[Math.floor(Math.random() * wpSignals.length)],
    mpSignal: mpSignals[Math.floor(Math.random() * mpSignals.length)],
    signal: `WP:${
      wpSignals[Math.floor(Math.random() * wpSignals.length)]
    }, MP:${mpSignals[Math.floor(Math.random() * mpSignals.length)]}`,
  }));
}

export async function GET() {
  try {
    // Simulate network delay (like real API)
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1000 + 500)
    );

    const response: ApiResponse = {
      im_alerts: generateMockIMAlerts(),
      im_hf_alerts: generateMockIMHFAlerts(),
      im_magic_alerts: generateMockIMMagicAlerts(),
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
