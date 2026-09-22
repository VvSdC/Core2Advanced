import type { SubTopic } from '../../../types'
import { AssociationRules } from './lessons/association-rules'
import { ClusteringMetrics } from './lessons/clustering-metrics'
import { DbscanLesson } from './lessons/dbscan'
import { GmmAndEm } from './lessons/gmm-and-em'
import { HierarchicalClustering } from './lessons/hierarchical-clustering'
import { KMeansLesson } from './lessons/k-means'
import { PcaLesson } from './lessons/pca'
import { TsneAndUmap } from './lessons/tsne-and-umap'

const clusteringLessons = [
  {
    id: 'k-means',
    title: 'k-Means',
    description:
      'Partition into k spheres: assign to the nearest centroid, then average. When the blobs are not spheres, it fails.',
    readTime: '16 min',
    component: KMeansLesson,
  },
  {
    id: 'hierarchical-clustering',
    title: 'Hierarchical Clustering',
    description:
      'A dendrogram of merges. Linkage (single, complete, average, Ward), where to cut, and why it does not scale to a million rows.',
    readTime: '16 min',
    component: HierarchicalClustering,
  },
  {
    id: 'dbscan',
    title: 'DBSCAN',
    description:
      'Density-based clusters of any shape, plus an explicit noise class. ε, min_samples, and the unequal-density failure.',
    readTime: '16 min',
    component: DbscanLesson,
  },
  {
    id: 'gmm-and-em',
    title: 'Gaussian Mixtures & EM',
    description:
      'Soft elliptical clusters. Responsibilities, the E and M steps, BIC for k, and k-means as the hard spherical cousin.',
    readTime: '18 min',
    component: GmmAndEm,
  },
  {
    id: 'clustering-metrics',
    title: 'Clustering Metrics',
    description:
      'Silhouette, inertia, ARI, NMI — what they ask, when they lie (two moons), and how purity is gamed.',
    readTime: '14 min',
    component: ClusteringMetrics,
  },
]

const representationLessons = [
  {
    id: 'pca',
    title: 'PCA',
    description:
      'Orthogonal directions of maximum variance. SVD, explained variance, whitening, and fit-on-train-only.',
    readTime: '16 min',
    component: PcaLesson,
  },
  {
    id: 'tsne-and-umap',
    title: 't-SNE & UMAP',
    description:
      'Neighbour-preserving maps for visualisation. Perplexity, n_neighbors, and the lies pretty blobs tell.',
    readTime: '16 min',
    component: TsneAndUmap,
  },
]

const patternLessons = [
  {
    id: 'association-rules',
    title: 'Association Rules',
    description:
      'Frequent itemsets and A → B. Support, confidence, lift, Apriori pruning, and why lift exists.',
    readTime: '14 min',
    component: AssociationRules,
  },
]

export const unsupervisedSubTopic: SubTopic = {
  id: 'unsupervised',
  title: 'Unsupervised Learning',
  description:
    'No labels — find groups, compress dimensions, and mine co-occurrence. Clustering, PCA, t-SNE / UMAP, and association rules, each with when-to-use and worked problems.',
  lessonSections: [
    { id: 'clustering', title: 'Clustering', lessons: clusteringLessons },
    { id: 'representation', title: 'Representation', lessons: representationLessons },
    { id: 'patterns', title: 'Patterns', lessons: patternLessons },
  ],
}
