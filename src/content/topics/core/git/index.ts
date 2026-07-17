import type { SubTopic } from '../../../types'

import { BranchesBasics } from './lessons/branches-basics'
import { CommitHashAndHistory } from './lessons/commit-hash-and-history'
import { EverydayGitWorkflow } from './lessons/everyday-git-workflow'
import { FetchExplained } from './lessons/fetch-explained'
import { FirstRepositoryWalkthrough } from './lessons/first-repository-walkthrough'
import { GitLogAndDiff } from './lessons/git-log-and-diff'
import { GitStatusAddCommit } from './lessons/git-status-add-commit'
import { GitVsGithub } from './lessons/git-vs-github'
import { InstallingAndConfiguringGit } from './lessons/installing-and-configuring-git'
import { MergeAndConflicts } from './lessons/merge-and-conflicts'
import { PullExplained } from './lessons/pull-explained'
import { PullVsFetch } from './lessons/pull-vs-fetch'
import { PushToRemote } from './lessons/push-to-remote'
import { PuttingItTogetherGit } from './lessons/putting-it-together-git'
import { RemotesCloneAndOrigin } from './lessons/remotes-clone-and-origin'
import { ResetSoftMixedHard } from './lessons/reset-soft-mixed-hard'
import { RevertVsReset } from './lessons/revert-vs-reset'
import { ThreeAreasWorkingStagingRepo } from './lessons/three-areas-working-staging-repo'
import { UndoingLocalChanges } from './lessons/undoing-local-changes'
import { WhatHappensOnGitInit } from './lessons/what-happens-on-git-init'
import { WhatIsGit } from './lessons/what-is-git'
import { WhereCommitsAreStored } from './lessons/where-commits-are-stored'

const foundationsLessons = [
  {
    id: 'what-is-git',
    title: 'What Is Git?',
    description: 'Version control as a time machine for your code — why Git exists.',
    readTime: '12 min',
    component: WhatIsGit,
  },
  {
    id: 'git-vs-github',
    title: 'Git vs GitHub',
    description: 'Git on your machine vs GitHub/GitLab hosting — local and remote.',
    readTime: '10 min',
    component: GitVsGithub,
  },
  {
    id: 'installing-and-configuring-git',
    title: 'Installing & Configuring Git',
    description: 'Install Git and set user.name / user.email so commits have an identity.',
    readTime: '12 min',
    component: InstallingAndConfiguringGit,
  },
  {
    id: 'what-happens-on-git-init',
    title: 'What Happens on git init',
    description: 'Creating .git/ — objects, refs, HEAD, config, and the index.',
    readTime: '14 min',
    component: WhatHappensOnGitInit,
  },
]

const internalsLessons = [
  {
    id: 'three-areas-working-staging-repo',
    title: 'Working Directory, Staging & Repo',
    description: 'The three areas — how files move from disk → staging → committed history.',
    readTime: '14 min',
    component: ThreeAreasWorkingStagingRepo,
  },
  {
    id: 'where-commits-are-stored',
    title: 'Where Commits Are Stored',
    description: 'Inside .git/objects — blobs, trees, commits, and content-addressed history.',
    readTime: '14 min',
    component: WhereCommitsAreStored,
  },
  {
    id: 'commit-hash-and-history',
    title: 'Commit Hash & History',
    description: 'SHA hashes, HEAD, branch pointers, and reading history with git log.',
    readTime: '12 min',
    component: CommitHashAndHistory,
  },
  {
    id: 'first-repository-walkthrough',
    title: 'First Repository Walkthrough',
    description: 'From mkdir to first commit — a full command sequence you can copy.',
    readTime: '14 min',
    component: FirstRepositoryWalkthrough,
  },
]

const everydayLessons = [
  {
    id: 'git-status-add-commit',
    title: 'status, add & commit',
    description: 'The daily loop — see changes, stage them, and save a snapshot.',
    readTime: '14 min',
    component: GitStatusAddCommit,
  },
  {
    id: 'git-log-and-diff',
    title: 'log & diff',
    description: 'Inspect history and see exactly what changed before you commit.',
    readTime: '12 min',
    component: GitLogAndDiff,
  },
  {
    id: 'undoing-local-changes',
    title: 'Undoing Local Changes',
    description: 'Unstage and discard safely — restore and reset HEAD recipes.',
    readTime: '12 min',
    component: UndoingLocalChanges,
  },
  {
    id: 'reset-soft-mixed-hard',
    title: 'reset --soft, --mixed & --hard',
    description: 'Move HEAD and choose what happens to staging and your files — with danger notes.',
    readTime: '16 min',
    component: ResetSoftMixedHard,
  },
  {
    id: 'revert-vs-reset',
    title: 'revert vs reset',
    description: 'Safe undo on shared branches (revert) vs rewriting local history (reset).',
    readTime: '12 min',
    component: RevertVsReset,
  },
]

const branchingLessons = [
  {
    id: 'branches-basics',
    title: 'Branches Basics',
    description: 'Create and switch branches — parallel lines of work without fear.',
    readTime: '12 min',
    component: BranchesBasics,
  },
  {
    id: 'merge-and-conflicts',
    title: 'Merge & Conflicts',
    description: 'Combine branches and resolve conflict markers step by step.',
    readTime: '14 min',
    component: MergeAndConflicts,
  },
]

const remotesLessons = [
  {
    id: 'remotes-clone-and-origin',
    title: 'Remotes, clone & origin',
    description: 'Clone a repo and understand the origin remote.',
    readTime: '12 min',
    component: RemotesCloneAndOrigin,
  },
  {
    id: 'push-to-remote',
    title: 'push',
    description: 'Publish commits — upstream tracking and rejected pushes.',
    readTime: '12 min',
    component: PushToRemote,
  },
  {
    id: 'fetch-explained',
    title: 'fetch Explained',
    description: 'Download remote commits without changing your working files.',
    readTime: '12 min',
    component: FetchExplained,
  },
  {
    id: 'pull-explained',
    title: 'pull Explained',
    description: 'fetch + integrate — how pull updates your branch.',
    readTime: '12 min',
    component: PullExplained,
  },
  {
    id: 'pull-vs-fetch',
    title: 'pull vs fetch',
    description: 'Side-by-side comparison — when to fetch and when to pull.',
    readTime: '12 min',
    component: PullVsFetch,
  },
]

const masteryLessons = [
  {
    id: 'everyday-git-workflow',
    title: 'Everyday Git Workflow',
    description: 'A practical morning-to-evening command cheatsheet for real projects.',
    readTime: '12 min',
    component: EverydayGitWorkflow,
  },
  {
    id: 'putting-it-together-git',
    title: 'Putting It Together',
    description: 'Mastery checklist — init through push, reset types, and common mistakes.',
    readTime: '12 min',
    component: PuttingItTogetherGit,
  },
]

export const gitSubTopic: SubTopic = {
  id: 'git',
  title: 'Git',
  description:
    'Version control from absolute zero — what Git is, where commits live, everyday commands, reset soft/hard, fetch vs pull, and pushing to remotes.',
  lessonTracks: [
    {
      id: 'foundations',
      title: 'Foundations',
      sections: [{ id: 'foundations-lessons', title: 'Lessons', lessons: foundationsLessons }],
    },
    {
      id: 'internals',
      title: 'How Git Stores History',
      sections: [{ id: 'internals-lessons', title: 'Lessons', lessons: internalsLessons }],
    },
    {
      id: 'everyday',
      title: 'Everyday Commands',
      sections: [{ id: 'everyday-lessons', title: 'Lessons', lessons: everydayLessons }],
    },
    {
      id: 'branching',
      title: 'Branching & Merging',
      sections: [{ id: 'branching-lessons', title: 'Lessons', lessons: branchingLessons }],
    },
    {
      id: 'remotes',
      title: 'Remotes: Push, Pull & Fetch',
      sections: [{ id: 'remotes-lessons', title: 'Lessons', lessons: remotesLessons }],
    },
    {
      id: 'mastery',
      title: 'Mastery',
      sections: [{ id: 'mastery-lessons', title: 'Lessons', lessons: masteryLessons }],
    },
  ],
}
