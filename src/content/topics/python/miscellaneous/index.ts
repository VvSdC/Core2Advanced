import type { SubTopic } from '../../../types'
import { FileIo } from './lessons/file-io'
import { PackagingAndVenv } from './lessons/packaging-and-venv'
import { Pytest } from './lessons/pytest'

export const miscellaneousSubTopic: SubTopic = {
  id: 'miscellaneous',
  title: 'Miscellaneous',
  description: 'File I/O, testing with pytest, and project packaging with virtual environments.',
  lessons: [
    {
      id: 'file-io',
      title: 'File I/O',
      description: 'Reading and writing files, pathlib, JSON, and CSV.',
      readTime: '12 min',
      component: FileIo,
    },
    {
      id: 'pytest',
      title: 'pytest',
      description: 'Writing tests, fixtures, parametrize, and mocking.',
      readTime: '13 min',
      component: Pytest,
    },
    {
      id: 'packaging-and-venv',
      title: 'Packaging & Virtual Environments',
      description: 'venv, pip, requirements.txt, and pyproject.toml.',
      readTime: '12 min',
      component: PackagingAndVenv,
    },
  ],
}
