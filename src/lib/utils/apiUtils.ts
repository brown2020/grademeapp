import * as cheerio from "cheerio";
import { adminDb } from "@/firebase/firebaseAdmin";
import pLimit from "p-limit";

/**
 * Fetches Google search results using the specified query.
 */
export async function fetchGoogleSearchResults(query: string, numResults: number = 5) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;

  if (!apiKey || !cx) {
    throw new Error("Google API credentials are missing.");
  }

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${query}&num=${numResults}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch Google search results.");

  return (await response.json()).items || [];
}

/**
 * Fetches content from a URL and extracts text content.
 */
export async function fetchAndExtractContent(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch content from ${url}`);

  const html = await response.text();
  const $ = cheerio.load(html);
  return $("p, div").text().replace(/\s+/g, " ").trim().slice(0, 15000);
}

/**
 * Fixes the grammar of a given title using OpenAI.
 */
export async function fixTitleGrammar(rawTitle: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
            You are an editor that corrects a book/article title's grammar and formatting.
            Output only the corrected title as plain text. Do not include any additional text or metadata.
          `,
        },
        {
          role: "user",
          content: `Please correct the grammar and style of this title: "${rawTitle}. Remove any unnecessary punctuation."`,
        },
      ],
      temperature: 0.2,
      max_tokens: 100,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim().replace(/\n+/g, " ") || "";
}

/**
 * Searches essay services using a corrected title combined with each service name.
 */
export async function searchEssayServices(correctedTitle: string): Promise<{ service: string; results: unknown[] }[]> {
  try {
    console.log("[searchEssayServices] Fetching essay services...");
    const servicesSnapshot = await adminDb.collection("essayServices").get();

    if (servicesSnapshot.empty) {
      console.log("[searchEssayServices] No essay services found in the database.");
      return [];
    }

    const services = servicesSnapshot.docs.map(doc => doc.data().name);

    // Optional rate limiting to prevent too many simultaneous requests
    const limit = pLimit(5); // Max 5 concurrent requests

    // Perform searches concurrently
    const searchPromises = services.map(service =>
      limit(async () => {
        const query = `${correctedTitle} ${service}`;
        console.log(`[searchEssayServices] Performing search for: ${query}`);
        try {
          const results = await fetchGoogleSearchResults(query, 5);
          return { service, results };
        } catch (error) {
          console.error(`[searchEssayServices] Failed to fetch results for service: ${service}`, error);
          return { service, results: [] }; // Return an empty result for the failed service
        }
      })
    );

    // Wait for all searches to complete
    const searchResults = await Promise.all(searchPromises);

    return searchResults;
  } catch (error) {
    console.error("[searchEssayServices] Error while searching essay services:", error);
    throw error;
  }
}
