import {
  Callout,
  ContentStep,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2302.04761'

export function Toolformer() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Toolformer: Language Models Can Teach Themselves to Use Tools"
        authors="Schick et al. (Meta AI)"
        year="2023"
        url={PAPER_URL}
      >
        Showed that LLMs can <strong className="text-white">learn when and how to call tools</strong> via
        self-supervised training — the research foundation behind LangChain's tool system.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read the <em>Tools</em> lesson first. Toolformer explains why tool descriptions and schemas matter —
        the model decides which tool to call based on the API text you provide.
      </Callout>

      <LessonSection title="Background — models trapped in their weights">
        <p>
          LLMs cannot access calculators, search engines, or databases on their own. Early approaches required
          hand-crafted prompts for each tool. Toolformer asked: can the model{' '}
          <strong className="text-white">teach itself</strong> to insert API calls into its own generated text?
        </p>
      </LessonSection>

      <LessonSection title="How Toolformer works">
        <ContentStep number={1} title="Self-supervised tool learning">
          <p>
            The model generates candidate API calls (calculator, search, translation, etc.) inline in its text.
            Each call is executed, and the result is checked: did the API output improve the model's ability to
            predict subsequent tokens? If yes, keep the call; if no, discard it.
          </p>
        </ContentStep>
        <ContentStep number={2} title="API call format">
          <p>
            Tool calls are embedded as special tokens in the text:
          </p>
          <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>The answer is AC/DC. [Calculator(2+2)] → 4. The band was formed in 1973.</div>
            <div className="mt-2 text-slate-400">[QA("Who founded AC/DC?")] → Malcolm and Angus Young.</div>
          </div>
          <p className="mt-3">
            This is the ancestor of LangChain's <code className="font-mono text-sm">@tool</code> decorator and
            OpenAI's function-calling format.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Tools used">
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
            <li><strong className="text-white">Calculator</strong> — arithmetic the model gets wrong.</li>
            <li><strong className="text-white">QA system</strong> — factual lookups.</li>
            <li><strong className="text-white">Search</strong> — current information.</li>
            <li><strong className="text-white">Translation / Calendar / Wikipedia</strong> — specialised lookups.</li>
          </ul>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key results">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Learned to call tools correctly with zero human annotation of tool-use examples.</li>
          <li>Calculator calls fixed arithmetic errors; search calls provided up-to-date facts.</li>
          <li>Model learned <em>when</em> tools help and when its own knowledge suffices — not every query needs a tool.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to LangChain lessons">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">How this paper connects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Tools', '@tool decorator defines the APIs the model can call — descriptions are critical'],
                ['ReAct Agents', 'Agent decides when to call tools, matching Toolformer\'s selective invocation'],
                ['Models & Inference', 'Modern models (GPT-4, Claude) have built-in tool-calling from Toolformer-style training'],
                ['Putting It Together', 'Only add tools the model actually needs — unnecessary tools confuse selection'],
              ].map(([lesson, connection]) => (
                <tr key={lesson} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{lesson}</td>
                  <td className="px-4 py-3 text-slate-400">{connection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'LLMs can self-learn when and how to call external tools via API tokens in generated text.',
          'Only keeps tool calls that improve subsequent token prediction — selective invocation.',
          'Foundation for @tool in LangChain and native function-calling in modern APIs.',
          'Write clear tool descriptions — the model uses them exactly like Toolformer uses API docs.',
        ]}
      />
    </LessonArticle>
  )
}
