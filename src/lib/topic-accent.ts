export const topicAccentStyles: Record<
  string,
  { text: string; hover: string; border: string }
> = {
  python: {
    text: 'text-python-400',
    hover: 'group-hover:text-python-400',
    border: 'hover:border-python-500/40',
  },
  striver: {
    text: 'text-striver-400',
    hover: 'group-hover:text-striver-400',
    border: 'hover:border-striver-500/40',
  },
  genai: {
    text: 'text-genai-400',
    hover: 'group-hover:text-genai-400',
    border: 'hover:border-genai-500/40',
  },
}

export function getTopicAccent(accent: string) {
  return topicAccentStyles[accent] ?? topicAccentStyles.python
}
