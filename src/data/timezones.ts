export interface TimezoneEntry {
  id: string; // IANA timezone ID
  label: string; // Friendly name
  flag: string; // Flag emoji
  aliases: string[]; // Search aliases
}

export const TIMEZONE_LIST: TimezoneEntry[] = [
  // Americas
  { id: "Pacific/Honolulu", label: "Hawaii", flag: "🇺🇸", aliases: ["HST", "Honolulu"] },
  { id: "America/Anchorage", label: "Alaska", flag: "🇺🇸", aliases: ["AKST", "AKDT", "Anchorage"] },
  { id: "America/Los_Angeles", label: "Pacific", flag: "🇺🇸", aliases: ["PST", "PDT", "LA", "Los Angeles", "San Francisco", "Seattle", "West Coast"] },
  { id: "America/Denver", label: "Mountain", flag: "🇺🇸", aliases: ["MST", "MDT", "Denver", "Phoenix"] },
  { id: "America/Chicago", label: "Central", flag: "🇺🇸", aliases: ["CST", "CDT", "Chicago", "Dallas", "Houston"] },
  { id: "America/New_York", label: "Eastern", flag: "🇺🇸", aliases: ["EST", "EDT", "New York", "NYC", "Boston", "Miami", "East Coast"] },
  { id: "America/Halifax", label: "Atlantic", flag: "🇨🇦", aliases: ["AST", "ADT", "Halifax", "Nova Scotia"] },
  { id: "America/St_Johns", label: "Newfoundland", flag: "🇨🇦", aliases: ["NST", "NDT", "St Johns"] },
  { id: "America/Sao_Paulo", label: "São Paulo", flag: "🇧🇷", aliases: ["BRT", "Brazil", "Rio"] },
  { id: "America/Argentina/Buenos_Aires", label: "Buenos Aires", flag: "🇦🇷", aliases: ["ART", "Argentina"] },
  { id: "America/Mexico_City", label: "Mexico City", flag: "🇲🇽", aliases: ["Mexico"] },
  { id: "America/Bogota", label: "Bogotá", flag: "🇨🇴", aliases: ["Colombia", "COT"] },
  { id: "America/Lima", label: "Lima", flag: "🇵🇪", aliases: ["Peru", "PET"] },
  { id: "America/Toronto", label: "Toronto", flag: "🇨🇦", aliases: ["Canada Eastern"] },
  { id: "America/Vancouver", label: "Vancouver", flag: "🇨🇦", aliases: ["Canada Pacific"] },

  // Europe
  { id: "Europe/London", label: "London", flag: "🇬🇧", aliases: ["GMT", "BST", "UK", "Britain", "England"] },
  { id: "Europe/Paris", label: "Paris", flag: "🇫🇷", aliases: ["CET", "CEST", "France"] },
  { id: "Europe/Berlin", label: "Berlin", flag: "🇩🇪", aliases: ["Germany"] },
  { id: "Europe/Amsterdam", label: "Amsterdam", flag: "🇳🇱", aliases: ["Netherlands"] },
  { id: "Europe/Madrid", label: "Madrid", flag: "🇪🇸", aliases: ["Spain"] },
  { id: "Europe/Rome", label: "Rome", flag: "🇮🇹", aliases: ["Italy"] },
  { id: "Europe/Zurich", label: "Zurich", flag: "🇨🇭", aliases: ["Switzerland"] },
  { id: "Europe/Stockholm", label: "Stockholm", flag: "🇸🇪", aliases: ["Sweden"] },
  { id: "Europe/Moscow", label: "Moscow", flag: "🇷🇺", aliases: ["MSK", "Russia"] },
  { id: "Europe/Istanbul", label: "Istanbul", flag: "🇹🇷", aliases: ["Turkey", "TRT"] },
  { id: "Europe/Athens", label: "Athens", flag: "🇬🇷", aliases: ["Greece", "EET", "EEST"] },
  { id: "Europe/Warsaw", label: "Warsaw", flag: "🇵🇱", aliases: ["Poland"] },
  { id: "Europe/Lisbon", label: "Lisbon", flag: "🇵🇹", aliases: ["Portugal", "WET"] },

  // Middle East & Africa
  { id: "Asia/Dubai", label: "Dubai", flag: "🇦🇪", aliases: ["GST", "UAE", "Abu Dhabi", "Gulf"] },
  { id: "Asia/Riyadh", label: "Riyadh", flag: "🇸🇦", aliases: ["Saudi Arabia", "AST"] },
  { id: "Asia/Jerusalem", label: "Jerusalem", flag: "🇮🇱", aliases: ["Israel", "IST", "Tel Aviv"] },
  { id: "Asia/Bahrain", label: "Bahrain", flag: "🇧🇭", aliases: ["Manama"] },
  { id: "Africa/Cairo", label: "Cairo", flag: "🇪🇬", aliases: ["Egypt", "EET"] },
  { id: "Africa/Lagos", label: "Lagos", flag: "🇳🇬", aliases: ["Nigeria", "WAT"] },
  { id: "Africa/Johannesburg", label: "Johannesburg", flag: "🇿🇦", aliases: ["South Africa", "SAST"] },
  { id: "Africa/Nairobi", label: "Nairobi", flag: "🇰🇪", aliases: ["Kenya", "EAT"] },

  // Asia & Pacific
  { id: "Asia/Kolkata", label: "Mumbai", flag: "🇮🇳", aliases: ["IST", "India", "Delhi", "Bangalore", "Chennai", "Calcutta"] },
  { id: "Asia/Karachi", label: "Karachi", flag: "🇵🇰", aliases: ["Pakistan", "PKT"] },
  { id: "Asia/Dhaka", label: "Dhaka", flag: "🇧🇩", aliases: ["Bangladesh", "BST"] },
  { id: "Asia/Bangkok", label: "Bangkok", flag: "🇹🇭", aliases: ["Thailand", "ICT"] },
  { id: "Asia/Singapore", label: "Singapore", flag: "🇸🇬", aliases: ["SGT"] },
  { id: "Asia/Hong_Kong", label: "Hong Kong", flag: "🇭🇰", aliases: ["HKT"] },
  { id: "Asia/Shanghai", label: "Shanghai", flag: "🇨🇳", aliases: ["China", "CST", "Beijing", "Shenzhen"] },
  { id: "Asia/Taipei", label: "Taipei", flag: "🇹🇼", aliases: ["Taiwan"] },
  { id: "Asia/Seoul", label: "Seoul", flag: "🇰🇷", aliases: ["Korea", "KST"] },
  { id: "Asia/Tokyo", label: "Tokyo", flag: "🇯🇵", aliases: ["Japan", "JST"] },
  { id: "Australia/Sydney", label: "Sydney", flag: "🇦🇺", aliases: ["AEST", "AEDT", "Australia"] },
  { id: "Australia/Melbourne", label: "Melbourne", flag: "🇦🇺", aliases: ["Victoria"] },
  { id: "Australia/Perth", label: "Perth", flag: "🇦🇺", aliases: ["AWST", "Western Australia"] },
  { id: "Pacific/Auckland", label: "Auckland", flag: "🇳🇿", aliases: ["NZST", "NZDT", "New Zealand"] },
  { id: "Pacific/Fiji", label: "Fiji", flag: "🇫🇯", aliases: ["FJT"] },
];

export const DEFAULT_ZONES = [
  { id: "America/Los_Angeles", label: "Pacific" },
  { id: "America/New_York", label: "Eastern" },
  { id: "Europe/London", label: "London" },
  { id: "Asia/Dubai", label: "Dubai" },
  { id: "Asia/Kolkata", label: "Mumbai" },
  { id: "Asia/Singapore", label: "Singapore" },
];
