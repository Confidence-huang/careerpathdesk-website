/*
Public website behavior contract: read the built-in static entry exactly as GitHub Pages serves it.
Run with: node --test tests/site.test.mjs
*/
import assert from 'node:assert/strict' // Use Node's public assertion interface without adding a test dependency.
import { readFile } from 'node:fs/promises' // Read the same HTML artifact visitors receive.
import test from 'node:test' // Execute the contract through Node's built-in test runner.

const htmlURL = new URL('../index.html', import.meta.url) // Keep the test independent of the caller's directory.

// --- Explain the product on the first screen ---

test('the first screen connects the owner, staff, and student journey', async () => {
  const html = await readFile(htmlURL, 'utf8') // Load the public page instead of testing an internal component.

  assert.match(html, /一个工作台，连接老板、老师和学生/) // Require the product value in visitor-facing copy.
})

// --- Show every participant and the complete service chain ---

test('the page explains three roles and four dependent workflow stages', async () => {
  const html = await readFile(htmlURL, 'utf8') // Observe only the visitor-facing document.

  for (const role of ['老板', '老师', '学生']) {
    assert.match(html, new RegExp(`data-role="${role}"`)) // Give each participant one visible responsibility card.
  }
  for (const stage of ['学生填写', '老师执行', '老板复盘', '继续跟进']) {
    assert.match(html, new RegExp(`data-stage="${stage}"`)) // Keep the service flow understandable without JavaScript.
  }
})

// --- Provide proof and source without collecting visitor data ---

test('the page links the public source and serves a local controlled demo', async () => {
  const html = await readFile(htmlURL, 'utf8') // Check the deployable document, not a source-only abstraction.

  assert.match(html, /controls[^>]*poster="\.\/assets\/readme\/demo-cover\.webp"/) // Let visitors control playback.
  assert.match(html, /\.\/media\/careerpathdesk-demo\.mp4/) // Keep the demo first-party and repository-owned.
  assert.match(html, /Confidence-huang\/careerpathdesk-frontend/) // Make the browser implementation discoverable.
  assert.match(html, /Confidence-huang\/careerpathdesk-backend/) // Make the API implementation discoverable.
  assert.match(html, /不含真实学生数据/) // Keep the synthetic-data boundary visible beside the proof.
  assert.doesNotMatch(html, /analytics|gtag|tracker|app\.careerpathdesk\.com|uat\.careerpathdesk\.com/i) // Publish no tracking or old origin.
})
