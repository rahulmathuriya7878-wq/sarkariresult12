export interface AdBannerItem {
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl?: string;
  linkUrl: string;
  buttonText: string;
  sponsorName?: string;
}

export interface AdsConfig {
  enabled: boolean;
  adDisplayType: 'ad_space' | 'sponsored' | 'adsense'; // Type of ad presentation
  adContactUrl: string; // Contact link for advertisers
  adSensePublisherId: string; // e.g. "ca-pub-1234567890123456"
  adSenseSlots: {
    leaderboard: string;
    inContent: string;
    sidebar: string;
    footer: string;
  };
  customHtmlCode?: string; // Optional raw 3rd-party ad code
  placements: {
    homeLeaderboard: boolean;
    homeMidGrid: boolean;
    postTop: boolean;
    postMidLinks: boolean;
    postBottom: boolean;
  };
  customBanners: {
    homeTop: AdBannerItem;
    homeMid: AdBannerItem;
    postTop: AdBannerItem;
    postMid: AdBannerItem;
    postBottom: AdBannerItem;
  };
}

export const DEFAULT_ADS_CONFIG: AdsConfig = {
  enabled: true,
  adDisplayType: 'ad_space', // Set to ad_space by default per user request
  adContactUrl: 'https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j',
  adSensePublisherId: '',
  adSenseSlots: {
    leaderboard: '',
    inContent: '',
    sidebar: '',
    footer: ''
  },
  customHtmlCode: '',
  placements: {
    homeLeaderboard: false,
    homeMidGrid: true,
    postTop: true,
    postMidLinks: true,
    postBottom: true
  },
  customBanners: {
    homeTop: {
      title: '📢 विज्ञापन स्थान उपलब्ध (Standard 728×90 / 320×50 Ad Space)',
      subtitle: 'Reserve this premium header banner space on Sarkari Result. Reach millions of active government job aspirants.',
      badge: 'AD SPACE',
      linkUrl: 'https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j',
      buttonText: 'Book This Ad Space',
      sponsorName: ''
    },
    homeMid: {
      title: '📢 विज्ञापन स्थान उपलब्ध (Standard In-Feed Ad Space)',
      subtitle: 'Premium middle banner slot between results and job updates. Instant placement available.',
      badge: 'AD SPACE',
      linkUrl: 'https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j',
      buttonText: 'Book This Ad Space',
      sponsorName: ''
    },
    postTop: {
      title: '📢 विज्ञापन स्थान उपलब्ध (Post Header Ad Space)',
      subtitle: 'High-visibility placement right under post details table on every exam notification page.',
      badge: 'AD SPACE',
      linkUrl: 'https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j',
      buttonText: 'Book This Ad Space',
      sponsorName: ''
    },
    postMid: {
      title: '📢 विज्ञापन स्थान उपलब्ध (Above Important Links)',
      subtitle: 'Prime engagement zone directly above official notification and apply online buttons.',
      badge: 'AD SPACE',
      linkUrl: 'https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j',
      buttonText: 'Book This Ad Space',
      sponsorName: ''
    },
    postBottom: {
      title: '📢 विज्ञापन स्थान उपलब्ध (Footer Legal & Tools Ad Space)',
      subtitle: 'Consistent bottom ad placement across all posts and statutory policy pages.',
      badge: 'AD SPACE',
      linkUrl: 'https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j',
      buttonText: 'Book This Ad Space',
      sponsorName: ''
    }
  }
};

const ADS_STORAGE_KEY = 'sarkari_ads_config_v2';

export const getAdsConfig = (): AdsConfig => {
  if (typeof window === 'undefined') return DEFAULT_ADS_CONFIG;
  try {
    const raw = localStorage.getItem(ADS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_ADS_CONFIG,
        ...parsed,
        adDisplayType: parsed.adDisplayType || 'ad_space',
        adContactUrl: parsed.adContactUrl || DEFAULT_ADS_CONFIG.adContactUrl,
        placements: { ...DEFAULT_ADS_CONFIG.placements, ...(parsed.placements || {}) },
        customBanners: { ...DEFAULT_ADS_CONFIG.customBanners, ...(parsed.customBanners || {}) }
      };
    }
  } catch (err) {
    console.error('Failed to parse ads config', err);
  }
  return DEFAULT_ADS_CONFIG;
};

export const saveAdsConfig = (config: AdsConfig): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('sarkari_ads_updated', { detail: config }));
  } catch (err) {
    console.error('Failed to save ads config', err);
  }
};
