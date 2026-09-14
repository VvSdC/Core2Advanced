import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function InstanceFamilies() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Pick the right engine for the workload">
        EC2 is not one machine type — it is a catalog of families optimized for different bottlenecks.
        For data engineering, the wrong family wastes money (GPU for CSV parsing) or time (general purpose
        for a 200 GB in-memory Spark shuffle). Learn the five main families and map them to ETL patterns
        before you size a cluster.
      </Callout>

      <Definition term="Instance family">
        <p>
          An <strong className="text-white">instance family</strong> is a group of EC2 types with similar
          hardware balance — CPU, memory, storage, and network. Names encode the family:{' '}
          <span className="font-mono text-sm">m7i.large</span> (general purpose),{' '}
          <span className="font-mono text-sm">c7i.xlarge</span> (compute),{' '}
          <span className="font-mono text-sm">r7i.2xlarge</span> (memory),{' '}
          <span className="font-mono text-sm">i4i.xlarge</span> (storage),{' '}
          <span className="font-mono text-sm">g5.xlarge</span> (GPU). Generation number (5, 6, 7) and
          suffix (i = Intel, a = AMD, g = Graviton) indicate chip generation and vendor.
        </p>
      </Definition>

      <LessonSection title="The five main families">
        <ContentStep number={1} title="General Purpose (M family)">
          <p className="text-slate-300">
            Balanced vCPU and RAM — the default for mixed workloads. Good for Airflow schedulers/webservers,
            small Python ETL runners, jump hosts, and dev boxes. Example:{' '}
            <span className="font-mono text-sm">m7i.large</span> (2 vCPU, 8 GiB). When you are unsure and
            the job is not clearly CPU-, memory-, or I/O-bound, start here and profile.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Compute Optimized (C family)">
          <p className="text-slate-300">
            Higher vCPU-to-memory ratio — batch compression, JSON parsing, lightweight transforms, Spark
            executors when CPU is the bottleneck. Example:{' '}
            <span className="font-mono text-sm">c7i.2xlarge</span>. Spark-like ETL with heavy UDF CPU work
            or many small partitions often benefits from C over M.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Memory Optimized (R / X family)">
          <p className="text-slate-300">
            High RAM per vCPU — in-memory Spark shuffles, large Pandas chunks, Redis/cache sidecars,
            Redshift-style sort/hash operations on single nodes. <span className="font-mono text-sm">R</span>{' '}
            is the workhorse; <span className="font-mono text-sm">X</span> (e.g. x2iedn) goes extreme for
            very large in-memory datasets. If jobs OOM on M or C, move to R before blindly adding nodes.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Storage Optimized (I / D family)">
          <p className="text-slate-300">
            Local NVMe SSD with very high IOPS and throughput — staging large files before S3 upload,
            high-throughput log ingestion, temporary shuffle spill when EBS would throttle.{' '}
            <span className="font-mono text-sm">I</span> instances pair with instance store (ephemeral);
            data is lost on stop/terminate unless copied to EBS/S3. Use when local disk speed beats network
            to S3 for a hot path.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Accelerated Computing (P / G / Inf family)">
          <p className="text-slate-300">
            GPUs or custom accelerators — deep learning training/inference, GPU-accelerated Spark (RAPIDS),
            video transcoding pipelines. <span className="font-mono text-sm">G</span> (e.g. g5) for
            inference and moderate training; <span className="font-mono text-sm">P</span> for heavy training.
            Most classic SQL/CSV ETL does not need GPU — reserve these for ML feature pipelines or RAPIDS.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="DE workload → family cheat sheet">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Workload pattern</th>
                <th className="px-4 py-3">Likely family</th>
                <th className="px-4 py-3">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Spark-like distributed ETL (EMR / self-managed)',
                  'C or R executors + M driver',
                  'Executors: CPU-bound → C; shuffle/cache-heavy → R; driver stays small on M',
                ],
                [
                  'Memory-heavy single-node Python (large Pandas / Polars)',
                  'R or X',
                  'Avoid OOM; RAM often limits before CPU on one box',
                ],
                [
                  'Airflow metadata DB + scheduler + webserver',
                  'M (small) or R if heavy DAG parsing',
                  'Balanced; scale web/scheduler separately in prod',
                ],
                [
                  'Local staging before S3 (high write MB/s)',
                  'I + instance store',
                  'NVMe throughput; sync to S3 before terminate',
                ],
                [
                  'GPU ML inference on feature vectors',
                  'G (g5, etc.)',
                  'CUDA workloads; not for plain SQL ETL',
                ],
                [
                  'Nightly batch on fixed schedule, cost-sensitive',
                  'Graviton (m7g, c7g, r7g)',
                  'Often 10–20% better price/performance vs x86 for same family tier',
                ],
              ].map(([workload, family, why]) => (
                <tr key={workload} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{workload}</td>
                  <td className="px-4 py-3">{family}</td>
                  <td className="px-4 py-3">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Right-sizing flow: start M → watch CloudWatch (CPUUtilization, mem_used from agent) → if CPU
          pegged and RAM low, try C; if OOM or high swap, try R; if disk wait high on EBS, try gp3/io2
          tuning or I family for local staging.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Five families: General Purpose (M), Compute (C), Memory (R/X), Storage (I), Accelerated (P/G) — name encodes balance.',
          'Spark-like ETL: C executors for CPU-heavy transforms; R executors for shuffle/cache-heavy jobs; M for drivers and orchestration.',
          'Memory-heavy single-node ETL and large in-memory joins → R or X before adding more nodes.',
          'GPU (G/P) only when the pipeline uses CUDA/RAPIDS or ML inference — not default for CSV/SQL batch.',
          'Storage-optimized I instances use fast local NVMe — great for staging; data must be copied to S3/EBS before instance termination.',
        ]}
      />
    </LessonArticle>
  )
}
