import { CONFIG } from '../config'

/* Answers used when the Gemini endpoint is not configured or unreachable.
   It is deliberately honest: it only repeats what is in CONFIG. */
export function answerLocally(question) {
  const q = question.toLowerCase()
  const has = (...words) => words.some(w => q.includes(w))
  const project = CONFIG.projects.find(p => q.includes(p.title.toLowerCase()) || q.includes(p.id))

  if (project) {
    return `${project.title} — ${project.kind} (${project.year}).\n${project.summary}\n\n${project.body[0]}\n\nStack: ${project.tags.join(', ')}.`
  }
  if (has('certificate', 'certification', 'award', 'document')) {
    return [
      'Ziad has 13 documents on file:',
      ...CONFIG.certificates.map(c => `• ${c.title} — ${c.org}, ${c.year}`),
      '',
      'Open About Me → Certifications to see the scans.',
    ].join('\n')
  }
  if (has('honor', 'honour', 'recognition', 'win', 'won', 'place')) {
    return [
      'Honors on file:',
      ...CONFIG.honors.map(h => `• ${h.title} — ${h.org}, ${h.year}`),
    ].join('\n')
  }
  if (has('teach', 'taught', 'schoolhouse', 'culture palace', 'service', 'volunteer')) {
    return [
      'Teaching and service:',
      '• Programming instructor at the Egyptian Culture Palace — designed and taught Python for primary students (2026).',
      '• Schoolhouse peer tutor since January 2026.',
      '• Be My Eyes volunteer since December 2025, English and Arabic.',
      '• Head of IT for the STEM Model Arab League, 2026.',
    ].join('\n')
  }
  if (has('skill', 'stack', 'tool', 'language', 'python', 'pytorch')) {
    return [
      'Toolkit:',
      ...CONFIG.tech.map(g => `• ${g.category}: ${g.items.join(', ')}`),
      '',
      'Languages: Arabic (native), English (fluent).',
    ].join('\n')
  }
  if (has('contact', 'email', 'reach', 'hire', 'instagram', 'social', 'linkedin', 'github')) {
    return [
      'Contact:',
      `• Email — ${CONFIG.site.email}`,
      `• Instagram — ${CONFIG.site.instagramHandle} (${CONFIG.site.instagram})`,
      `• GitHub — ${CONFIG.site.github}`,
      `• LinkedIn — ${CONFIG.site.linkedin}`,
    ].join('\n')
  }
  if (has('who', 'about', 'bio', 'story', 'yourself', 'ziad')) {
    return `${CONFIG.about.lead}\n\n${CONFIG.about.paragraphs[0]}\n\nFocus: ${CONFIG.site.role}. ${CONFIG.site.status}. Based in ${CONFIG.site.location}.`
  }
  if (has('project', 'build', 'work')) {
    return [
      'Projects on this desk:',
      ...CONFIG.projects.map(p => `• ${p.title} — ${p.summary}`),
    ].join('\n')
  }
  if (has('resume', 'cv')) {
    return 'The Résumé folder item opens a printable one-page CV. Use “Print / Save PDF” to keep a copy.'
  }

  return [
    'I can answer from Ziad’s portfolio, but the live Gemini agent is not connected right now.',
    '',
    'Try asking about:',
    '• his projects (Pipe Inspector, Pest Sentinel, Sprout, Geology RAG)',
    '• certifications and honors',
    '• teaching and volunteering',
    '• skills, contact details or Instagram',
    '',
    'Or open About Me → About Me.txt for the long version.',
  ].join('\n')
}
