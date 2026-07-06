import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function CustomExceptionsAndContextlib() {
  return (
    <LessonArticle>
      <Definition term="Custom Exceptions & contextlib">
        <p>
          Production code defines <strong className="text-white">custom exception classes</strong> for domain errors.
          The <strong className="text-white">contextlib</strong> module adds utilities beyond basic try/except — suppressing
          expected errors, redirecting output, and building context managers.
        </p>
      </Definition>

      <ContentStep number={1} title="Custom exception hierarchy">
        <Example
          title="Subclass Exception, not BaseException"
        >{`class AppError(Exception):
    """Base for all app errors."""

class ValidationError(AppError):
  def __init__(self, field, message):
    self.field = field
    super().__init__(f"{field}: {message}")

def set_age(age):
  if age < 0:
    raise ValidationError("age", "must be non-negative")

try:
  set_age(-1)
except ValidationError as e:
  print(e.field, e)`}</Example>
        <Callout variant="info">
          Catch <code className="font-mono text-sm">AppError</code> to handle all app failures. Never catch{' '}
          <code className="font-mono text-sm">BaseException</code> — that includes KeyboardInterrupt and SystemExit.
        </Callout>
      </ContentStep>

      <ContentStep number={2} title="raise from — chaining">
        <Example
          title="Preserve original traceback"
        >{`try:
  int("abc")
except ValueError as e:
  raise RuntimeError("parse failed") from e`}</Example>
        <p>Shows both exceptions in traceback — critical for debugging wrapped failures.</p>
      </ContentStep>

      <ContentStep number={3} title="contextlib.suppress">
        <Example
          title="Ignore expected errors cleanly"
        >{`from contextlib import suppress

with suppress(FileNotFoundError):
    os.remove("maybe_missing.txt")`}</Example>
        <p>Cleaner than empty <code className="font-mono text-sm">except FileNotFoundError: pass</code>.</p>
      </ContentStep>

      <ContentStep number={4} title="Exception hierarchy recap">
        <ul className="space-y-2 text-slate-300">
          <li><code className="font-mono text-sm">BaseException</code> → SystemExit, KeyboardInterrupt, Exception</li>
          <li><code className="font-mono text-sm">Exception</code> → ValueError, TypeError, KeyError, your custom errors</li>
          <li><code className="font-mono text-sm">except Exception:</code> catches most bugs; <code className="font-mono text-sm">except:</code> catches everything including BaseException subclasses</li>
        </ul>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Subclass Exception for custom errors; group under a base AppError.',
          'raise ... from e chains exceptions for debugging.',
          'contextlib.suppress ignores expected errors without bare except.',
          'Never catch BaseException or use bare except: in production.',
        ]}
      />
    </LessonArticle>
  )
}
