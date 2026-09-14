import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function Ec2PricingOptimization() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The meter runs whether your ETL is idle or crunching">
        EC2 bills per second for running instances plus EBS storage, data transfer, and Elastic IPs sitting
        idle. Data platforms often oversize &quot;just in case&quot; or leave dev Airflow boxes on 24/7.
        Combine <strong className="text-white">right-sizing</strong>,{' '}
        <strong className="text-white">purchase options</strong>, and disciplined{' '}
        <strong className="text-white">stop vs terminate</strong> habits to keep lake compute costs predictable.
      </Callout>

      <Definition term="Right-sizing">
        <p>
          <strong className="text-white">Right-sizing</strong> matches instance family and size to observed
          CPU, memory, and disk metrics — not peak load from one bad day. A{' '}
          <span className="font-mono text-sm">r6i.4xlarge</span> Airflow worker at 12% CPU for a month
          should become <span className="font-mono text-sm">m7i.xlarge</span> or move orchestration to
          managed MWAA. Use CloudWatch Agent data from the monitoring lesson before buying bigger boxes.
        </p>
      </Definition>

      <LessonSection title="Purchase options for DE workloads">
        <ContentStep number={1} title="On-Demand">
          <p className="text-slate-300">
            Pay per second, no commitment. Best for unknown load, short dev environments, and burst capacity
            on top of reserved baseline. Most expensive per hour — default for experiments.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Spot Instances">
          <p className="text-slate-300">
            Spare AWS capacity at steep discount — can be interrupted with two-minute notice. Excellent for{' '}
            <strong className="text-white">fault-tolerant batch ETL</strong>: idempotent SQS workers,
            EMR Spot task nodes, nightly replays from S3. Avoid for singleton Airflow schedulers or
            stateful databases without failover.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Reserved Instances / Savings Plans">
          <p className="text-slate-300">
            Commit to steady usage (1 or 3 years) for lower hourly rates.{' '}
            <strong className="text-white">Compute Savings Plans</strong> apply across instance families
            and regions (flexible). Buy coverage for baseline always-on capacity — e.g. two Airflow
            schedulers + minimum ASG workers — after 30–60 days of stable metrics.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Dedicated Host / Capacity Reservations">
          <p className="text-slate-300">
            Niche: guarantee capacity in an AZ or full host for compliance/licensing. Not typical cost
            optimization for stateless S3 ETL.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Stop vs terminate — cost and state">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Compute charge</th>
                <th className="px-4 py-3">EBS charge</th>
                <th className="px-4 py-3">DE note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Stop', 'None while stopped', 'Still billed', 'Dev/staging overnight; reattach same volumes'],
                ['Terminate', 'None', 'Root/data volumes deleted if DeleteOnTermination=true', 'Stateless ASG workers — default terminate on scale-in'],
                ['Hibernate (stop)', 'None while stopped', 'EBS includes RAM snapshot size', 'Dev convenience only — not cost strategy'],
                ['Spot interrupt', 'Stops billing when gone', 'EBS persists if attached', 'Checkpoint to S3; retry from queue'],
              ].map(([action, compute, ebs, note]) => (
                <tr key={action} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{action}</td>
                  <td className="px-4 py-3">{compute}</td>
                  <td className="px-4 py-3">{ebs}</td>
                  <td className="px-4 py-3">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Tag with <span className="font-mono text-sm">AutoStop=true</span> and Lambda/EventBridge to stop
          dev instances at 19:00 local — EBS cost remains but compute savings dominate. Use ASG scale-to-zero
          (min=0) for batch worker pools instead of stopped idle On-Demand boxes.
        </Callout>
      </LessonSection>

      <LessonSection title="DE cost optimization checklist">
        <ContentStep number={1} title="Match purchase model to workload shape">
          <p className="text-slate-300">
            Steady schedulers → Savings Plans. Burst batch → Spot ASG + On-Demand floor. Unpredictable R&amp;D
            → On-Demand with aggressive stop schedules.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Graviton and gp3">
          <p className="text-slate-300">
            Test ARM (Graviton) for Python ETL — often cheaper if wheels support it. gp3 over gp2/io2 unless
            metrics prove IOPS need.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Compare to Glue/Lambda">
          <p className="text-slate-300">
            If EC2 workers sit idle 80% of the time, model Glue DPU-hours or Lambda per-invoke cost — EC2
            wins when you need long runtimes, custom libs, or Airflow on-box (see comparison lesson).
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Right-size with CloudWatch Agent metrics — don\'t pay for idle r6i when m7i suffices.',
          'Spot for fault-tolerant batch workers; Savings Plans/Reserved for steady always-on schedulers and baseline ASG.',
          'Stop saves compute but not EBS; terminate stateless workers on scale-in; set DeleteOnTermination carefully on data volumes.',
          'Schedule dev/staging stops; ASG min=0 for intermittent ETL pools beats 24/7 On-Demand workers.',
          'Re-evaluate EC2 vs Glue/Lambda when utilization is low — ops cost is part of total cost of ownership.',
        ]}
      />
    </LessonArticle>
  )
}
