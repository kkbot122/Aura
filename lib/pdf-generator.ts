import jsPDF from "jspdf";
import { ThemeUtils } from "@/lib/theme-utils";
import { createCanvas, loadImage as canvasLoadImage } from "canvas";

interface FontDefinition {
  name?: string;
  usage?: string;
  category?: string;
  characteristics?: string;
}

interface BrandIdentity {
  business_name: string;
  tagline: string;
  brand_description: string;
  mission_statement?: string;
  vision_statement?: string;
  core_values?: string[];
  color_palette?: Array<{
    name: string;
    hex: string;
    usage: string;
    rgb?: string;
  }>;
  design_style?: string;
  // Fix: Define proper typography structure
  typography?: {
    primary?: FontDefinition | string;
    secondary?: FontDefinition | string;
    accent?: FontDefinition | string;
  };
  target_audience?: { primary?: string; secondary?: string };
  brand_personality?: { traits?: string[]; tone_of_voice?: string };
  logo_direction?: {
    concept?: string;
    symbolism?: string;
    style_notes?: string;
    color_notes?: string;
    typography_notes?: string;
  };
}

interface PDFOptions {
  brand: BrandIdentity;
  primaryLogo: string;
  logoVariations?: Record<string, { logo_png: string; prompt: string }>;
  mockups?: string[];
}

export class PremiumPDFGenerator {
  private static pageNumber = 1;

  // Helper method to destructure RGB arrays safely
  private static getRGB(colors: any, key: string): [number, number, number] {
    if (!colors || !colors[key] || !Array.isArray(colors[key])) {
      // Return default colors if not available
      const defaults: Record<string, [number, number, number]> = {
        primary: [59, 130, 246],
        dark: [15, 23, 42],
        medium: [71, 85, 105],
        light: [148, 163, 184],
        background: [248, 250, 252],
        white: [255, 255, 255],
        accent: [16, 185, 129],
      };
      return defaults[key] || [0, 0, 0];
    }
    return colors[key] as [number, number, number];
  }

  // Get dynamic theme from brand colors
  private static getThemeColors(brand: BrandIdentity) {
    return ThemeUtils.brandPaletteToPDFColors(brand.color_palette || []);
  }

  static async generateBrandBook(options: PDFOptions): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      try {
        const { brand, primaryLogo, logoVariations, mockups = [] } = options;

        // Enhanced validation with fallbacks
        if (!brand) {
          throw new Error("Brand data is required");
        }

        // Get dynamic theme from brand
        const theme = this.getThemeColors(brand);

        const businessName = brand.business_name || "Your Business";
        const tagline = brand.tagline || "Your Professional Tagline";
        const brandDescription =
          brand.brand_description ||
          "Comprehensive brand identity and guidelines.";

        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        this.pageNumber = 1;

        // Cover Page with dynamic theme
        await this.addCoverPage(
          pdf,
          {
            ...brand,
            business_name: businessName,
            tagline,
            brand_description: brandDescription,
          },
          primaryLogo,
          pageWidth,
          pageHeight,
          theme
        );

        // Contents Page with dynamic theme
        this.addContentsPage(pdf, pageWidth, pageHeight, theme);

        // Introduction with dynamic theme
        this.addIntroduction(
          pdf,
          { ...brand, business_name: businessName },
          pageWidth,
          pageHeight,
          theme
        );

        // About Us with dynamic theme
        this.addAboutUs(
          pdf,
          {
            ...brand,
            business_name: businessName,
            brand_description: brandDescription,
          },
          pageWidth,
          pageHeight,
          theme
        );

        // Logo Section with dynamic theme
        await this.addLogoSection(
          pdf,
          { ...brand, business_name: businessName },
          primaryLogo,
          logoVariations,
          pageWidth,
          pageHeight,
          theme
        );

        // Typography with dynamic theme and actual brand typography
        this.addTypographySection(pdf, brand, pageWidth, pageHeight, theme);

        // Color Palette with dynamic theme
        this.addColorPalette(pdf, brand, pageWidth, pageHeight, theme);

        // Brand Applications with dynamic theme
        await this.addBrandApplications(
          pdf,
          mockups,
          pageWidth,
          pageHeight,
          theme
        );

        const pdfBlob = pdf.output("blob");
        resolve(pdfBlob);
      } catch (error) {
        console.error("PDF generation error:", error);
        reject(error);
      }
    });
  }

  // COVER PAGE - Updated to use dynamic theme with proper RGB destructuring
  private static async addCoverPage(
    pdf: jsPDF,
    brand: BrandIdentity,
    logoUrl: string,
    pageWidth: number,
    pageHeight: number,
    theme: any
  ) {
    // Get RGB values properly
    const [bgR, bgG, bgB] = this.getRGB(theme.colors, "background");
    const [primaryR, primaryG, primaryB] = this.getRGB(theme.colors, "primary");
    const [darkR, darkG, darkB] = this.getRGB(theme.colors, "dark");
    const [lightR, lightG, lightB] = this.getRGB(theme.colors, "light");
    const [whiteR, whiteG, whiteB] = this.getRGB(theme.colors, "white");

    // Full page background - elegant gradient effect with dynamic background color
    pdf.setFillColor(bgR, bgG, bgB);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");

    // Decorative top bar with dynamic primary color
    pdf.setFillColor(primaryR, primaryG, primaryB);
    pdf.rect(0, 0, pageWidth, 3, "F");

    // Large title with dynamic dark color
    pdf.setFontSize(48);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(darkR, darkG, darkB);
    const titleY = 80;
    pdf.text("BRAND", pageWidth / 2, titleY, { align: "center" });
    pdf.text("GUIDELINES", pageWidth / 2, titleY + 20, { align: "center" });

    // Business name with dynamic primary color
    pdf.setFontSize(28);
    pdf.setTextColor(primaryR, primaryG, primaryB);
    pdf.text(brand.business_name.toUpperCase(), pageWidth / 2, titleY + 45, {
      align: "center",
    });

    // Year with dynamic light color
    pdf.setFontSize(16);
    pdf.setTextColor(lightR, lightG, lightB);
    pdf.text(new Date().getFullYear().toString(), pageWidth / 2, titleY + 58, {
      align: "center",
    });

    // Logo in center with dynamic background
    if (logoUrl) {
      try {
        const logoImg = await this.loadImage(logoUrl);
        const logoSize = 70;

        // Add subtle shadow with brand primary color
        pdf.setFillColor(primaryR, primaryG, primaryB);
        pdf.circle(pageWidth / 2, 195, 38, "F");

        // White circle for logo background
        pdf.setFillColor(whiteR, whiteG, whiteB);
        pdf.circle(pageWidth / 2, 195, 35, "F");

        pdf.addImage(
          logoImg as any,
          "PNG",
          (pageWidth - logoSize) / 2,
          160,
          logoSize,
          logoSize
        );
      } catch (error) {
        // Placeholder with dynamic colors
        pdf.setFillColor(primaryR, primaryG, primaryB);
        pdf.circle(pageWidth / 2, 195, 35, "F");
        pdf.setFillColor(whiteR, whiteG, whiteB);
        pdf.circle(pageWidth / 2, 195, 32, "F");
      }
    }

    // Bottom text with dynamic light color
    pdf.setFontSize(10);
    pdf.setTextColor(lightR, lightG, lightB);
    pdf.text("Generated by Aura+ Brand Identity System", pageWidth / 2, 270, {
      align: "center",
    });
    pdf.text(
      `${new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`,
      pageWidth / 2,
      276,
      { align: "center" }
    );
  }

  // CONTENTS PAGE - Updated to use dynamic theme with proper RGB destructuring
  private static addContentsPage(
    pdf: jsPDF,
    pageWidth: number,
    pageHeight: number,
    theme: any
  ) {
    pdf.addPage();
    this.addPageNumber(pdf, pageWidth, pageHeight, theme);

    let y = 40;

    // Get RGB values properly
    const [darkR, darkG, darkB] = this.getRGB(theme.colors, "dark");
    const [lightR, lightG, lightB] = this.getRGB(theme.colors, "light");

    // Title with dynamic dark color
    pdf.setFontSize(36);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(darkR, darkG, darkB);
    pdf.text("CONTENTS", 30, y);

    y += 30;

    // Section numbers and titles with dynamic colors
    const sections = [
      { num: "01", title: "INTRODUCTION", page: 3 },
      { num: "02", title: "ABOUT US", page: 4 },
      { num: "03", title: "LOGO", page: 5 },
      { num: "04", title: "TYPOGRAPHY", page: 7 },
      { num: "05", title: "COLOUR PALETTE", page: 8 },
      { num: "06", title: "BRAND APPLICATIONS", page: 9 },
    ];

    sections.forEach((section, index) => {
      const sectionY = y + index * 22;

      // Section number with dynamic light color
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(lightR, lightG, lightB);
      pdf.text(section.num, 30, sectionY);

      // Section title with dynamic dark color
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(darkR, darkG, darkB);
      pdf.text(section.title, 50, sectionY);

      // Page number with dynamic light color
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(lightR, lightG, lightB);
      pdf.text(
        section.page.toString().padStart(2, "0"),
        pageWidth - 30,
        sectionY,
        { align: "right" }
      );

      // Subtle line with dynamic light color
      pdf.setDrawColor(lightR, lightG, lightB);
      pdf.setLineWidth(0.5);
      pdf.line(30, sectionY + 5, pageWidth - 30, sectionY + 5);
    });
  }

  // INTRODUCTION - Updated to use dynamic theme with proper RGB destructuring
  private static addIntroduction(
    pdf: jsPDF,
    brand: BrandIdentity,
    pageWidth: number,
    pageHeight: number,
    theme: any
  ) {
    pdf.addPage();
    this.addPageNumber(pdf, pageWidth, pageHeight, theme);

    let y = 40;

    // Section header with dynamic theme
    this.addSectionHeader(pdf, "INTRODUCTION", pageWidth, theme);
    y += 30;

    // Get RGB values properly
    const [mediumR, mediumG, mediumB] = this.getRGB(theme.colors, "medium");

    // Introduction text with dynamic medium color
    const introText = `This Brand Guidelines document is designed to ensure that all communications consistently reflect the core values, tone, and personality of ${brand.business_name}. It serves as a reference point to help you create content and experiences that resonate with your target audience and maintain brand integrity across all touchpoints.

Inside, you'll find clear directions on how to visually and verbally represent the brand. Whether you're crafting a social media post, designing marketing materials, or building digital experiences, these guidelines will support you in staying aligned and consistent.

The contents of this guide are here to help you stay on brand, communicate with clarity, and achieve the best possible results.`;

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(mediumR, mediumG, mediumB);
    const introLines = pdf.splitTextToSize(introText, pageWidth - 60);
    pdf.text(introLines, 30, y);
  }

  // ABOUT US - Updated to use dynamic theme with proper RGB destructuring
  private static addAboutUs(
    pdf: jsPDF,
    brand: BrandIdentity,
    pageWidth: number,
    pageHeight: number,
    theme: any
  ) {
    pdf.addPage();
    this.addPageNumber(pdf, pageWidth, pageHeight, theme);

    let y = 40;

    this.addSectionHeader(pdf, "ABOUT US", pageWidth, theme);
    y += 30;

    // Get RGB values properly
    const [darkR, darkG, darkB] = this.getRGB(theme.colors, "dark");
    const [mediumR, mediumG, mediumB] = this.getRGB(theme.colors, "medium");

    // Brand Description with dynamic medium color
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(mediumR, mediumG, mediumB);
    const descLines = pdf.splitTextToSize(
      brand.brand_description,
      pageWidth - 60
    );
    pdf.text(descLines, 30, y);
    y += descLines.length * 5 + 20;

    // Mission with dynamic colors
    if (brand.mission_statement) {
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(darkR, darkG, darkB);
      pdf.text("MISSION", 30, y);
      y += 10;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(mediumR, mediumG, mediumB);
      const missionLines = pdf.splitTextToSize(
        brand.mission_statement,
        pageWidth - 60
      );
      pdf.text(missionLines, 30, y);
      y += missionLines.length * 5 + 20;
    }

    // Vision with dynamic colors
    if (brand.vision_statement) {
      if (y > 220) {
        pdf.addPage();
        this.addPageNumber(pdf, pageWidth, pageHeight, theme);
        y = 40;
      }

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(darkR, darkG, darkB);
      pdf.text("VISION", 30, y);
      y += 10;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(mediumR, mediumG, mediumB);
      const visionLines = pdf.splitTextToSize(
        brand.vision_statement,
        pageWidth - 60
      );
      pdf.text(visionLines, 30, y);
      y += visionLines.length * 5 + 20;
    }

    // Core Values with dynamic colors
    if (brand.core_values && brand.core_values.length > 0) {
      if (y > 220) {
        pdf.addPage();
        this.addPageNumber(pdf, pageWidth, pageHeight, theme);
        y = 40;
      }

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(darkR, darkG, darkB);
      pdf.text("CORE VALUES", 30, y);
      y += 15;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(mediumR, mediumG, mediumB);

      brand.core_values.forEach((value) => {
        if (y > pageHeight - 30) {
          pdf.addPage();
          this.addPageNumber(pdf, pageWidth, pageHeight, theme);
          y = 40;
        }
        pdf.text(`• ${value}`, 35, y);
        y += 8;
      });
    }
  }

  // LOGO SECTION - Updated to use dynamic theme with proper RGB destructuring
  private static async addLogoSection(
    pdf: jsPDF,
    brand: BrandIdentity,
    primaryLogo: string,
    logoVariations: any,
    pageWidth: number,
    pageHeight: number,
    theme: any
  ) {
    pdf.addPage();
    this.addPageNumber(pdf, pageWidth, pageHeight, theme);

    let y = 40;

    this.addSectionHeader(pdf, "LOGO", pageWidth, theme);
    y += 30;

    // Get RGB values properly
    const [mediumR, mediumG, mediumB] = this.getRGB(theme.colors, "medium");
    const [darkR, darkG, darkB] = this.getRGB(theme.colors, "dark");
    const [whiteR, whiteG, whiteB] = this.getRGB(theme.colors, "white");
    const [lightR, lightG, lightB] = this.getRGB(theme.colors, "light");
    const [accentR, accentG, accentB] = this.getRGB(theme.colors, "accent");

    // Logo description with dynamic medium color
    const logoDesc =
      brand.logo_direction?.concept ||
      `The ${brand.business_name} logo represents our brand identity and values. It serves as the primary visual anchor for all brand communications.`;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(mediumR, mediumG, mediumB);
    const logoDescLines = pdf.splitTextToSize(logoDesc, pageWidth - 60);
    pdf.text(logoDescLines, 30, y);
    y += logoDescLines.length * 5 + 25;

    // Primary Logo Display with dynamic background
    if (primaryLogo) {
      // Background with dynamic white color
      pdf.setFillColor(whiteR, whiteG, whiteB);
      pdf.rect(30, y, pageWidth - 60, 80, "F");
      pdf.setDrawColor(lightR, lightG, lightB);
      pdf.setLineWidth(0.3);
      pdf.rect(30, y, pageWidth - 60, 80);

      try {
        const logoImg = await this.loadImage(primaryLogo);
        const logoSize = 60;
        pdf.addImage(
          logoImg as any,
          "PNG",
          (pageWidth - logoSize) / 2,
          y + 10,
          logoSize,
          logoSize
        );
      } catch (error) {
        pdf.setTextColor(lightR, lightG, lightB);
        pdf.text("Primary Logo", pageWidth / 2, y + 40, { align: "center" });
      }

      y += 95;
    }

    // Logo Variations if available
    if (logoVariations && Object.keys(logoVariations).length > 0) {
      if (y > pageHeight - 100) {
        pdf.addPage();
        this.addPageNumber(pdf, pageWidth, pageHeight, theme);
        y = 40;
      }

      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(darkR, darkG, darkB);
      pdf.text("LOGO VARIATIONS", 30, y);
      y += 25;

      const variations = Object.entries(logoVariations);
      for (let i = 0; i < Math.min(variations.length, 4); i++) {
        const [name, variation] = variations[i] as [string, any];

        if (y > pageHeight - 80) {
          pdf.addPage();
          this.addPageNumber(pdf, pageWidth, pageHeight, theme);
          y = 40;
        }

        pdf.setFontSize(11);
        pdf.setTextColor(mediumR, mediumG, mediumB);
        pdf.text(name.toUpperCase(), 30, y);

        if (variation.logo_png) {
          try {
            const variationImg = await this.loadImage(variation.logo_png);
            const imgSize = 40;
            pdf.addImage(variationImg, "PNG", 30, y + 5, imgSize, imgSize);
          } catch (error) {
            // Skip if image fails to load
          }
        }

        y += 60;
      }
    }

    // Logo Guidelines with dynamic theme
    pdf.addPage();
    this.addPageNumber(pdf, pageWidth, pageHeight, theme);
    y = 40;

    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(darkR, darkG, darkB);
    pdf.text("LOGO GUIDELINES &", 30, y);
    pdf.text("CLEAR SPACE", 30, y + 10);
    y += 30;

    // Guidelines list with dynamic medium color
    const guidelines = [
      "The logo should be given a place of prominence on a page",
      "The logo should not appear more than once on a single page or screen",
      "Always maintain the required clear space around the logo",
      "The solid white or black versions should be used only where the full color logo is not an option",
    ];

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(mediumR, mediumG, mediumB);
    guidelines.forEach((guideline, index) => {
      pdf.text(`• ${guideline}`, 35, y + index * 8);
    });
    y += guidelines.length * 8 + 20;

    // Don'ts section with dynamic accent color for "DON'T"
    pdf.addPage();
    this.addPageNumber(pdf, pageWidth, pageHeight, theme);
    y = 40;

    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(accentR, accentG, accentB);
    pdf.text("DON'T", 30, y);
    y += 20;

    const donts = [
      "Don't distort the logo",
      "Don't add stroke or change the original solid one",
      "Don't add any shadow",
      "Don't set the logo against a background that lacks contrast",
      "Don't change the letter spacing and positions",
      "Don't use gradients or colors that are not aligned to the brand",
    ];

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(mediumR, mediumG, mediumB);
    donts.forEach((dont, index) => {
      pdf.text(`• ${dont}`, 35, y + index * 10);
    });
  }

  // TYPOGRAPHY - Updated to use actual brand typography with proper RGB destructuring
  private static addTypographySection(
    pdf: jsPDF,
    brand: BrandIdentity,
    pageWidth: number,
    pageHeight: number,
    theme: any
  ) {
    pdf.addPage();
    this.addPageNumber(pdf, pageWidth, pageHeight, theme);

    let y = 40;

    this.addSectionHeader(pdf, "TYPOGRAPHY", pageWidth, theme);
    y += 30;

    // Get RGB values properly
    const [darkR, darkG, darkB] = this.getRGB(theme.colors, "dark");
    const [mediumR, mediumG, mediumB] = this.getRGB(theme.colors, "medium");

    // Use actual brand typography with fallbacks
    const typography = brand.typography || {
      primary: {
        name: "Inter",
        usage: "Primary brand font",
        characteristics: "Modern and clean",
      },
      secondary: {
        name: "Helvetica",
        usage: "Secondary font",
        characteristics: "Classic and readable",
      },
      accent: {
        name: "Courier",
        usage: "Accent font",
        characteristics: "Technical and monospaced",
      },
    };

    // Primary Font Display
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(darkR, darkG, darkB);
    pdf.text("PRIMARY FONT", 30, y);
    y += 10;

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(mediumR, mediumG, mediumB);
    const primaryUsage =
      typeof typography.primary === "object"
        ? typography.primary.usage
        : "Used for headlines and major branding elements";
    pdf.text(
      primaryUsage || "Used for headlines and major branding elements",
      30,
      y
    );
    y += 15;

    // Font showcase with larger size
    pdf.setFontSize(32);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(darkR, darkG, darkB);
    const primaryName =
      typeof typography.primary === "object"
        ? typography.primary.name
        : "Inter";
    pdf.text((primaryName || "Aa").substring(0, 10), 30, y);
    y += 15;

    pdf.setFontSize(18);
    pdf.text("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 30, y);
    y += 10;
    pdf.text("abcdefghijklmnopqrstuvwxyz", 30, y);
    y += 10;
    pdf.text("1234567890", 30, y);

    // Show font characteristics if available
    if (
      typeof typography.primary === "object" &&
      typography.primary.characteristics
    ) {
      y += 15;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(mediumR, mediumG, mediumB);
      pdf.text(`Characteristics: ${typography.primary.characteristics}`, 30, y);
    }

    y += 30;

    // Secondary Font
    if (typeof typography.secondary === "object" && typography.secondary.name) {
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(darkR, darkG, darkB);
      pdf.text("SECONDARY FONT", 30, y);
      y += 10;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(mediumR, mediumG, mediumB);
      pdf.text(
        typography.secondary.usage ||
          "Used for body text and supporting content",
        30,
        y
      );
      y += 15;

      pdf.setFontSize(24);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(darkR, darkG, darkB);
      pdf.text(typography.secondary.name.substring(0, 10) || "Aa", 30, y);
      y += 12;

      pdf.setFontSize(14);
      pdf.text("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 30, y);
      y += 8;
      pdf.text("abcdefghijklmnopqrstuvwxyz", 30, y);
      y += 8;
      pdf.text("1234567890", 30, y);
    }
  }

  // COLOR PALETTE - Updated to use dynamic theme with proper RGB destructuring
  private static addColorPalette(
    pdf: jsPDF,
    brand: BrandIdentity,
    pageWidth: number,
    pageHeight: number,
    theme: any
  ) {
    pdf.addPage();
    this.addPageNumber(pdf, pageWidth, pageHeight, theme);

    let y = 40;

    this.addSectionHeader(pdf, "COLOUR PALETTE", pageWidth, theme);
    y += 30;

    // Get RGB values properly
    const [darkR, darkG, darkB] = this.getRGB(theme.colors, "dark");
    const [mediumR, mediumG, mediumB] = this.getRGB(theme.colors, "medium");
    const [lightR, lightG, lightB] = this.getRGB(theme.colors, "light");

    const colorPalette = brand.color_palette || [
      {
        name: "Primary",
        hex: "#3B82F6",
        usage: "Main brand color for primary elements",
      },
      {
        name: "Secondary",
        hex: "#1E40AF",
        usage: "Supporting elements and backgrounds",
      },
      {
        name: "Accent",
        hex: "#10B981",
        usage: "Highlights and call-to-action elements",
      },
    ];

    // Palette description with dynamic medium color
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(mediumR, mediumG, mediumB);
    const paletteDesc =
      "Our color palette reflects the brand personality and creates a cohesive visual identity across all touchpoints.";
    const descLines = pdf.splitTextToSize(paletteDesc, pageWidth - 60);
    pdf.text(descLines, 30, y);
    y += descLines.length * 5 + 25;

    // Color swatches with proper RGB values
    colorPalette.forEach((color, index) => {
      if (y > 220) {
        pdf.addPage();
        this.addPageNumber(pdf, pageWidth, pageHeight, theme);
        y = 40;
      }

      const rgb = color.rgb
        ? color.rgb.split(",").map((c: string) => parseInt(c.trim()))
        : this.hexToRgb(color.hex);
      const swatchSize = 40;

      // Color swatch
      pdf.setFillColor(rgb[0], rgb[1], rgb[2]);
      pdf.rect(30, y, swatchSize, swatchSize, "F");
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.3);
      pdf.rect(30, y, swatchSize, swatchSize);

      // Color info
      const infoX = 30 + swatchSize + 15;

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(darkR, darkG, darkB);
      pdf.text(color.name.toUpperCase(), infoX, y + 10);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(mediumR, mediumG, mediumB);
      pdf.text(`HEX ${color.hex}`, infoX, y + 18);

      const rgbText = `RGB ${rgb[0]} ${rgb[1]} ${rgb[2]}`;
      pdf.text(rgbText, infoX, y + 25);

      // Usage
      pdf.setFontSize(9);
      const usageLines = pdf.splitTextToSize(
        color.usage,
        pageWidth - infoX - 30
      );
      pdf.text(usageLines, infoX, y + 33);

      y += swatchSize + 25;
    });
  }

  // BRAND APPLICATIONS - Updated to use dynamic theme with proper RGB destructuring
  private static async addBrandApplications(
    pdf: jsPDF,
    mockups: string[],
    pageWidth: number,
    pageHeight: number,
    theme: any
  ) {
    pdf.addPage();
    this.addPageNumber(pdf, pageWidth, pageHeight, theme);

    let y = 40;

    this.addSectionHeader(pdf, "BRAND APPLICATIONS", pageWidth, theme);
    y += 30;

    // Get RGB values properly
    const [mediumR, mediumG, mediumB] = this.getRGB(theme.colors, "medium");
    const [lightR, lightG, lightB] = this.getRGB(theme.colors, "light");
    const [bgR, bgG, bgB] = this.getRGB(theme.colors, "background");

    if (mockups.length === 0) {
      pdf.setFontSize(11);
      pdf.setTextColor(lightR, lightG, lightB);
      pdf.text(
        "Generate mockups to see brand applications",
        pageWidth / 2,
        y + 50,
        { align: "center" }
      );
      return;
    }

    // Display mockups
    const imgWidth = 70;
    const imgHeight = 70;
    const spacing = 15;

    const mockupLabels = [
      "Business Card",
      "T-Shirt",
      "Website",
      "Mobile App",
      "Packaging",
      "Stationery",
    ];

    for (let i = 0; i < mockups.length; i++) {
      if (y > pageHeight - 100) {
        pdf.addPage();
        this.addPageNumber(pdf, pageWidth, pageHeight, theme);
        y = 40;
      }

      const col = i % 2;
      const x = 30 + col * (imgWidth + spacing);

      try {
        const mockupImg = await this.loadImage(mockups[i]);
        pdf.addImage(mockupImg, "PNG", x, y, imgWidth, imgHeight);

        // Mockup label with dynamic medium color
        pdf.setFontSize(9);
        pdf.setTextColor(mediumR, mediumG, mediumB);
        pdf.text(
          mockupLabels[i] || `Application ${i + 1}`,
          x + imgWidth / 2,
          y + imgHeight + 8,
          { align: "center" }
        );
      } catch (error) {
        pdf.setFillColor(bgR, bgG, bgB);
        pdf.rect(x, y, imgWidth, imgHeight, "F");
      }

      if (col === 1 || i === mockups.length - 1) {
        y += imgHeight + spacing + 15;
      }
    }
  }

  // HELPER METHODS - Updated to use dynamic theme with proper RGB destructuring
  private static addSectionHeader(
    pdf: jsPDF,
    title: string,
    pageWidth: number,
    theme: any
  ) {
    // Get RGB values properly
    const [darkR, darkG, darkB] = this.getRGB(theme.colors, "dark");
    const [primaryR, primaryG, primaryB] = this.getRGB(theme.colors, "primary");

    pdf.setFontSize(36);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(darkR, darkG, darkB);
    pdf.text(title, 30, 40);

    // Accent line with dynamic primary color
    pdf.setDrawColor(primaryR, primaryG, primaryB);
    pdf.setLineWidth(2);
    pdf.line(30, 48, 80, 48);
  }

  private static addPageNumber(
    pdf: jsPDF,
    pageWidth: number,
    pageHeight: number,
    theme: any
  ) {
    // Get RGB values properly
    const [lightR, lightG, lightB] = this.getRGB(theme.colors, "light");

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(lightR, lightG, lightB);
    pdf.text(
      `${this.pageNumber.toString().padStart(2, "0")}`,
      pageWidth - 30,
      pageHeight - 15,
      { align: "right" }
    );
    this.pageNumber++;
  }

  private static async loadImage(src: string): Promise<HTMLImageElement> {
    try {
      // Handle base64 data URLs
      if (src.startsWith("data:image")) {
        const img = await canvasLoadImage(src);
        return img as unknown as HTMLImageElement;
      }

      // Handle URLs (if needed)
      const img = await canvasLoadImage(src);
      return img as unknown as HTMLImageElement;
    } catch (error) {
      console.error("Failed to load image:", error);
      throw error;
    }
  }

  private static hexToRgb(hex: string): [number, number, number] {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
  }
}
