import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ClassificationMetrics() {
  return (
    <LessonArticle>
      <Definition term="Classification metrics">
        <p>
          Accuracy is “fraction correct.” It is a terrible north star when classes are imbalanced
          or errors have different costs. The useful numbers come from the confusion matrix.
        </p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3" />
                <th className="px-4 py-3">Predicted +</th>
                <th className="px-4 py-3">Predicted −</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Actual +</td>
                <td className="px-4 py-3">True positive (TP)</td>
                <td className="px-4 py-3">False negative (FN)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Actual −</td>
                <td className="px-4 py-3">False positive (FP)</td>
                <td className="px-4 py-3">True negative (TN)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Definition>

      <LessonSection title="The metrics that matter">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Accuracy  = (TP + TN) / N</div>
          <div>Precision = TP / (TP + FP)     “of what I flagged, how many were real?”</div>
          <div>Recall    = TP / (TP + FN)     “of what was real, how many did I catch?”</div>
          <div>F1        = 2 · P · R / (P + R)  harmonic mean — punishes a 0 in either</div>
          <div>TPR = recall,   FPR = FP / (FP + TN)</div>
        </div>
        <Callout variant="tip" title="Threshold is part of the model">
          Logistic regression, boosting, and SVM scores become labels only after a cutoff. Moving
          it trades precision for recall. Pick it on a validation PR curve, not by habit at 0.5.
        </Callout>
      </LessonSection>

      <LessonSection title="ROC vs PR">
        <p className="text-slate-300">
          ROC plots TPR vs FPR as you sweep the threshold. AUROC is the probability a random
          positive scores higher than a random negative. It stays optimistic on rare-event
          problems because TNs flood the FPR denominator.
        </p>
        <p className="mt-3 text-slate-300">
          Precision-recall plots P vs R. Average precision / PR-AUC is the honest ranking metric
          when positives are rare (fraud, disease, defects).
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — The 99% accuracy trap">
          <p>1% fraud. A model that always says “not fraud.” Accuracy, recall, precision?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Accuracy = 0.99.  Recall = 0.  Precision is undefined (no predicted +) or 0 if you force it.</div>
            <div className="mt-1 text-genai-400">Never lead with accuracy on a rare class.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Compute P, R, F1">
          <p>TP = 40, FP = 10, FN = 10, TN = 140. Precision, recall, F1, accuracy?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>P = 40/50 = 0.80,  R = 40/50 = 0.80,  F1 = 0.80</div>
            <div>Acc = 180/200 = 0.90</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Which curve?">
          <p>Screening a 0.5% disease. ROC-AUC = 0.94, PR-AUC = 0.08. Celebrate?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Not yet. ROC looks great because TNs are cheap. PR-AUC 0.08 means precision collapses
              as you recall more — maybe still useful, but ROC hid the pain.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Cost-sensitive threshold">
          <p>A missed fraud costs 20× a false alarm. Do you raise or lower the threshold vs 0.5?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Lower it — catch more fraud (higher recall), accept more FP.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Macro vs micro F1 (ML flavour)">
          <p>Three classes, one rare. You report a single F1. Macro or micro?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Micro: closer to overall accuracy, dominated by the common class.</div>
            <div>Macro: unweighted mean of per-class F1 — the rare class gets an equal vote.</div>
            <div>Say which one, and why, every time you quote a multiclass F1.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — confusion matrix to F1">
        <Example
          title="Problem 2 in code"
          output={`P=0.80  R=0.80  F1=0.80  acc=0.90`}
        >{`tp, fp, fn, tn = 40, 10, 10, 140
p = tp / (tp + fp)
r = tp / (tp + fn)
f1 = 2 * p * r / (p + r)
acc = (tp + tn) / (tp + fp + fn + tn)
print(f"P={p:.2f}  R={r:.2f}  F1={f1:.2f}  acc={acc:.2f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Accuracy lies when classes are imbalanced. Start from the confusion matrix: precision, recall, F1.',
          'Precision = “don’t cry wolf.” Recall = “don’t miss the wolf.” F1 is their harmonic mean.',
          'The classification threshold is a decision, not a constant 0.5. Set it from costs on a validation PR curve.',
          'ROC-AUC ranks positives vs negatives and looks rosy on rare events. Prefer PR-AUC / average precision there.',
          'Multiclass F1 is ambiguous until you say macro vs micro. Macro cares about every class equally.',
        ]}
      />
    </LessonArticle>
  )
}
