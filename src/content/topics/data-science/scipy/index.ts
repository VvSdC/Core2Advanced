import type { SubTopic } from '../../../types'
import { ConvolutionLesson } from './lessons/convolution'
import { ConvolutionNotebook } from './lessons/convolution-notebook'
import { CurveFittingLesson } from './lessons/curve-fitting'
import { CurveFittingNotebook } from './lessons/curve-fitting-notebook'
import { GettingStartedWithScipy } from './lessons/getting-started-with-scipy'
import { IntegrationNotebook } from './lessons/integration-notebook'
import { InterpolationLesson } from './lessons/interpolation'
import { InterpolationNotebook } from './lessons/interpolation-notebook'
import { MlPipelineNotebook } from './lessons/ml-pipeline-notebook'
import { MlWorkflowsLesson } from './lessons/ml-workflows'
import { NumericalIntegrationLesson } from './lessons/numerical-integration'
import { OptimizationLesson } from './lessons/optimization'
import { OptimizationNotebook } from './lessons/optimization-notebook'
import { SignalProcessingLesson } from './lessons/signal-processing'
import { SignalProcessingNotebook } from './lessons/signal-processing-notebook'
import { WhatIsScipy } from './lessons/what-is-scipy'
import { WhyScipy } from './lessons/why-scipy'

export const scipySubTopic: SubTopic = {
  id: 'scipy',
  title: 'SciPy',
  description:
    'Scientific computing on top of NumPy — optimization, interpolation, integration, curve fitting, signals, and ML pipelines.',
  lessonSections: [
    {
      id: 'getting-started',
      title: 'Getting Started',
      lessons: [
        {
          id: 'getting-started-with-scipy',
          title: 'Getting Started',
          description: 'Roadmap, vocabulary, and how to study this SciPy track calmly.',
          readTime: '10 min',
          component: GettingStartedWithScipy,
        },
        {
          id: 'what-is-scipy',
          title: 'What Is SciPy?',
          description: 'NumPy’s partner for algorithms — key modules for data science and AI.',
          readTime: '11 min',
          component: WhatIsScipy,
        },
        {
          id: 'why-scipy',
          title: 'Why SciPy?',
          description: 'Why battle-tested math beats reinventing optimizers and filters.',
          readTime: '9 min',
          component: WhyScipy,
        },
      ],
    },
    {
      id: 'optimization',
      title: 'Optimization',
      lessons: [
        {
          id: 'optimization',
          title: 'scipy.optimize',
          description: 'minimize, curve_fit, least_squares — tuning parameters to fit data.',
          readTime: '12 min',
          component: OptimizationLesson,
        },
        {
          id: 'optimization-notebook',
          title: 'Optimization (Notebook)',
          description: 'Fit a logistic curve to toy data with curve_fit.',
          readTime: '12 min',
          component: OptimizationNotebook,
        },
      ],
    },
    {
      id: 'interpolation',
      title: 'Interpolation',
      lessons: [
        {
          id: 'interpolation',
          title: 'scipy.interpolate',
          description: 'Fill gaps and resample — interp1d, griddata, splines.',
          readTime: '11 min',
          component: InterpolationLesson,
        },
        {
          id: 'interpolation-notebook',
          title: 'Interpolation (Notebook)',
          description: 'Interpolate missing sensor values along a timeline.',
          readTime: '11 min',
          component: InterpolationNotebook,
        },
      ],
    },
    {
      id: 'numerical-integration',
      title: 'Numerical Integration',
      lessons: [
        {
          id: 'numerical-integration',
          title: 'scipy.integrate',
          description: 'quad, dblquad, odeint — areas under curves and simple ODEs.',
          readTime: '12 min',
          component: NumericalIntegrationLesson,
        },
        {
          id: 'integration-notebook',
          title: 'Integration (Notebook)',
          description: 'Integrate a Gaussian-style function and peek at odeint.',
          readTime: '11 min',
          component: IntegrationNotebook,
        },
      ],
    },
    {
      id: 'curve-fitting',
      title: 'Curve Fitting',
      lessons: [
        {
          id: 'curve-fitting',
          title: 'Curve Fitting',
          description: 'Nonlinear regression with curve_fit — beyond straight lines.',
          readTime: '11 min',
          component: CurveFittingLesson,
        },
        {
          id: 'curve-fitting-notebook',
          title: 'Curve Fitting (Notebook)',
          description: 'Fit exponential decay to noisy measurements.',
          readTime: '12 min',
          component: CurveFittingNotebook,
        },
      ],
    },
    {
      id: 'signal-processing',
      title: 'Signal Processing',
      lessons: [
        {
          id: 'signal-processing',
          title: 'scipy.signal',
          description: 'butter, lfilter, spectrogram — filters for audio and sensors.',
          readTime: '12 min',
          component: SignalProcessingLesson,
        },
        {
          id: 'signal-processing-notebook',
          title: 'Signal Processing (Notebook)',
          description: 'Low-pass filter a noisy sine wave and compare samples.',
          readTime: '12 min',
          component: SignalProcessingNotebook,
        },
      ],
    },
    {
      id: 'convolution',
      title: 'Convolution & Deconvolution',
      lessons: [
        {
          id: 'convolution',
          title: 'Convolution & Deconvolution',
          description: 'convolve / deconvolve — smoothing and CNN-like kernels.',
          readTime: '11 min',
          component: ConvolutionLesson,
        },
        {
          id: 'convolution-notebook',
          title: 'Convolution (Notebook)',
          description: 'Smooth a jagged time series with a moving-average kernel.',
          readTime: '11 min',
          component: ConvolutionNotebook,
        },
      ],
    },
    {
      id: 'ml-workflows',
      title: 'ML / DL Workflows',
      lessons: [
        {
          id: 'ml-workflows',
          title: 'SciPy in ML Pipelines',
          description: 'How SciPy sits with NumPy, Pandas, and scikit-learn.',
          readTime: '11 min',
          component: MlWorkflowsLesson,
        },
        {
          id: 'ml-pipeline-notebook',
          title: 'End-to-End Pipeline (Notebook)',
          description: 'Interpolate → curve fit → summarize — a tiny SciPy workflow.',
          readTime: '14 min',
          component: MlPipelineNotebook,
        },
      ],
    },
  ],
}
