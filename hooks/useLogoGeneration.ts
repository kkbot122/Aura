import { useState } from 'react';

interface BrandIdentity {
  business_name: string;
  style: string;
  tagline: string;
  brand_description: string;
  color_palette: string[];
  design_style: string;
  target_audience: string;
  brand_values: string[];
  typography_suggestions: string[];
  logo_direction: string;
}

interface GenerationState {
  brand: BrandIdentity | null;
  logoPng: string | null;
  projectId: string | null;
  status: 'idle' | 'generating_brand' | 'generating_logo' | 'complete' | 'error';
  error: string | null;
}

export function useLogoGeneration() {
  const [state, setState] = useState<GenerationState>({
    brand: null,
    logoPng: null,
    projectId: null,
    status: 'idle',
    error: null
  });

  const generateLogo = async (businessName: string, style: string, industry: string, userId?: string) => {
    setState(prev => ({ ...prev, status: 'generating_brand', error: null }));

    try {
      // Step 1: Generate Brand Identity
      console.log('Step 1: Generating brand identity...');
      const brandResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, style, industry, userId }),
      });

      if (!brandResponse.ok) {
        const errorText = await brandResponse.text();
        throw new Error(`Brand generation failed: ${errorText}`);
      }
      
      const brandResult = await brandResponse.json();
      console.log('Brand generation successful:', brandResult);

      setState(prev => ({ 
        ...prev, 
        brand: brandResult.data,
        projectId: brandResult.data.project_id || null,
        status: 'generating_logo' 
      }));

      // Step 2: Generate Logo Image
      console.log('Step 2: Generating logo...');
      const logoResponse = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          brandData: brandResult.data,
          projectId: brandResult.data.project_id 
        }),
      });

      if (!logoResponse.ok) {
        const errorData = await logoResponse.json();
        throw new Error(errorData.error || 'Logo generation failed');
      }
      
      const logoResult = await logoResponse.json();
      console.log('Logo generation result:', logoResult);

      if (!logoResult.data || !logoResult.data.logo_png) {
        throw new Error('No logo image received');
      }

      setState(prev => ({ 
        ...prev, 
        logoPng: logoResult.data.logo_png,
        status: 'complete' 
      }));

    } catch (error) {
      console.error('Generation pipeline error:', error);
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Generation failed'
      }));
    }
  };

  const reset = () => {
    setState({
      brand: null,
      logoPng: null,
      projectId: null,
      status: 'idle',
      error: null
    });
  };

  return {
    ...state,
    generateLogo,
    reset,
    loading: state.status !== 'idle' && state.status !== 'complete' && state.status !== 'error'
  };
}