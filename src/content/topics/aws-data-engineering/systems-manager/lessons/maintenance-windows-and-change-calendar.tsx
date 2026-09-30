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

export function MaintenanceWindowsAndChangeCalendar() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Risky work gets a time slot — and month-end gets a freeze">
        Patching, agent upgrades, and volume resizes are fine on a quiet Sunday morning and terrible at 01:00
        UTC when the nightly load into <code className="text-core-400">acme-dw-prod</code> is running.{' '}
        <strong className="text-white">Maintenance windows</strong> schedule disruptive tasks into agreed
        slots; <strong className="text-white">Change Calendar</strong> blocks changes entirely during periods
        like month-end close or peak ingest.
      </Callout>

      <Definition term="Maintenance window">
        <p>
          A recurring time slot defined by a <strong className="text-white">schedule</strong> (cron or rate,
          with an optional time zone), a <strong className="text-white">duration</strong> in hours, and a{' '}
          <strong className="text-white">cutoff</strong> — the number of hours before the end when no new tasks
          start. You register <strong className="text-white">targets</strong> (tags or instance IDs) and{' '}
          <strong className="text-white">tasks</strong>: Run Command, Automation, Lambda, or Step Functions.
          Tasks run in priority order with their own concurrency and error limits.
        </p>
      </Definition>

      <LessonSection title="Building a maintenance window">
        <ContentStep number={1} title="Schedule, duration, cutoff">
          <p className="text-slate-300">
            Example: Sundays 10:00 UTC, four hours long, cutoff of one hour — tasks may start until 13:00 and the
            window closes at 14:00. Cutoff protects you from a long patch run spilling into the next load.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Targets and tasks">
          <p className="text-slate-300">
            Register targets by tag (<code className="text-core-400">Role=etl-worker</code>,{' '}
            <code className="text-core-400">Env=prod</code>), then tasks: priority 1 drains workers (Lambda or
            Automation), priority 2 runs <code className="text-core-400">AWS-RunPatchBaseline</code> Install, priority
            3 runs a smoke-test Automation that confirms the ETL service is healthy. Tasks with the same priority
            run in parallel; lower numbers run first.
          </p>
        </ContentStep>
        <Example title="Weekly patch window for prod ETL workers" caption="IDs in angle brackets come from previous command outputs">
{`aws ssm create-maintenance-window \\
  --name "etl-prod-weekly" \\
  --schedule "cron(0 10 ? * SUN *)" \\
  --schedule-timezone "UTC" \\
  --duration 4 \\
  --cutoff 1 \\
  --no-allow-unassociated-targets

aws ssm register-target-with-maintenance-window \\
  --window-id <window-id> \\
  --resource-type INSTANCE \\
  --targets "Key=tag:Role,Values=etl-worker" "Key=tag:Env,Values=prod"

aws ssm register-task-with-maintenance-window \\
  --window-id <window-id> \\
  --task-type RUN_COMMAND \\
  --task-arn "AWS-RunPatchBaseline" \\
  --targets "Key=WindowTargetIds,Values=<window-target-id>" \\
  --priority 2 \\
  --max-concurrency "1" \\
  --max-errors "1" \\
  --task-invocation-parameters '{"RunCommand":{"Parameters":{"Operation":["Install"],"RebootOption":["RebootIfNeeded"]}}}'`}
        </Example>
      </LessonSection>

      <LessonSection title="Choosing windows around data loads">
        <ContentStep number={1} title="Map the data calendar first">
          <p className="text-slate-300">
            List when each pipeline runs: nightly batch 00:00–05:00 UTC, hourly micro-batches, the Redshift
            refresh before business hours, SLA deadlines. Put windows in the widest gap, and give dev and staging
            earlier windows so prod patches land after a few successful runs elsewhere.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Orchestrate the drain with Step Functions">
          <p className="text-slate-300">
            A Step Functions task inside the window can pause the SQS consumer, wait until in-flight messages
            reach zero, invoke patching, verify, and resume — using the workflow skills from the Step Functions
            sub-topic.
          </p>
        </ContentStep>
        <Flowchart
          title="Inside a weekly maintenance window"
          chart={`flowchart LR
  OPEN[Window opens Sunday 10 UTC]
  CAL{First task checks calendar OPEN}
  DRAIN[Priority 1 drain workers]
  PATCH[Priority 2 patch install one at a time]
  TEST[Priority 3 smoke test runbook]
  CUT[Cutoff no new tasks]
  SKIP[Skip and notify de-alerts-prod]
  OPEN --> CAL
  CAL -->|yes| DRAIN
  CAL -->|no| SKIP
  DRAIN --> PATCH
  PATCH --> TEST
  TEST --> CUT`}
        />
      </LessonSection>

      <LessonSection title="Change Calendar — freeze periods as code">
        <ContentStep number={1} title="Calendars and states">
          <p className="text-slate-300">
            A change calendar is an SSM document of type ChangeCalendar. A <strong className="text-white">DEFAULT_OPEN</strong>{' '}
            calendar allows changes except during events you add (for example the last two business days of the
            month); a <strong className="text-white">DEFAULT_CLOSED</strong> calendar blocks changes except during
            events. You can import events from an iCalendar file. At any moment the calendar is OPEN or CLOSED.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Making automation respect it">
          <p className="text-slate-300">
            Automation runbooks add a step using <code className="text-core-400">aws:assertAwsResourceProperty</code>{' '}
            that calls <code className="text-core-400">GetCalendarState</code> and continues only if the state is
            OPEN. State Manager associations accept calendar names directly and skip runs while closed. For Lambda
            or Step Functions tasks, call <code className="text-core-400">GetCalendarState</code> yourself; EventBridge
            also emits events when a calendar changes state.
          </p>
        </ContentStep>
        <Example title="Runbook step that honors month-end freeze" caption="Fails the step (or branches to notify) when CLOSED">
{`- name: checkChangeFreeze
  action: aws:assertAwsResourceProperty
  onFailure: step:notifyFrozen
  inputs:
    Service: ssm
    Api: GetCalendarState
    CalendarNames:
      - arn:aws:ssm:us-east-1:111122223333:document/de-month-end-freeze
    PropertySelector: $.State
    DesiredValues:
      - OPEN
  nextStep: stopEtlService`}
        </Example>
        <Callout variant="info" title="Change Manager">
          Systems Manager Change Manager added formal change requests and approval templates on top of
          runbooks, but AWS closed it to new customers in November 2025 (existing customers can keep using it).
          New teams typically combine Change Calendar, <code className="text-core-400">aws:approve</code> steps,
          and their ITSM tool for approvals.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Maintenance windows = schedule + duration + cutoff + registered targets + prioritized tasks.',
          'Tasks can be Run Command, Automation, Lambda, or Step Functions, each with concurrency and error limits.',
          'Place windows in gaps between data loads; drain workers first and smoke-test afterwards.',
          'Change Calendar models freezes (month-end, peak ingest) as OPEN or CLOSED states.',
          'Runbooks check GetCalendarState via aws:assertAwsResourceProperty; associations accept calendar names.',
        ]}
      />
    </LessonArticle>
  )
}
