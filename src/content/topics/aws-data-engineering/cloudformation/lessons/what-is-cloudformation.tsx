import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function WhatIsCloudformation() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="In simple terms">
        <strong className="text-white">AWS CloudFormation</strong> is Amazon&apos;s built-in Infrastructure
        as Code service. You hand it a template describing resources — S3 buckets, IAM roles, Glue
        databases — and it creates a <strong className="text-white">stack</strong> that owns those resources
        for you. Update the template, CloudFormation updates the stack. Delete the stack, CloudFormation
        deletes the resources (unless you told it to keep some). No separate agent to install — it runs
        entirely inside AWS.
      </Callout>

      <Definition term="AWS CloudFormation">
        <p>
          <strong className="text-white">AWS CloudFormation</strong> is a regional AWS service that
          provisions and manages AWS resources using templates written in JSON or YAML. It handles
          dependency ordering (create the bucket before the policy that references it), rolls back failed
          operations, and tracks the physical ID of every resource it created. For data engineers, it is the
          standard way to deploy lake storage, ETL IAM, and supporting alarms as one coherent unit.
        </p>
      </Definition>

      <LessonSection title="AWS-native IaC — what that gives DE teams">
        <ContentStep number={1} title="First-day support for new AWS features">
          <p className="text-slate-300">
            When AWS ships a new property on S3 or Glue, CloudFormation support usually follows quickly.
            Platform teams on native CFN avoid waiting for third-party provider updates before adopting a
            security control.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Integrated with AWS governance">
          <p className="text-slate-300">
            CloudFormation works with IAM, CloudTrail, Service Catalog, and StackSets for multi-account
            rollout — common in enterprises where a central platform team deploys lake baselines to every
            analytics account.
          </p>
        </ContentStep>
        <ContentStep number={3} title="No state file you manage">
          <p className="text-slate-300">
            Unlike some IaC tools, CloudFormation stores stack state in AWS. You do not check a Terraform
            state bucket into runbooks — the stack record in CloudFormation is the source of what is live
            (plus your Git template as intent).
          </p>
        </ContentStep>
        <Callout variant="insight">
          Many teams write CDK or SAM in Python/TypeScript — both compile down to CloudFormation templates.
          Learning raw YAML CloudFormation helps you read what those tools generate and debug prod stacks.
        </Callout>
      </LessonSection>

      <LessonSection title="Template and stack relationship">
        <p className="text-slate-300">
          The <strong className="text-white">template</strong> is the recipe — a file in Git. The{' '}
          <strong className="text-white">stack</strong> is the meal — live AWS resources in one account and
          Region. One template can spawn many stacks:{' '}
          <code className="text-core-400">acme-lake-dev</code>,{' '}
          <code className="text-core-400">acme-lake-staging</code>,{' '}
          <code className="text-core-400">acme-lake-prod</code>, each with different parameter values.
        </p>
        <ContentStep number={1} title="Template — declarative document">
          <p className="text-slate-300">
            Sections include <code className="text-core-400">Resources</code> (required), optional{' '}
            <code className="text-core-400">Parameters</code>, <code className="text-core-400">Outputs</code>,{' '}
            <code className="text-core-400">Mappings</code>, and <code className="text-core-400">Conditions</code>.
            DE beginners focus on Resources, Parameters, and Outputs first.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Stack — deployed instance">
          <p className="text-slate-300">
            Creating a stack sends the template to CloudFormation. The service creates each resource, waits
            for success signals, and marks the stack{' '}
            <code className="text-core-400">CREATE_COMPLETE</code> or rolls back on failure.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Stack name is your handle">
          <p className="text-slate-300">
            Operators and CI pipelines refer to stacks by name. Updating{' '}
            <code className="text-core-400">acme-lake-prod</code> applies a new template version or parameter
            set — CloudFormation diffs and applies changes in safe order.
          </p>
        </ContentStep>
        <Flowchart
          title="One template, many stacks"
          chart={`flowchart TB
  TPL[lake-baseline.yaml in Git]
  TPL --> DEV[Stack acme-lake-dev]
  TPL --> STG[Stack acme-lake-staging]
  TPL --> PRD[Stack acme-lake-prod]
  DEV --> DRES[S3 IAM Glue dev]
  STG --> SRES[S3 IAM Glue staging]
  PRD --> PRES[S3 IAM Glue prod]`}
        />
      </LessonSection>

      <LessonSection title="What CloudFormation does during a deploy">
        <ContentStep number={1} title="Dependency graph">
          <p className="text-slate-300">
            If an IAM policy references a bucket, CloudFormation creates the bucket first. You do not manually
            order fifty resources — the engine builds a graph from{' '}
            <code className="text-core-400">Ref</code> and <code className="text-core-400">GetAtt</code>{' '}
            links in the template.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Rollback on failure">
          <p className="text-slate-300">
            A Glue crawler fails to create because of a bad IAM trust policy? The stack rolls back to the
            last stable state — better than half-created prod infrastructure left for humans to clean up.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Change sets for updates">
          <p className="text-slate-300">
            Before applying a prod update, create a change set to see additions, modifications, and deletions
            — critical when a template change might replace an S3 bucket (destructive) vs update in place.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="CloudFormation vs other parts of your DE stack">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Layer</th>
                <th className="px-4 py-3">Tool / service</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Infrastructure', 'CloudFormation', 'Creates buckets, roles, VPC, alarms'],
                ['Orchestration trigger', 'EventBridge', 'Starts Lambda/Glue when events fire'],
                ['Transform', 'Glue / Spark', 'Raw CSV to curated Parquet'],
                ['SQL transform', 'Athena / dbt on Redshift', 'Business logic on curated data'],
                ['App code', 'Lambda Python', 'Validation, lightweight enrichment'],
              ].map(([layer, tool, role]) => (
                <tr key={layer} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{layer}</td>
                  <td className="px-4 py-3">{tool}</td>
                  <td className="px-4 py-3">{role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-slate-300">
          CloudFormation does not run ETL — it creates the S3 paths and IAM roles your Glue scripts assume.
          EventBridge rules you declare in CFN still need correct event patterns; CFN only ensures they exist.
        </p>
      </LessonSection>

      <LessonSection title="When CloudFormation is the right first IaC choice">
        <ContentStep number={1} title="AWS-only data platform">
          <p className="text-slate-300">
            Lake on S3, catalog in Glue, orchestration via EventBridge and Step Functions — all AWS. CFN
            covers the full footprint without multi-cloud tooling.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Enterprise guardrails">
          <p className="text-slate-300">
            Org policies require CloudFormation stack sets or Service Catalog products for new accounts — DE
            sandboxes deploy from approved lake templates only.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Learning IaC concepts">
          <p className="text-slate-300">
            Parameters, outputs, dependencies, and change sets translate to other IaC tools. Master CFN YAML
            and reading Terraform HCL or CDK synth output becomes easier.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CloudFormation is AWS-native IaC — templates describe resources; stacks are live deployed instances in an account/Region.',
          'One template can power many stacks (dev/staging/prod) with different parameters.',
          'CloudFormation orders creates/updates, rolls back failures, and supports change sets before prod updates.',
          'CFN builds the platform (S3, IAM, Glue catalog); it does not replace Glue ETL or EventBridge event routing logic.',
        ]}
      />
    </LessonArticle>
  )
}
