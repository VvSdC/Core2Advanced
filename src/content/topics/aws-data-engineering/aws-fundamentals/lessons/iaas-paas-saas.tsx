import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function IaasPaasSaas() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Who manages what?">
        Cloud services stack in layers. Some you fully control (virtual machines). Some are mostly
        managed (databases). Some are ready-to-use apps (analytics UIs). The labels{' '}
        <strong className="text-white">IaaS</strong>, <strong className="text-white">PaaS</strong>, and{' '}
        <strong className="text-white">SaaS</strong> describe how much the provider runs for you.
      </Callout>

      <Definition term="IaaS, PaaS, SaaS">
        <p>
          <strong className="text-white">IaaS</strong> (Infrastructure as a Service) — you manage OS,
          runtime, and apps; provider supplies VMs, networks, storage.{' '}
          <strong className="text-white">PaaS</strong> (Platform as a Service) — provider manages OS
          and runtime; you deploy code or jobs. <strong className="text-white">SaaS</strong> (Software
          as a Service) — provider runs the entire application; you configure and use it.
        </p>
      </Definition>

      <LessonSection title="The pizza analogy">
        <Example title="Pizza as a service" caption="More provider management as you move right">
{`Homemade (on-prem):
  You buy ingredients, oven, table — full control, full work

Take-and-bake (IaaS):
  Provider gives kitchen space and oven — you bring dough and toppings (OS + apps)

Delivery (PaaS):
  Provider bakes — you choose toppings (your code on their platform)

Dine-in (SaaS):
  Provider serves finished pizza — you just eat (use the app)`}
        </Example>
        <p className="text-slate-300">
          Data engineers live mostly in IaaS and PaaS — EC2 for custom Spark, Glue for managed ETL,
          Athena for serverless SQL. Business users often consume SaaS dashboards built on top of your
          pipelines.
        </p>
      </LessonSection>

      <LessonSection title="AWS examples by layer">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Layer</th>
                <th className="px-4 py-3">You manage</th>
                <th className="px-4 py-3">AWS examples</th>
                <th className="px-4 py-3">Non-AWS example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['IaaS', 'OS, middleware, apps, data', 'EC2, EBS, VPC', 'Raw VMs anywhere'],
                ['PaaS-ish', 'App code, config, data', 'RDS, Glue, Elastic Beanstalk', 'Managed DB / ETL platforms'],
                ['SaaS', 'Users, data access, config', 'Athena (query UI), QuickSight', 'Salesforce, Slack'],
              ].map(([layer, you, aws, other]) => (
                <tr key={layer} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{layer}</td>
                  <td className="px-4 py-3">{you}</td>
                  <td className="px-4 py-3">{aws}</td>
                  <td className="px-4 py-3">{other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Labels blur in practice. RDS feels like PaaS (AWS patches Postgres) but you still pick instance
          size and security groups. Glue is PaaS for Spark jobs; EC2 running Spark yourself is IaaS.
        </Callout>
      </LessonSection>

      <LessonSection title="Where typical DE services sit">
        <ContentStep number={1} title="Storage foundation">
          <p className="text-slate-300">
            <strong className="text-white">S3</strong> is managed object storage — you configure buckets
            and policies; AWS runs the disks. Most data lakes are S3 plus catalog and query layers
            above it.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Compute spectrum">
          <p className="text-slate-300">
            <strong className="text-white">EC2</strong> (IaaS) for full control — custom AMIs, legacy
            ETL. <strong className="text-white">Lambda</strong> and <strong className="text-white">Glue</strong>{' '}
            (PaaS/serverless) for event-driven or scheduled transforms without patching servers.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Query and warehouse">
          <p className="text-slate-300">
            <strong className="text-white">Athena</strong> gives a SQL interface over S3 — closer to
            SaaS experience for analysts. <strong className="text-white">Redshift</strong> is a managed
            warehouse (PaaS) where you design tables and distribution keys.
          </p>
        </ContentStep>
        <Flowchart
          title="Shared responsibility layers"
          chart={`flowchart TB
  subgraph You["You manage"]
    U1[Applications and ETL code]
    U2[Data classification and encryption choices]
    U3[IAM policies and network rules]
  end
  subgraph Shared["Shared — depends on service"]
    S1[OS patching on EC2 — you]
    S2[OS patching on RDS — AWS]
  end
  subgraph AWS["AWS manages"]
    A1[Physical hardware]
    A2[Hypervisor and facilities]
    A3[Managed service control planes]
  end
  U1 --> S1
  S1 --> A1
  U2 --> A2
  U3 --> A3`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'IaaS = you run OS and apps (EC2); PaaS = you run code on managed runtime (Glue, RDS); SaaS = you use the app (Athena UI, Salesforce).',
          'Pizza analogy: more provider responsibility as you move from homemade to dine-in.',
          'Data engineers mix layers — S3 storage, Glue/Lambda compute, Athena/Redshift serving — and responsibility shifts with each choice.',
        ]}
      />
    </LessonArticle>
  )
}
