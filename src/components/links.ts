// Link type.
export interface Link {
  icon: string;
  path: string;
  title: string;
}

// List of header and footer links.
export const links: Link[] = [
  {
    icon: 'fa-solid fa-envelope',
    path: 'mailto://webmasterslava@gmail.com',
    title: 'Send me an Email.',
  },
  {
    icon: 'fa-brands fa-github',
    path: 'https://github.com/webmasterslava?tab=repositories',
    title: 'Follow me on Github.',
  },
  {
    icon: 'fa-brands fa-linkedin',
    path: 'https://linkedin.com/in/webmasterslava',
    title: 'Follow me on Linkedin.',
  },
  {
    icon: 'fa-brands fa-telegram',
    path: 'https://t.me/webmasterslava',
    title: 'Write me in Telegram.',
  },
];
