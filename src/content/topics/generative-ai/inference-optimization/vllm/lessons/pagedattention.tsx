import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

export function PagedAttention() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Efficient Memory Management for Large Language Model Serving with PagedAttention"
        authors="Woosuk Kwon et al."
        year="2023"
        venue="SOSP"
        url="https://arxiv.org/abs/2309.06180"
      >
        PagedAttention is the core innovation behind vLLM. It borrows the idea of virtual memory paging from
        operating systems and applies it to KV cache storage on GPU.
      </ResearchPaperHeader>

      <LessonSection title="The problem: fragmented, wasted GPU memory">
        <p className="text-slate-300">
          In naive LLM serving, each request gets a <strong className="text-white">pre-allocated contiguous
          block</strong> of GPU memory for its KV cache — sized for the maximum possible sequence length (e.g.
          8,192 tokens), even if the conversation only uses 200 tokens.
        </p>
        <Callout variant="beginner" title="Analogy: reserving a banquet hall for two people">
          Imagine a restaurant that reserves a 500-seat banquet hall every time a couple walks in, &quot;just in
          case&quot; they invite 498 friends later. Most of the room sits empty. Worse, when a party of 6 arrives
          and the only free halls are three scattered two-seat tables, the restaurant cannot seat them — even
          though plenty of chairs exist in total. That is <strong className="text-white">fragmentation</strong>.
        </Callout>
        <p className="mt-4 text-slate-300">
          Naive KV cache allocation causes two problems:
        </p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Internal fragmentation</strong> — reserved but unused memory inside
            each request&apos;s block (a 200-token chat wasting space for 8,000 tokens).
          </li>
          <li>
            <strong className="text-white">External fragmentation</strong> — free memory exists but in scattered
            chunks too small to fit a new request&apos;s contiguous allocation.
          </li>
        </ul>
        <p className="mt-4 text-slate-300">
          Result: GPU memory utilization as low as <strong className="text-white">20–40%</strong> in practice,
          meaning you can serve far fewer concurrent users than the hardware should allow.
        </p>
      </LessonSection>

      <Definition term="PagedAttention">
        <p>
          <strong className="text-white">PagedAttention</strong> stores each request&apos;s KV cache in{' '}
          <strong className="text-white">fixed-size pages</strong> (blocks of tokens) that do not need to be
          contiguous in GPU memory. A <strong className="text-white">block table</strong> maps logical token
          positions to physical page addresses — exactly like an OS page table maps virtual to physical memory.
        </p>
        <p className="mt-3">
          Pages are allocated <em>on demand</em> as the sequence grows. When a request finishes, its pages are
          freed and can be immediately reused by new requests — no wasted reserved space.
        </p>
      </Definition>

      <LessonSection title="How page tables map logical to physical memory">
        <Flowchart
          title="PagedAttention block table (per request)"
          chart={`flowchart TB
  subgraph logical ["Logical KV cache — Request A (7 tokens)"]
    L0[Token 0] --> L1[Token 1]
    L1 --> L2[Token 2]
    L2 --> L3[Token 3]
    L3 --> L4[Token 4]
    L4 --> L5[Token 5]
    L5 --> L6[Token 6]
  end
  subgraph table ["Block table"]
    BT0["Slot 0 → Physical block 7"]
    BT1["Slot 1 → Physical block 2"]
  end
  subgraph physical ["Physical GPU memory — shared pool"]
  P2[Block 2: tokens 4-7]
  P7[Block 0-3: tokens 0-3]
  P9[Block 9: free]
  P12[Block 12: free]
  end
  L0 -.-> BT0
  L4 -.-> BT1
  BT0 --> P7
  BT1 --> P2`}
        />
        <p className="mt-4 text-slate-300">
          Each <strong className="text-white">physical block</strong> holds K and V for a fixed number of tokens
          (e.g. 16 tokens per block). Request A uses 2 blocks for 7 tokens — only those 2 blocks are allocated.
          Blocks 9 and 12 are free and available for other requests.
        </p>
        <Callout variant="tip" title="Non-contiguous is fine">
          Attention kernels in vLLM read through the block table, so K/V data does not need to sit in one
          continuous memory region. The GPU gathers the right pages at attention time — transparent to the
          model math.
        </Callout>
      </LessonSection>

      <LessonSection title="Memory copy-on-write and sharing">
        <p className="text-slate-300">
          PagedAttention also enables advanced memory optimizations:
        </p>
        <ContentStep number={1} title="Copy-on-write for parallel sampling">
          <p>
            When one prompt generates multiple completions (n=4), all sequences share the same KV cache pages
            for the <em>prompt</em> portion. Only when generated tokens diverge do new pages get allocated —
            saving memory proportional to prompt length × (n − 1).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Prefix caching">
          <p>
            If many requests share the same system prompt or document prefix, vLLM can reuse cached pages for
            that prefix instead of recomputing and re-storing K/V. The block table points multiple requests at
            the same physical blocks (read-only) until a token diverges.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Results: near-zero waste, more concurrent requests">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-slate-400">Naive contiguous allocation</div>
              <div className="mt-1 text-slate-300">~20–40% GPU memory utilization</div>
              <div className="mt-1 text-red-400">Frequent OOM despite &quot;free&quot; memory</div>
            </div>
            <div>
              <div className="text-slate-400">PagedAttention (vLLM)</div>
              <div className="mt-1 text-genai-400">~95%+ memory utilization</div>
              <div className="mt-1 text-emerald-400">2–4× more concurrent requests on same GPU</div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-slate-300">
          The vLLM paper (2023) demonstrated up to <strong className="text-white">24× higher throughput</strong>{' '}
          than HuggingFace Transformers and <strong className="text-white">3.5× higher</strong> than prior
          serving systems like Orca, primarily by eliminating KV cache waste and enabling better batching.
        </p>
        <Flowchart
          title="Before vs after PagedAttention"
          chart={`flowchart LR
  subgraph before ["Before — contiguous blocks"]
    B1[Req 1: 8K reserved, 200 used]
    B2[Req 2: 8K reserved, 500 used]
    B3[Req 3: cannot allocate — fragmented]
  end
  subgraph after ["After — paged blocks"]
    A1[Req 1: 13 pages allocated]
    A2[Req 2: 32 pages allocated]
    A3[Req 3: 8 pages allocated]
    POOL[(Shared page pool — high utilization)]
    A1 --> POOL
    A2 --> POOL
    A3 --> POOL
  end`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Naive KV cache allocation reserves max-length contiguous blocks — causing internal and external fragmentation.',
          'PagedAttention stores KV cache in fixed-size pages with a block table mapping logical → physical addresses.',
          'Pages are allocated on demand and freed when requests finish — like OS virtual memory paging.',
          'Near-zero memory waste enables 2–4× more concurrent requests on the same GPU.',
          'Introduced in the vLLM paper (Kwon et al., SOSP 2023) — the foundation of vLLM\'s throughput advantage.',
        ]}
      />
    </LessonArticle>
  )
}
