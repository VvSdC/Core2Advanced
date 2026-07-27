import type { SubTopic } from '../../../types'
import { CleaningNotebook } from './lessons/cleaning-notebook'
import { DataFrameLesson } from './lessons/dataframe'
import { ExploringData } from './lessons/exploring-data'
import { ExploringNotebook } from './lessons/exploring-notebook'
import { FilteringRows } from './lessons/filtering-rows'
import { GettingStartedWithPandas } from './lessons/getting-started-with-pandas'
import { GroupingAndAggregation } from './lessons/grouping-and-aggregation'
import { HandlingMissingValues } from './lessons/handling-missing-values'
import { ImportantMethods } from './lessons/important-methods'
import { MergingAndJoining } from './lessons/merging-and-joining'
import { MultiIndexLesson } from './lessons/multiindex'
import { PandasPlotting } from './lessons/pandas-plotting'
import { PerformanceTips } from './lessons/performance-tips'
import { ReadingData } from './lessons/reading-data'
import { RemovingDuplicates } from './lessons/removing-duplicates'
import { ReshapingData } from './lessons/reshaping-data'
import { SelectingWithLocIloc } from './lessons/selecting-with-loc-iloc'
import { SelectionNotebook } from './lessons/selection-notebook'
import { SeriesLesson } from './lessons/series'
import { SeriesDataframeNotebook } from './lessons/series-dataframe-notebook'
import { SortingData } from './lessons/sorting-data'
import { SummariesAndCorrelations } from './lessons/summaries-and-correlations'
import { TimeSeriesLesson } from './lessons/time-series'
import { WhatIsPandas } from './lessons/what-is-pandas'
import { WhyPandas } from './lessons/why-pandas'
import { WranglingNotebook } from './lessons/wrangling-notebook'

export const pandasSubTopic: SubTopic = {
  id: 'pandas',
  title: 'Pandas',
  description:
    'Beginner to advanced tabular data — Series, DataFrames, cleaning, wrangling, plotting, time series, and performance.',
  lessonSections: [
    {
      id: 'getting-started',
      title: 'Getting Started',
      lessons: [
        {
          id: 'getting-started-with-pandas',
          title: 'Getting Started',
          description: 'Roadmap, vocabulary, and how to study this Pandas track calmly.',
          readTime: '10 min',
          component: GettingStartedWithPandas,
        },
        {
          id: 'what-is-pandas',
          title: 'What Is Pandas?',
          description: 'Tables in Python — NumPy roots, use cases, and common data sources.',
          readTime: '11 min',
          component: WhatIsPandas,
        },
        {
          id: 'why-pandas',
          title: 'Why Pandas?',
          description: 'Large tables, mixed types, and rich manipulation without endless loops.',
          readTime: '9 min',
          component: WhyPandas,
        },
      ],
    },
    {
      id: 'core-data-structures',
      title: 'Core Data Structures',
      lessons: [
        {
          id: 'series',
          title: 'Series',
          description: 'A labeled 1-D column — create, index, and run basic operations.',
          readTime: '12 min',
          component: SeriesLesson,
        },
        {
          id: 'dataframe',
          title: 'DataFrame',
          description: 'The 2-D table — rows, columns, indexes, and everyday inspection.',
          readTime: '12 min',
          component: DataFrameLesson,
        },
        {
          id: 'series-dataframe-notebook',
          title: 'Series & DataFrame (Notebook)',
          description: 'Hands-on cells: build, inspect, rename, and do simple math.',
          readTime: '14 min',
          component: SeriesDataframeNotebook,
        },
      ],
    },
    {
      id: 'reading-and-exploring',
      title: 'Reading & Exploring',
      lessons: [
        {
          id: 'reading-data',
          title: 'Reading Data',
          description: 'read_csv, Excel, SQL, JSON — plus useful load options.',
          readTime: '12 min',
          component: ReadingData,
        },
        {
          id: 'exploring-data',
          title: 'Exploring Data',
          description: 'shape, head/tail, info, describe, and spotting missing values.',
          readTime: '11 min',
          component: ExploringData,
        },
        {
          id: 'exploring-notebook',
          title: 'Exploring Data (Notebook)',
          description: 'Build a toy frame and practice first-look tools end to end.',
          readTime: '12 min',
          component: ExploringNotebook,
        },
      ],
    },
    {
      id: 'selecting-and-filtering',
      title: 'Selecting & Filtering',
      lessons: [
        {
          id: 'selecting-with-loc-iloc',
          title: 'loc & iloc',
          description: 'Label vs position selection for rows, columns, and slices.',
          readTime: '12 min',
          component: SelectingWithLocIloc,
        },
        {
          id: 'filtering-rows',
          title: 'Filtering Rows',
          description: 'Boolean masks, combined conditions, and query().',
          readTime: '11 min',
          component: FilteringRows,
        },
        {
          id: 'selection-notebook',
          title: 'Selection (Notebook)',
          description: 'Practice loc, iloc, and filters on a small sales table.',
          readTime: '12 min',
          component: SelectionNotebook,
        },
      ],
    },
    {
      id: 'data-cleaning',
      title: 'Data Cleaning',
      lessons: [
        {
          id: 'handling-missing-values',
          title: 'Missing Values',
          description: 'dropna, fillna, and mean/median/mode imputation — when to use each.',
          readTime: '13 min',
          component: HandlingMissingValues,
        },
        {
          id: 'removing-duplicates',
          title: 'Duplicates & Types',
          description: 'drop_duplicates, keep=, and fixing types with astype / to_datetime.',
          readTime: '10 min',
          component: RemovingDuplicates,
        },
        {
          id: 'cleaning-notebook',
          title: 'Cleaning (Notebook)',
          description: 'Invent messes, then drop, fill, and de-duplicate step by step.',
          readTime: '12 min',
          component: CleaningNotebook,
        },
      ],
    },
    {
      id: 'data-wrangling',
      title: 'Data Wrangling',
      lessons: [
        {
          id: 'grouping-and-aggregation',
          title: 'Grouping & Aggregation',
          description: 'groupby split-apply-combine — mean, sum, count, and custom aggs.',
          readTime: '13 min',
          component: GroupingAndAggregation,
        },
        {
          id: 'merging-and-joining',
          title: 'Merging & Joining',
          description: 'merge, join, concat — inner, left, right, and outer joins.',
          readTime: '13 min',
          component: MergingAndJoining,
        },
        {
          id: 'reshaping-data',
          title: 'Reshaping Data',
          description: 'pivot_table, melt, and crosstab for wide ↔ long layouts.',
          readTime: '13 min',
          component: ReshapingData,
        },
        {
          id: 'sorting-data',
          title: 'Sorting & Reordering',
          description: 'sort_values, sort_index, and reordering columns.',
          readTime: '9 min',
          component: SortingData,
        },
        {
          id: 'wrangling-notebook',
          title: 'Wrangling (Notebook)',
          description: 'Group, merge, pivot, melt, and sort on toy datasets.',
          readTime: '15 min',
          component: WranglingNotebook,
        },
      ],
    },
    {
      id: 'visualization-and-insights',
      title: 'Visualization & Insights',
      lessons: [
        {
          id: 'pandas-plotting',
          title: 'Pandas Plotting',
          description: 'Built-in plot, hist, box, scatter — plus Matplotlib/Seaborn hooks.',
          readTime: '12 min',
          component: PandasPlotting,
        },
        {
          id: 'summaries-and-correlations',
          title: 'Summaries & Correlations',
          description: 'describe, corr, value_counts, and column-wise stats for insights.',
          readTime: '11 min',
          component: SummariesAndCorrelations,
        },
      ],
    },
    {
      id: 'important-methods',
      title: 'Important Methods',
      lessons: [
        {
          id: 'important-methods',
          title: 'Functions & Methods Cheat Sheet',
          description:
            'unique, value_counts, dropna/fillna, merge, pivot, sort — a practical recap.',
          readTime: '12 min',
          component: ImportantMethods,
        },
      ],
    },
    {
      id: 'advanced-topics',
      title: 'Advanced Topics',
      lessons: [
        {
          id: 'time-series',
          title: 'Time Series',
          description: 'to_datetime, DatetimeIndex, resample, and rolling windows.',
          readTime: '14 min',
          component: TimeSeriesLesson,
        },
        {
          id: 'multiindex',
          title: 'MultiIndex',
          description: 'Hierarchical indexes — groupby levels, xs, stack/unstack.',
          readTime: '13 min',
          component: MultiIndexLesson,
        },
        {
          id: 'performance-tips',
          title: 'Performance Tips',
          description: 'Vectorize, prefer built-ins, categoricals, and avoid slow patterns.',
          readTime: '11 min',
          component: PerformanceTips,
        },
      ],
    },
  ],
}
