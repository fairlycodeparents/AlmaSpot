# 5. DevOps

#### Index

1. [Analysis](1-analysis.md)
2. [Design](2-design.md)
3. [Architecture](3-architecture.md)
4. [Implementation](4-implementation.md)
5. [DevOps](5-devops.md)
   - 5.1. [DVCS Workflow](#51-dvcs-workflow)
   - 5.2. [Release Automation](#52-release-automation)
     - 5.2.1 [Conventional Commits](#521-conventional-commits)
     - 5.2.2 [Semantic Release](#522-semantic-release)
   - 5.3. [Quality Assurance](#53-quality-assurance)
     - 5.3.1. [Husky](#531-husky)
     - 5.3.2. [Prettier](#532-prettier)
     - 5.3.3. [Code coverage](#533-code-coverage)
   - 5.4. [Continuous Integration and Delivery](#54-continuous-integration-and-delivery)
     - 5.4.1. [PR Checks](#541-pr-checks)
     - 5.4.2. [Automated Releases](#542-automated-releases)
     - 5.4.3. [Renovate Bot](#543-renovate-bot)
6. [License](6-license.md)
7. [Deployment](7-deployment.md)

To streamline collaboration among group members and automate repetitive tasks, the choice of a deployment strategy is
crucial. For this reason, we decided to adopt the continuous release strategy described below. This requires a robust
test suite to limit errors, along with an adequate workflow and tools to automate releases.

## 5.1. DVCS Workflow

![GitHub Flow Diagram](figures/github-flow-diagram.png)

For the DVCS workflow, we chose [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow):
a lightweight, branch-based workflow centered around a single persistent branch, `main`, which always holds the stable,
deployable production history. We chose this strategy for its simplicity and agility, which supports our continuous
delivery goals.

Development of new features or bug fixes happens in dedicated branches created directly from `main`. This isolation
ensures that work-in-progress code does not affect the stability of the production branch. The core of this workflow
is the **Pull Request**: once work is ready, a PR is opened to facilitate code review and discussion. Only after the
changes are approved and pass all automated tests are they merged back into `main` and immediately ready for deployment.
This eliminates the complexity of managing multiple long-running branches like `develop` or `release`, streamlining our
path to production.

## 5.2. Release Automation

### 5.2.1 Conventional Commits

We chose to adopt [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) as the standard for our commit
messages. It is a lightweight convention for formatting commit messages that creates an explicit history that is easy
for both humans and machines to understand. Every commit must follow a specific structure: a standard type, such as
`feat` for new features or `fix` for bug repairs (optionally followed by a scope in parentheses), followed by a concise
description of the change. We adopted this standard for our project because it removes ambiguity from our version
history, significantly improving collaboration by enabling anyone to scan the log and immediately grasp the purpose of
each change. Furthermore, strictly adhering to this structured format enables us to automate critical parts of our
DevOps pipeline. For example, we can automatically generate semantic version numbers and changelogs based on the commit
types. This reduces manual overhead and ensures our release documentation is always accurate and up to date.

### 5.2.2. Semantic Release

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

## 5.3 Quality Assurance

### 5.3.1 Husky

We chose Husky to efficiently manage Git hooks across the development team. This allows us to automatically trigger
scripts at specific points in the Git workflow. It acts as a first line of defense, preventing low-quality code or
incorrect commit messages from ever entering the repository.

In our configuration, we utilize two primary hooks:

- **commit-msg**: This hook integrates with `Commitlint` to enforce the Conventional Commits standard (described
  in [Section 5.2.1](#521-conventional-commits)). Before a commit is finalized, Husky validates the message format; if
  the message does not adhere to the required structure (i.e., `<type>[(scope)][!]: <description>`), the commit is
  aborted, providing the developer with immediate feedback.
- **pre-commit**: This hook triggers `Lint-staged`, a tool that runs linters and formatters only on files currently
  staged for the commit. We have configured this to run `Prettier`, which ensures that all code is automatically
  formatted according to our style guidelines before being saved. By formatting only the changed files rather than the
  entire project, we maintain high performance while ensuring the codebase remains consistent.

This setup ensures that quality assurance is not an additional step, but an integral, automated part of the daily
contribution workflow.

### 5.3.2 Prettier

As introduced in the previous section, we use Prettier as our code formatter. Prettier is an opinionated code formatter
that enforces a consistent style by parsing code and re-printing it with its own rules. This eliminates debates over
styling, allowing the team to focus on the substance of the changes rather than their appearance.

By integrating Prettier into our development workflow, we ensure that all code adheres to a uniform style, which
improves readability and maintainability. This is particularly important in a collaborative environment where multiple
developers contribute to the same codebase.

### 5.3.3 Code coverage

To ensure the reliability and robustness of our codebase, we have integrated code coverage analysis into our development
workflow. For the server package we utilize **c8**, a code coverage tool for Node.js projects, which leverages Node.js'
built-in coverage capabilities, providing compatibility with Istanbul's reporting formats. On the other hand, for the
client package, we use **storybook**'s built-in coverage tool.

These tools help us identify untested parts of our codebase, allowing us to write additional tests to cover those areas.
By maintaining high code coverage, we can catch potential bugs early in the development process, leading to a more
stable and reliable application.

## 5.4 Continuous Integration and Delivery

To automate our build, test, and deployment processes, we have implemented a Continuous Integration and Delivery (CI/CD)
pipeline using GitHub Actions. This setup allows us to automatically validate and deploy our code changes, ensuring that
new features and fixes are delivered to users quickly and reliably.

### 5.4.1 PR Checks

Following the [GitHub Flow](#51-dvcs-workflow) strategy, new code is integrated into the main branch through Pull
Requests (PRs). For this reason, we've configured our repository to block any direct pushes to the `main` branch,
ensuring that all changes undergo a review process, to maintain production stability.

When a PR is opened, a series of automated checks are triggered via GitHub Actions. These checks include:

- **Unit tests**: All unit tests are executed to verify that new changes do not introduce regressions.
- **Type checking and Build verification**: Since the project is fully containerized with Docker, the CI pipeline is
  optimized for each environment. For the client, we execute a full build to verify that the application bundles
  correctly. For the server, we perform a strict TypeScript type check to ensure code validity without redundant
  compilation steps.

Moreover, for the repository as a whole, we run code Prettier checks, and we validate commit messages against the
Conventional Commits standard.

### 5.4.2 Automated Releases

To complete the continuous delivery pipeline, we implemented an automated release workflow that triggers on every push
to the main branch. This workflow, orchestrated by GitHub Actions, manages the entire lifecycle of a release without
manual intervention.

The pipeline performs the following steps in sequence:

- **Documentation deployment**: First, the workflow deploys the updated project documentation to GitHub Pages, ensuring
  that the documentation is always synchronized with the latest codebase.
- **Semantic Release**: It executes Semantic Release to analyze the commit history since the last version. Based on the
  Conventional Commits, it automatically calculates the next version number, generates a changelog, and creates a GitHub
  Release.
- **Conditional Docker build**: A crucial step in our pipeline is the verification of the release status. The docker
  release job is conditional; it executes only if a new release has actually been published by the previous step. This
  prevents the creation of redundant Docker images for commits that do not trigger a version upgrade (e.g.,
  documentation changes or chores).
- **Artifact publication**: If a release is triggered, the pipeline builds the Docker images for the server and
  unibo-provider contexts. These images are tagged with both the specific semantic version (e.g., `1.2.0`) and the
  `latest` tag, and are finally pushed to the GitHub container registry.

This automated approach ensures that every production artifact is traceable, correctly versioned, and immediately
available for deployment.

### 5.4.3 Renovate Bot

Renovate is a tool that automates the process of keeping dependencies up to date. It continuously scans the project's
dependency files and creates pull requests to update them whenever new versions are released. This helps ensure that the
project benefits from the latest features, bug fixes, and security patches without requiring manual intervention from
developers to track and update dependencies. By automating this process, Renovate reduces the risk of using outdated
libraries and helps maintain a secure and efficient codebase.
