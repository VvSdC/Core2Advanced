import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function AwsGlobalInfrastructure() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="AWS is worldwide">
        When you use AWS, you choose <em>where</em> your resources live. That choice affects speed
        (latency), legal rules (data residency), and disaster recovery. Think of AWS as a map of
        Regions — each Region contains multiple isolated data centers called Availability Zones.
      </Callout>

      <Definition term="AWS global infrastructure">
        <p>
          AWS builds in <strong className="text-white">Regions</strong> (geographic areas), each with
          multiple <strong className="text-white">Availability Zones</strong> (isolated datacenters),
          plus <strong className="text-white">Edge Locations</strong> for caching and{' '}
          <strong className="text-white">Local Zones</strong> for ultra-low latency near large cities.
          Not every service is available in every Region — always check the Regional service list.
        </p>
      </Definition>

      <LessonSection title="The hierarchy">
        <ContentStep number={1} title="Region">
          <p className="text-slate-300">
            A named geographic area such as <span className="font-mono text-sm text-core-400">us-east-1</span>{' '}
            (N. Virginia) or <span className="font-mono text-sm text-core-400">ap-south-1</span>{' '}
            (Mumbai). Resources you create are Regional unless marked global (IAM, Route 53, CloudFront
            control plane). Your S3 bucket and Glue job live in exactly one Region unless you replicate.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Availability Zone (AZ)">
          <p className="text-slate-300">
            One or more discrete datacenters with independent power and networking within a Region.
            Names like <span className="font-mono text-sm text-core-400">us-east-1a</span>,{' '}
            <span className="font-mono text-sm text-core-400">us-east-1b</span>. AZs are connected by
            low-latency links but designed so a failure in one AZ should not take down another.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Edge Locations">
          <p className="text-slate-300">
            Points of presence worldwide for CloudFront CDN and Lambda@Edge — cache content closer to
            users. Useful when dashboards or API responses must feel snappy globally; less central to
            batch ETL but relevant for serving curated datasets.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Local Zones">
          <p className="text-slate-300">
            Extensions of a Region placed near a metro area for single-digit millisecond latency to
            on-premises equipment. Niche for hybrid media processing or real-time inference — know they
            exist for interview depth.
          </p>
        </ContentStep>
        <Flowchart
          title="Region → AZs → data centers (conceptual)"
          chart={`flowchart TB
  R[Region — e.g. us-east-1]
  R --> AZ1[AZ us-east-1a]
  R --> AZ2[AZ us-east-1b]
  R --> AZ3[AZ us-east-1c]
  AZ1 --> DC1[Data center racks]
  AZ2 --> DC2[Data center racks]
  AZ3 --> DC3[Data center racks]
  R -.-> EL[Edge Locations — global CDN]
  R -.-> LZ[Local Zone — optional metro extension]`}
        />
      </LessonSection>

      <LessonSection title="Latency and data residency">
        <ContentStep number={1} title="Latency">
          <p className="text-slate-300">
            Put compute and storage near users and sources. A Glue job reading on-prem data over a
            cross-continent link will be slow and expensive. Co-locate ingestion, processing, and query
            in the same Region when possible.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Data residency">
          <p className="text-slate-300">
            GDPR, HIPAA, and national banking rules may require data to stay in specific countries.
            Choose a Region that satisfies legal review — copying EU personal data to{' '}
            <span className="font-mono text-sm text-core-400">us-east-1</span> without safeguards can
            violate policy even if technically easy.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cross-Region replication">
          <p className="text-slate-300">
            S3 Cross-Region Replication and Redshift snapshots can duplicate data for disaster recovery
            or global analytics — but each copy has storage cost and compliance scope. Document why a
            second Region exists.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Default Region trap">
          The Console remembers your last Region. Always glance at the top-right dropdown before
          creating buckets or clusters — many beginners accidentally build in{' '}
          <span className="font-mono text-sm text-core-400">us-east-1</span> while their team standard
          is <span className="font-mono text-sm text-core-400">eu-west-1</span>.
        </Callout>
      </LessonSection>

      <LessonSection title="Multi-AZ mindset for data engineering">
        <p className="text-slate-300">
          Production pipelines should survive single-AZ failure. Examples: RDS Multi-AZ for metadata
          stores, Redshift with snapshot recovery, S3&apos;s eleven-nines durability within a Region
          (objects replicated across AZs automatically), and spreading Kafka or Kinesis consumers across
          AZs for high availability.
        </p>
        <ContentStep number={1} title="Not everything needs multi-Region">
          <p className="text-slate-300">
            Multi-AZ within one Region handles most datacenter failures. Multi-Region adds complexity —
            reserve it for DR mandates or global products.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Batch jobs and AZs">
          <p className="text-slate-300">
            Stateless Glue jobs or EMR steps can retry in another AZ if a spot interruption or AZ issue
            occurs. Stateful single-node legacy ETL on one EC2 instance is an AZ single point of
            failure — document that risk.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Region = geography and compliance. AZ = resilience within that geography. Pick Region first for
          law and latency; design across AZs for uptime.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Regions are geographic; AZs are isolated datacenters within a Region; Edge Locations cache content globally.',
          'Choose Region for latency and data residency — resources are Regional unless explicitly global.',
          'Design production DE systems multi-AZ for resilience; multi-Region only when DR or global reach requires it.',
        ]}
      />
    </LessonArticle>
  )
}
