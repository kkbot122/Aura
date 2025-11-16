// Groq Client for Text Generation
export class GroqClient {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY!;
    if (!this.apiKey) {
      console.error("GROQ_API_KEY is not set in environment variables");
    }
  }

  async generateText(prompt: string, model: string = "llama-3.1-8b-instant") {
    console.log("Sending request to Groq API...");

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 500,
          }),
        }
      );

      console.log("Groq API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq API error response:", errorText);
        throw new Error(
          `Groq API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(
        "Groq API success, response length:",
        data.choices[0].message.content.length
      );
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Groq API request failed:", error);
      throw error;
    }
  }

  async generateBrandIdentity(
    businessName: string,
    style: string,
    industry: string
  ) {
    const prompt = `
      Create a comprehensive brand identity for:
      Business Name: ${businessName}
      Style: ${style}
      Industry: ${industry}

      Return ONLY valid JSON with this structure:
      {
        "business_name": "${businessName}",
        "style": "${style}",
        "tagline": "creative tagline",
        "brand_description": "2-3 sentence brand story",
        "color_palette": ["#hex1", "#hex2", "#hex3", "#hex4"],
        "design_style": "visual style description",
        "target_audience": "audience description",
        "brand_values": ["value1", "value2", "value3"],
        "typography_suggestions": ["font1", "font2"],
        "logo_direction": "logo design ideas"
      }

      Use realistic hex codes and professional language.
      Only return the JSON object, no additional text.
    `;

    try {
      const result = await this.generateText(prompt);

      // Clean the response - remove any markdown code blocks
      let cleanedResult = result.trim();
      if (cleanedResult.includes("```json")) {
        cleanedResult = cleanedResult
          .split("```json")[1]
          .split("```")[0]
          .trim();
      } else if (cleanedResult.includes("```")) {
        cleanedResult = cleanedResult.split("```")[1].split("```")[0].trim();
      }

      console.log("Cleaned JSON result:", cleanedResult);

      const brandData = JSON.parse(cleanedResult);
      return brandData;
    } catch (parseError) {
      console.error("Failed to parse Groq response:", parseError);

      // Fallback brand data if parsing fails
      return {
        business_name: businessName,
        style: style,
        tagline: `Innovating the future of ${industry}`,
        brand_description: `${businessName} is a ${style} ${industry} company focused on excellence and innovation.`,
        color_palette: ["#0066FF", "#00CC88", "#333333", "#FF6B6B"],
        design_style: `Clean ${style} aesthetic with modern design principles`,
        target_audience: "Forward-thinking professionals and businesses",
        brand_values: ["Innovation", "Quality", "Customer Focus"],
        typography_suggestions: ["Inter", "Helvetica Neue", "SF Pro"],
        logo_direction: `Modern ${style} design reflecting innovation`,
        note: "Fallback generation due to API error",
      };
    }
  }
}

// Cloudflare AI Client for Image Generation
export class CloudflareAIClient {
  private accountId: string;
  private apiToken: string;

  constructor() {
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
    this.apiToken = process.env.CLOUDFLARE_API_TOKEN!;
    
    if (!this.accountId || !this.apiToken) {
      console.error('Cloudflare credentials are missing');
      throw new Error('Cloudflare AI not configured');
    }
  }

  async generateLogo(prompt: string, model: string = "@cf/black-forest-labs/flux-1-schnell") {
    console.log('Calling Cloudflare AI with model:', model);
    
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/${model}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            num_steps: 4, // Reduced for faster testing
          }),
        }
      );

      console.log('Cloudflare AI response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudflare AI error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        throw new Error(`Cloudflare AI error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Cloudflare AI full response:', JSON.stringify(result, null, 2));
      
      // Handle different response formats
      if (!result.result) {
        console.error('Cloudflare AI missing result:', result);
        throw new Error('No image data in response');
      }

      // The response might be an object with image data or direct base64
      let imageData = result.result;
      
      // If it's an object, check for common image data fields
      if (typeof imageData === 'object') {
        if (imageData.image) {
          imageData = imageData.image; // Some models return { image: base64 }
        } else if (imageData.data) {
          imageData = imageData.data; // Some models return { data: base64 }
        } else {
          // Try to find any base64 string in the object
          const base64Value = Object.values(imageData).find(
            (value: any) => typeof value === 'string' && value.length > 1000
          );
          if (base64Value) {
            imageData = base64Value;
          }
        }
      }

      // Ensure we have a string
      if (typeof imageData !== 'string') {
        console.error('Cloudflare AI response is not a string:', typeof imageData, imageData);
        throw new Error('Invalid image data format received');
      }

      console.log('Cloudflare AI success, image data length:', imageData.length);
      return imageData;

    } catch (error) {
      console.error('Cloudflare AI request failed:', error);
      throw error;
    }
  }
}

export const groqClient = new GroqClient();
export const cloudflareAI = new CloudflareAIClient();
