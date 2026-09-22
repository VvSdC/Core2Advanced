import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function EnterpriseIngestion() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Read this after">
        Complete <em>RAG Architecture</em> and the <em>Chunking</em> track first. Those lessons introduced the
        indexing pipeline with one PDF. This lesson scales it up to a company with hundreds of sources.
      </Callout>

      <Definition term="Enterprise ingestion">
        <p>
          In a demo you drop one PDF into a folder. In a company, documents live in{' '}
          <strong className="text-white">SharePoint, Confluence, Jira, Salesforce, S3 buckets, wikis, ticket
          systems, and databases</strong> — each with its own API, its own permissions, and its own update
          cadence. <span className="text-genai-400">Enterprise ingestion</span> is the pipeline that pulls all of
          that in, keeps it fresh, and turns it into searchable chunks — reliably, incrementally, and without
          losing metadata the retriever will later need.
        </p>
      </Definition>

      <LessonSection title="The five stages of a real ingestion pipeline">
        <p className="text-slate-300">
          Every enterprise RAG system has the same five stages under the hood. Name them, own them, monitor them
          separately.
        </p>
        <Flowchart
          title="Ingestion pipeline (offline)"
          chart={`flowchart LR
  CONN[1. Connectors] --> PARSE[2. Parse & normalise]
  PARSE --> ENRICH[3. Enrich metadata]
  ENRICH --> CHUNK[4. Chunk & embed]
  CHUNK --> INDEX[5. Index + version]
  INDEX --> STORE[(Vector store + metadata store)]`}
        />
        <ContentStep number={1} title="Connectors — how documents enter">
          <p className="text-slate-300">
            One connector per source system. Common ones: SharePoint / OneDrive, Confluence, Notion, Google
            Drive, Slack, Jira, Zendesk, Salesforce, S3, GCS, Azure Blob, and internal databases via ODBC/JDBC.
            Each returns a document plus its <em>source metadata</em>: the URL, author, owner, timestamps, and —
            critically — the ACL (who is allowed to see it).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Parse & normalise — turn bytes into text">
          <p className="text-slate-300">
            PDFs, DOCX, HTML, PPTX, images, and audio all need format-specific handling. Scanned PDFs need OCR
            (Tesseract, Azure Document Intelligence, AWS Textract). Slides and spreadsheets need layout-aware
            parsers (Unstructured, LlamaParse, Docling) so tables and headings survive. The output of this stage
            is <strong className="text-white">clean text plus a structure map</strong> — sections, tables,
            figures — that downstream chunking can respect.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Enrich — attach metadata the retriever will need later">
          <p className="text-slate-300">
            Metadata is what makes filtering, routing, and access control work at query time. Attach as much as
            you can afford:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
            <li><strong className="text-white">Provenance</strong> — source system, URL, path, version, last-modified.</li>
            <li><strong className="text-white">Access</strong> — user IDs, group IDs, tenant ID, sensitivity label.</li>
            <li><strong className="text-white">Semantic</strong> — product line, geography, language, topic tags.</li>
            <li><strong className="text-white">Structural</strong> — parent doc ID, section heading, page number.</li>
          </ul>
          <Callout variant="tip" title="Add metadata now, thank yourself later">
            Every filter, every citation, every &ldquo;why did the bot see this doc?&rdquo; debug question comes
            from this stage. Missing metadata is the single most common enterprise-RAG mistake.
          </Callout>
        </ContentStep>
        <ContentStep number={4} title="Chunk & embed — same as before, at fleet scale">
          <p className="text-slate-300">
            The chunking rules from the Chunking track apply here. What changes: you run them in parallel
            workers, cache embeddings by content hash so unchanged chunks are not re-embedded, and batch calls
            to the embedding provider to hit rate limits gracefully.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Index + version — write to the store">
          <p className="text-slate-300">
            Upsert vectors and metadata into the vector store. Keep a <strong className="text-white">document
            version</strong> alongside the chunk so a rollback is a metadata query, not a re-index. Support two
            write modes: <em>full rebuild</em> (rare, for reindexing decisions like new chunk sizes) and{' '}
            <em>incremental</em> (default, only touched documents).
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Incremental vs full — CDC in one page">
        <p className="text-slate-300">
          Enterprises produce thousands of edits a day. Re-embedding everything nightly burns money and slows
          freshness. Use <strong className="text-white">change data capture (CDC)</strong>: only touch what
          changed.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Signal</th>
                <th className="px-4 py-3">Where it comes from</th>
                <th className="px-4 py-3">What you do</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Webhook / event', 'SharePoint, Confluence, Slack push notifications', 'Ingest the one document immediately'],
                ['Polling window', 'API that supports "modifiedSince" queries', 'Every 5–15 min, fetch delta, ingest'],
                ['Cursor / journal', 'DB with an updated_at index or CDC log', 'Read forward from last checkpoint'],
                ['Full rebuild', 'You changed chunk size or embedding model', 'Rare — treat as a migration'],
              ].map(([sig, src, act]) => (
                <tr key={sig}>
                  <td className="px-4 py-3 font-semibold text-white">{sig}</td>
                  <td className="px-4 py-3 text-slate-400">{src}</td>
                  <td className="px-4 py-3 text-slate-400">{act}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="Delete is a first-class event">
          When a source document is deleted or archived, the corresponding vectors must be removed. A retrieval
          that returns chunks from a deleted policy is a compliance problem, not a bug. Wire delete events
          through the same pipeline.
        </Callout>
      </LessonSection>

      <LessonSection title="Deduplication, versioning, and quality gates">
        <ul className="mt-1 list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Dedupe near-identical text</strong> — the same policy PDF often lives in three folders. Hash content and keep one canonical record; other locations become aliases.</li>
          <li><strong className="text-white">Version, do not overwrite</strong> — keep the previous version until the new one is fully indexed and its answers pass eval. Then flip the pointer.</li>
          <li><strong className="text-white">Quarantine broken parses</strong> — OCR that returns 3 characters, scans that are 90% blank, ZIPs of nested archives. Route them to a dead-letter queue with a human reviewer.</li>
          <li><strong className="text-white">Language detection</strong> — a Portuguese doc embedded with an English-only model will retrieve poorly. Tag language and route to the right model or a multilingual one.</li>
          <li><strong className="text-white">Rate-limit backoff</strong> — connectors and embedding APIs both throttle. Retry with exponential backoff; log every 429 as a metric.</li>
        </ul>
      </LessonSection>

      <LessonSection title="A production reference pipeline">
        <Example title="Airflow / Prefect / cron — one worker, three stages">{`# schedule: every 10 minutes
def ingest_incremental(source: str, since: datetime):
    # 1) Fetch delta
    docs = connectors[source].list_changes(since)

    for d in docs:
        try:
            # 2) Parse + normalise
            text, structure = parsers[d.mime].parse(d.bytes)

            # 3) Enrich
            meta = {
                "source": source,
                "url": d.url,
                "acl": d.acl,               # list of user/group IDs
                "tenant": d.tenant_id,
                "sensitivity": classify_sensitivity(text),  # public / internal / confidential / secret
                "language": detect_lang(text),
                "version": d.version,
                "updated_at": d.modified_at.isoformat(),
            }

            # 4) Chunk + embed  (cache by content hash so unchanged text is free)
            for chunk in structure_aware_chunker(text, structure):
                vec = embed_with_cache(chunk.text)
                store.upsert(
                    id=f"{d.id}:{chunk.id}",
                    vector=vec,
                    text=chunk.text,
                    metadata={**meta, "section": chunk.section, "page": chunk.page},
                )

            # 5) Version pointer
            store.set_alias(d.id, version=d.version)

        except Exception as e:
            dead_letter.push(d, error=str(e))
            metrics.incr("ingest.failed", tags={"source": source})`}</Example>
        <Callout variant="tip" title="Own three dashboards from day one">
          Docs ingested per hour per source; embedding-cache hit rate; dead-letter queue size. Those three catch
          most incidents before users notice.
        </Callout>
      </LessonSection>

      <LessonSection title="Common pitfalls">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Symptom</th>
                <th className="px-4 py-3">Root cause</th>
                <th className="px-4 py-3">Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Bot cites a doc that was deleted', 'Delete events not wired', 'Handle delete/archive; delete vectors + set tombstones'],
                ['Same answer appears three times', 'Same doc in three folders, no dedupe', 'Hash-and-alias on content'],
                ['Stale answers after policy update', 'Nightly full rebuild only', 'Move to webhook / polling with a "since" cursor'],
                ['OCR gibberish in retrieved chunks', 'Scanned PDFs with no OCR', 'Detect image-heavy PDFs; route to OCR before chunking'],
                ['Costs exploding', 'Re-embedding unchanged text', 'Content-hash embedding cache; upsert only when hash changed'],
              ].map(([sym, cause, fix]) => (
                <tr key={sym}>
                  <td className="px-4 py-3 text-slate-300">{sym}</td>
                  <td className="px-4 py-3 text-slate-400">{cause}</td>
                  <td className="px-4 py-3 text-slate-400">{fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Enterprise ingestion is five stages: connectors, parse, enrich, chunk & embed, index + version.',
          'Metadata (provenance, ACL, sensitivity, structure) is attached during ingestion — it powers filtering, access control, and citations at query time.',
          'Default to incremental via webhooks or a "modifiedSince" cursor; treat full rebuilds as migrations.',
          'Delete is a first-class event: stale or archived docs must be removed from the vector store.',
          'Cache embeddings by content hash, dedupe near-duplicates, quarantine broken parses, and track three dashboards: throughput, cache hit rate, dead-letter queue.',
        ]}
      />
    </LessonArticle>
  )
}
