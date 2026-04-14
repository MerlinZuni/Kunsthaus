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

// On-site exhibition content -- per D-15, D-16, D-19
const onsiteExhibition = defineCollection({
  loader: file("src/content/onsite/kerry-james-marshall.json"),
  schema: z.object({
    id: z.string(),
    title: localizedText,
    artist: z.string(),
    dates: z.object({
      start: z.string(),
      end: z.string(),
    }),
    description: localizedText,
    artworks: z.array(z.object({
      id: z.string(),
      title: localizedText,
      description: localizedText,
      image: z.string(),
      room: z.string(),
      year: z.string().optional(),
      medium: localizedText.optional(),
      audioGuide: z.boolean().default(false),
      membersOnly: z.boolean().default(false),
    })),
    practicalInfo: z.object({
      rooms: z.array(z.string()),
      audioGuideAvailable: z.boolean(),
      estimatedDuration: localizedText,
    }).optional(),
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

export const collections = {
  planning: planningHomepage,
  onsite: onsiteExhibition,
  shared,
  footer: footerCollection,
  uiStrings,
};
