import type { SubTopic } from '../../../types'

// Fundamentals
import { AugmentationAndGeneration } from './lessons/fundamentals/augmentation-and-generation'
import { BiEncodersAndCrossEncoders } from './lessons/fundamentals/bi-encoders-and-cross-encoders'
import { IntroductionToRag } from './lessons/fundamentals/introduction-to-rag'
import { RagArchitecture } from './lessons/fundamentals/rag-architecture'

// Embeddings
import { CommercialEmbeddingModels } from './lessons/embeddings/commercial-embedding-models'
import { DenseVsSparseEmbeddings } from './lessons/embeddings/dense-vs-sparse-embeddings'
import { OpenSourceEmbeddings } from './lessons/embeddings/open-source-embeddings'
import { PopularEmbeddingQuestions } from './lessons/embeddings/popular-embedding-questions'
import { SpecializedEmbeddings } from './lessons/embeddings/specialized-embeddings'
import { WhatAreEmbeddings } from './lessons/embeddings/what-are-embeddings'

// Chunking
import { ChunkSizeAndOverlap } from './lessons/chunking/chunk-size-and-overlap'
import { FixedAndRecursiveChunking } from './lessons/chunking/fixed-and-recursive-chunking'
import { IntroductionToChunking } from './lessons/chunking/introduction-to-chunking'
import { SemanticChunking } from './lessons/chunking/semantic-chunking'
import { StructureAwareChunking } from './lessons/chunking/structure-aware-chunking'

// Vector Databases
import { ChromaDb } from './lessons/vector-databases/chromadb'
import { FaissVectorDb } from './lessons/vector-databases/faiss'
import { PineconeDb } from './lessons/vector-databases/pinecone'
import { QdrantAndMilvus } from './lessons/vector-databases/qdrant-and-milvus'
import { VectorDatabasesOverview } from './lessons/vector-databases/vector-databases-overview'
import { WeaviateAndPgvector } from './lessons/vector-databases/weaviate-and-pgvector'

// Retrieval
import { AdvancedRetrievalStrategies } from './lessons/retrieval/advanced-retrieval-strategies'
import { Bm25KeywordSearch } from './lessons/retrieval/bm25-keyword-search'
import { DenseRetrieval } from './lessons/retrieval/dense-retrieval'
import { HybridSearchAndRrf } from './lessons/retrieval/hybrid-search-and-rrf'
import { MmrAndReranking } from './lessons/retrieval/mmr-and-reranking'
import { RetrievalOverview } from './lessons/retrieval/retrieval-overview'

// Evaluation
import { EvaluationFrameworks } from './lessons/evaluation/evaluation-frameworks'
import { GenerationFaithfulnessMetrics } from './lessons/evaluation/generation-faithfulness-metrics'
import { RagEvaluationOverview } from './lessons/evaluation/rag-evaluation-overview'
import { RagLimitationsAndDebugging } from './lessons/evaluation/rag-limitations-and-debugging'
import { RetrievalMetrics } from './lessons/evaluation/retrieval-metrics'

// Papers
import { AresAutomatedEvaluation } from './lessons/papers/ares-automated-evaluation'
import { ColbertLateInteraction } from './lessons/papers/colbert-late-interaction'
import { DensePassageRetrieval } from './lessons/papers/dense-passage-retrieval'
import { E5TextEmbeddings } from './lessons/papers/e5-text-embeddings'
import { FaissBillionScale } from './lessons/papers/faiss-billion-scale'
import { FusionInDecoder } from './lessons/papers/fusion-in-decoder'
import { HnswAnnSearch } from './lessons/papers/hnsw-ann-search'
import { HydeZeroShotRetrieval } from './lessons/papers/hyde-zero-shot-retrieval'
import { LostInTheMiddle } from './lessons/papers/lost-in-the-middle'
import { RagBestPracticesSurvey } from './lessons/papers/rag-best-practices-survey'
import { RagasEvaluation } from './lessons/papers/ragas-evaluation'
import { RealmRetrievalPretraining } from './lessons/papers/realm-retrieval-pretraining'
import { RetrievalAugmentedGeneration } from './lessons/papers/retrieval-augmented-generation'
import { SelfRag } from './lessons/papers/self-rag'
import { SentenceBert } from './lessons/papers/sentence-bert'

export const ragSubTopic: SubTopic = {
  id: 'rag',
  title: 'RAG',
  description:
    'Retrieval-Augmented Generation explained for first-time learners — six topic areas with plain-language lessons, analogies, and curated research papers. Conceptual only; code in LangChain.',
  lessonTracks: [
    {
      id: 'fundamentals',
      title: 'Fundamentals',
      sections: [
        {
          id: 'fundamentals-lessons',
          title: 'Lessons',
          lessons: [
            { id: 'introduction-to-rag', title: 'Introduction to RAG', description: 'What RAG is, why it exists, and when to use it over fine-tuning.', readTime: '10 min', component: IntroductionToRag },
            { id: 'rag-architecture', title: 'RAG Architecture', description: 'Offline indexing vs online querying — the two-phase system design.', readTime: '12 min', component: RagArchitecture },
            { id: 'bi-encoders-and-cross-encoders', title: 'Bi-Encoders & Cross-Encoders', description: 'How retrieval scores relevance — two architectures, flowcharts, and the two-stage pattern.', readTime: '12 min', component: BiEncodersAndCrossEncoders },
            { id: 'augmentation-and-generation', title: 'Augmentation & Generation', description: 'Prompt templates, grounding instructions, and diagnosing failures.', readTime: '12 min', component: AugmentationAndGeneration },
          ],
        },
        {
          id: 'fundamentals-papers',
          title: 'Research Papers',
          lessons: [
            { id: 'retrieval-augmented-generation', title: 'RAG (Lewis et al.)', description: 'Full paper walkthrough — parametric vs non-parametric memory, DPR + BART, RAG-Sequence vs RAG-Token.', readTime: '20 min', component: RetrievalAugmentedGeneration },
            { id: 'realm-retrieval-pretraining', title: 'REALM', description: 'Full paper walkthrough — retrieval baked into pretraining, contrast with inference-time RAG.', readTime: '18 min', component: RealmRetrievalPretraining },
            { id: 'fusion-in-decoder', title: 'Fusion-in-Decoder (FiD)', description: 'Full paper walkthrough — encode passages separately, fuse in decoder, multi-doc QA.', readTime: '18 min', component: FusionInDecoder },
          ],
        },
      ],
    },
    {
      id: 'embeddings',
      title: 'Embeddings',
      sections: [
        {
          id: 'embeddings-lessons',
          title: 'Lessons',
          lessons: [
            { id: 'what-are-embeddings', title: 'What Are Embeddings?', description: 'Tokenise → encode → pool → vector. Cosine similarity and golden rules.', readTime: '10 min', component: WhatAreEmbeddings },
            { id: 'dense-vs-sparse-embeddings', title: 'Dense vs Sparse', description: 'Semantic vectors vs keyword matching — when each wins.', readTime: '8 min', component: DenseVsSparseEmbeddings },
            { id: 'commercial-embedding-models', title: 'Commercial Models', description: 'OpenAI, Cohere, Voyage, and Google embedding APIs compared.', readTime: '10 min', component: CommercialEmbeddingModels },
            { id: 'open-source-embeddings', title: 'Open-Source Models', description: 'BGE, E5, MiniLM — running embeddings locally.', readTime: '10 min', component: OpenSourceEmbeddings },
            { id: 'specialized-embeddings', title: 'Specialized Embeddings', description: 'Multimodal, code, and domain-specific models.', readTime: '8 min', component: SpecializedEmbeddings },
            { id: 'popular-embedding-questions', title: 'Popular Questions', description: 'abc vs ABC, mixing models, negation, dimensions — detailed FAQ.', readTime: '14 min', component: PopularEmbeddingQuestions },
          ],
        },
        {
          id: 'embeddings-papers',
          title: 'Research Papers',
          lessons: [
            { id: 'sentence-bert', title: 'Sentence-BERT', description: 'Full paper walkthrough — Siamese BERT, pooling, 10,000× speedup, sentence-transformers.', readTime: '18 min', component: SentenceBert },
            { id: 'dense-passage-retrieval', title: 'Dense Passage Retrieval', description: 'Full paper walkthrough — dual encoders, contrastive training, beating BM25 by 9–19%.', readTime: '18 min', component: DensePassageRetrieval },
            { id: 'e5-text-embeddings', title: 'E5 Embeddings', description: 'Full paper walkthrough — weakly-supervised contrastive learning, query:/passage: prefixes.', readTime: '18 min', component: E5TextEmbeddings },
          ],
        },
      ],
    },
    {
      id: 'chunking-strategies',
      title: 'Chunking Strategies',
      sections: [
        {
          id: 'chunking-lessons',
          title: 'Lessons',
          lessons: [
            { id: 'introduction-to-chunking', title: 'Introduction to Chunking', description: 'Why chunk, what a chunk contains, and why bad chunks break RAG.', readTime: '6 min', component: IntroductionToChunking },
            { id: 'fixed-and-recursive-chunking', title: 'Fixed & Recursive Splitting', description: 'Fixed-size vs recursive character splitting with worked examples.', readTime: '10 min', component: FixedAndRecursiveChunking },
            { id: 'structure-aware-chunking', title: 'Structure-Aware Chunking', description: 'Split on headings, pages, and records.', readTime: '8 min', component: StructureAwareChunking },
            { id: 'semantic-chunking', title: 'Semantic Chunking', description: 'Group sentences by topic similarity — boundaries where meaning shifts.', readTime: '10 min', component: SemanticChunking },
            { id: 'chunk-size-and-overlap', title: 'Chunk Size & Overlap', description: 'Tuning parameters by use case with an empirical workflow.', readTime: '8 min', component: ChunkSizeAndOverlap },
          ],
        },
        {
          id: 'chunking-papers',
          title: 'Research Papers',
          lessons: [
            { id: 'lost-in-the-middle', title: 'Lost in the Middle', description: 'Full paper walkthrough — U-shaped attention, experiments, k=3–7 and chunk ordering.', readTime: '18 min', component: LostInTheMiddle },
            { id: 'rag-best-practices-survey', title: 'RAG Best Practices Survey', description: 'Full paper walkthrough — systematic benchmark of chunking, retrieval, and reranking.', readTime: '20 min', component: RagBestPracticesSurvey },
          ],
        },
      ],
    },
    {
      id: 'vector-databases',
      title: 'Vector Databases',
      sections: [
        {
          id: 'vector-databases-lessons',
          title: 'Lessons',
          lessons: [
            { id: 'vector-databases-overview', title: 'Overview', description: 'Library analogy, insert/query walkthrough, ANN vs exact search, and a 30-second picker.', readTime: '10 min', component: VectorDatabasesOverview },
            { id: 'faiss', title: 'FAISS', description: 'Similarity math library — what it does, what it cannot do, and index types explained.', readTime: '10 min', component: FaissVectorDb },
            { id: 'chromadb', title: 'ChromaDB', description: 'Collections, documents, queries — a full walkthrough with concrete examples.', readTime: '10 min', component: ChromaDb },
            { id: 'pinecone', title: 'Pinecone', description: 'Managed cloud vector DB — index, upsert, namespace, and query explained plainly.', readTime: '10 min', component: PineconeDb },
            { id: 'weaviate-and-pgvector', title: 'Weaviate & pgvector', description: 'Hybrid search vs SQL vector columns — when each wins, with real query examples.', readTime: '12 min', component: WeaviateAndPgvector },
            { id: 'qdrant-and-milvus', title: 'Qdrant & Milvus', description: 'Rich payload filters, billion-vector scale, and a full comparison of all seven options.', readTime: '12 min', component: QdrantAndMilvus },
          ],
        },
        {
          id: 'vector-databases-papers',
          title: 'Research Papers',
          lessons: [
            { id: 'hnsw-ann-search', title: 'HNSW', description: 'Full paper walkthrough — hierarchical graph layers, greedy traversal, ef_search tuning.', readTime: '18 min', component: HnswAnnSearch },
            { id: 'faiss-billion-scale', title: 'FAISS (Billion-Scale)', description: 'Full paper walkthrough — IVF, Product Quantization, GPU search at billion scale.', readTime: '18 min', component: FaissBillionScale },
          ],
        },
      ],
    },
    {
      id: 'retrieval-strategies',
      title: 'Retrieval Strategies',
      sections: [
        {
          id: 'retrieval-lessons',
          title: 'Lessons',
          lessons: [
            { id: 'retrieval-overview', title: 'Retrieval Overview', description: 'Strategy landscape and choosing k.', readTime: '6 min', component: RetrievalOverview },
            { id: 'dense-retrieval', title: 'Dense / Semantic Search', description: 'Embedding similarity retrieval — the RAG default.', readTime: '8 min', component: DenseRetrieval },
            { id: 'bm25-keyword-search', title: 'BM25 & Keyword Search', description: 'Term frequency ranking for exact IDs and references.', readTime: '10 min', component: Bm25KeywordSearch },
            { id: 'hybrid-search-and-rrf', title: 'Hybrid Search & RRF', description: 'Dense + BM25 merged with Reciprocal Rank Fusion.', readTime: '10 min', component: HybridSearchAndRrf },
            { id: 'mmr-and-reranking', title: 'MMR & Reranking', description: 'Diversity-aware selection and cross-encoder precision.', readTime: '10 min', component: MmrAndReranking },
            { id: 'advanced-retrieval-strategies', title: 'Advanced Strategies', description: 'HyDE, multi-query, parent-document, query decomposition.', readTime: '10 min', component: AdvancedRetrievalStrategies },
          ],
        },
        {
          id: 'retrieval-papers',
          title: 'Research Papers',
          lessons: [
            { id: 'hyde-zero-shot-retrieval', title: 'HyDE', description: 'Full paper walkthrough — hypothetical document embeddings for zero-shot dense retrieval.', readTime: '18 min', component: HydeZeroShotRetrieval },
            { id: 'colbert-late-interaction', title: 'ColBERT', description: 'Full paper walkthrough — late interaction, token-level matching, between bi- and cross-encoder.', readTime: '20 min', component: ColbertLateInteraction },
            { id: 'self-rag', title: 'Self-RAG', description: 'Full paper walkthrough — adaptive retrieval, reflection tokens, candidate selection.', readTime: '20 min', component: SelfRag },
          ],
        },
      ],
    },
    {
      id: 'evaluating-rag',
      title: 'Evaluating RAG',
      sections: [
        {
          id: 'evaluating-lessons',
          title: 'Lessons',
          lessons: [
            { id: 'rag-evaluation-overview', title: 'Evaluation Overview', description: 'Retrieval vs generation — two dimensions, one test set.', readTime: '8 min', component: RagEvaluationOverview },
            { id: 'retrieval-metrics', title: 'Retrieval Metrics', description: 'Recall@k, MRR, NDCG — measuring retrieval quality.', readTime: '10 min', component: RetrievalMetrics },
            { id: 'generation-faithfulness-metrics', title: 'Generation & Faithfulness', description: 'Answer relevance, groundedness, and LLM-as-judge.', readTime: '8 min', component: GenerationFaithfulnessMetrics },
            { id: 'rag-limitations-and-debugging', title: 'Limitations & Debugging', description: 'When RAG fails, debugging checklist, tuning order.', readTime: '10 min', component: RagLimitationsAndDebugging },
            { id: 'evaluation-frameworks', title: 'Evaluation Frameworks', description: 'RAGAS, DeepEval, TruLens, LangSmith — tools overview.', readTime: '8 min', component: EvaluationFrameworks },
          ],
        },
        {
          id: 'evaluating-papers',
          title: 'Research Papers',
          lessons: [
            { id: 'ragas-evaluation', title: 'RAGAS', description: 'Full paper walkthrough — faithfulness, relevancy, context metrics, claim extraction.', readTime: '18 min', component: RagasEvaluation },
            { id: 'ares-automated-evaluation', title: 'ARES', description: 'Full paper walkthrough — lightweight judge models for scalable production eval.', readTime: '18 min', component: AresAutomatedEvaluation },
          ],
        },
      ],
    },
  ],
}
