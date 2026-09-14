import type { SubTopic } from '../../../types'
import { AnatomyNotebook } from './lessons/anatomy-notebook'
import { AnatomyOfAPlot } from './lessons/anatomy-of-a-plot'
import { BarHistogramBoxPie } from './lessons/bar-histogram-box-pie'
import { CustomizationLesson } from './lessons/customization'
import { CustomizationNotebook } from './lessons/customization-notebook'
import { GettingStartedWithMatplotlib } from './lessons/getting-started-with-matplotlib'
import { LineAndScatter } from './lessons/line-and-scatter'
import { PandasIntegrationLesson } from './lessons/pandas-integration'
import { PandasPlotNotebook } from './lessons/pandas-plot-notebook'
import { PlotTypesNotebook } from './lessons/plot-types-notebook'
import { SubplotsLesson } from './lessons/subplots'
import { SubplotsNotebook } from './lessons/subplots-notebook'
import { WhatIsMatplotlib } from './lessons/what-is-matplotlib'

export const matplotlibSubTopic: SubTopic = {
  id: 'matplotlib',
  title: 'Matplotlib',
  description:
    'Python’s foundational plotting library — anatomy, chart types, subplots, styling, and Pandas.plot().',
  lessonSections: [
    {
      id: 'getting-started',
      title: 'Getting Started',
      lessons: [
        {
          id: 'getting-started-with-matplotlib',
          title: 'Getting Started',
          description: 'Roadmap, vocabulary, and setup for this Matplotlib track.',
          readTime: '10 min',
          component: GettingStartedWithMatplotlib,
        },
        {
          id: 'what-is-matplotlib',
          title: 'What Is Matplotlib?',
          description: 'Why it’s the foundation of Python viz — and how it pairs with NumPy/Pandas.',
          readTime: '10 min',
          component: WhatIsMatplotlib,
        },
      ],
    },
    {
      id: 'anatomy-of-a-plot',
      title: 'Anatomy of a Plot',
      lessons: [
        {
          id: 'anatomy-of-a-plot',
          title: 'Figure, Axes & Labels',
          description: 'Figure, Axes, Axis, title, labels, and legend — how the pieces fit.',
          readTime: '12 min',
          component: AnatomyOfAPlot,
        },
        {
          id: 'anatomy-notebook',
          title: 'Anatomy (Notebook)',
          description: 'Build a simple line plot with title, axis labels, and a legend.',
          readTime: '10 min',
          component: AnatomyNotebook,
        },
      ],
    },
    {
      id: 'basic-plot-types',
      title: 'Basic Plot Types',
      lessons: [
        {
          id: 'line-and-scatter',
          title: 'Line & Scatter',
          description: 'Trends over continuous data and relationships between variables.',
          readTime: '11 min',
          component: LineAndScatter,
        },
        {
          id: 'bar-histogram-box-pie',
          title: 'Bar, Hist, Box & Pie',
          description: 'Categories, distributions, spread/outliers, and proportions.',
          readTime: '13 min',
          component: BarHistogramBoxPie,
        },
        {
          id: 'plot-types-notebook',
          title: 'Plot Types (Notebook)',
          description: 'Practice line, scatter, bar, hist, boxplot, and pie on toy data.',
          readTime: '14 min',
          component: PlotTypesNotebook,
        },
      ],
    },
    {
      id: 'subplots',
      title: 'Subplots',
      lessons: [
        {
          id: 'subplots',
          title: 'plt.subplots & Grids',
          description: 'Multiple Axes in one Figure — side-by-side comparisons.',
          readTime: '11 min',
          component: SubplotsLesson,
        },
        {
          id: 'subplots-notebook',
          title: 'Subplots (Notebook)',
          description: 'Compare chart types in a grid layout.',
          readTime: '11 min',
          component: SubplotsNotebook,
        },
      ],
    },
    {
      id: 'customization',
      title: 'Customization',
      lessons: [
        {
          id: 'customization',
          title: 'Colors, Markers & Style',
          description: 'Legends, annotations, grids, and readability polish.',
          readTime: '12 min',
          component: CustomizationLesson,
        },
        {
          id: 'customization-notebook',
          title: 'Customization (Notebook)',
          description: 'Style a multi-series plot until it is presentation-ready.',
          readTime: '12 min',
          component: CustomizationNotebook,
        },
      ],
    },
    {
      id: 'pandas-integration',
      title: 'Integration with Pandas',
      lessons: [
        {
          id: 'pandas-integration',
          title: 'DataFrame.plot()',
          description: 'Quick charts from tables — and when to drop to the Axes API.',
          readTime: '11 min',
          component: PandasIntegrationLesson,
        },
        {
          id: 'pandas-plot-notebook',
          title: 'Pandas Plot (Notebook)',
          description: 'Line, bar, and hist from a DataFrame — including ax= subplots.',
          readTime: '11 min',
          component: PandasPlotNotebook,
        },
      ],
    },
  ],
}
