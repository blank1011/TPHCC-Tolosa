export interface EventItem {
  _id?: string;
  title: string;
  description: string;
  location: string;
  category: string;
  dateShort: string;
  facebookLink?: string;
  facebookImage?: string;
  facebookPermalink?: string;
  facebookMessage?: string;
  createdAt?: string;
}

// Note: Events are now fetched from MongoDB via /api/events
// Use the fetchEvents() function in your components to get real-time data
