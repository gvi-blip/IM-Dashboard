import { NextResponse } from "next/server";

// Force dynamic responses and disable all caching at the route level
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

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
  // Mix of Nifty 50 stocks and other stocks
  const nifty50Stocks = [
    "RELIANCE",
    "TCS",
    "HDFCBANK",
    "INFY",
    "HINDUNILVR",
    "ITC",
    "SBIN",
    "BHARTIARTL",
    "KOTAKBANK",
    "LT",
    "ASIANPAINT",
    "MARUTI",
    "AXISBANK",
    "TITAN",
    "NESTLEIND",
    "ULTRACEMCO",
    "BAJFINANCE",
    "SUNPHARMA",
    "WIPRO",
    "ONGC",
    "NTPC",
    "TECHM",
    "POWERGRID",
    "COALINDIA",
    "TATAMOTORS",
    "BAJAJFINSV",
    "HCLTECH",
    "INDUSINDBK",
    "ICICIBANK",
    "ADANIENT",
    "JSWSTEEL",
    "BRITANNIA",
    "CIPLA",
    "DIVISLAB",
    "DRREDDY",
  ];

  const otherStocks = [
    "ADANIPORTS",
    "APOLLOHOSP",
    "BAJAJ-AUTO",
    "EICHERMOT",
    "GRASIM",
    "HEROMOTOCO",
    "HINDALCO",
    "M&M",
    "SHREECEM",
    "TATACONSUM",
    "TATASTEEL",
    "UPL",
    "VEDL",
    "ZEEL",
    "GODREJCP",
    "PIDILITIND",
    "MCDOWELL-N",
    "PAGEIND",
    "COLPAL",
    "DABUR",
  ];

  const indexes = [
    "NIFTY 50",
    "BANK NIFTY",
    "NIFTY IT",
    "NIFTY PHARMA",
    "NIFTY AUTO",
    "NIFTY METAL",
    "NIFTY FMCG",
    "NIFTY ENERGY",
    "NIFTY REALTY",
    "NIFTY PSU BANK",
  ];

  const allSymbols = [...nifty50Stocks, ...otherStocks, ...indexes];
  const signals = ["FII-R1", "FII-R2", "FII-S1", "FII-S2"];

  const alertDetails = [
    "FII - R1 hit",
    "FII - R2 hit",
    "FII - S1 hit",
    "FII - S2 hit",
    "FII - Closed above FII - R1",
    "FII - Closed below FII - R1",
    "FII - Closed above FII - R2",
    "FII - Closed below FII - R2",
    "FII - Closed above FII - S1",
    "FII - Closed below FII - S1",
    "FII - Closed above FII - S2",
    "FII - Closed below FII - S2",
  ];

  // Generate random time between 9:00 AM and 3:30 PM
  function generateRandomTime(): string {
    const startHour = 9;
    const endHour = 15;
    const endMinute = 30;

    let hour =
      Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
    let minute = Math.floor(Math.random() * 60);

    // If it's 3 PM (15), limit minutes to 30
    if (hour === 15 && minute > 30) {
      minute = Math.floor(Math.random() * 31);
    }

    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  }

  return Array.from({ length: Math.floor(Math.random() * 15) + 30 }, (_, i) => {
    const symbol = allSymbols[Math.floor(Math.random() * allSymbols.length)];

    // Determine the Index & Oth category
    let indexOthCategory: string;
    if (indexes.includes(symbol)) {
      indexOthCategory = "Index";
    } else if (nifty50Stocks.includes(symbol)) {
      indexOthCategory = "Nifty 50";
    } else {
      indexOthCategory = "Other";
    }

    const signal = signals[Math.floor(Math.random() * signals.length)];

    // For indexes, use higher price ranges
    const isIndex = indexes.includes(symbol);
    const ltp = isIndex
      ? Math.round((Math.random() * 15000 + 15000) * 100) / 100 // 15,000 - 30,000 for indexes
      : Math.round((Math.random() * 4000 + 100) * 100) / 100; // 100 - 4,100 for stocks

    const baseline =
      Math.round((ltp + (Math.random() * 200 - 100)) * 100) / 100;

    return {
      id: `im_${Date.now()}_${i}`,
      timestamp: new Date().toISOString(),
      symbol: symbol,
      indexOth: indexOthCategory,
      time: generateRandomTime(),
      type: signal,
      alertDetail:
        alertDetails[Math.floor(Math.random() * alertDetails.length)],
      ltp: ltp,
      baseline: Math.max(baseline, 50), // Ensure baseline is reasonable
      price: ltp, // Keep for compatibility
      change: Math.round((Math.random() * 20 - 10) * 100) / 100,
      changePercent: Math.round((Math.random() * 10 - 5) * 100) / 100,
      volume: Math.floor(Math.random() * 1000000),
      signal: signal,
    };
  });
}

function generateMockIMHFAlerts(): AlertData[] {
  // Reuse the same symbol pool from IM Alerts
  const nifty50Stocks = [
    "RELIANCE",
    "TCS",
    "HDFCBANK",
    "INFY",
    "HINDUNILVR",
    "ITC",
    "SBIN",
    "BHARTIARTL",
    "KOTAKBANK",
    "LT",
    "ASIANPAINT",
    "MARUTI",
    "AXISBANK",
    "TITAN",
    "NESTLEIND",
    "ULTRACEMCO",
    "BAJFINANCE",
    "SUNPHARMA",
    "WIPRO",
    "ONGC",
    "NTPC",
    "TECHM",
    "POWERGRID",
    "COALINDIA",
    "TATAMOTORS",
    "BAJAJFINSV",
    "HCLTECH",
    "INDUSINDBK",
    "ICICIBANK",
    "ADANIENT",
    "JSWSTEEL",
    "BRITANNIA",
    "CIPLA",
    "DIVISLAB",
    "DRREDDY",
  ];

  const otherStocks = [
    "ADANIPORTS",
    "APOLLOHOSP",
    "BAJAJ-AUTO",
    "EICHERMOT",
    "GRASIM",
    "HEROMOTOCO",
    "HINDALCO",
    "M&M",
    "SHREECEM",
    "TATACONSUM",
    "TATASTEEL",
    "UPL",
    "VEDL",
    "ZEEL",
    "GODREJCP",
    "PIDILITIND",
    "MCDOWELL-N",
    "PAGEIND",
    "COLPAL",
    "DABUR",
  ];

  const indexes = [
    "NIFTY 50",
    "BANK NIFTY",
    "NIFTY IT",
    "NIFTY PHARMA",
    "NIFTY AUTO",
    "NIFTY METAL",
    "NIFTY FMCG",
    "NIFTY ENERGY",
    "NIFTY REALTY",
    "NIFTY PSU BANK",
  ];

  const allSymbols = [...nifty50Stocks, ...otherStocks, ...indexes];

  const types = [
    "M Value-Hit",
    "Matrix - Final Hit",
    "Max Point 1 - Hit",
    "Max Up",
    "Mid-OCP",
  ];

  // Map types to alert details
  const getAlertDetail = (type: string): string => {
    switch (type) {
      case "M Value-Hit":
        return "M Value-Hit";
      case "Matrix - Final Hit":
        return "Matrix - Final Hit";
      case "Max Point 1 - Hit":
        return "Max Point 1 - Hit";
      case "Max Up":
        return "Max Up - Hit";
      case "Mid-OCP":
        return "OCP - hit";
      default:
        return type;
    }
  };

  // Generate random time between 9:00 AM and 3:30 PM (same as IM Alerts)
  function generateRandomTime(): string {
    const startHour = 9;
    const endHour = 15;
    const endMinute = 30;

    let hour =
      Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
    let minute = Math.floor(Math.random() * 60);

    // If it's 3 PM (15), limit minutes to 30
    if (hour === 15 && minute > 30) {
      minute = Math.floor(Math.random() * 31);
    }

    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  }

  return Array.from({ length: Math.floor(Math.random() * 15) + 25 }, (_, i) => {
    const symbol = allSymbols[Math.floor(Math.random() * allSymbols.length)];

    // Determine the Index & Oth category
    let indexOthCategory: string;
    if (indexes.includes(symbol)) {
      indexOthCategory = "Index";
    } else if (nifty50Stocks.includes(symbol)) {
      indexOthCategory = "Nifty 50";
    } else {
      indexOthCategory = "Other";
    }

    const type = types[Math.floor(Math.random() * types.length)];
    const alertDetail = getAlertDetail(type);

    // For indexes, use higher price ranges
    const isIndex = indexes.includes(symbol);
    const ltp = isIndex
      ? Math.round((Math.random() * 15000 + 15000) * 100) / 100 // 15,000 - 30,000 for indexes
      : Math.round((Math.random() * 4000 + 100) * 100) / 100; // 100 - 4,100 for stocks

    const baseline =
      Math.round((ltp + (Math.random() * 200 - 100)) * 100) / 100;

    return {
      id: `hf_${Date.now()}_${i}`,
      timestamp: new Date().toISOString(),
      symbol: symbol,
      indexOth: indexOthCategory,
      time: generateRandomTime(),
      type: type,
      alertDetail: alertDetail,
      ltp: ltp,
      baseline: Math.max(baseline, 50), // Ensure baseline is reasonable
      price: ltp, // Keep for compatibility
      change: Math.round((Math.random() * 20 - 10) * 100) / 100,
      changePercent: Math.round((Math.random() * 10 - 5) * 100) / 100,
      volume: Math.floor(Math.random() * 1000000),
      signal: type, // Keep for compatibility
    };
  });
}

function generateMockIMMagicAlerts(): AlertData[] {
  // Reuse the same symbol pool from IM Alerts
  const nifty50Stocks = [
    "RELIANCE",
    "TCS",
    "HDFCBANK",
    "INFY",
    "HINDUNILVR",
    "ITC",
    "SBIN",
    "BHARTIARTL",
    "KOTAKBANK",
    "LT",
    "ASIANPAINT",
    "MARUTI",
    "AXISBANK",
    "TITAN",
    "NESTLEIND",
    "ULTRACEMCO",
    "BAJFINANCE",
    "SUNPHARMA",
    "WIPRO",
    "ONGC",
    "NTPC",
    "TECHM",
    "POWERGRID",
    "COALINDIA",
    "TATAMOTORS",
    "BAJAJFINSV",
    "HCLTECH",
    "INDUSINDBK",
    "ICICIBANK",
    "ADANIENT",
    "JSWSTEEL",
    "BRITANNIA",
    "CIPLA",
    "DIVISLAB",
    "DRREDDY",
  ];

  const otherStocks = [
    "ADANIPORTS",
    "APOLLOHOSP",
    "BAJAJ-AUTO",
    "EICHERMOT",
    "GRASIM",
    "HEROMOTOCO",
    "HINDALCO",
    "M&M",
    "SHREECEM",
    "TATACONSUM",
    "TATASTEEL",
    "UPL",
    "VEDL",
    "ZEEL",
    "GODREJCP",
    "PIDILITIND",
    "MCDOWELL-N",
    "PAGEIND",
    "COLPAL",
    "DABUR",
  ];

  const indexes = [
    "NIFTY 50",
    "BANK NIFTY",
    "NIFTY IT",
    "NIFTY PHARMA",
    "NIFTY AUTO",
    "NIFTY METAL",
    "NIFTY FMCG",
    "NIFTY ENERGY",
    "NIFTY REALTY",
    "NIFTY PSU BANK",
  ];

  const allSymbols = [...nifty50Stocks, ...otherStocks, ...indexes];

  const wpMpValues = ["Coming", "Watch", "Must", "Close"];

  return Array.from({ length: Math.floor(Math.random() * 20) + 30 }, (_, i) => {
    const symbol = allSymbols[Math.floor(Math.random() * allSymbols.length)];

    // Determine the Index & Oth category
    let indexOthCategory: string;
    if (indexes.includes(symbol)) {
      indexOthCategory = "Index";
    } else if (nifty50Stocks.includes(symbol)) {
      indexOthCategory = "Nifty 50";
    } else {
      indexOthCategory = "Other";
    }

    const wpValue = wpMpValues[Math.floor(Math.random() * wpMpValues.length)];
    const mpValue = wpMpValues[Math.floor(Math.random() * wpMpValues.length)];

    // For indexes, use higher price ranges
    const isIndex = indexes.includes(symbol);
    const ltp = isIndex
      ? Math.round((Math.random() * 15000 + 15000) * 100) / 100 // 15,000 - 30,000 for indexes
      : Math.round((Math.random() * 4000 + 100) * 100) / 100; // 100 - 4,100 for stocks

    return {
      id: `magic_${Date.now()}_${i}`,
      timestamp: new Date().toISOString(),
      symbol: symbol,
      indexOth: indexOthCategory,
      wp: wpValue,
      mp: mpValue,
      // Keep these for compatibility with existing table structure
      price: ltp,
      ltp: ltp,
      change: Math.round((Math.random() * 30 - 15) * 100) / 100,
      changePercent: Math.round((Math.random() * 8 - 4) * 100) / 100,
      volume: Math.floor(Math.random() * 2000000),
      wpSignal: wpValue,
      mpSignal: mpValue,
      signal: `WP:${wpValue}, MP:${mpValue}`,
    };
  });
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

    const res = NextResponse.json(response, {
      headers: {
        // Ensure no caching by browsers, proxies, or CDNs
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
        // Ensure Vercel/CDN layers do not cache
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    });
    // Avoid conditional requests yielding 304 by removing any ETag
    res.headers.delete("ETag");
    return res;
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
