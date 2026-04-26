import { NextRequest, NextResponse } from "next/server";

// Fashion retailers and brands to look for
const FASHION_KEYWORDS = [
  "zara", "h&m", "asos", "nordstrom", "macy's", "uniqlo", "gap", "banana republic",
  "j.crew", "anthropologie", "free people", "urban outfitters", "forever 21",
  "topshop", "mango", "cos", "& other stories", "arket", "massimo dutti",
  "pull&bear", "bershka", "stradivarius", "primark", "shein", "fashion nova",
  "revolve", "net-a-porter", "farfetch", "ssense", "mytheresa", "matches fashion",
  "saks", "neiman marcus", "bloomingdale's", "lululemon", "nike", "adidas",
  "everlane", "reformation", "realisation par", "rouje", "sezane", "mejuri",
  "order confirmation", "your order", "shipping confirmation", "order shipped",
  "thank you for your purchase", "receipt", "invoice"
];

interface EmailMessage {
  id: string;
  snippet: string;
  payload?: {
    headers?: Array<{ name: string; value: string }>;
    body?: { data?: string };
    parts?: Array<{ body?: { data?: string } }>;
  };
}

interface AnalysisResult {
  brands: string[];
  styles: string[];
  priceRange: string;
  gaps: string[];
  recentPurchases: string[];
  orderCount: number;
}

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token required" },
        { status: 401 }
      );
    }

    // Search for fashion-related emails
    const searchQuery = FASHION_KEYWORDS.slice(0, 15).join(" OR ");
    const searchUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(searchQuery)}&maxResults=50`;

    const searchResponse = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!searchResponse.ok) {
      const error = await searchResponse.json();
      return NextResponse.json(
        { error: error.error?.message || "Failed to search emails" },
        { status: searchResponse.status }
      );
    }

    const searchData = await searchResponse.json();
    const messages = searchData.messages || [];

    if (messages.length === 0) {
      return NextResponse.json({
        analysis: {
          brands: [],
          styles: ["No fashion emails found"],
          priceRange: "Unknown",
          gaps: ["We couldn't find any fashion-related emails. Try the manual paste option."],
          recentPurchases: [],
          orderCount: 0,
        },
      });
    }

    // Fetch email details (limit to 20 for performance)
    const emailPromises = messages.slice(0, 20).map(async (msg: { id: string }) => {
      const emailResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return emailResponse.ok ? emailResponse.json() : null;
    });

    const emails: (EmailMessage | null)[] = await Promise.all(emailPromises);
    const validEmails = emails.filter((e): e is EmailMessage => e !== null);

    // Analyze emails
    const analysis = analyzeEmails(validEmails);

    return NextResponse.json({ analysis });
  } catch (err) {
    console.error("Gmail analysis error:", err);
    return NextResponse.json(
      { error: "Failed to analyze emails" },
      { status: 500 }
    );
  }
}

function analyzeEmails(emails: EmailMessage[]): AnalysisResult {
  const brandCounts: Record<string, number> = {};
  const styleKeywords: Record<string, number> = {};
  const recentPurchases: string[] = [];
  let totalPriceIndicators = 0;
  let priceSum = 0;

  const brandPatterns = [
    { pattern: /zara/i, name: "Zara" },
    { pattern: /h&m|h and m/i, name: "H&M" },
    { pattern: /asos/i, name: "ASOS" },
    { pattern: /uniqlo/i, name: "Uniqlo" },
    { pattern: /nordstrom/i, name: "Nordstrom" },
    { pattern: /macy(')?s/i, name: "Macy's" },
    { pattern: /gap(?!\s*year)/i, name: "Gap" },
    { pattern: /banana republic/i, name: "Banana Republic" },
    { pattern: /j\.?\s?crew/i, name: "J.Crew" },
    { pattern: /anthropologie/i, name: "Anthropologie" },
    { pattern: /free people/i, name: "Free People" },
    { pattern: /urban outfitters/i, name: "Urban Outfitters" },
    { pattern: /mango/i, name: "Mango" },
    { pattern: /cos\b/i, name: "COS" },
    { pattern: /& other stories|other stories/i, name: "& Other Stories" },
    { pattern: /massimo dutti/i, name: "Massimo Dutti" },
    { pattern: /lululemon/i, name: "Lululemon" },
    { pattern: /nike/i, name: "Nike" },
    { pattern: /adidas/i, name: "Adidas" },
    { pattern: /everlane/i, name: "Everlane" },
    { pattern: /reformation/i, name: "Reformation" },
    { pattern: /shein/i, name: "Shein" },
    { pattern: /revolve/i, name: "Revolve" },
    { pattern: /net-a-porter/i, name: "Net-a-Porter" },
    { pattern: /saks/i, name: "Saks Fifth Avenue" },
  ];

  const stylePatterns = [
    { pattern: /dress(es)?/i, style: "dresses" },
    { pattern: /blazer|jacket/i, style: "outerwear" },
    { pattern: /jeans|denim/i, style: "denim" },
    { pattern: /shirt|blouse|top/i, style: "tops" },
    { pattern: /skirt/i, style: "skirts" },
    { pattern: /pants|trousers/i, style: "pants" },
    { pattern: /sweater|knit|cardigan/i, style: "knitwear" },
    { pattern: /athletic|sport|workout/i, style: "athleisure" },
    { pattern: /formal|suit/i, style: "formalwear" },
    { pattern: /casual/i, style: "casualwear" },
    { pattern: /minimalist|minimal/i, style: "minimalist" },
    { pattern: /vintage|retro/i, style: "vintage" },
    { pattern: /bohemian|boho/i, style: "bohemian" },
  ];

  for (const email of emails) {
    const content = getEmailContent(email);
    const subject = getHeader(email, "Subject") || "";
    const fullText = `${subject} ${content}`.toLowerCase();

    // Find brands
    for (const { pattern, name } of brandPatterns) {
      if (pattern.test(fullText)) {
        brandCounts[name] = (brandCounts[name] || 0) + 1;
      }
    }

    // Find style keywords
    for (const { pattern, style } of stylePatterns) {
      if (pattern.test(fullText)) {
        styleKeywords[style] = (styleKeywords[style] || 0) + 1;
      }
    }

    // Extract prices
    const priceMatches = fullText.match(/\$\d+(?:\.\d{2})?/g);
    if (priceMatches) {
      for (const price of priceMatches) {
        const value = parseFloat(price.replace("$", ""));
        if (value > 10 && value < 2000) {
          priceSum += value;
          totalPriceIndicators++;
        }
      }
    }

    // Extract recent purchases from subject lines
    if (/order|confirm|shipped|receipt/i.test(subject) && recentPurchases.length < 5) {
      const cleanSubject = subject.replace(/re:|fwd:/gi, "").trim();
      if (cleanSubject.length > 10 && cleanSubject.length < 100) {
        recentPurchases.push(cleanSubject);
      }
    }
  }

  // Sort and get top results
  const topBrands = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([brand]) => brand);

  const topStyles = Object.entries(styleKeywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([style]) => style);

  // Determine price range
  let priceRange = "Mid-range ($50-150)";
  if (totalPriceIndicators > 0) {
    const avgPrice = priceSum / totalPriceIndicators;
    if (avgPrice < 30) priceRange = "Budget-friendly (under $30)";
    else if (avgPrice < 75) priceRange = "Affordable ($30-75)";
    else if (avgPrice < 150) priceRange = "Mid-range ($75-150)";
    else if (avgPrice < 300) priceRange = "Premium ($150-300)";
    else priceRange = "Luxury ($300+)";
  }

  // Identify wardrobe gaps
  const gaps: string[] = [];
  const allStyles = Object.keys(styleKeywords);
  
  if (!allStyles.includes("outerwear")) gaps.push("Quality outerwear pieces (blazers, jackets)");
  if (!allStyles.includes("formalwear")) gaps.push("Formalwear for special occasions");
  if (!allStyles.includes("knitwear")) gaps.push("Cozy knitwear for layering");
  if (!allStyles.includes("athleisure") && !allStyles.includes("casualwear")) {
    gaps.push("Comfortable casual basics");
  }
  if (gaps.length === 0) {
    gaps.push("Your wardrobe seems well-rounded! Consider adding statement accessories.");
  }

  return {
    brands: topBrands.length > 0 ? topBrands : ["No specific brands detected"],
    styles: topStyles.length > 0 ? topStyles : ["casual", "everyday"],
    priceRange,
    gaps: gaps.slice(0, 3),
    recentPurchases,
    orderCount: emails.length,
  };
}

function getEmailContent(email: EmailMessage): string {
  if (email.payload?.body?.data) {
    return decodeBase64(email.payload.body.data);
  }
  if (email.payload?.parts) {
    for (const part of email.payload.parts) {
      if (part.body?.data) {
        return decodeBase64(part.body.data);
      }
    }
  }
  return email.snippet || "";
}

function getHeader(email: EmailMessage, headerName: string): string | undefined {
  return email.payload?.headers?.find(
    (h) => h.name.toLowerCase() === headerName.toLowerCase()
  )?.value;
}

function decodeBase64(data: string): string {
  try {
    const decoded = Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64");
    return decoded.toString("utf-8");
  } catch {
    return "";
  }
}
