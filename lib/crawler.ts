import { chromium as playwrightChromium } from "playwright-core";
import chromium from "@sparticuz/chromium";

export interface CrawlResult {
  screenshot: Buffer;
  title: string;
  description: string;
  domSummary: {
    navItems: string[];
    ctaButtons: string[];
    headings: string[];
    formFields: number;
    imageCount: number;
    linkCount: number;
  };
}

export async function crawlPage(url: string): Promise<CrawlResult> {
  // In production (Vercel), use @sparticuz/chromium
  // In development, use local Chrome/Chromium
  const isProduction = process.env.NODE_ENV === "production";

  const browser = await playwrightChromium.launch({
    args: isProduction ? chromium.args : [],
    executablePath: isProduction
      ? await chromium.executablePath()
      : undefined, // Let playwright-core find local browser in dev
    headless: true,
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent:
        "UX-Psychology-Analyzer/1.0 (Educational Tool; +https://ux-psychology-dictionary.vercel.app)",
    });

    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    // Wait a bit for any lazy-loaded content
    await page.waitForTimeout(2000);

    // Take screenshot
    const screenshot = await page.screenshot({
      fullPage: false,
      type: "png",
    });

    // Extract metadata
    const title = await page.title();
    const description = await page
      .$eval('meta[name="description"]', (el) =>
        el.getAttribute("content")
      )
      .catch(() => "");

    // Extract DOM summary
    const domSummary = await page.evaluate(() => {
      const navItems = Array.from(
        document.querySelectorAll("nav a, header a, [role='navigation'] a")
      )
        .map((el) => el.textContent?.trim() || "")
        .filter(Boolean)
        .slice(0, 20);

      const ctaButtons = Array.from(
        document.querySelectorAll(
          'button, a[class*="btn"], a[class*="button"], [role="button"]'
        )
      )
        .map((el) => el.textContent?.trim() || "")
        .filter(Boolean)
        .slice(0, 15);

      const headings = Array.from(
        document.querySelectorAll("h1, h2, h3")
      )
        .map((el) => el.textContent?.trim() || "")
        .filter(Boolean)
        .slice(0, 15);

      const formFields = document.querySelectorAll(
        "input, textarea, select"
      ).length;
      const imageCount = document.querySelectorAll("img").length;
      const linkCount = document.querySelectorAll("a").length;

      return { navItems, ctaButtons, headings, formFields, imageCount, linkCount };
    });

    return {
      screenshot: Buffer.from(screenshot),
      title,
      description: description || "",
      domSummary,
    };
  } finally {
    await browser.close();
  }
}
