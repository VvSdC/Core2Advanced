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

export function ConfidentialDocumentsAndRedaction() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Read this after">
        Read <em>Enterprise Ingestion Pipelines</em> first. It introduced the metadata that this lesson builds
        on — ACLs, tenant IDs, and sensitivity labels.
      </Callout>

      <Definition term="Confidential RAG">
        <p>
          Not every user should see every document. HR handbooks, salary bands, legal memos, customer PII,
          medical records, and unreleased product plans all sit in the same corpus as harmless public wikis.{' '}
          <span className="text-genai-400">Confidential RAG</span> is the set of controls that ensure a user
          only sees answers built from chunks they are personally allowed to read — and that PII is removed or
          redacted before it ever reaches the model.
        </p>
      </Definition>

      <LessonSection title="Two problems, two layers">
        <p className="text-slate-300">
          Confidentiality in RAG splits cleanly into two concerns. Solve them separately.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Problem</th>
                <th className="px-4 py-3">Where you solve it</th>
                <th className="px-4 py-3">Mechanism</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Access — who can see which document?</td>
                <td className="px-4 py-3 text-slate-400">At retrieval time</td>
                <td className="px-4 py-3 text-slate-400">Metadata filter on ACL / tenant / sensitivity</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Content — is PII / secret text inside the doc?</td>
                <td className="px-4 py-3 text-slate-400">At ingestion (mostly) and again pre-generation</td>
                <td className="px-4 py-3 text-slate-400">Detect + redact / tokenise / block</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Layer 1 — access control at retrieval">
        <Flowchart
          title="ACL-aware retrieval"
          chart={`flowchart LR
  U[User query + identity]
  U --> Q[Embed query]
  U --> IDP[Look up user's groups from IdP]
  Q --> S[Vector search]
  IDP --> F[ACL filter]
  S --> F
  F --> R[Only allowed chunks]
  R --> LLM[LLM]`}
        />
        <ContentStep number={1} title="Store ACLs on every chunk">
          <p className="text-slate-300">
            During ingestion, copy the source document&rsquo;s ACL onto every chunk. Store it as arrays of user
            IDs and group IDs in the vector database metadata. Do not compute ACLs at query time — that turns
            into an N+1 request pattern.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Filter, don't post-filter">
          <p className="text-slate-300">
            All major vector stores support metadata filters that run{' '}
            <em>alongside</em> the ANN search (Pinecone, Qdrant, Milvus, pgvector with hybrid queries). Filtering{' '}
            <strong className="text-white">during</strong> search preserves top-k quality. Filtering{' '}
            <strong className="text-white">after</strong> search (post-filter) breaks it — you can silently drop
            the entire top-10 and be left with irrelevant tail chunks.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Model your identity">
          <p className="text-slate-300">
            Resolve the caller&rsquo;s identity from the auth token, expand it to the set of groups via the
            identity provider (Okta, Azure AD, Google Workspace), and cache that expansion per session. The
            retrieval filter then becomes:
          </p>
          <Example title="Access-filtered retrieval">{`def retrieve(query: str, user):
    groups = idp.groups_for(user.id)   # cached
    return store.search(
        vector=embed(query),
        k=10,
        filter={
            "$or": [
                {"acl.users":  {"$in": [user.id]}},
                {"acl.groups": {"$in": groups}},
                {"visibility": "public"},
            ],
            "tenant": user.tenant_id,   # hard tenant isolation
        },
    )`}</Example>
        </ContentStep>
        <ContentStep number={4} title="Multi-tenant isolation">
          <p className="text-slate-300">
            For B2B SaaS RAG, tenant leakage is the failure that ends careers. Two safer patterns:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
            <li><strong className="text-white">Namespaces / collections per tenant</strong> — hardest to leak because you cannot even address another tenant&rsquo;s vectors.</li>
            <li><strong className="text-white">Shared index with mandatory tenant filter</strong> — cheaper, but every query must carry the filter. Enforce it in one place (a retrieval SDK), never in application code.</li>
          </ul>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Layer 2 — data redaction and PII handling">
        <p className="text-slate-300">
          Even documents a user is allowed to read may contain sensitive fields — credit card numbers, national
          IDs, phone numbers, health data — that should not be embedded, logged, or sent to a hosted LLM.
        </p>
        <ContentStep number={1} title="What to redact">
          <p className="text-slate-300">
            <strong className="text-white">Direct identifiers</strong> — SSN, national ID, credit card, IBAN,
            passport. <strong className="text-white">Quasi-identifiers</strong> — full name + date of birth,
            phone, email, address. <strong className="text-white">Regulated content</strong> — PHI (HIPAA),
            payment data (PCI-DSS), children&rsquo;s data (COPPA), and anything your DPA calls &ldquo;special
            category&rdquo; under GDPR.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Detect — regex + NER + LLM">
          <p className="text-slate-300">
            Three layers, in this order: <em>regex</em> for structured formats (Luhn-checked cards, IBAN, SSN),{' '}
            <em>NER</em> for names, addresses, orgs (Presidio, spaCy, Comprehend), and an{' '}
            <em>LLM classifier</em> only for edge cases the first two missed. Regex + NER catches ~95% at a
            fraction of the cost of an LLM pass.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Redact — five techniques, pick per field">
          <div className="overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Technique</th>
                  <th className="px-4 py-3">Effect</th>
                  <th className="px-4 py-3">When to use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-600">
                {[
                  ['Mask', '4111-1111-1111-1111 → **** **** **** 1111', 'You must still show the tail of the value'],
                  ['Replace with a tag', 'Ravi Kumar → [PERSON_1]', 'Model needs the shape of the entity, not the value'],
                  ['Tokenise (reversible)', 'Ravi Kumar → tok_9a2f...', 'You need to reconstruct the answer for the requester'],
                  ['Hash', 'ravi@x.com → sha256:0f...', 'Analytics without leaking the raw value'],
                  ['Drop entirely', 'Remove the sentence', 'The field has zero business value in RAG'],
                ].map(([t, e, w]) => (
                  <tr key={t}>
                    <td className="px-4 py-3 font-semibold text-white">{t}</td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{e}</td>
                    <td className="px-4 py-3 text-slate-400">{w}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Where to redact">
          <p className="text-slate-300">
            Redact at <strong className="text-white">ingestion</strong> so the vector store never contains
            secrets — that limits blast radius if the DB is exfiltrated. Redact again on the{' '}
            <strong className="text-white">outbound prompt</strong> as a belt-and-braces check right before the
            LLM call. And redact <strong className="text-white">logs and traces</strong> so debugging tools do
            not become a PII lake.
          </p>
          <Callout variant="insight" title="Redact before you embed, not after">
            Embeddings are reversible in expectation — you can partially reconstruct text from a vector with a
            trained inverter. If PII is in the text you embed, it is effectively in the vector.
          </Callout>
        </ContentStep>
        <ContentStep number={5} title="Reversible flow — when the user must see the real value">
          <p className="text-slate-300">
            For workflows like &ldquo;draft a reply email to the customer&rdquo;, replace PII with a{' '}
            <strong className="text-white">reversible token</strong> before the LLM, then swap the token back
            for the real value in the final response only when the requesting user is entitled to it. The LLM
            never sees the raw value; the recipient still gets a personalised email.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Reference flow">
        <Example title="End-to-end redaction wrapper">{`from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine

analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()

def redact(text: str, reversible: bool = False) -> tuple[str, dict]:
    findings = analyzer.analyze(text=text, language="en")
    if not findings:
        return text, {}

    if reversible:
        mapping = {}
        for f in findings:
            token = f"tok_{secrets.token_hex(6)}"
            mapping[token] = text[f.start:f.end]
            text = text[:f.start] + token + text[f.end:]
        return text, mapping
    else:
        result = anonymizer.anonymize(text=text, analyzer_results=findings)
        return result.text, {}   # irreversible

# --- ingestion side ---
clean, _ = redact(chunk_text, reversible=False)
store.upsert(id=chunk_id, vector=embed(clean), text=clean, metadata=meta)

# --- query side (reversible flow) ---
clean_ctx, mapping = redact("\\n".join(retrieved_chunks), reversible=True)
answer = llm.generate(prompt=build(clean_ctx, user_query))
for tok, real in mapping.items():
    if user.can_see(real):
        answer = answer.replace(tok, real)
return answer`}</Example>
      </LessonSection>

      <LessonSection title="Compliance patterns worth knowing">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Data residency</strong> — some regulations require EU data to stay in the EU. Keep separate vector stores per region and route by tenant metadata.</li>
          <li><strong className="text-white">Right to erasure (GDPR Art. 17)</strong> — a delete must remove the raw doc, its chunks, its cached embeddings, its logs, and its trace history. Wire delete through every store.</li>
          <li><strong className="text-white">Audit trails</strong> — log (user, query, retrieved chunk IDs, redactions applied, answer). Enough to reconstruct any answer for a compliance review.</li>
          <li><strong className="text-white">Hosted vs on-prem models</strong> — for the most sensitive corpora, run inference on a self-hosted model (vLLM, TGI) so raw text never leaves your VPC even for a millisecond.</li>
          <li><strong className="text-white">Zero-retention flags</strong> — when you must use a hosted LLM, set the provider&rsquo;s zero-retention header and record the confirmation.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Confidential RAG is two problems: who can see the doc (access) and what is inside the doc (content).',
          'Enforce access with metadata filters run DURING the vector search — never post-filter, never trust application code alone.',
          'Multi-tenant systems must isolate by namespace or a mandatory tenant filter; leakage between tenants is unforgivable.',
          'Redact PII at ingestion so the vector store never holds secrets; embeddings can leak content, so redact BEFORE you embed.',
          'Use reversible tokenisation only when the requesting user is entitled to see the real value — otherwise anonymise once and permanently.',
          'Wire deletes, audit logs, region routing, and zero-retention flags — compliance failures are the fastest way to lose a RAG program.',
        ]}
      />
    </LessonArticle>
  )
}
