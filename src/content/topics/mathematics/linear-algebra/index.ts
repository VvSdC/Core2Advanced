import type { SubTopic } from '../../../types'

import { DeterminantsAndInverses } from './lessons/determinants-and-inverses'
import { EigenvaluesAndEigenvectors } from './lessons/eigenvalues-and-eigenvectors'
import { MatricesAndMultiplication } from './lessons/matrices-and-multiplication'
import { SingularValueDecomposition } from './lessons/singular-value-decomposition'
import { SystemsOfLinearEquations } from './lessons/systems-of-linear-equations'
import { VectorSpacesRankAndNullSpace } from './lessons/vector-spaces-rank-and-null-space'
import { VectorsAndDotProduct } from './lessons/vectors-and-dot-product'

export const linearAlgebraSubTopic: SubTopic = {
  id: 'linear-algebra',
  title: 'Linear Algebra',
  description:
    'The math behind almost every ML algorithm — vectors, matrices, solving systems, spaces & rank, eigen-decomposition, and SVD. Every lesson has 3–6 worked problems, an intuition-first walkthrough, and a NumPy implementation.',
  lessons: [
    {
      id: 'vectors-and-dot-product',
      title: 'Vectors & the Dot Product',
      description:
        'Vectors as arrows and feature lists, addition, scaling, and the dot product — length, angle, cosine similarity, projections, and unit vectors, with hand-worked problems and NumPy.',
      readTime: '14 min',
      component: VectorsAndDotProduct,
    },
    {
      id: 'matrices-and-multiplication',
      title: 'Matrices & Multiplication',
      description:
        'Matrix as table / stack of vectors / transformation; add, scale, transpose, and matrix multiply from first principles; matrix × vector as a neural layer; special matrices (identity, diagonal, symmetric, orthogonal, sparse); step-by-step problems with the shape rules.',
      readTime: '16 min',
      component: MatricesAndMultiplication,
    },
    {
      id: 'determinants-and-inverses',
      title: 'Determinants & Inverses',
      description:
        'Determinant as volume-scaling factor and singularity flag; 2×2 / 3×3 / triangular formulas; matrix inverses via adjugate and Gauss-Jordan; why real code solves rather than inverts; worked OLS + collinearity + system-solving problems.',
      readTime: '16 min',
      component: DeterminantsAndInverses,
    },
    {
      id: 'systems-of-linear-equations',
      title: 'Systems of Linear Equations',
      description:
        'Ax = b in all three flavours (unique / no solution / infinite); Gaussian elimination with back-substitution; Cramer\'s rule; least-squares for overdetermined systems (the OLS normal equations derived); consistency detection, plus 5 hand-worked problems.',
      readTime: '18 min',
      component: SystemsOfLinearEquations,
    },
    {
      id: 'vector-spaces-rank-and-null-space',
      title: 'Vector Spaces, Rank & Null Space',
      description:
        'Span, linear independence, basis, dimension; the four fundamental subspaces; rank as the count of independent directions; rank-nullity theorem; ML-flavour problems on collinear features and the dummy-variable trap.',
      readTime: '18 min',
      component: VectorSpacesRankAndNullSpace,
    },
    {
      id: 'eigenvalues-and-eigenvectors',
      title: 'Eigenvalues & Eigenvectors',
      description:
        'Directions a matrix only stretches; solving det(A − λI) = 0 and finding eigenvectors as null spaces; diagonalisation and matrix powers; trace / det identities; symmetric-matrix orthogonality; ML links (PCA, spectral clustering, PageRank, power iteration).',
      readTime: '20 min',
      component: EigenvaluesAndEigenvectors,
    },
    {
      id: 'singular-value-decomposition',
      title: 'Singular Value Decomposition (SVD)',
      description:
        'A = U Σ Vᵀ for any matrix — rotate, scale, rotate. Rank / condition number / pseudoinverse from Σ; the Eckart-Young theorem for best low-rank approximation; how PCA, LSA, recommenders, and LoRA are all truncated SVD; hand-worked 2×2 example.',
      readTime: '20 min',
      component: SingularValueDecomposition,
    },
  ],
}
