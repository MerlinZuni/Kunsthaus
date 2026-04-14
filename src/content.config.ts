import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

// Reusable i18n text schema -- per D-12: DE+EN active, FR placeholder
const localizedText = z.object({
  de: z.string(),
  en: z.string(),
  fr: z.string().optional(),
});

// Hero carousel slide sub-schema -- per D-01 through D-04
const heroSlide = z.object({
  id: z.string(),
  title: localizedText,
  subtitle: localizedText.optional(),
  cta: z.object({
    label: localizedText,
    href: z.string(),
  }),
  images: z.array(z.object({
    src: z.string(),
    alt: localizedText,
    gridCol: z.string(),
    gridRow: z.string(),
  })),
});

// Planning homepage sections -- per D-13 priority hierarchy
const planningHomepage = defineCollection({
  loader: file("src/content/planning/homepage.json"),
  schema: z.object({
    id: z.string(),
    section: z.enum(["hero", "key-info", "exhibitions", "offerings", "events", "planning-details", "education"]),
    priority: z.number().int().min(1).max(10),
    title: localizedText,
    subtitle: localizedText.optional(),
    body: localizedText.optional(),
    image: z.string().optional(),
    slides: z.array(heroSlide).optional(),
    items: z.array(z.object({
      id: z.string(),
      title: localizedText,
      description: localizedText.optional(),
      image: z.string().optional(),
      date: z.string().optional(),
      link: z.string().optional(),
    })).optional(),
  }),
});

// On-site exhibition content -- per Phase 03-03 (rewrites Phase-1 stub schema)
const onsiteExhibition = defineCollection({
  loader: file("src/content/onsite/kerry-james-marshall.json"),
  schema: z.object({
    id: z.string(),
    title: localizedText,
    dateLabel: localizedText,
    heroVideo: z.object({
      src: z.string(),
      poster: z.string(),
    }),
    cinematicReveal: z.object({
      tagline: localizedText,
      cardTitle: localizedText,
      description: localizedText,
      image: z.string(),
      imagePosition: z.enum(['left', 'center', 'right']).optional(),
    }),
    intro: z.object({
      heading: localizedText,
      body: localizedText,
    }),
    artworks: z.array(z.object({
      id: z.string(),
      number: z.number().int(),
      title: localizedText,
      year: z.string(),
      collection: z.string(),
      credit: z.string().optional(),
      image: z.string(),
      description: localizedText,
      audioSrc: z.string(),
    })),
    artistQuote: z.object({
      quote: localizedText,
      attribution: z.string(),
    }),
    videos: z.array(z.object({
      id: z.string(),
      thumbnail: z.string(),
      duration: z.string(),
      quote: localizedText,
      role: z.enum(['artist', 'audience', 'curator']),
    })),
    shop: z.array(z.object({
      id: z.string(),
      image: z.string(),
      title: localizedText,
      price: z.string(),
      addToCartLabel: localizedText,
    })),
  }),
});

// Shared UI strings -- navigation, common labels
const shared = defineCollection({
  loader: file("src/content/shared/navigation.json"),
  schema: z.object({
    id: z.string(),
    label: localizedText,
    href: z.string().optional(),
    icon: z.string().optional(),
  }),
});

// Footer content -- per D-35 through D-39
const footerCollection = defineCollection({
  loader: file("src/content/shared/footer.json"),
  schema: z.object({
    id: z.string(),
    address: z.object({
      street: z.string(),
      zip: z.string(),
      city: localizedText,
      mapsUrl: z.string(),
      email: z.string(),
      phone: z.string(),
    }),
    schedule: z.array(z.object({
      day: localizedText,
      hours: localizedText,
      closed: z.boolean(),
    })),
    openStatus: localizedText,
    quickLinks: z.array(z.object({
      id: z.string(),
      label: localizedText,
      href: z.string(),
    })),
    media: z.array(z.object({
      id: z.string(),
      label: localizedText,
      href: z.string(),
    })),
    newsletter: z.object({
      description: localizedText,
      linkLabel: localizedText,
      href: z.string(),
    }),
    social: z.array(z.object({
      id: z.string(),
      platform: z.string(),
      url: z.string(),
      // icon dropped from data file (text-only social links per Phase 02 footer redesign);
      // schema kept tolerant so the collection validates.
      icon: z.string().optional(),
    })),
    legal: z.array(z.object({
      id: z.string(),
      label: localizedText,
      href: z.string(),
    })),
    copyright: localizedText,
  }),
});

// UI string labels -- per D-22, D-41, D-44
const uiStrings = defineCollection({
  loader: file("src/content/shared/ui-strings.json"),
  schema: z.object({
    id: z.string(),
    key: z.string(),
    value: localizedText,
  }),
});

// Onsite landing page content -- per Phase 03-02
const onsiteHome = defineCollection({
  loader: file("src/content/onsite/home.json"),
  schema: z.object({
    id: z.string(),
    hero: z.object({ title: localizedText }),
    cinematicReveal: z.object({
      tagline: localizedText,
      cardTitle: localizedText,
      description: localizedText,
      image: z.string(),
    }).optional(),
    buildings: z.array(z.object({ id: z.string(), name: localizedText })),
    specialExhibitionsLabel: localizedText,
    visitorEssentialsLabel: localizedText,
    visitorEssentials: z.object({
      gettingAround: z.object({
        title: localizedText,
        description: localizedText,
        linkLabel: localizedText,
        linkHref: z.string(),
      }),
      todaysEvents: z.object({
        title: localizedText,
        description: localizedText,
      }),
      wifi: z.object({
        title: localizedText,
        description: localizedText,
        networkName: z.string(),
      }),
      venueCards: z.record(
        z.string(),
        z.object({
          title: localizedText,
          description: localizedText,
        })
      ),
      accessibility: z.object({
        title: localizedText,
        description: localizedText,
        placeholder: localizedText,
      }),
    }),
    faq: z.array(z.object({
      id: z.string(),
      question: localizedText,
      answer: localizedText,
    })),
  }),
});

export const collections = {
  planning: planningHomepage,
  onsite: onsiteExhibition,
  onsiteHome,
  shared,
  footer: footerCollection,
  uiStrings,
};
