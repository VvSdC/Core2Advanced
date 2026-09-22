import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function AssociationRules() {
  return (
    <LessonArticle>
      <Definition term="Association rules">
        <p>
          Pattern mining on <strong className="text-white">baskets</strong>: items that occur
          together often enough to write a rule A → B (“people who buy A tend to buy B”). The
          classic algorithm family is Apriori / FP-Growth. This is not clustering and not a
          classifier — it is frequent-set discovery.
        </p>
      </Definition>

      <LessonSection title="Three numbers for every rule">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Support(A)     = P(A)                    how common the set is</div>
          <div>Confidence(A→B)= P(B | A) = supp(A∪B) / supp(A)</div>
          <div>Lift(A→B)      = P(B | A) / P(B)         &gt; 1 means positive association</div>
        </div>
        <p className="mt-3 text-slate-300">
          High confidence can be a trick: if B is almost always bought, A → B looks strong even
          when A and B are independent. Lift (or conviction, or leverage) is the sanity check.
        </p>
        <Callout variant="beginner" title="Apriori’s one trick">
          If a set is rare, every superset is rarer. Apriori grows itemsets one item at a time
          and prunes any branch whose support is below a threshold. FP-Growth stores the same
          counts in a prefix tree and is usually faster.
        </Callout>
      </LessonSection>

      <LessonSection title="When to use it">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>Retail baskets, clicksets, symptom co-occurrence, “people who viewed X also viewed Y.”</li>
          <li>You want readable if-then patterns, not a black-box score.</li>
        </ul>
        <p className="mt-3 text-slate-300">
          Do not treat lift as causation (diapers and beer is a correlation story). Rare but
          important items need a lower support — or you will only rediscover milk.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Support and confidence">
          <p>5 baskets: {'{milk, bread}'}, {'{milk}'}, {'{bread, eggs}'}, {'{milk, bread, eggs}'}, {'{eggs}'}. Rule milk → bread?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>supp(milk) = 3/5.  supp(milk, bread) = 2/5.  conf = (2/5)/(3/5) = 2/3.</div>
            <div>supp(bread) = 3/5.  lift = (2/3) / (3/5) = 10/9 ≈ 1.11  (barely associated)</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — The popular-item trap">
          <p>Bread is in 90% of baskets. A rare item A (5%) always appears with bread. conf(A → bread)?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Confidence = 1.0. Lift = 1 / 0.9 ≈ 1.11 — not a discovery, bread is everywhere.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Apriori prune">
          <p>min_support = 0.3. Itemset {'{A, B}'} has support 0.2. Do you check {'{A, B, C}'}?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No. Any superset has support ≤ 0.2. That is the prune.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Direction">
          <p>conf(A → B) = 0.8, conf(B → A) = 0.2. What is going on?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>B is more common than A. A is almost a subset of B-baskets; the reverse is not true.</div>
            <div>Rules are directed. Always quote both or quote lift, which is symmetric.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Recommenders (ML flavour)">
          <p>Is “users who bought X bought Y” an association rule or collaborative filtering?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Item-item association is a rule miner on implicit baskets. Collaborative filtering scores a user-item matrix (neighbours or factors).</div>
            <div>Rules are a strong, explainable baseline; CF usually wins on ranking metrics once you have enough users.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — counts to lift">
        <Example
          title="milk → bread on the five baskets"
          output={`support(milk)=0.60  conf=0.67  lift=1.11`}
        >{`baskets = [
    {"milk", "bread"},
    {"milk"},
    {"bread", "eggs"},
    {"milk", "bread", "eggs"},
    {"eggs"},
]
n = len(baskets)

def supp(items):
    return sum(items <= b for b in baskets) / n

s_m, s_mb, s_b = supp({"milk"}), supp({"milk", "bread"}), supp({"bread"})
conf = s_mb / s_m
lift = conf / s_b
print(f"support(milk)={s_m:.2f}  conf={conf:.2f}  lift={lift:.2f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Association rules mine frequent itemsets and turn them into A → B with support, confidence, and lift.',
          'Confidence alone is fooled by popular items. Lift > 1 is a real positive association; lift ≈ 1 is independence.',
          'Apriori prunes any set whose support is already too small — supersets cannot recover. FP-Growth is the faster cousin.',
          'Rules are directed and not causal. Use them as explainable “also bought” patterns, not as a treatment effect.',
          'For ranking personalised items, collaborative filtering usually beats a global rule table once the user-item matrix is dense enough.',
        ]}
      />
    </LessonArticle>
  )
}
