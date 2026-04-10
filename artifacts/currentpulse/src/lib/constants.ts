export const categoryColors: Record<string, string> = {
  polity: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  economy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  environment: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  international_relations: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  science_tech: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};

export const gsMappingColors: Record<string, string> = {
  GS1: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  GS2: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  GS3: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  GS4: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
};

export const examRelevanceColors: Record<string, string> = {
  prelims: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  mains: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  both: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
};

export const formatCategory = (category: string) => {
  return category.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};
