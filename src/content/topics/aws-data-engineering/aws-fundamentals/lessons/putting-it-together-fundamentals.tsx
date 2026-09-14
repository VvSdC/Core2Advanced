import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherFundamentals() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="You made it through AWS Fundamentals">
        Cloud models, global infrastructure, scalability, reliability, cost, Well-Architected thinking,
        multi-AZ/Region design, RTO/RPO, stateless workers, pricing tags, and audit basics — these are
        the vocabulary every later service lesson assumes. This page ties the threads into one mental
        model before you open the IAM module.
      </Callout>

      <Definition term="Fundamentals mental model">
        <p>
          A production data platform on AWS is a stack of decisions: <strong className="text-white">where</strong>{' '}
          data lives (Region, AZ, S3 tiers), <strong className="text-white">who</strong> can touch it (IAM —
          next sub-topic), <strong className="text-white">how</strong> it scales and survives failure
          (elasticity, HA, DR), and <strong className="text-white">how much</strong> it costs and how you
          prove compliance (tags, trails, Config). Services like Glue and Redshift are knobs on this
          frame — not the frame itself.
        </p>
      </Definition>

      <LessonSection title="Mental model map — everything in this sub-topic">
        <Flowchart
          title="AWS Fundamentals map for data engineering"
          chart={`flowchart TB
  START[AWS Fundamentals]
  START --> CLOUD[Cloud basics — IaaS PaaS SaaS deployment]
  START --> INFRA[Global infra — Region AZ Edge]
  START --> SCALE[Scale — elasticity throughput latency]
  START --> REL[Reliability — availability durability HA DR]
  START --> ARCH[Well-Architected six pillars]
  START --> GEO[Multi-AZ and multi-Region]
  START --> RTO[RTO RPO backup vs DR]
  START --> STATE[Scaling and stateless workers]
  START --> COST[Cost pricing tags Organizations]
  START --> GOV[CloudTrail and Config overview]
  CLOUD --> IAMNEXT
  INFRA --> IAMNEXT
  SCALE --> IAMNEXT
  REL --> IAMNEXT
  ARCH --> IAMNEXT
  GEO --> IAMNEXT
  RTO --> IAMNEXT
  STATE --> IAMNEXT
  COST --> IAMNEXT
  GOV --> IAMNEXT
  IAMNEXT[IAM — identity and access next]`}
        />
      </LessonSection>

      <LessonSection title="How fundamentals prepare you for IAM">
        <ContentStep number={1} title="Shared responsibility → permissions">
          <p className="text-slate-300">
            You learned AWS secures the cloud; you secure what you put in it. IAM is how you enforce that —
            roles for Glue instead of access keys in Git, least privilege on S3 prefixes, no root for
            daily work.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Multi-account and audit → IAM structure">
          <p className="text-slate-300">
            Organizations, tagging, CloudTrail, and Config only work with coherent IAM — cross-account roles,
            service-linked roles, and separation of duties. Fundamentals explained <em>why</em> split accounts;
            IAM shows <em>how</em> principals access resources safely.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Reliability and cost → role design">
          <p className="text-slate-300">
            Auto Scaling and Lambda need roles that can read specific buckets and write specific paths — not
            AdministratorAccess. Designing policies connects Well-Architected Security and Cost pillars to
            everyday pipeline code.
          </p>
        </ContentStep>
        <Flowchart
          title="From fundamentals to IAM to pipelines"
          chart={`flowchart LR
  FUND[Fundamentals complete]
  FUND --> IAM[IAM — users roles policies]
  IAM --> S3[S3 — lake storage]
  S3 --> COMPUTE[EC2 Lambda Glue]
  COMPUTE --> WH[Redshift Athena — serve data]
  WH --> OPS[CloudWatch CloudTrail — operate safely]`}
        />
      </LessonSection>

      <LessonSection title="Checklist before moving on">
        <p className="text-slate-300">
          Pause here if any item feels fuzzy — IAM will feel painful without these anchors.
        </p>
        <ContentStep number={1} title="Infrastructure vocabulary">
          <p className="text-slate-300">
            Can you explain Region vs AZ vs Edge location, and when multi-AZ differs from multi-Region?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Quality attributes">
          <p className="text-slate-300">
            Can you contrast availability, durability, and fault tolerance with a lake example?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Scale and state">
          <p className="text-slate-300">
            Can you describe why Glue workers should be stateless and where watermarks should live?
          </p>
        </ContentStep>
        <ContentStep number={4} title="DR and SLAs">
          <p className="text-slate-300">
            Can you define RTO and RPO for a nightly batch job vs a near-real-time dashboard?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Cost and governance">
          <p className="text-slate-300">
            Can you name three cost levers and four recommended cost tags? Do you know CloudTrail vs Config
            in one sentence each?
          </p>
        </ContentStep>
        <ContentStep number={6} title="Well-Architected lens">
          <p className="text-slate-300">
            Can you give one data-engineering example for Security, Reliability, and Cost Optimization
            pillars?
          </p>
        </ContentStep>
        <Callout variant="tip" title="Ready for IAM when…">
          You can sketch a simple architecture — ingestion to S3 in one Region, Multi-AZ metadata DB,
          tagged resources, backups with stated RPO, and IAM roles (conceptually) connecting services —
          without looking at notes. Then open the IAM sub-topic.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next in the course">
        <p className="text-slate-300">
          IAM unlocks everything else: S3 bucket policies, Glue job roles, Lambda execution roles, Redshift
          COPY credentials, and cross-account lake access. After IAM you will touch EC2, S3, Lambda, and
          build toward Glue orchestration and an end-to-end project. Each module reuses the fundamentals
          you just completed — return to this checklist whenever a design review feels overwhelming.
        </p>
        <Callout variant="insight">
          Strong fundamentals do not mean memorizing every AWS service. They mean asking the right
          questions before you click Create: Region, identity, durability, cost, and who audits changes.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Fundamentals = where data lives, how it scales and survives, what it costs, and how you audit it — services plug into that frame.',
          'IAM is the logical next step: shared responsibility becomes roles, policies, and least privilege for every pipeline component.',
          'Use the checklist (infra, quality, state, DR, cost/governance, Well-Architected) as a course checkpoint before starting IAM.',
          'You are ready when you can sketch a tagged, Multi-AZ-aware lake architecture with backup targets and explain who can change it.',
        ]}
      />
    </LessonArticle>
  )
}
