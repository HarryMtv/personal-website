import {
  BriefcaseBusiness,
  Clock,
  FileDown,
  Folder,
  Gamepad2,
  Layers,
  Mail,
  PenLine,
  Trash2,
  User,
  type LucideIcon,
} from 'lucide-react';
import type { LinkProps } from '@tanstack/react-router';

export interface DesktopIconConfig {
  id: string;
  label: string;
  mobileLabel: string;
  to: LinkProps['to'];
  icon: LucideIcon;
  rail: 'left' | 'right';
  showOnMobile: boolean;
  /** Prefix matching keeps an icon active on nested routes (e.g. /projects/x). */
  matchPrefix?: boolean;
}

/** The desktop icon inventory, mirroring the mock's two rails. */
export const DESKTOP_ICONS: DesktopIconConfig[] = [
  { id: 'about', label: 'About me', mobileLabel: 'About', to: '/', icon: User, rail: 'left', showOnMobile: true },
  { id: 'projects', label: 'Projects', mobileLabel: 'Projects', to: '/projects', icon: Folder, rail: 'left', showOnMobile: true, matchPrefix: true },
  { id: 'experience', label: 'Experience', mobileLabel: 'Experience', to: '/experience', icon: BriefcaseBusiness, rail: 'left', showOnMobile: true },
  { id: 'stack', label: 'Stack & uses', mobileLabel: 'Stack', to: '/stack', icon: Layers, rail: 'left', showOnMobile: true },
  { id: 'writing', label: 'Writing', mobileLabel: 'Writing', to: '/writing', icon: PenLine, rail: 'left', showOnMobile: true, matchPrefix: true },
  { id: 'hobbies', label: 'Hobbies', mobileLabel: 'Hobbies', to: '/hobbies', icon: Gamepad2, rail: 'right', showOnMobile: true },
  { id: 'now', label: 'Now', mobileLabel: 'Now', to: '/now', icon: Clock, rail: 'right', showOnMobile: true },
  { id: 'contact', label: 'Contact', mobileLabel: 'Contact', to: '/contact', icon: Mail, rail: 'right', showOnMobile: true },
  { id: 'cv', label: 'CV.pdf', mobileLabel: 'CV', to: '/cv', icon: FileDown, rail: 'right', showOnMobile: false },
  { id: 'trash', label: 'Trash', mobileLabel: 'Trash', to: '/trash', icon: Trash2, rail: 'right', showOnMobile: false },
];
