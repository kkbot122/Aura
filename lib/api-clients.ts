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
Create a comprehensive brand identity for "${businessName}" - a ${industry} business with ${style} aesthetic.

BUSINESS CONTEXT: ${description}

Generate a complete brand identity package with this EXACT JSON structure:

{
  "business_name": "${businessName}",
  "tagline": "A catchy, memorable tagline under 8 words",
  "brand_description": "A compelling 2-3 sentence brand story",
  "mission_statement": "Clear and inspiring mission statement",
  "core_values": ["value1", "value2", "value3", "value4", "value5"],
  "color_palette": [
    {"name": "Primary Brand", "hex": "#HEXCODE", "usage": "Main brand color for logos and primary elements"},
    {"name": "Secondary", "hex": "#HEXCODE", "usage": "Supporting color for backgrounds and secondary elements"},
    {"name": "Accent", "hex": "#HEXCODE", "usage": "Highlight color for CTAs and important elements"},
    {"name": "Neutral Dark", "hex": "#HEXCODE", "usage": "Text and dark elements"},
    {"name": "Neutral Light", "hex": "#HEXCODE", "usage": "Backgrounds and light elements"}
  ],
  "design_style": "Detailed description of visual style matching the ${style} aesthetic",
  "typography": {
    "primary": "Primary font name - Usage: Headlines and prominent text",
    "secondary": "Secondary font name - Usage: Body text and paragraphs", 
    "accent": "Accent font name - Usage: Special elements and highlights"
  },
  "target_audience": {
    "primary": "Detailed demographic and psychographic profile of main customers",
    "secondary": "Additional relevant audience segments"
  },
  "brand_personality": {
    "traits": ["adjective1", "adjective2", "adjective3", "adjective4", "adjective5"],
    "tone_of_voice": "How the brand communicates with its audience"
  },
  "logo_direction": {
    "concept": "Clear creative direction for logo design",
    "symbolism": "Key symbolic elements and meanings to incorporate",
    "style_notes": "Specific style requirements and visual guidelines"
  }
}

IMPORTANT: 
- Return ONLY valid JSON, no additional text
- Make hex codes realistic and harmonious
- Ensure all values are practical for business use
- Colors should work well together and match the ${style} style
- Keep descriptions concise but impactful
    `;

    console.log('Generating comprehensive brand identity with Groq...');

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a professional brand strategist and identity designer. 
            Create comprehensive, practical brand identities that are ready for implementation. 
            Always return valid JSON format. 
            Make color palettes harmonious and professional.
            Ensure brand values are meaningful and actionable.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response received from Groq');
      }

      console.log('Raw Groq response received, length:', response.length);

      try {
        const parsedResponse = JSON.parse(response);
        console.log('Successfully parsed brand identity');
        
        // Validate required fields
        if (!parsedResponse.business_name || !parsedResponse.tagline || !parsedResponse.color_palette) {
          console.warn('Missing required fields in response:', parsedResponse);
        }
        
        return parsedResponse;
      } catch (parseError) {
        console.error('Failed to parse Groq response as JSON. Raw response:', response.substring(0, 500));
        
        // Enhanced JSON extraction with multiple attempts
        let extractedJson = null;
        
        // Attempt 1: Standard JSON extraction
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            extractedJson = JSON.parse(jsonMatch[0]);
            console.log('Extracted JSON using standard method');
          } catch (e) {
            console.log('Standard extraction failed');
          }
        }
        
        // Attempt 2: Look for JSON after potential markers
        if (!extractedJson) {
          const jsonStart = response.indexOf('{');
          const jsonEnd = response.lastIndexOf('}') + 1;
          if (jsonStart !== -1 && jsonEnd > jsonStart) {
            try {
              extractedJson = JSON.parse(response.substring(jsonStart, jsonEnd));
              console.log('Extracted JSON using position method');
            } catch (e) {
              console.log('Position extraction failed');
            }
          }
        }
        
        if (extractedJson) {
          return extractedJson;
        }
        
        throw new Error('Invalid JSON response from AI service. Response: ' + response.substring(0, 200));
      }

    } catch (error) {
      console.error('Groq API request failed:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('model_decommissioned')) {
          throw new Error('AI model unavailable. Please try again with a different model.');
        } else if (error.message.includes('rate_limit')) {
          throw new Error('AI service is busy. Please try again in a moment.');
        } else if (error.message.includes('authentication')) {
          throw new Error('AI service configuration error. Please contact support.');
        }
      }
      
      throw error;
    }
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

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq text generation failed:', error);
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
      console.error('Cloudflare credentials are missing');
      throw new Error('Cloudflare AI not configured');
    }
  }

  async generateLogo(prompt: string, model: string = "@cf/black-forest-labs/flux-1-schnell") {
    console.log('Calling Cloudflare AI with optimized settings...');
    
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
            prompt: `${prompt}, simple vector logo, minimalist, clean, professional, white background, no complex details, flat design`,
            num_steps: 2, // Reduced from 4 to 2 for much faster generation
            guidance_scale: 3, // Lower guidance for faster generation
            width: 256, // Smaller image size = faster
            height: 256,
          }),
        }
      );

      console.log('Cloudflare AI response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudflare AI error response:', errorText);
        throw new Error(`Cloudflare AI error: ${response.status}`);
      }

      const result = await response.json();
      
      let imageData = result.result;
      
      if (typeof imageData === 'object') {
        if (imageData.image) {
          imageData = imageData.image;
        } else if (imageData.data) {
          imageData = imageData.data;
        } else {
          const base64Value = Object.values(imageData).find(
            (value: any) => typeof value === 'string' && value.length > 1000
          );
          if (base64Value) {
            imageData = base64Value;
          }
        }
      }

      if (typeof imageData !== 'string') {
        throw new Error('Invalid image data format received');
      }

      console.log('Cloudflare AI success - logo generated in optimized mode');
      return imageData;

    } catch (error) {
      console.error('Cloudflare AI request failed:', error);
      throw error;
    }
  }

  // Method to try faster models first
  async generateFastLogo(prompt: string) {
    const fasterModels = [
      "@cf/bytedance/stable-diffusion-xl-lightning", // Very fast model
      "@cf/lykon/dreamshaper-8-lcm", // Fast with good quality  
      "@cf/black-forest-labs/flux-1-schnell" // Your current (fallback)
    ];

    for (const model of fasterModels) {
      try {
        console.log(`Trying faster model: ${model}`);
        const result = await this.generateLogo(prompt, model);
        console.log(`✅ Success with fast model: ${model}`);
        return result;
      } catch (error) {
        console.log(`❌ Fast model ${model} failed, trying next...`);
        continue;
      }
    }
    
    throw new Error('All fast logo models failed');
  }

  // Method for high quality (slower) generation when needed
  async generateHighQualityLogo(prompt: string) {
    console.log('Generating high quality logo (slower)...');
    
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `${prompt}, professional logo, high quality, detailed, clean vector design, white background`,
          num_steps: 6, // More steps for better quality
          guidance_scale: 7.5,
          width: 512,
          height: 512,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`High quality generation failed: ${response.status}`);
    }

    const result = await response.json();
    let imageData = result.result;
    
    if (typeof imageData === 'object') {
      if (imageData.image) imageData = imageData.image;
      else if (imageData.data) imageData = imageData.data;
    }

    if (typeof imageData !== 'string') {
      throw new Error('Invalid image data format received');
    }

    return imageData;
  }
}

export const groqClient = new GroqClient();
export const cloudflareAI = new CloudflareAIClient();