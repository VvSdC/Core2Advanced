import type { SubTopic } from '../../../types'

import { BackgroundAndHistory } from './lessons/background-and-history'
import { BuildTagAndPush } from './lessons/build-tag-and-push'
import { CleaningUpResources } from './lessons/cleaning-up-resources'
import { ContainerCommands } from './lessons/container-commands'
import { ContainersExplained } from './lessons/containers-explained'
import { ContainersVsVirtualMachines } from './lessons/containers-vs-virtual-machines'
import { DockerArchitecture } from './lessons/docker-architecture'
import { DockerComposeIntro } from './lessons/docker-compose-intro'
import { DockerfileBasics } from './lessons/dockerfile-basics'
import { EnvironmentAndConfig } from './lessons/environment-and-config'
import { EssentialCommandsCheatsheet } from './lessons/essential-commands-cheatsheet'
import { FirstContainersWalkthrough } from './lessons/first-containers-walkthrough'
import { HowContainersWork } from './lessons/how-containers-work'
import { ImageCommands } from './lessons/image-commands'
import { ImagesExplained } from './lessons/images-explained'
import { InstallingDocker } from './lessons/installing-docker'
import { LogsExecAndInspect } from './lessons/logs-exec-and-inspect'
import { NetworkingBasics } from './lessons/networking-basics'
import { PuttingItTogetherDocker } from './lessons/putting-it-together-docker'
import { RegistriesAndDockerHub } from './lessons/registries-and-docker-hub'
import { VolumesAndPersistentData } from './lessons/volumes-and-persistent-data'
import { WhatIsDocker } from './lessons/what-is-docker'

const foundationsLessons = [
  {
    id: 'what-is-docker',
    title: 'What Is Docker?',
    description: 'Package apps with their dependencies — end the “works on my machine” problem.',
    readTime: '12 min',
    component: WhatIsDocker,
  },
  {
    id: 'background-and-history',
    title: 'Background & History',
    description: 'Why containers won — shipping-container analogy and Docker’s rise.',
    readTime: '12 min',
    component: BackgroundAndHistory,
  },
  {
    id: 'containers-vs-virtual-machines',
    title: 'Containers vs Virtual Machines',
    description: 'Shared kernel vs full guest OS — speed, size, and isolation tradeoffs.',
    readTime: '14 min',
    component: ContainersVsVirtualMachines,
  },
]

const conceptsLessons = [
  {
    id: 'images-explained',
    title: 'Images Explained',
    description: 'Read-only blueprints made of layers — templates for containers.',
    readTime: '14 min',
    component: ImagesExplained,
  },
  {
    id: 'containers-explained',
    title: 'Containers Explained',
    description: 'A running (or stopped) instance of an image — the lifecycle.',
    readTime: '14 min',
    component: ContainersExplained,
  },
  {
    id: 'how-containers-work',
    title: 'How Containers Work',
    description: 'Namespaces and cgroups in plain English — isolation without a second OS.',
    readTime: '16 min',
    component: HowContainersWork,
  },
  {
    id: 'docker-architecture',
    title: 'Docker Architecture',
    description: 'CLI client → Docker daemon → containers, images, and registries.',
    readTime: '14 min',
    component: DockerArchitecture,
  },
  {
    id: 'registries-and-docker-hub',
    title: 'Registries & Docker Hub',
    description: 'Where images live — pull, push, and trusting official images.',
    readTime: '12 min',
    component: RegistriesAndDockerHub,
  },
]

const gettingStartedLessons = [
  {
    id: 'installing-docker',
    title: 'Installing Docker',
    description: 'Desktop vs Engine, docker version, and your first hello-world run.',
    readTime: '12 min',
    component: InstallingDocker,
  },
  {
    id: 'first-containers-walkthrough',
    title: 'First Containers Walkthrough',
    description: 'Pull nginx, publish a port, logs, exec, stop, and remove — copyable commands.',
    readTime: '14 min',
    component: FirstContainersWalkthrough,
  },
]

const commandsLessons = [
  {
    id: 'image-commands',
    title: 'Image Commands',
    description: 'pull, images, rmi, tag, history, inspect, and safe image prune.',
    readTime: '14 min',
    component: ImageCommands,
  },
  {
    id: 'container-commands',
    title: 'Container Commands',
    description: 'run, ps, start/stop, rm, and the flags you use every day (-d, -p, --name).',
    readTime: '14 min',
    component: ContainerCommands,
  },
  {
    id: 'logs-exec-and-inspect',
    title: 'logs, exec & inspect',
    description: 'Debug running containers — follow logs, open a shell, inspect config.',
    readTime: '12 min',
    component: LogsExecAndInspect,
  },
  {
    id: 'volumes-and-persistent-data',
    title: 'Volumes & Persistent Data',
    description: 'Keep data after containers die — named volumes vs bind mounts.',
    readTime: '14 min',
    component: VolumesAndPersistentData,
  },
  {
    id: 'networking-basics',
    title: 'Networking Basics',
    description: 'Bridge networks, -p publishing, and talking between containers by name.',
    readTime: '14 min',
    component: NetworkingBasics,
  },
  {
    id: 'cleaning-up-resources',
    title: 'Cleaning Up Resources',
    description: 'system df and prune — reclaim disk without deleting the wrong volumes.',
    readTime: '12 min',
    component: CleaningUpResources,
  },
]

const buildingLessons = [
  {
    id: 'dockerfile-basics',
    title: 'Dockerfile Basics',
    description: 'FROM, COPY, RUN, CMD vs ENTRYPOINT — write your first image recipe.',
    readTime: '16 min',
    component: DockerfileBasics,
  },
  {
    id: 'build-tag-and-push',
    title: 'build, tag & push',
    description: 'docker build -t, tagging for a registry, and pushing your image.',
    readTime: '14 min',
    component: BuildTagAndPush,
  },
  {
    id: 'environment-and-config',
    title: 'Environment & Config',
    description: '-e, --env-file, and why secrets must not be baked into images.',
    readTime: '12 min',
    component: EnvironmentAndConfig,
  },
  {
    id: 'docker-compose-intro',
    title: 'Docker Compose Intro',
    description: 'Multi-container apps — compose up/down and a simple service map.',
    readTime: '16 min',
    component: DockerComposeIntro,
  },
]

const masteryLessons = [
  {
    id: 'essential-commands-cheatsheet',
    title: 'Essential Commands Cheatsheet',
    description: 'Images, containers, networks, volumes, and Compose — one daily reference.',
    readTime: '12 min',
    component: EssentialCommandsCheatsheet,
  },
  {
    id: 'putting-it-together-docker',
    title: 'Putting It Together',
    description: 'Mastery checklist from concepts to Compose — and common mistakes to avoid.',
    readTime: '12 min',
    component: PuttingItTogetherDocker,
  },
]

export const dockerSubTopic: SubTopic = {
  id: 'docker',
  title: 'Docker',
  description:
    'Containers from absolute zero — images, architecture, how containers work, and the CLI commands you use every day.',
  lessonTracks: [
    {
      id: 'foundations',
      title: 'Foundations',
      sections: [{ id: 'foundations-lessons', title: 'Lessons', lessons: foundationsLessons }],
    },
    {
      id: 'concepts',
      title: 'Images, Containers & Architecture',
      sections: [{ id: 'concepts-lessons', title: 'Lessons', lessons: conceptsLessons }],
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      sections: [{ id: 'getting-started-lessons', title: 'Lessons', lessons: gettingStartedLessons }],
    },
    {
      id: 'commands',
      title: 'Everyday Commands',
      sections: [{ id: 'commands-lessons', title: 'Lessons', lessons: commandsLessons }],
    },
    {
      id: 'building',
      title: 'Building Images & Compose',
      sections: [{ id: 'building-lessons', title: 'Lessons', lessons: buildingLessons }],
    },
    {
      id: 'mastery',
      title: 'Mastery',
      sections: [{ id: 'mastery-lessons', title: 'Lessons', lessons: masteryLessons }],
    },
  ],
}
