#!/usr/bin/env bats

setup() {
  repository_root="$(cd "$BATS_TEST_DIRNAME/.." && pwd)"
  test_root="$(mktemp -d)"
  repo_dir="$test_root/repo"
  mkdir -p "$repo_dir/scripts/lib"
  cp "$repository_root/scripts/check-version-bump.js" "$repo_dir/scripts/"
  cp "$repository_root/scripts/lib/plugin-manifests.js" "$repo_dir/scripts/lib/"

  write_manifests golfo-kit 1.12.0
  mkdir -p "$repo_dir/plugins/golfo-kit/skills/demo"
  printf '%s\n' 'skill' > "$repo_dir/plugins/golfo-kit/skills/demo/SKILL.md"

  git -C "$repo_dir" -c init.defaultBranch=main init -q
  git -C "$repo_dir" config user.name "Check Version Test"
  git -C "$repo_dir" config user.email "check-version-test@example.com"
  git -C "$repo_dir" add -A
  git -C "$repo_dir" commit -qm "Initialize fixture"

  remote_dir="$test_root/remote.git"
  git -c init.defaultBranch=main init -q --bare "$remote_dir"
  git -C "$repo_dir" remote add origin "$remote_dir"
  git -C "$repo_dir" push -q origin main
  git -C "$repo_dir" switch -qc feature/change
  unset GITHUB_ACTIONS
  cd "$repo_dir"
}

teardown() {
  cd "$repository_root"
  rm -rf "$test_root"
}

# write_manifests <plugin> <claude-version> [codex-version]
write_manifests() {
  local plugin_dir="$repo_dir/plugins/$1"
  mkdir -p "$plugin_dir/.claude-plugin" "$plugin_dir/.codex-plugin"
  printf '{\n  "name": "%s",\n  "version": "%s"\n}\n' "$1" "$2" > "$plugin_dir/.claude-plugin/plugin.json"
  printf '{\n  "name": "%s",\n  "version": "%s"\n}\n' "$1" "${3:-$2}" > "$plugin_dir/.codex-plugin/plugin.json"
}

commit_all() {
  git add -A
  git commit -qm "$1"
}

run_check() {
  run node scripts/check-version-bump.js "$@"
}

@test "fails when a plugin skill changed without a version bump" {
  printf '%s\n' 'changed' >> plugins/golfo-kit/skills/demo/SKILL.md
  commit_all "Change skill"

  run_check
  [ "$status" -eq 1 ]
  [[ "$output" == *"golfo-kit: Plugin changed but its version is 1.12.0 (base 1.12.0)"* ]]
}

@test "passes when both manifests were bumped" {
  printf '%s\n' 'changed' >> plugins/golfo-kit/skills/demo/SKILL.md
  write_manifests golfo-kit 1.13.0
  commit_all "Change skill and bump"

  run_check
  [ "$status" -eq 0 ]
  [[ "$output" == *"golfo-kit: 1.12.0 -> 1.13.0."* ]]
}

@test "fails when only the Claude manifest was bumped" {
  write_manifests golfo-kit 1.13.0 1.12.0
  commit_all "Bump only Claude"

  run_check
  [ "$status" -eq 1 ]
  [[ "$output" == *"Claude manifest has 1.13.0 but Codex manifest has 1.12.0"* ]]
}

@test "fails when the version goes down" {
  write_manifests golfo-kit 1.11.9
  commit_all "Lower version"

  run_check
  [ "$status" -eq 1 ]
  [[ "$output" == *"its version is 1.11.9 (base 1.12.0)"* ]]
}

@test "compares versions numerically, not as text" {
  write_manifests golfo-kit 1.12.0
  git commit -qm "noop" --allow-empty
  git switch -q main
  write_manifests golfo-kit 1.9.0
  commit_all "Base at 1.9.0"
  git push -q origin main
  git switch -qc feature/numeric
  write_manifests golfo-kit 1.10.0
  commit_all "Bump to 1.10.0"

  run_check
  [ "$status" -eq 0 ]
  [[ "$output" == *"golfo-kit: 1.9.0 -> 1.10.0."* ]]
}

@test "ignores changes outside plugins and inside tests or evals" {
  printf '%s\n' 'ci' > ci.txt
  mkdir -p plugins/golfo-kit/skills/demo/tests plugins/golfo-kit/skills/demo/evals
  printf '%s\n' 'test' > plugins/golfo-kit/skills/demo/tests/demo.bats
  printf '%s\n' '{}' > plugins/golfo-kit/skills/demo/evals/eval-config.json
  commit_all "Tests and tooling only"

  run_check
  [ "$status" -eq 0 ]
  [[ "$output" == *"golfo-kit: no shipped changes, no bump needed."* ]]
}

@test "accepts a new plugin without a base version" {
  write_manifests new-kit 0.1.0
  commit_all "Add plugin"

  run_check
  [ "$status" -eq 0 ]
  [[ "$output" == *"new-kit: new plugin at 0.1.0."* ]]
}

@test "emits a GitHub Actions error annotation in CI" {
  printf '%s\n' 'changed' >> plugins/golfo-kit/skills/demo/SKILL.md
  commit_all "Change skill"

  GITHUB_ACTIONS=true run_check
  [ "$status" -eq 1 ]
  [[ "$output" == *"::error file=plugins/golfo-kit/.claude-plugin/plugin.json::golfo-kit: Plugin changed"* ]]
}

@test "fails with context when the base reference does not exist" {
  run_check origin/missing
  [ "$status" -eq 1 ]
  [[ "$output" == *'check-version-bump: "git merge-base origin/missing HEAD" failed'* ]]
}
