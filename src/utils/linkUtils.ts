export function formatLink(
  value?: string,
  type?: 'email' | 'phone' | 'url' | 'linkedin' | 'github' | 'general'
): string {
  if (!value) return '';
  const trimmed = value.trim();
  if (!trimmed) return '';

  if (type === 'email') {
    return trimmed.startsWith('mailto:') ? trimmed : `mailto:${trimmed}`;
  }
  if (type === 'phone') {
    return trimmed.startsWith('tel:') ? trimmed : `tel:${trimmed.replace(/\s+/g, '')}`;
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
    return trimmed;
  }
  if (type === 'linkedin' && !trimmed.toLowerCase().includes('linkedin.com')) {
    return `https://linkedin.com/in/${trimmed.replace(/^@/, '')}`;
  }
  if (type === 'github' && !trimmed.toLowerCase().includes('github.com')) {
    return `https://github.com/${trimmed.replace(/^@/, '')}`;
  }
  return `https://${trimmed}`;
}
