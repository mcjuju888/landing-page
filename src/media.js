// Turns a pasted video link into something embeddable.
// Returns { type: 'iframe' | 'video', src } or null when empty/unknown.
export function videoEmbed(url) {
  if (!url) return null;
  let u;
  try { u = new URL(url); } catch { return null; }
  const host = u.hostname.replace(/^www\.|^m\./, '');

  if (host === 'youtu.be' || host.endsWith('youtube.com')) {
    const id = host === 'youtu.be'
      ? u.pathname.slice(1)
      : u.searchParams.get('v') || u.pathname.split('/').filter(Boolean).pop();
    return id ? { type: 'iframe', src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` } : null;
  }
  if (host.endsWith('vimeo.com')) {
    const id = u.pathname.split('/').filter(Boolean).find((p) => /^\d+$/.test(p));
    return id ? { type: 'iframe', src: `https://player.vimeo.com/video/${id}?autoplay=1` } : null;
  }
  return { type: 'video', src: url };
}

// Cal.com and Calendly both render inline in a plain iframe.
export function bookingEmbedSrc(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.endsWith('calendly.com')) {
      u.searchParams.set('hide_gdpr_banner', '1');
    } else if (u.hostname.endsWith('cal.com')) {
      u.searchParams.set('embed', 'true');
    }
    return u.toString();
  } catch {
    return null;
  }
}
