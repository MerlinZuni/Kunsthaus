import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

// Reusable i18n text schema -- per D-12: DE+EN active, FR placeholder
const localizedText = z.object({
  de: z.string(),
  en: z.string(),
  fr: z.string().optional(),
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

export const collections = {
  planning: planningHomepage,
  onsite: onsiteExhibition,
  shared,
};
