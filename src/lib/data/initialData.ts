import {
  SacredExperience,
  ProgrammeDay,
  Testimonial,
  GalleryItem,
  FAQItem,
  SiteSettings,
  RishikeshAttraction,
  WeatherClothingGuide,
} from "@/types";
import dbData from "@/data/db.json";

export const initialSiteSettings: SiteSettings = dbData.settings as SiteSettings;
export const initialExperiences: SacredExperience[] = dbData.experiences as SacredExperience[];
export const initialHealingSessions: SacredExperience[] = dbData.healingSessions as SacredExperience[];
export const initialAttractions: RishikeshAttraction[] = dbData.attractions as RishikeshAttraction[];
export const initialGallery: GalleryItem[] = dbData.gallery as GalleryItem[];
export const initialProgramme: ProgrammeDay[] = dbData.programme as ProgrammeDay[];
export const initialTestimonials: Testimonial[] = dbData.testimonials as Testimonial[];
export const initialFAQs: FAQItem[] = dbData.faqs as FAQItem[];
export const initialWeatherClothing: WeatherClothingGuide = dbData.weatherClothing as WeatherClothingGuide;
