import { FaLinkedin, FaGithub, FaFacebook, FaInstagram, FaYoutube, FaDiscord, FaTwitch, FaTelegram, FaGlobe, FaEnvelope } from 'react-icons/fa'
import { SiLeetcode, SiX, SiGmail, SiGooglescholar, SiLetterboxd } from 'react-icons/si'

export const platformIcons: Record<string, React.ReactNode> = {
  Email: <SiGmail size={20} />,
  LinkedIn: <FaLinkedin size={20} />,
  GitHub: <FaGithub size={20} />,
  'Google Scholar': <SiGooglescholar size={20} />,
  Facebook: <FaFacebook size={20} />,
  Instagram: <FaInstagram size={20} />,
  X: <SiX size={20} />,
  LeetCode: <SiLeetcode size={20} />,
  YouTube: <FaYoutube size={20} />,
  Discord: <FaDiscord size={20} />,
  Twitch: <FaTwitch size={20} />,
  Telegram: <FaTelegram size={20} />,
  Website: <FaGlobe size={20} />,
  Letterboxd: <SiLetterboxd size={20} />,
}

export const platformHoverColors: Record<string, string> = {
  LinkedIn: 'hover:text-blue-400',
  GitHub: 'hover:text-[var(--text-primary)]',
  Facebook: 'hover:text-blue-500',
  Instagram: 'instagram-hover',
  X: 'hover:text-white',
  YouTube: 'hover:text-red-500',
  Discord: 'hover:text-[#5865F2]',
  Twitch: 'hover:text-[#9146FF]',
  Telegram: 'hover:text-[#26A5E4]',
  Email: 'hover:text-red-400',
  'Google Scholar': 'hover:text-blue-400',
  LeetCode: 'leetcode-hover',
  Website: 'hover:text-green-400',
  Letterboxd: 'hover:text-[#00E054]',
}
