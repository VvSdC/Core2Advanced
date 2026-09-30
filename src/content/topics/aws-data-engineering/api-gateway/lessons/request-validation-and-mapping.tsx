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

export function RequestValidationAndMapping() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Garbage in the bronze layer starts at the API">
        If a partner sends <code className="text-core-400">amount: &quot;twelve&quot;</code> or forgets{' '}
        <code className="text-core-400">event_id</code>, you want to reject it with a clear 400 — not land it in{' '}
        <code className="text-core-400">acme-lake-prod</code> and discover it three days later when a Glue job
        fails. REST APIs can validate payloads and reshape requests inside API Gateway, before Lambda is invoked
        or a message hits SQS.
      </Callout>

      <Definition term="Request validator and model">
        <p>
          A <strong className="text-white">model</strong> is a JSON Schema (draft 4) describing the expected
          request body. A <strong className="text-white">request validator</strong> tells a REST API method to
          check the body against the model, and optionally required headers and query strings. Failed checks
          return <code className="text-core-400">400 Bad Request</code> from the gateway — the integration never
          runs and you pay nothing for it.
        </p>
      </Definition>

      <LessonSection title="Validating payloads with JSON Schema">
        <ContentStep number={1} title="Define the model">
          <p className="text-slate-300">
            Describe required fields, types, enums, string patterns, and max lengths. For an order event:{' '}
            <code className="text-core-400">event_id</code> string, <code className="text-core-400">event_type</code>{' '}
            in a fixed list, <code className="text-core-400">amount</code> a number at least 0,{' '}
            <code className="text-core-400">occurred_at</code> a date-time string.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Attach a validator to the method">
          <p className="text-slate-300">
            Choose <code className="text-core-400">Validate body</code>,{' '}
            <code className="text-core-400">Validate query string parameters and headers</code>, or both, and map
            the model to the <code className="text-core-400">application/json</code> content type. Mark{' '}
            <code className="text-core-400">X-Partner-Id</code> as a required header so it is checked too.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Know the limits">
          <p className="text-slate-300">
            Schema validation checks shape, not business rules — it cannot look up whether a customer exists or
            dedupe an event. Keep deep checks in Lambda or Glue. HTTP APIs have no built-in request validation;
            validate in the integration or put a REST API in front when schema checks matter.
          </p>
        </ContentStep>
        <Example title="OrderEvent model" caption="JSON Schema draft 4 attached to POST /ingest/orders">
{`{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "OrderEvent",
  "type": "object",
  "required": ["event_id", "event_type", "amount", "occurred_at"],
  "properties": {
    "event_id": { "type": "string", "minLength": 8, "maxLength": 64 },
    "event_type": { "type": "string", "enum": ["order_created", "order_updated", "order_cancelled"] },
    "amount": { "type": "number", "minimum": 0 },
    "currency": { "type": "string", "pattern": "^[A-Z]{3}$" },
    "occurred_at": { "type": "string", "format": "date-time" }
  },
  "additionalProperties": false
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Mapping templates with VTL">
        <ContentStep number={1} title="What a mapping template does">
          <p className="text-slate-300">
            With non-proxy integrations, a Velocity Template Language (VTL) template transforms the incoming
            request into whatever the backend expects. <code className="text-core-400">$input.json(&apos;$&apos;)</code>{' '}
            returns the whole body as JSON, <code className="text-core-400">$input.path(&apos;$.field&apos;)</code>{' '}
            returns a value, and <code className="text-core-400">$context.requestId</code> adds the gateway request
            id for tracing.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Enrich before landing">
          <p className="text-slate-300">
            Wrap the partner payload in an envelope with <code className="text-core-400">received_at</code>,
            source IP, partner id from the authorizer context, and request id. Downstream Glue jobs then have
            lineage fields without every partner sending them.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Escape correctly">
          <p className="text-slate-300">
            When embedding the body as a string inside another JSON document, use{' '}
            <code className="text-core-400">$util.escapeJavaScript()</code> so quotes do not break the output. For
            form-encoded service calls, use <code className="text-core-400">$util.urlEncode()</code>.
          </p>
        </ContentStep>
        <Example title="Envelope mapping template" caption="Integration request template for application/json">
{`{
  "request_id": "$context.requestId",
  "received_at": "$context.requestTime",
  "source_ip": "$context.identity.sourceIp",
  "partner_id": "$context.authorizer.partnerId",
  "payload": $input.json('$')
}`}
        </Example>
        <Flowchart
          title="Request path through a REST method"
          chart={`flowchart LR
  C[Partner client]
  AUTH[Authorizer]
  VAL[Request validator]
  MAP[Mapping template]
  INT[Integration]
  BAD[400 Bad Request]
  C --> AUTH
  AUTH --> VAL
  VAL -->|valid| MAP
  VAL -->|invalid| BAD
  MAP --> INT`}
        />
      </LessonSection>

      <LessonSection title="HTTP API parameter mapping and gateway responses">
        <ContentStep number={1} title="Lighter mapping on HTTP APIs">
          <p className="text-slate-300">
            HTTP APIs skip VTL. Parameter mapping can append, overwrite, or remove headers, query strings, and
            the path using values like <code className="text-core-400">$request.header.x-partner-id</code> or{' '}
            <code className="text-core-400">$context.requestId</code>. Good for adding a trace header; not for
            rebuilding a body.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Custom gateway responses">
          <p className="text-slate-300">
            REST APIs let you customize responses API Gateway generates itself —{' '}
            <code className="text-core-400">BAD_REQUEST_BODY</code>, <code className="text-core-400">THROTTLED</code>,{' '}
            <code className="text-core-400">ACCESS_DENIED</code>. Return a consistent JSON error with the request id
            and the validation message so partners can fix payloads without opening a ticket.
          </p>
        </ContentStep>
        <Example title="BAD_REQUEST_BODY gateway response template" caption="Partners see which field failed">
{`{
  "error": "invalid_payload",
  "detail": "$context.error.validationErrorString",
  "request_id": "$context.requestId"
}`}
        </Example>
        <Callout variant="tip">
          Version your models alongside the API (OrderEventV1, OrderEventV2) and store them in CloudFormation or
          OpenAPI. A schema change is a contract change for every partner.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'REST request validators check bodies against JSON Schema models and return 400 before any integration runs.',
          'Schema validation covers shape and types; business rules and dedupe still belong in Lambda or Glue.',
          'VTL mapping templates reshape requests — $input.json and $context variables add lineage fields cheaply.',
          'HTTP APIs have parameter mapping but no VTL or built-in body validation.',
          'Customize gateway responses so partners get clear, consistent error bodies with a request id.',
        ]}
      />
    </LessonArticle>
  )
}
