#!/usr/bin/env bats

setup() {
  repository_root="$(cd "$BATS_TEST_DIRNAME/.." && pwd)"
  test_root="$(mktemp -d)"
  repo_dir="$test_root/repo"
  mkdir -p \
    "$repo_dir/scripts/lib" \
    "$repo_dir/plugins/astra-kit/.claude-plugin" \
    "$repo_dir/plugins/astra-kit/.codex-plugin"

  cp "$repository_root/scripts/create-version.js" "$repo_dir/scripts/create-version.js"
  cp "$repository_root/scripts/lib/plugin-manifests.js" "$repo_dir/scripts/lib/plugin-manifests.js"
  cat > "$repo_dir/plugins/astra-kit/.claude-plugin/plugin.json" <<'JSON'
{
  "name": "astra-kit",
  "version": "1.12.0"
}
JSON
  cat > "$repo_dir/plugins/astra-kit/.codex-plugin/plugin.json" <<'JSON'
{
  "name": "astra-kit",
  "version": "1.12.0"
}
JSON

  git -C "$repo_dir" -c init.defaultBranch=main init -q
  git -C "$repo_dir" config user.name "Create Version Test"
  git -C "$repo_dir" config user.email "create-version-test@example.com"
  git -C "$repo_dir" add -A
  git -C "$repo_dir" commit -qm "Initialize fixture"

  remote_dir="$test_root/remote.git"
  git -c init.defaultBranch=main init -q --bare "$remote_dir"
  git -C "$repo_dir" remote add origin "$remote_dir"
  git -C "$repo_dir" push -q origin main
  unset FORCE_COLOR NO_COLOR
  cd "$repo_dir"
}

remote_head() {
  git -C "$remote_dir" rev-parse --verify --quiet "refs/heads/$1"
}

teardown() {
  cd "$repository_root"
  rm -rf "$test_root"
}

assert_head_contains_only_manifests() {
  git show --format= --name-only HEAD | grep -Fxq 'plugins/astra-kit/.claude-plugin/plugin.json'
  git show --format= --name-only HEAD | grep -Fxq 'plugins/astra-kit/.codex-plugin/plugin.json'
  [ "$(git show --format= --name-only HEAD | wc -l | tr -d ' ')" = "2" ]
}

@test "auto-detects one changed plugin and commits only both manifests" {
  mkdir -p plugins/astra-kit/docs
  printf '%s\n' 'plugin change' > plugins/astra-kit/docs/change.md
  printf '%s\n' 'staged change' > staged.txt
  git add staged.txt
  printf '%s\n' 'untracked change' > untracked.txt

  run bash -c "printf '1\\n' | node scripts/create-version.js"

  [ "$status" -eq 0 ]
  [[ "$output" == *"Detected changed plugin: astra-kit"* ]]
  [[ "$output" != *"Select a plugin by number"* ]]
  [ "$(node -p "require('./plugins/astra-kit/.claude-plugin/plugin.json').version")" = "1.12.1" ]
  [ "$(node -p "require('./plugins/astra-kit/.codex-plugin/plugin.json').version")" = "1.12.1" ]
  [ "$(git log -1 --pretty=%s)" = 'Bump the version number from 1.12.0 to 1.12.1 in both "plugin.json" files for the "astra-kit" plugin' ]
  git log -1 --pretty=%B | grep -Fxq 'Co-Authored-By: Claude Code <noreply@anthropic.com>'
  assert_head_contains_only_manifests
  git status --porcelain | grep -Fxq 'A  staged.txt'
  git status --porcelain | grep -Fxq '?? plugins/astra-kit/docs/'
  git status --porcelain | grep -Fxq '?? untracked.txt'
  [ "$(git status --porcelain | wc -l | tr -d ' ')" = "3" ]
}

@test "auto-detects plugin changed in branch history" {
  git update-ref refs/remotes/origin/main "$(git rev-parse HEAD)"
  git switch -q -c feature/astra-kit-change
  mkdir -p plugins/astra-kit/docs
  printf '%s\n' 'committed plugin change' > plugins/astra-kit/docs/committed.md
  git add plugins/astra-kit/docs/committed.md
  git commit -qm "Change Astra Kit"

  run bash -c "printf '1\\n' | node scripts/create-version.js"

  [ "$status" -eq 0 ]
  [[ "$output" == *"Detected changed plugin: astra-kit"* ]]
  [[ "$output" != *"Select a plugin by number"* ]]
  [ "$(node -p "require('./plugins/astra-kit/.claude-plugin/plugin.json').version")" = "1.12.1" ]
  [ -z "$(git status --porcelain)" ]
}

@test "keeps plugin menu when multiple plugins changed" {
  mkdir -p \
    plugins/astra-kit/docs \
    plugins/other-plugin/.claude-plugin \
    plugins/other-plugin/.codex-plugin
  printf '%s\n' 'plugin change' > plugins/astra-kit/docs/change.md
  cat > plugins/other-plugin/.claude-plugin/plugin.json <<'JSON'
{
  "name": "other-plugin",
  "version": "2.0.0"
}
JSON
  cat > plugins/other-plugin/.codex-plugin/plugin.json <<'JSON'
{
  "name": "other-plugin",
  "version": "2.0.0"
}
JSON

  run bash -c "printf '1\\n1\\n' | node scripts/create-version.js"

  [ "$status" -eq 0 ]
  [[ "$output" == *"Detected changed plugins:"* ]]
  [[ "$output" == *"Select a plugin by number"* ]]
  [ "$(git log -1 --pretty=%s)" = 'Bump the version number from 1.12.0 to 1.12.1 in both "plugin.json" files for the "astra-kit" plugin' ]
  assert_head_contains_only_manifests
  git status --porcelain | grep -Fxq '?? plugins/other-plugin/'
}

@test "pushes new feature branch and sets upstream" {
  git switch -q -c feature/astra-kit-change
  mkdir -p plugins/astra-kit/docs
  printf '%s\n' 'plugin change' > plugins/astra-kit/docs/change.md

  run bash -c "printf '1\\n' | node scripts/create-version.js"

  [ "$status" -eq 0 ]
  [[ "$output" == *'Pushed "feature/astra-kit-change" to origin'* ]]
  [ "$(remote_head feature/astra-kit-change)" = "$(git rev-parse HEAD)" ]
  [ "$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}')" = "origin/feature/astra-kit-change" ]
}

@test "pushes to existing upstream branch" {
  git switch -q -c feature/astra-kit-change
  git push -q -u origin HEAD
  mkdir -p plugins/astra-kit/docs
  printf '%s\n' 'plugin change' > plugins/astra-kit/docs/change.md

  run bash -c "printf '2\\n' | node scripts/create-version.js"

  [ "$status" -eq 0 ]
  [ "$(node -p "require('./plugins/astra-kit/.claude-plugin/plugin.json').version")" = "1.13.0" ]
  [ "$(remote_head feature/astra-kit-change)" = "$(git rev-parse HEAD)" ]
}

@test "pushes default branch" {
  mkdir -p plugins/astra-kit/docs
  printf '%s\n' 'plugin change' > plugins/astra-kit/docs/change.md

  run bash -c "printf '1\\n' | node scripts/create-version.js"

  [ "$status" -eq 0 ]
  [[ "$output" == *'Pushed "main" to origin'* ]]
  [ "$(remote_head main)" = "$(git rev-parse HEAD)" ]
  [ "$(git log -1 --pretty=%s)" = 'Bump the version number from 1.12.0 to 1.12.1 in both "plugin.json" files for the "astra-kit" plugin' ]
}

@test "reports push failure and keeps local commit" {
  git switch -q -c feature/astra-kit-change
  git remote set-url origin "$test_root/missing-remote.git"
  mkdir -p plugins/astra-kit/docs
  printf '%s\n' 'plugin change' > plugins/astra-kit/docs/change.md

  run bash -c "printf '1\\n' | node scripts/create-version.js"

  [ "$status" -eq 1 ]
  [[ "$output" == *'Version bump commit was created but "git push -u origin HEAD" failed for branch "feature/astra-kit-change"'* ]]
  [ "$(git log -1 --pretty=%s)" = 'Bump the version number from 1.12.0 to 1.12.1 in both "plugin.json" files for the "astra-kit" plugin' ]
  assert_head_contains_only_manifests
  [ "$(git status --porcelain)" = '?? plugins/astra-kit/docs/' ]
}

@test "prints plain output when stdout is not a terminal" {
  mkdir -p plugins/astra-kit/docs
  printf '%s\n' 'plugin change' > plugins/astra-kit/docs/change.md

  run bash -c "printf '1\\n' | node scripts/create-version.js"

  [ "$status" -eq 0 ]
  [[ "$output" != *$'\e['* ]]
  [[ "$output" == *"╭─ 📦 Plugin"* ]]
  [[ "$output" == *"1.12.0 → 1.12.1"* ]]
}

@test "colors output when FORCE_COLOR is set" {
  mkdir -p plugins/astra-kit/docs
  printf '%s\n' 'plugin change' > plugins/astra-kit/docs/change.md

  run bash -c "printf '1\\n' | FORCE_COLOR=1 node scripts/create-version.js"

  [ "$status" -eq 0 ]
  [[ "$output" == *$'\e[32m'* ]]
}

@test "NO_COLOR overrides FORCE_COLOR" {
  mkdir -p plugins/astra-kit/docs
  printf '%s\n' 'plugin change' > plugins/astra-kit/docs/change.md

  run bash -c "printf '1\\n' | FORCE_COLOR=1 NO_COLOR=1 node scripts/create-version.js"

  [ "$status" -eq 0 ]
  [[ "$output" != *$'\e['* ]]
}

@test "dry run previews bump without writing, committing or pushing" {
  git switch -q -c feature/astra-kit-change
  mkdir -p plugins/astra-kit/docs
  printf '%s\n' 'plugin change' > plugins/astra-kit/docs/change.md
  initial_head="$(git rev-parse HEAD)"
  initial_status="$(git status --porcelain)"

  run bash -c "printf '1\\n' | node scripts/create-version.js --dry-run"

  [ "$status" -eq 0 ]
  [[ "$output" == *"🧪 DRY RUN"* ]]
  [[ "$output" == *"Would update plugins/astra-kit/.claude-plugin/plugin.json"* ]]
  [[ "$output" == *'Would commit only both manifests: Bump the version number from 1.12.0 to 1.12.1'* ]]
  [[ "$output" == *'Would push "feature/astra-kit-change" to origin (git push -u origin HEAD)'* ]]
  [ "$(node -p "require('./plugins/astra-kit/.claude-plugin/plugin.json').version")" = "1.12.0" ]
  [ "$(node -p "require('./plugins/astra-kit/.codex-plugin/plugin.json').version")" = "1.12.0" ]
  [ "$(git rev-parse HEAD)" = "$initial_head" ]
  [ "$(git status --porcelain)" = "$initial_status" ]
  [ -z "$(remote_head feature/astra-kit-change)" ]
}

@test "dry run shorthand works with plugin name on default branch" {
  run bash -c "printf '3\\n' | node scripts/create-version.js -n astra-kit"

  [ "$status" -eq 0 ]
  [[ "$output" == *"1.12.0 → 2.0.0"* ]]
  [[ "$output" == *'Would push "main" to origin (git push -u origin HEAD)'* ]]
  [ "$(node -p "require('./plugins/astra-kit/.claude-plugin/plugin.json').version")" = "1.12.0" ]
  [ "$(git log -1 --pretty=%s)" = "Initialize fixture" ]
}

@test "rejects unknown options" {
  run bash -c "node scripts/create-version.js --force"

  [ "$status" -eq 1 ]
  [[ "$output" == *'Unknown option "--force". Supported options: --dry-run, -n'* ]]
}

@test "prints help without touching the repository" {
  run bash -c "node scripts/create-version.js -h"

  [ "$status" -eq 0 ]
  [[ "$output" == *"Usage"* ]]
  [[ "$output" == *"--bump <kind>"* ]]
  [[ "$output" == *"--set <version>"* ]]
  [ "$(git log -1 --pretty=%s)" = "Initialize fixture" ]
}

@test "bumps without prompts using --bump" {
  mkdir -p plugins/astra-kit/docs
  printf '%s\n' 'plugin change' > plugins/astra-kit/docs/change.md

  run bash -c "node scripts/create-version.js astra-kit --bump minor < /dev/null"

  [ "$status" -eq 0 ]
  [[ "$output" != *"Select an option"* ]]
  [ "$(node -p "require('./plugins/astra-kit/.claude-plugin/plugin.json').version")" = "1.13.0" ]
  [ "$(node -p "require('./plugins/astra-kit/.codex-plugin/plugin.json').version")" = "1.13.0" ]
}

@test "sets exact version using --set=value" {
  mkdir -p plugins/astra-kit/docs
  printf '%s\n' 'plugin change' > plugins/astra-kit/docs/change.md

  run bash -c "node scripts/create-version.js --set=3.1.4 < /dev/null"

  [ "$status" -eq 0 ]
  [ "$(node -p "require('./plugins/astra-kit/.claude-plugin/plugin.json').version")" = "3.1.4" ]
}

@test "combines dry run with --set" {
  mkdir -p plugins/astra-kit/docs
  printf '%s\n' 'plugin change' > plugins/astra-kit/docs/change.md

  run bash -c "node scripts/create-version.js -n --set 2.0.0 < /dev/null"

  [ "$status" -eq 0 ]
  [[ "$output" == *"1.12.0 → 2.0.0"* ]]
  [ "$(node -p "require('./plugins/astra-kit/.claude-plugin/plugin.json').version")" = "1.12.0" ]
}

@test "rejects invalid --bump and --set values" {
  run bash -c "node scripts/create-version.js --bump huge"
  [ "$status" -eq 1 ]
  [[ "$output" == *'Invalid --bump value "huge". Expected one of: patch, minor, major'* ]]

  run bash -c "node scripts/create-version.js --set 1.2"
  [ "$status" -eq 1 ]
  [[ "$output" == *'Invalid --set value "1.2". Expected MAJOR.MINOR.PATCH.'* ]]
}

@test "rejects --bump with --set and missing values" {
  run bash -c "node scripts/create-version.js --bump patch --set 2.0.0"
  [ "$status" -eq 1 ]
  [[ "$output" == *"Options --bump and --set cannot be used together."* ]]

  run bash -c "node scripts/create-version.js --bump --dry-run"
  [ "$status" -eq 1 ]
  [[ "$output" == *'Option "--bump" requires a value.'* ]]
}

add_other_plugin_on_base() {
  mkdir -p plugins/other-plugin/.claude-plugin plugins/other-plugin/.codex-plugin
  for provider_directory in .claude-plugin .codex-plugin; do
    printf '%s\n' '{' '  "name": "other-plugin",' '  "version": "2.0.0"' '}' \
      > "plugins/other-plugin/$provider_directory/plugin.json"
  done
  git add plugins/other-plugin
  git commit -qm "Add other plugin"
  git update-ref refs/remotes/origin/main "$(git rev-parse HEAD)"
  git switch -q -c feature/multi-plugin-change
}

@test "skips plugins already bumped in the branch and auto-selects the pending one" {
  add_other_plugin_on_base
  mkdir -p plugins/astra-kit/docs plugins/other-plugin/docs
  printf '%s\n' 'astra kit change' > plugins/astra-kit/docs/change.md
  printf '%s\n' 'other plugin change' > plugins/other-plugin/docs/change.md
  git add plugins
  git commit -qm "Change both plugins"
  node scripts/create-version.js other-plugin --bump minor >/dev/null

  run bash -c "printf '1\\n' | node scripts/create-version.js"

  [ "$status" -eq 0 ]
  [[ "$output" == *"Already bumped in this branch: other-plugin (2.0.0 → 2.1.0)"* ]]
  [[ "$output" == *"Detected changed plugin: astra-kit"* ]]
  [[ "$output" != *"Select a plugin by number"* ]]
  [ "$(node -p "require('./plugins/astra-kit/.claude-plugin/plugin.json').version")" = "1.12.1" ]
  [ "$(node -p "require('./plugins/other-plugin/.claude-plugin/plugin.json').version")" = "2.1.0" ]
}

@test "marks bumped plugins in the menu when every changed plugin is bumped" {
  add_other_plugin_on_base
  mkdir -p plugins/astra-kit/docs plugins/other-plugin/docs
  printf '%s\n' 'astra kit change' > plugins/astra-kit/docs/change.md
  printf '%s\n' 'other plugin change' > plugins/other-plugin/docs/change.md
  git add plugins
  git commit -qm "Change both plugins"
  node scripts/create-version.js astra-kit --bump patch >/dev/null
  node scripts/create-version.js other-plugin --bump patch >/dev/null

  run bash -c "printf '1\\n1\\n' | node scripts/create-version.js --dry-run"

  [ "$status" -eq 0 ]
  [[ "$output" == *"astra-kit  ✔ bumped 1.12.0 → 1.12.1"* ]]
  [[ "$output" == *"other-plugin  ✔ bumped 2.0.0 → 2.0.1"* ]]
  [[ "$output" == *"Select a plugin by number"* ]]
  [[ "$output" != *"Detected changed plugin"* ]]
}

@test "auto-selects the only plugin when no plugin changed" {
  run bash -c "printf '1\n' | node scripts/create-version.js"

  [ "$status" -eq 0 ]
  [[ "$output" == *"Only plugin available: astra-kit"* ]]
  [[ "$output" != *"Select a plugin by number"* ]]
  [ "$(node -p "require('./plugins/astra-kit/.claude-plugin/plugin.json').version")" = "1.12.1" ]
}

@test "auto-detects plugin committed on the default branch after its last version change" {
  mkdir -p plugins/other-plugin/.claude-plugin plugins/other-plugin/.codex-plugin plugins/astra-kit/docs
  for provider_directory in .claude-plugin .codex-plugin; do
    printf '%s\n' '{' '  "name": "other-plugin",' '  "version": "2.0.0"' '}' \
      > "plugins/other-plugin/$provider_directory/plugin.json"
  done
  git add plugins/other-plugin
  git commit -qm "Add other plugin"
  printf '%s\n' 'released without bump' > plugins/astra-kit/docs/change.md
  git add plugins/astra-kit/docs/change.md
  git commit -qm "Change Astra Kit"
  git push -q origin main
  git fetch -q origin

  run bash -c "printf '1\n' | node scripts/create-version.js --dry-run"

  [ "$status" -eq 0 ]
  [[ "$output" == *"Detected changed plugin: astra-kit"* ]]
  [[ "$output" != *"Select a plugin by number"* ]]
  [[ "$output" == *"1.12.0 → 1.12.1"* ]]
}
