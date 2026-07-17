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
  core: {
    text: 'text-core-400',
    hover: 'group-hover:text-core-400',
    border: 'hover:border-core-500/40',
  },
  'system-design': {
    text: 'text-system-design-400',
    hover: 'group-hover:text-system-design-400',
    border: 'hover:border-system-design-500/40',
  },
  web: {
    text: 'text-web-400',
    hover: 'group-hover:text-web-400',
    border: 'hover:border-web-500/40',
  },
  databases: {
    text: 'text-databases-400',
    hover: 'group-hover:text-databases-400',
    border: 'hover:border-databases-500/40',
  },
  mathematics: {
    text: 'text-mathematics-400',
    hover: 'group-hover:text-mathematics-400',
    border: 'hover:border-mathematics-500/40',
  },
  'data-visualization': {
    text: 'text-data-visualization-400',
    hover: 'group-hover:text-data-visualization-400',
    border: 'hover:border-data-visualization-500/40',
  },
  'data-science': {
    text: 'text-data-science-400',
    hover: 'group-hover:text-data-science-400',
    border: 'hover:border-data-science-500/40',
  },
  'machine-learning': {
    text: 'text-machine-learning-400',
    hover: 'group-hover:text-machine-learning-400',
    border: 'hover:border-machine-learning-500/40',
  },
  nlp: {
    text: 'text-nlp-400',
    hover: 'group-hover:text-nlp-400',
    border: 'hover:border-nlp-500/40',
  },
  'deep-learning': {
    text: 'text-deep-learning-400',
    hover: 'group-hover:text-deep-learning-400',
    border: 'hover:border-deep-learning-500/40',
  },
  docker: {
    text: 'text-docker-400',
    hover: 'group-hover:text-docker-400',
    border: 'hover:border-docker-500/40',
  },
}

export function getTopicAccent(accent: string) {
  return topicAccentStyles[accent] ?? topicAccentStyles.python
}
