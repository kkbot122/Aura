interface MockupOptions {
  logoUrl: string;
  businessName: string;
  colors: string[];
}

export class MockupGenerator {
  static async generateProductMockups(options: MockupOptions): Promise<string[]> {
    const mockups: string[] = [];
    
    try {
      // Generate different product mockups
      const products = [
        'business-card',
        't-shirt', 
        'website',
        'mobile-app',
        'packaging',
        'stationery'
      ];

      for (const product of products) {
        try {
          const mockup = await this.generateSingleMockup(options, product);
          if (mockup) {
            mockups.push(mockup);
          }
        } catch (error) {
          console.warn(`Failed to generate ${product} mockup:`, error);
        }
      }
    } catch (error) {
      console.error('Mockup generation failed:', error);
    }

    return mockups;
  }

  private static async generateSingleMockup(options: MockupOptions, productType: string): Promise<string> {
    // For now, we'll create simple CSS-based mockups
    // In production, you could use Cloudflare AI to generate realistic mockups
    
    return new Promise((resolve) => {
      // Create a canvas-based mockup
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      canvas.width = 400;
      canvas.height = 400;

      // Background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Product shape based on type
      switch (productType) {
        case 'business-card':
          this.drawBusinessCard(ctx, options);
          break;
        case 't-shirt':
          this.drawTShirt(ctx, options);
          break;
        case 'website':
          this.drawWebsite(ctx, options);
          break;
        case 'mobile-app':
          this.drawMobileApp(ctx, options);
          break;
        default:
          this.drawGenericProduct(ctx, options, productType);
      }

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    });
  }

  private static drawBusinessCard(ctx: CanvasRenderingContext2D, options: MockupOptions) {
    // Card background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(50, 50, 300, 180);
    ctx.strokeStyle = '#e2e8f0';
    ctx.strokeRect(50, 50, 300, 180);

    // Logo placeholder
    ctx.fillStyle = options.colors[0] || '#3b82f6';
    ctx.fillRect(70, 70, 60, 60);

    // Business name
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(options.businessName, 150, 90);

    // Tagline
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    ctx.fillText('Professional Business Card', 150, 110);
  }

  private static drawTShirt(ctx: CanvasRenderingContext2D, options: MockupOptions) {
    // T-shirt shape
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(200, 150, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.stroke();

    // Logo on shirt
    ctx.fillStyle = options.colors[0] || '#ef4444';
    ctx.fillRect(170, 130, 60, 40);
  }

  private static drawWebsite(ctx: CanvasRenderingContext2D, options: MockupOptions) {
    // Browser window
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(50, 50, 300, 250);
    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(50, 50, 300, 250);

    // Browser header
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(50, 50, 300, 30);

    // Logo in header
    ctx.fillStyle = options.colors[0] || '#3b82f6';
    ctx.fillRect(60, 55, 20, 20);

    // Business name in header
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(options.businessName, 90, 70);

    // Hero section
    ctx.fillStyle = options.colors[1] || '#f0f9ff';
    ctx.fillRect(50, 80, 300, 100);
  }

  private static drawMobileApp(ctx: CanvasRenderingContext2D, options: MockupOptions) {
    // Phone frame
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(100, 50, 200, 350);
    ctx.fillStyle = '#000000';
    ctx.fillRect(110, 60, 180, 330);

    // Screen content
    ctx.fillStyle = options.colors[0] || '#3b82f6';
    ctx.fillRect(120, 70, 160, 50);

    // App icon
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(140, 80, 30, 30);
  }

  private static drawGenericProduct(ctx: CanvasRenderingContext2D, options: MockupOptions, productType: string) {
    // Generic product box
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(100, 100, 200, 150);
    ctx.strokeStyle = '#e2e8f0';
    ctx.strokeRect(100, 100, 200, 150);

    // Logo
    ctx.fillStyle = options.colors[0] || '#10b981';
    ctx.fillRect(150, 120, 40, 40);

    // Product label
    ctx.fillStyle = '#374151';
    ctx.font = '14px Arial';
    ctx.fillText(productType, 150, 180);
  }
}