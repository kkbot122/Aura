// lib/theme-utils.ts

export interface BrandTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    dark: string;
    light: string;
    background: string;
    white: string;
  };
  typography: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export class ThemeUtils {
  // Convert brand palette to PDF generator colors format
  static brandPaletteToPDFColors(brandPalette: any[]): BrandTheme {
    const defaultColors = {
      primary: "#3b82f6",
      secondary: "#64748b",
      accent: "#10b981",
      dark: "#0f172a",
      light: "#94a3b8",
      background: "#f8fafc",
      white: "#ffffff",
    };

    if (!brandPalette || !Array.isArray(brandPalette)) {
      return {
        colors: defaultColors,
        typography: {
          primary: "Helvetica",
          secondary: "Arial",
          accent: "Courier",
        },
      };
    }

    // Extract colors from brand palette
    const primaryColor = brandPalette.find((c) =>
      c.name.toLowerCase().includes("primary")
    );
    const accentColor = brandPalette.find((c) =>
      c.name.toLowerCase().includes("accent")
    );
    const darkColor = brandPalette.find(
      (c) =>
        c.name.toLowerCase().includes("dark") ||
        c.name.toLowerCase().includes("neutral")
    );
    const lightColor = brandPalette.find(
      (c) =>
        c.name.toLowerCase().includes("light") ||
        c.name.toLowerCase().includes("background")
    );

    return {
      colors: {
        primary: primaryColor ? primaryColor.hex : defaultColors.primary,
        secondary: "#64748b", // Default or extract from palette if available
        accent: accentColor ? accentColor.hex : defaultColors.accent,
        dark: darkColor ? darkColor.hex : defaultColors.dark,
        light: lightColor ? lightColor.hex : defaultColors.light,
        background: defaultColors.background,
        white: defaultColors.white,
      },
      typography: {
        primary: "Helvetica", // PDF default
        secondary: "Arial",
        accent: "Courier",
      },
    };
  }

  // Convert hex to RGB array for jsPDF
  static hexToRgbArray(hex: string): [number, number, number] {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
  }

  // Generate CSS variables from brand theme
  static generateCSSVariables(theme: BrandTheme): string {
    return `
      --color-primary: rgb(${this.hexToRgbArray(theme.colors.primary).join(", ")});
      --color-accent: rgb(${this.hexToRgbArray(theme.colors.accent).join(", ")});
      --color-dark: rgb(${this.hexToRgbArray(theme.colors.dark).join(", ")});
      --color-light: rgb(${this.hexToRgbArray(theme.colors.light).join(", ")});
      --color-background: rgb(${this.hexToRgbArray(theme.colors.background).join(", ")});
    `;
  }

  // Check color contrast for accessibility
  static getContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.hexToRgbArray(color1);
    const rgb2 = this.hexToRgbArray(color2);

    const luminance1 = this.getLuminance(rgb1[0], rgb1[1], rgb1[2]);
    const luminance2 = this.getLuminance(rgb2[0], rgb2[1], rgb2[2]);

    const brightest = Math.max(luminance1, luminance2);
    const darkest = Math.min(luminance1, luminance2);

    return (brightest + 0.05) / (darkest + 0.05);
  }

  private static getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }
}
