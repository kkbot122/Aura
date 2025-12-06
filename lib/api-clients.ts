import Groq from "groq-sdk";

// Groq Client for Text Generation
export class GroqClient {
  private groq: Groq;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY!;
    if (!apiKey) {
      console.error("GROQ_API_KEY is not set in environment variables");
      throw new Error("GROQ_API_KEY is required");
    }
    this.groq = new Groq({ apiKey });
  }

  async generateComprehensiveBrandIdentity(
    businessName: string,
    style: string,
    industry: string,
    description: string
  ) {
    const prompt = `
You are a professional brand strategist and identity designer. Create a complete, ready-to-implement brand identity for "${businessName}" - a ${industry} business with ${style} aesthetic.

BUSINESS CONTEXT: ${description}

Generate a comprehensive brand identity package with this EXACT JSON structure:

{
  "business_name": "${businessName}",
  "tagline": "A memorable, compelling tagline under 8 words that captures the brand essence",
  "brand_description": "A 2-3 sentence compelling brand story that explains the brand's purpose and value proposition",
  "mission_statement": "Clear, inspiring mission statement that guides business decisions",
  "vision_statement": "Future-oriented vision statement showing where the brand aims to be",
  "core_values": ["value1", "value2", "value3", "value4", "value5"],
  
  // ENHANCED: Generate specific, harmonious color schemes
  "color_palette": [
    {
      "name": "Primary Brand Color",
      "hex": "#HEXCODE", 
      "usage": "Main brand color for logos, primary buttons, and key brand elements",
      "rgb": "r, g, b"
    },
    {
      "name": "Secondary Color",
      "hex": "#HEXCODE", 
      "usage": "Supporting color for backgrounds, secondary elements, and accents",
      "rgb": "r, g, b"
    },
    {
      "name": "Accent Color",
      "hex": "#HEXCODE", 
      "usage": "Highlight color for CTAs, important elements, and interactive features",
      "rgb": "r, g, b"
    },
    {
      "name": "Neutral Dark",
      "hex": "#HEXCODE", 
      "usage": "Text color, headlines, and dark interface elements",
      "rgb": "r, g, b"
    },
    {
      "name": "Neutral Light",
      "hex": "#HEXCODE", 
      "usage": "Backgrounds, cards, and light interface elements",
      "rgb": "r, g, b"
    }
  ],
  
  // ENHANCED: Generate practical design style with specific instructions
  "design_style": "Detailed description of visual style matching ${style} aesthetic. Include specific characteristics like: minimalism level, use of negative space, icon style, layout preferences",
  
  // ENHANCED: Generate REAL, web-safe fonts with fallbacks
  "typography": {
    "primary": {
      "name": "Font Name (e.g., Inter, Poppins, Montserrat)",
      "usage": "Headlines, prominent text, and brand name display",
      "category": "Sans-serif or Serif",
      "characteristics": "Describe the font personality (e.g., modern, friendly, professional)"
    },
    "secondary": {
      "name": "Font Name (e.g., Open Sans, Roboto, Lato)",
      "usage": "Body text, paragraphs, and general content",
      "category": "Sans-serif or Serif", 
      "characteristics": "Describe the font readability and feel"
    },
    "accent": {
      "name": "Font Name (e.g., Playfair Display, Merriweather, Raleway)",
      "usage": "Special elements, quotes, and decorative text",
      "category": "Display or Special",
      "characteristics": "Describe the decorative or special nature"
    }
  },
  
  "target_audience": {
    "primary": "Detailed demographic and psychographic profile of main customers (age, income, interests, values)",
    "secondary": "Additional relevant audience segments"
  },
  
  "brand_personality": {
    "traits": ["adjective1", "adjective2", "adjective3", "adjective4", "adjective5"],
    "tone_of_voice": "How the brand communicates (e.g., professional yet friendly, authoritative but approachable)"
  },
  
  // ENHANCED: More specific logo direction for AI image generation
  "logo_direction": {
    "concept": "Clear creative direction for logo design. Be specific about symbols, shapes, and visual metaphors.",
    "symbolism": "Key symbolic elements and their meanings (e.g., 'leaf for growth', 'arrow for progress').",
    "style_notes": "Specific style requirements: use of lines (thick/thin), shape style (geometric/organic), complexity level, recommended iconography.",
    "color_notes": "How to use the color palette in the logo (e.g., 'use primary color for main symbol, accent color for highlights').",
    "typography_notes": "How typography should be integrated (e.g., 'clean sans-serif for wordmark, avoid script fonts').",

    "ai_prompts": {
      "primary": "Detailed prompt for AI image generation of primary logo (include specific symbols, colors, style)",
      "icon": "Detailed prompt for icon version of logo",
      "monochrome": "Detailed prompt for monochrome/black and white version",
      "wordmark": "Detailed prompt for text-based logo if applicable"
    }
  }
}

CRITICAL REQUIREMENTS:
1. Colors MUST be harmonious and follow color theory for ${style} style
2. Colors should include RGB values (calculated from hex)
3. Fonts must be REAL, web-safe fonts available on Google Fonts
4. Make all descriptions practical for immediate implementation
5. Logo direction should be specific enough for AI image generation
6. Return ONLY valid JSON, no additional text
7. Hex codes must be valid 6-digit colors (like #3B82F6)

Style-specific considerations:
- For "minimal": Use monochromatic or analogous color schemes, clean fonts
- For "tech": Use cool colors (blues, purples), geometric fonts
- For "luxury": Use deep colors (burgundy, navy, gold), elegant serif fonts  
- For "organic": Use earth tones, natural colors, rounded fonts
- For "playful": Use bright, complementary colors, rounded fun fonts
- For "vintage": Use muted colors, classic serif fonts
    `;

    console.log(
      "Generating enhanced comprehensive brand identity with Groq..."
    );

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are an expert brand identity designer with deep knowledge of:
          1. Color theory and harmonious palette creation
          2. Typography and font pairing
          3. Logo design principles for various industries
          4. Modern design trends and styles
          
          Your brand identities must be:
          - Practical and immediately usable
          - Aesthetically cohesive and professional  
          - Industry-appropriate
          - Technically correct (valid hex codes, real font names)
          - Specific enough for implementation by designers and developers`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error("No response received from Groq");
      }

      console.log("Enhanced brand identity response received");

      try {
        const parsedResponse = JSON.parse(response);
        console.log("Successfully parsed enhanced brand identity");

        // Add RGB values if missing
        if (
          parsedResponse.color_palette &&
          Array.isArray(parsedResponse.color_palette)
        ) {
          parsedResponse.color_palette = parsedResponse.color_palette.map(
            (color: any) => {
              if (color.hex && !color.rgb) {
                const rgb = this.hexToRgb(color.hex);
                return {
                  ...color,
                  rgb: `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`,
                };
              }
              return color;
            }
          );
        }

        return parsedResponse;
      } catch (parseError) {
        console.error("Failed to parse enhanced response as JSON:", parseError);
        console.log("Raw response snippet:", response.substring(0, 500));
        throw new Error("Invalid JSON response from AI service");
      }
    } catch (error) {
      console.error("Enhanced Groq API request failed:", error);
      throw error;
    }
  }

  // Add this helper method to the GroqClient class
  private hexToRgb(hex: string): [number, number, number] {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
  }

  // Keep your existing generateText method
  async generateText(prompt: string, model: string = "llama-3.1-8b-instant") {
    try {
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model,
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Groq text generation failed:", error);
      throw error;
    }
  }
}

// Optimized Cloudflare AI Client for Faster Logo Generation
export class CloudflareAIClient {
  private accountId: string;
  private apiToken: string;

  constructor() {
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
    this.apiToken = process.env.CLOUDFLARE_API_TOKEN!;

    if (!this.accountId || !this.apiToken) {
      console.error("Cloudflare credentials are missing");
      throw new Error("Cloudflare AI not configured");
    }
  }

  async generateLogo(
    prompt: string,
    model: string = "@cf/black-forest-labs/flux-1-schnell"
  ) {
    console.log(`Calling Cloudflare AI model: ${model}...`);

    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/${model}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: `${prompt}, minimalist vector logo, clean, professional, white background, flat design, simple`,
            num_steps: 4,
            guidance_scale: 7.5,
            width: 512,
            height: 512,
          }),
        }
      );

      console.log("Cloudflare AI response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudflare AI error response:", errorText);
        throw new Error(`Cloudflare AI error: ${response.status}`);
      }

      // Try multiple approaches to get the image
      const contentType = response.headers.get("content-type");
      console.log("Content-Type:", contentType);

      // Approach 1: Try JSON parsing
      if (contentType?.includes("application/json")) {
        try {
          const result = await response.json();
          console.log("JSON response keys:", Object.keys(result));

          // Common JSON response structures from Cloudflare AI
          let imageData =
            result.result || result.image || result.data || result.output;

          if (typeof imageData === "object") {
            // Handle nested structures
            if (imageData.image) imageData = imageData.image;
            else if (imageData.data) imageData = imageData.data;
            else if (imageData.result) imageData = imageData.result;
            else if (imageData.output) imageData = imageData.output;
            else {
              // Find any long string that might be base64
              const base64Value = Object.values(imageData).find(
                (value: any) => typeof value === "string" && value.length > 1000
              );
              if (base64Value) imageData = base64Value;
            }
          }

          if (typeof imageData === "string" && imageData.length > 100) {
            // Clean up the string (remove data URL prefix if present)
            const cleanImageData = imageData.replace(
              /^data:image\/[^;]+;base64,/,
              ""
            );
            console.log(
              `✅ Extracted from JSON, length: ${cleanImageData.length}`
            );
            return cleanImageData;
          }
        } catch (jsonError) {
          console.log("JSON parsing failed, trying other approaches...");
        }
      }

      // Approach 2: Try binary/arrayBuffer
      try {
        const imageBuffer = await response.arrayBuffer();
        if (imageBuffer.byteLength > 100) {
          const base64Image = Buffer.from(imageBuffer).toString("base64");
          console.log(`✅ Binary image, length: ${base64Image.length}`);
          return base64Image;
        }
      } catch (binaryError) {
        console.log("Binary approach failed...");
      }

      // Approach 3: Try text and extract base64
      const textData = await response.text();
      console.log("Raw response length:", textData.length);

      // Look for base64 pattern
      const base64Regex =
        /(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?/g;
      const matches = textData.match(base64Regex);

      if (matches) {
        // Find the longest base64 string (likely the image)
        const longestBase64 = matches.sort((a, b) => b.length - a.length)[0];
        if (longestBase64 && longestBase64.length > 1000) {
          console.log(
            `✅ Found base64 in text, length: ${longestBase64.length}`
          );
          return longestBase64;
        }
      }

      // Approach 4: Return raw text (might be base64 already)
      console.log(`⚠️ Returning raw response, length: ${textData.length}`);
      return textData;
    } catch (error) {
      console.error(`Cloudflare AI request failed for model ${model}:`, error);
      throw error;
    }
  }

  // Method to try reliable models
  async generateFastLogo(prompt: string) {
    // Updated order based on reliability for logos
    const reliableModels = [
      "@cf/black-forest-labs/flux-1-schnell", // Most reliable for logos
      "@cf/lykon/dreamshaper-8-lcm", // Good fallback
      "@cf/bytedance/stable-diffusion-xl-lightning", // Last resort
    ];

    for (const model of reliableModels) {
      try {
        console.log(`Trying model: ${model}`);
        const result = await this.generateLogo(prompt, model);
        console.log(`✅ Success with model: ${model}`);
        return result;
      } catch (error) {
        console.log(
          `❌ Model ${model} failed:`,
          error instanceof Error ? error.message : String(error)
        );
        continue;
      }
    }

    throw new Error("All logo models failed");
  }

  // Method for high quality generation
  async generateHighQualityLogo(prompt: string) {
    console.log("Generating high quality logo...");

    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: `${prompt}, professional vector logo, high quality, detailed, clean design, white background`,
            num_steps: 6, // More steps for better quality
            guidance_scale: 8.0,
            width: 512,
            height: 512,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`High quality generation failed: ${response.status}`);
      }

      // Handle binary response
      const imageBuffer = await response.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString("base64");

      console.log(`High quality logo generated: ${base64Image.length} bytes`);
      return base64Image;
    } catch (error) {
      console.error("High quality generation failed:", error);
      throw error;
    }
  }

  // Special method for logo-specific generation
  async generateLogoWithStyle(prompt: string, style: string = "minimalist") {
    const stylePrompts: Record<string, string> = {
      minimalist: "minimalist, clean lines, simple geometric shapes",
      tech: "geometric, futuristic, sharp edges, modern",
      organic: "rounded shapes, natural, flowing lines, soft edges",
      luxury: "elegant, sophisticated, refined, detailed",
      playful: "fun, rounded, colorful, friendly",
      vintage: "classic, retro, textured, traditional",
    };

    const stylePrompt = stylePrompts[style] || stylePrompts.minimalist;

    const enhancedPrompt = `${prompt}, ${stylePrompt}, vector logo, white background, professional`;

    return this.generateFastLogo(enhancedPrompt);
  }
}

export const groqClient = new GroqClient();
export const cloudflareAI = new CloudflareAIClient();
