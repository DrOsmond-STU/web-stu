import type { ReactElement, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
};

export const IconCode = (p: IconProps) => (
  <svg {...base} {...p}><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></svg>
);
export const IconNetwork = (p: IconProps) => (
  <svg {...base} {...p}><rect x="9" y="2" width="6" height="6" rx="1.5" /><rect x="2" y="16" width="6" height="6" rx="1.5" /><rect x="16" y="16" width="6" height="6" rx="1.5" /><path d="M12 8v4M5 16v-2h14v2" /></svg>
);
export const IconWrench = (p: IconProps) => (
  <svg {...base} {...p}><path d="M14.7 6.3a4 4 0 0 0 5 5l-9.4 9.4a2.1 2.1 0 0 1-3-3l9.4-9.4a4 4 0 0 0-5-5l3 3-2 2-3-3a4 4 0 0 1 5 1Z" /></svg>
);
export const IconCertificate = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="9" r="6" /><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8M12 6.5l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2L9 8.7l2-.3Z" /></svg>
);
export const IconUsers = (p: IconProps) => (
  <svg {...base} {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
export const IconShield = (p: IconProps) => (
  <svg {...base} {...p}><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const IconSprout = (p: IconProps) => (
  <svg {...base} {...p}><path d="M7 20h10M12 20V9M12 9C12 6 9.5 3.5 6 3.5 6 7 8.5 9 12 9ZM12 12c0-3 2.5-5.5 6-5.5 0 3.5-2.5 5.5-6 5.5Z" /></svg>
);
export const IconAward = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="8" r="6" /><path d="m8.2 13.5-1.7 7.3 5.5-3 5.5 3-1.7-7.3" /></svg>
);
export const IconArrowRight = (p: IconProps) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const IconArrowUpRight = (p: IconProps) => (
  <svg {...base} {...p}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const IconChevronLeft = (p: IconProps) => (
  <svg {...base} {...p}><path d="m15 18-6-6 6-6" /></svg>
);
export const IconChevronRight = (p: IconProps) => (
  <svg {...base} {...p}><path d="m9 18 6-6-6-6" /></svg>
);
export const IconChevronDown = (p: IconProps) => (
  <svg {...base} {...p}><path d="m6 9 6 6 6-6" /></svg>
);
export const IconCheck = (p: IconProps) => (
  <svg {...base} {...p}><path d="m4 12 5.5 5.5L20 7" /></svg>
);
export const IconCheckCircle = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9.5" /><path d="m8 12 2.8 2.8L16 9.5" /></svg>
);
export const IconClose = (p: IconProps) => (
  <svg {...base} {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>
);
export const IconMenu = (p: IconProps) => (
  <svg {...base} {...p}><path d="M3 6h18M3 12h18M3 18h18" /></svg>
);
export const IconMail = (p: IconProps) => (
  <svg {...base} {...p}><rect x="2.5" y="4.5" width="19" height="15" rx="2.5" /><path d="m3 7 9 6 9-6" /></svg>
);
export const IconPhone = (p: IconProps) => (
  <svg {...base} {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" /></svg>
);
export const IconMapPin = (p: IconProps) => (
  <svg {...base} {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);
export const IconClock = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9.5" /><path d="M12 7v5.2l3.2 2" /></svg>
);
export const IconWhatsapp = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.25-4.38c0-4.53 3.69-8.22 8.23-8.22 2.2 0 4.26.86 5.81 2.41a8.16 8.16 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.23 8.23Zm4.51-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.04-.38-1.99-1.22-.73-.65-1.23-1.46-1.37-1.71-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.09-.16.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.42-.14-.01-.31-.01-.47-.01s-.44.06-.67.31c-.23.25-.87.85-.87 2.08s.9 2.41 1.02 2.58c.12.16 1.76 2.69 4.27 3.77.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
  </svg>
);
export const IconLinkedin = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.07-1.9-3.07-1.9 0-2.2 1.46-2.2 2.97V21H9z" /></svg>
);
export const IconInstagram = (p: IconProps) => (
  <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="3.8" /><circle cx="17.2" cy="6.8" r="1" fill="currentColor" /></svg>
);
export const IconFacebook = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" /></svg>
);
export const IconYoutube = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M23 12s0-3.5-.45-5.17a2.9 2.9 0 0 0-2.05-2.06C18.83 4.3 12 4.3 12 4.3s-6.83 0-8.5.47A2.9 2.9 0 0 0 1.45 6.83C1 8.5 1 12 1 12s0 3.5.45 5.17a2.9 2.9 0 0 0 2.05 2.06c1.67.47 8.5.47 8.5.47s6.83 0 8.5-.47a2.9 2.9 0 0 0 2.05-2.06C23 15.5 23 12 23 12ZM9.8 15.3V8.7l5.7 3.3-5.7 3.3Z" /></svg>
);
export const IconGithub = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>
);
export const IconStar = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="m12 2.5 2.95 5.98 6.6.96-4.78 4.65 1.13 6.57L12 17.56l-5.9 3.1 1.13-6.57L2.45 9.44l6.6-.96L12 2.5Z" /></svg>
);
export const IconQuote = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M9.5 5C6.5 5 4 7.6 4 10.8 4 13.7 6.1 16 8.8 16c.4 0 .8 0 1.1-.1-.6 1.7-2.1 3-3.9 3.4-.4.1-.6.5-.5.9.1.4.4.6.8.6 4.2-.5 7.4-4.2 7.4-8.7V10C13.7 7.2 11.9 5 9.5 5Zm10 0C16.5 5 14 7.6 14 10.8c0 2.9 2.1 5.2 4.8 5.2.4 0 .8 0 1.1-.1-.6 1.7-2.1 3-3.9 3.4-.4.1-.6.5-.5.9.1.4.4.6.8.6 4.2-.5 7.4-4.2 7.4-8.7V10C23.7 7.2 21.9 5 19.5 5Z" /></svg>
);
export const IconSearch = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></svg>
);
export const IconCalendar = (p: IconProps) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
);
export const IconTag = (p: IconProps) => (
  <svg {...base} {...p}><path d="M20.6 13.6 12 22l-9-9V4h9l8.6 8.6a1.4 1.4 0 0 1 0 2Z" /><circle cx="7.5" cy="7.5" r="1.4" fill="currentColor" /></svg>
);
export const IconLayers = (p: IconProps) => (
  <svg {...base} {...p}><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 17l9 5 9-5" /></svg>
);
export const IconBuilding = (p: IconProps) => (
  <svg {...base} {...p}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 21v-4h6v4M8 7h2M14 7h2M8 11h2M14 11h2" /></svg>
);
export const IconSparkles = (p: IconProps) => (
  <svg {...base} {...p}><path d="m12 3 1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3ZM19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" /></svg>
);
export const IconTrendingUp = (p: IconProps) => (
  <svg {...base} {...p}><path d="m3 17 6-6 4 4 8-8" /><path d="M15 7h6v6" /></svg>
);
export const IconDocument = (p: IconProps) => (
  <svg {...base} {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></svg>
);
export const IconSend = (p: IconProps) => (
  <svg {...base} {...p}><path d="M21.5 2.5 11 13M21.5 2.5l-6.8 19-3.7-8.5L2.5 9.3l19-6.8Z" /></svg>
);
export const IconExternal = (p: IconProps) => (
  <svg {...base} {...p}><path d="M14 3h7v7M21 3l-9 9" /><path d="M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" /></svg>
);
export const IconLock = (p: IconProps) => (
  <svg {...base} {...p}><rect x="4" y="10" width="16" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
);
export const IconImage = (p: IconProps) => (
  <svg {...base} {...p}><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="8.5" cy="9.5" r="1.8" /><path d="m3.5 17 5-5 4.5 4.5L16 14l4.5 4.5" /></svg>
);
export const IconPlus = (p: IconProps) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const IconTrash = (p: IconProps) => (
  <svg {...base} {...p}><path d="M4 7h16M10 11v6M14 11v6" /><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13M9 7V4h6v3" /></svg>
);
export const IconEdit = (p: IconProps) => (
  <svg {...base} {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" /></svg>
);
export const IconEye = (p: IconProps) => (
  <svg {...base} {...p}><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const IconRefresh = (p: IconProps) => (
  <svg {...base} {...p}><path d="M21 12a9 9 0 1 1-2.6-6.4M21 4v5h-5" /></svg>
);
export const IconLogout = (p: IconProps) => (
  <svg {...base} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
);
export const IconDashboard = (p: IconProps) => (
  <svg {...base} {...p}><rect x="3" y="3" width="7.5" height="8.5" rx="2" /><rect x="13.5" y="3" width="7.5" height="5.5" rx="2" /><rect x="13.5" y="11" width="7.5" height="10" rx="2" /><rect x="3" y="14" width="7.5" height="7" rx="2" /></svg>
);
export const IconSettings = (p: IconProps) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" /></svg>
);
export const IconInbox = (p: IconProps) => (
  <svg {...base} {...p}><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.5 5h13l3.5 7v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5l3.5-7Z" /></svg>
);
export const IconNews = (p: IconProps) => (
  <svg {...base} {...p}><path d="M4 5h13a1 1 0 0 1 1 1v13a2 2 0 0 0 2 2H5a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1Z" /><path d="M7 9h7M7 13h7M7 17h4M18 9h2a1 1 0 0 1 1 1v8" /></svg>
);
export const IconBriefcase = (p: IconProps) => (
  <svg {...base} {...p}><rect x="2.5" y="7" width="19" height="13" rx="2.5" /><path d="M8.5 7V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2M2.5 12h19" /></svg>
);

export const ICON_MAP: Record<string, (p: IconProps) => ReactElement> = {
  code: IconCode,
  network: IconNetwork,
  wrench: IconWrench,
  certificate: IconCertificate,
  users: IconUsers,
  shield: IconShield,
  sprout: IconSprout,
  award: IconAward,
  layers: IconLayers,
  building: IconBuilding,
  sparkles: IconSparkles,
  document: IconDocument,
  trending: IconTrendingUp,
};

export function DynamicIcon({ name, ...props }: IconProps & { name: string }) {
  const Component = ICON_MAP[name] ?? IconSparkles;
  return <Component {...props} />;
}
