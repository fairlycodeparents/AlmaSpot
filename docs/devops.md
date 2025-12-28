# DevOps

To minimize the friction between each member of the group and to automate the release of the project during its
development, we decided to adopt the following described continuous release strategy. This, requires a robust test
suite,

To streamline collaboration among group members and automate repetitive tasks, the choice of a deployment strategy is
crucial. For this reason, we decided to
adopt the continuous release strategy described below. This requires a robust test suite to limit errors, along with an
adequate workflow and tools to automate releases.

A good deployment strategy is crucial for the success of a project. We decided to adopt a continuous release strategy:
this implied having a robust test suite, an adequate DVCS workflow and tools to automate the releases.

## DVCS Workflow

![GitFlow Diagram](figures/gitflow-diagram.svg)

For the DVCS workflow, we chose [GitFlow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow):
a workflow centred around two persistent branches, with `main` holding the stable production history and `develop`
serving as an integration point for ongoing work, supported by temporary branches. We chose this strategy for our
project because it provides the necessary control in an environment where multiple work streams occur simultaneously. By
isolating new feature development from the production codebase using dedicated `feature` branches, we ensure that the
application remains stable regardless of the state of ongoing work. Additionally, GitFlow's dedicated `release` branches
enable us to finalize and test a new version without halting development on future features. Its `hotfix` protocol
allows us to address critical production bugs immediately.

## Release Automation

### Conventional Commits

We chose to adopt [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) as the standard for our commit
messages. It is a lightweight convention for formatting commit messages that creates an explicit history that is easy
for both humans and machines to understand. Every commit must follow a specific structure: a standard type, such as
`feat` for new features or `fix` for bug repairs (optionally followed by a scope in parentheses), followed by a concise
description of the change. We adopted this standard for our project because it removes ambiguity from our version
history, significantly improving collaboration by enabling anyone to scan the log and immediately grasp the purpose of
each change. Furthermore, strictly adhering to this structured format enables us to automate critical parts of our
DevOps pipeline. For example, we can automatically generate semantic version numbers and changelogs based on the commit
types. This reduces manual overhead and ensures our release documentation is always accurate and up to date.

### Semantic Release

Assigning software versions is often an arbitrary and difficult process, as manually determining the impact of changes
from commit histories is time-consuming and prone to error. To address this problem, standards have been introduced to
help developers assign an identifier to each unique state of the software in a predictable way, to make it easier to
understand the software itself. We chose [Semantic Versioning](https://semver.org) as the standard for the project we
are working on.

Moreover, thanks to the standardized notation adopted for our commit messages, tools such as semantic-release can fully
automate version assignment and artifact management. For example, they can generate changelogs and manage release
notifications without the need for human intervention.

Therefore, automating the release workflow minimizes errors and enables teams to concentrate exclusively on development
rather than versioning tasks.

## Quality Assurance

TODO: Here, we must list all the practices and tools used to ensure quality, such as code style checkers and code
analyzers.

## Continuous Integration and Delivery

TODO: In depth explanation (when we write the scripts) on pipelines and GHA.