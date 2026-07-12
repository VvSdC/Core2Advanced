import {
  Callout,
  ContentStep,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function Tools() {
  return (
    <LessonArticle>
      <LessonSection title="What are tools?">
        <p>
          A <strong className="text-white">tool</strong> is a callable function the LLM can invoke during
          generation — search the web, run code, query a database, call an API. LangChain wraps Python functions
          as tools with a <strong className="text-white">name</strong>, <strong className="text-white">description</strong>{' '}
          (tells the model when to use it), and <strong className="text-white">arguments schema</strong>.
        </p>
      </LessonSection>

      <LessonSection title="Defining tools with @tool">
        <ContentStep number={1} title="Simple tool from a function">
          <Example
            title="Calculator and search tools"
          >{`from langchain_core.tools import tool

@tool
def calculator(expression: str) -> str:
    """Evaluate a math expression. Use for arithmetic calculations."""
    try:
        return str(eval(expression))
    except Exception:
        return "Error: invalid expression"

@tool
def search_web(query: str) -> str:
    """Search the web for current information. Use when you need up-to-date facts."""
    # In production, call a real search API (Tavily, SerpAPI, etc.)
    return f"Search results for: {query}"

tools = [calculator, search_web]`}</Example>
          <Callout variant="insight">
            The <strong className="text-white">docstring is critical</strong> — the model reads it to decide
            when to call the tool. Write clear, specific descriptions.
          </Callout>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Structured tools with Pydantic">
        <Example
          title="Tool with typed arguments"
        >{`from pydantic import BaseModel, Field

class WeatherInput(BaseModel):
    city: str = Field(description="City name, e.g. 'Tokyo'")
    units: str = Field(default="celsius", description="celsius or fahrenheit")

@tool(args_schema=WeatherInput)
def get_weather(city: str, units: str = "celsius") -> str:
    """Get current weather for a city."""
    return f"Weather in {city}: 22°{units[0].upper()}, partly cloudy"`}</Example>
      </LessonSection>

      <LessonSection title="Built-in and community tools">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Tool</th>
                <th className="px-4 py-3">Package</th>
                <th className="px-4 py-3">Use case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['TavilySearchResults', 'langchain_community', 'Web search'],
                ['WikipediaQueryRun', 'langchain_community', 'Encyclopedia lookup'],
                ['PythonREPLTool', 'langchain_experimental', 'Execute Python code'],
                ['SQLDatabaseToolkit', 'langchain_community', 'Query SQL databases'],
                ['Custom @tool', 'langchain_core', 'Any Python function'],
              ].map(([tool, pkg, use]) => (
                <tr key={tool} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{tool}</td>
                  <td className="px-4 py-3 font-mono text-xs text-genai-400">{pkg}</td>
                  <td className="px-4 py-3 text-slate-400">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Tools are Python functions wrapped with @tool — name, description, and schema.',
          'The docstring tells the model WHEN to use the tool — write it carefully.',
          'Pydantic args_schema gives typed, validated tool arguments.',
          'Tools are passed to agents — covered in the ReAct Agents lesson.',
        ]}
      />
    </LessonArticle>
  )
}
