/**
 * Month hero images — using local images from src/images/ folder.
 */
import janImg from '../images/jan_img.jpg';
import febImg from '../images/feb_img.avif';
import marImg from '../images/mar_img.jpg';
import aprImg from '../images/apr_img.jpg';
import mayImg from '../images/may_img.jpeg';
import junImg from '../images/jun_img.jpg';
import julImg from '../images/jul_img.jpeg';
import augImg from '../images/aug_img.jpg';
import septImg from '../images/sept_img.webp';
import octImg from '../images/oct_img.jpeg';
import novImg from '../images/nov_img.jpg';
import decImg from '../images/dec_img.jpg';

export const MONTH_IMAGES = {
  0:  { src: janImg,  alt: 'January',   color: '#1a4a6e' },
  1:  { src: febImg,  alt: 'February',  color: '#4a3a6e' },
  2:  { src: marImg,  alt: 'March',     color: '#5a6e4a' },
  3:  { src: aprImg,  alt: 'April',     color: '#8e4a6a' },
  4:  { src: mayImg,  alt: 'May',       color: '#8e6a2a' },
  5:  { src: junImg,  alt: 'June',      color: '#1a6e8e' },
  6:  { src: julImg,  alt: 'July',      color: '#2a5e3a' },
  7:  { src: augImg,  alt: 'August',    color: '#3a5e8e' },
  8:  { src: septImg, alt: 'September', color: '#5a7e3a' },
  9:  { src: octImg,  alt: 'October',   color: '#8e5a2a' },
  10: { src: novImg,  alt: 'November',  color: '#4a5e6e' },
  11: { src: decImg,  alt: 'December',  color: '#6e2a2a' },
};

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const MONTH_ACCENTS = {
  0:  '#1a8fd1',
  1:  '#7c3aed',
  2:  '#059669',
  3:  '#ec4899',
  4:  '#d97706',
  5:  '#0891b2',
  6:  '#16a34a',
  7:  '#2563eb',
  8:  '#0d9488',
  9:  '#ea580c',
  10: '#6b7280',
  11: '#dc2626',
};
