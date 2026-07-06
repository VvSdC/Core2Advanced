import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  StepSequence,
} from '../../../../../components/content'

export function Pytest() {
  return (
    <LessonArticle>
      <Definition term="pytest">
        <p>
          <strong className="text-white">pytest</strong> is the dominant testing framework in Python. You write
          plain functions starting with <code className="font-mono text-sm">test_</code>, use{' '}
          <code className="font-mono text-sm">assert</code> for checks, and pytest discovers and runs them
          automatically.
        </p>
        <p>
          Interviewers expect you to know basic test structure, fixtures, mocking, and how pytest differs from the
          built-in <code className="font-mono text-sm">unittest</code> module.
        </p>
      </Definition>

      <ContentStep number={1} title="Your first test">
        <Example
          title="test_math.py"
          caption="Run: pytest test_math.py -v"
        >{`# math_utils.py
def add(a, b):
    return a + b

# test_math.py
from math_utils import add

def test_add():
    assert add(2, 3) == 5

def test_add_negative():
    assert add(-1, 1) == 0`}</Example>
        <p>
          No boilerplate classes required. pytest collects any function named{' '}
          <code className="font-mono text-sm">test_*</code> in files named{' '}
          <code className="font-mono text-sm">test_*.py</code> or <code className="font-mono text-sm">*_test.py</code>.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Assertions and failure output">
        <Example
          title="pytest rewrites assert for clarity"
        >{`def test_list_contents():
    result = [1, 2, 3]
    assert result == [1, 2, 4]
    # pytest shows: Left: [1, 2, 3], Right: [1, 2, 4]`}</Example>
        <Callout variant="info">
          Use plain <code className="font-mono text-sm">assert</code> — avoid <code className="font-mono text-sm">assertEqual</code>{' '}
          ceremony from unittest unless you are in a unittest codebase.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="Fixtures — reusable setup">
        <Example
          title="@pytest.fixture shares setup"
        >{`import pytest

@pytest.fixture
def sample_user():
    return {"name": "Ada", "age": 30}

def test_user_name(sample_user):
    assert sample_user["name"] == "Ada"

def test_user_adult(sample_user):
    assert sample_user["age"] >= 18`}</Example>
        <StepSequence
          steps={[
            {
              title: 'Fixture runs before test',
              description: 'pytest injects the return value by parameter name.',
            },
            {
              title: 'Scope control',
              description: 'scope="module" or "session" for expensive setup — default is function scope.',
            },
            {
              title: 'conftest.py',
              description: 'Shared fixtures in conftest.py are auto-discovered in that directory tree.',
            },
          ]}
        />
      </ContentStep>

      <ContentStep number={4} title="Parametrize — one test, many inputs">
        <Example
          title="Avoid copy-paste test cases"
        >{`import pytest

@pytest.mark.parametrize("a,b,expected", [
    (2, 3, 5),
    (0, 0, 0),
    (-1, 1, 0),
])
def test_add(a, b, expected):
    assert a + b == expected`}</Example>
      </ContentStep>

      <ContentStep number={5} title="Mocking with unittest.mock">
        <Example
          title="Patch external dependencies"
        >{`from unittest.mock import patch, MagicMock
import requests

def fetch_status(url):
    r = requests.get(url)
    return r.status_code

@patch("mymodule.requests.get")
def test_fetch_status(mock_get):
    mock_get.return_value = MagicMock(status_code=200)
    assert fetch_status("https://api.example.com") == 200
    mock_get.assert_called_once()`}</Example>
        <p>
          Patch where the name is <em>used</em>, not where it is defined — a classic interview gotcha.
        </p>
      </ContentStep>

      <ContentStep number={6} title="pytest vs unittest">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-surface-600 bg-surface-800/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Feature</th>
                <th className="px-4 py-3 font-semibold">pytest</th>
                <th className="px-4 py-3 font-semibold">unittest</th>
              </tr>
            </thead>
            <tbody className="text-slate-400">
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Test style</td>
                <td className="px-4 py-3">Functions + assert</td>
                <td className="px-4 py-3">Classes inheriting TestCase</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Setup</td>
                <td className="px-4 py-3">Fixtures</td>
                <td className="px-4 py-3">setUp / tearDown</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Ecosystem</td>
                <td className="px-4 py-3">Plugins, parametrize, rich output</td>
                <td className="px-4 py-3">stdlib, no install needed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ContentStep>

      <KeyTakeaways
        items={[
          'pytest discovers test_* functions — plain assert, no boilerplate.',
          'Fixtures provide reusable setup; conftest.py shares them.',
          '@pytest.mark.parametrize runs one test with many inputs.',
          'Patch where the object is looked up, not where it is defined.',
        ]}
      />
    </LessonArticle>
  )
}
