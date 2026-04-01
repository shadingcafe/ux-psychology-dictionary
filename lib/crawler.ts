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

/**
 * Fetch page metadata via server-side HTML fetch + screenshot via thum.io
 * This approach works on Vercel Serverless without Playwright/Chromium
 */
export async function crawlPage(url: string): Promise<CrawlResult> {
  // Step 1: Fetch screenshot from thum.io (free, no API key needed)
  const screenshotUrl = `https://image.thum.io/get/width/1280/crop/800/noanimate/${encodeURIComponent(url)}`;
  const screenshotRes = await fetch(screenshotUrl, { signal: AbortSignal.timeout(20000) });

  let screenshot: Buffer;
  if (screenshotRes.ok) {
    const arrayBuffer = await screenshotRes.arrayBuffer();
    screenshot = Buffer.from(arrayBuffer);
  } else {
    // Return 1x1 transparent PNG as fallback
    screenshot = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
  }

  // Step 2: Fetch HTML and extract metadata
  let title = "";
  let description = "";
  const domSummary = {
    navItems: [] as string[],
    ctaButtons: [] as string[],
    headings: [] as string[],
    formFields: 0,
    imageCount: 0,
    linkCount: 0,
  };

  try {
    const htmlRes = await fetch(url, {
      headers: {
        "User-Agent": "UX-Psychology-Analyzer/1.0 (Educational Tool)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (htmlRes.ok) {
      const html = await htmlRes.text();

      // Extract title
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, " ") : "";

      // Extract meta description
      const descMatch = html.match(
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
      ) || html.match(
        /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i
      );
      description = descMatch ? descMatch[1].trim() : "";

      // Extract headings (h1, h2, h3)
      const headingMatches = html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi);
      for (const m of headingMatches) {
        const text = m[1].replace(/<[^>]+>/g, "").trim().replace(/\s+/g, " ");
        if (text && domSummary.headings.length < 15) {
          domSummary.headings.push(text);
        }
      }

      // Extract nav links
      const navSection = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/gi);
      if (navSection) {
        for (const nav of navSection) {
          const linkMatches = nav.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi);
          for (const lm of linkMatches) {
            const text = lm[1].replace(/<[^>]+>/g, "").trim().replace(/\s+/g, " ");
            if (text && domSummary.navItems.length < 20) {
              domSummary.navItems.push(text);
            }
          }
        }
      }

      // Extract buttons
      const buttonMatches = html.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/gi);
      for (const m of buttonMatches) {
        const text = m[1].replace(/<[^>]+>/g, "").trim().replace(/\s+/g, " ");
        if (text && domSummary.ctaButtons.length < 15) {
          domSummary.ctaButtons.push(text);
        }
      }

      // Count elements
      domSummary.formFields = (html.match(/<(input|textarea|select)/gi) || []).length;
      domSummary.imageCount = (html.match(/<img/gi) || []).length;
      domSummary.linkCount = (html.match(/<a\s/gi) || []).length;
    }
  } catch {
    // HTML fetch failed — continue with screenshot only
  }

  return {
    screenshot,
    title,
    description,
    domSummary,
  };
}
