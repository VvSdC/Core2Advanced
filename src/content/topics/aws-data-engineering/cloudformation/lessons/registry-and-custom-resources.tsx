import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function RegistryAndCustomResources() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Beyond built-in types — Registry and Custom Resources">
        CloudFormation covers most AWS services natively, but data teams sometimes need third-party resources
        or provisioning logic AWS does not model. The{' '}
        <strong className="text-white">CloudFormation Registry</strong> extends native types;{' '}
        <strong className="text-white">Custom Resources</strong> run Lambda during create/update/delete for
        anything else.
      </Callout>

      <Definition term="CloudFormation Registry">
        <p>
          Central catalog of resource types beyond the default AWS namespace.{' '}
          <strong className="text-white">Resource types</strong> (third-party and AWS extensions),{' '}
          <strong className="text-white">modules</strong> (precomposed templates), and{' '}
          <strong className="text-white">hooks</strong> (policy checks at deploy). Types use{' '}
          <span className="font-mono text-sm">Organization::Service::Resource</span> naming — e.g. Datadog
          monitors, MongoDB Atlas clusters, or newer AWS previews before full native support.
        </p>
      </Definition>

      <LessonSection title="CloudFormation Registry">
        <ContentStep number={1} title="When DE teams encounter Registry types">
          <p className="text-slate-300">
            SaaS data tools publish Registry types: Snowflake integration, Databricks workspaces, Confluent
            Kafka. AWS also publishes some services to Registry first. Activate type in account, grant IAM to
            CloudFormation, use like native resources with schema-validated properties.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Modules">
          <p className="text-slate-300">
            Registry modules bundle best-practice sub-templates — e.g. compliant S3 bucket module with
            encryption, logging, and Block Public Access. Data platform publishes internal modules (standard
            lake bucket, standard Glue role) consumed via{' '}
            <span className="font-mono text-sm">AWS::CloudFormation::ModuleVersion</span> — organizational
            standardization without copy-paste YAML.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Hooks and guardrails">
          <p className="text-slate-300">
            Proactive hooks run before resource create — reject S3 buckets without encryption, Glue jobs
            without security configuration. DE platform teams deploy hooks org-wide so non-compliant templates
            fail at deploy time, not audit time.
          </p>
        </ContentStep>
        <Example title="Registry-style resource (conceptual third-party type)">
{`Resources:
  DataCatalogSync:
    Type: Datadog::Monitors::Monitor
    Properties:
      Name: glue-job-failure-prod
      Type: metric alert
      Query: avg(last_5m):sum:aws.glue.job.failed{env:prod} > 0
      Message: Glue failure — check CloudWatch logs

  # Native AWS equivalent remains preferred when available:
  GlueFailureAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      MetricName: glue.driver.aggregate.numFailedTasks
      Namespace: Glue
      Threshold: 1
      ComparisonOperator: GreaterThanOrEqualToThreshold`}
        </Example>
      </LessonSection>

      <LessonSection title="Custom Resources overview">
        <ContentStep number={1} title="How custom resources work">
          <p className="text-slate-300">
            <span className="font-mono text-sm">AWS::CloudFormation::CustomResource</span> or{' '}
            <span className="font-mono text-sm">Custom::MyType</span> with{' '}
            <span className="font-mono text-sm">ServiceToken</span> pointing to SNS topic backed by Lambda.
            CloudFormation sends Create/Update/Delete to Lambda; Lambda performs work and sends SUCCESS/FAILED
            response to pre-signed S3 URL with physical resource ID.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE use cases">
          <p className="text-slate-300">
            Seed S3 bucket with initial folder layout and policy JSON from repo. Register Glue Schema Registry
            schema version via API not yet in CFN. Trigger external metadata catalog (Collibra, Alation) on
            stack create. Run data quality baseline SQL against empty RDS after create — gate stack completion
            on validation pass.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Risks and best practices">
          <p className="text-slate-300">
            Custom resources block stack progress — Lambda timeout fails entire stack. Must be idempotent on
            Update (same physical ID). Implement Delete to avoid orphaned external state. Prefer native or
            Registry types when available; custom resources are escape hatch, not default architecture.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Custom resource providers">
          <p className="text-slate-300">
            AWS open-source custom resource providers (cfn-response framework), or CDK{' '}
            <span className="font-mono text-sm">AwsCustomResource</span> wrapping SDK calls. Data engineering
            teams rarely author from scratch — use established patterns with structured logging and 15-minute
            timeout awareness.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Interview: Custom Resource = Lambda-backed lifecycle hook for unsupported APIs. Registry = managed
          extension types with schema. Prefer native AWS::Glue::*, AWS::S3::Bucket before custom Lambda.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Registry: third-party and extended resource types, modules, hooks — schema-validated beyond native AWS.',
          'Modules standardize compliant S3/Glue patterns org-wide; hooks reject non-compliant deploys proactively.',
          'Custom Resources: ServiceToken Lambda handles Create/Update/Delete — escape hatch for unsupported APIs.',
          'DE uses: bucket seeding, external catalog registration, post-create validation — idempotent, implement Delete.',
          'Prefer native CFN types first; custom resources block stack and add operational burden if Lambda fails.',
        ]}
      />
    </LessonArticle>
  )
}
