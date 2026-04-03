import { Filter } from "bad-words";

const profanityFilter = new Filter();

// Common keyboard-mash and low-signal patterns
const GARBAGE_PATTERNS = [
  /^(.)\1{2,}$/i,                    // "aaa", "bbbbb"
  /^(?:asd|dsa|fgh|jkl)+$/i,         // "asd", "asdasd", "dsadsa"
  /^(?:qwe|wer|ert|rty)+$/i,         // "qwerty", "qweqwe"
  /^(?:zxc|xcv|cvb)+$/i,             // "zxczxc"
  /^(?:abc|def|ghi)+$/i,             // "abcabc"
  /^[a-z]{1,5}$/i,                   // very short alpha-only strings like "asd", "ff"
  /^(.{1,3})\1{1,}$/i,              // short repeating groups: "abab", "xyzxyz"
];

const JUNK_WORDS = new Set([
  "test", "testing", "hello", "hi", "hey", "foo", "bar", "baz",
  "blah", "blahblah", "lol", "lmao", "bruh", "whatever",
  "nothing", "idk", "n/a", "na", "none", "null", "undefined",
  "xxx", "zzz",
]);

/**
 * Validates gratitude content before submission.
 * Returns { valid: true } or { valid: false, message: string }.
 */
export function validateContent(text) {
  const trimmed = text.trim();

  // Block blank / whitespace-only
  if (!trimmed) {
    return { valid: false, message: "Please write something you're grateful for." };
  }

  // Block very short content (fewer than 3 non-space characters)
  const stripped = trimmed.replace(/\s/g, "");
  if (stripped.length < 3) {
    return { valid: false, message: "Could you share a bit more? Even a short sentence helps." };
  }

  // Block known junk words (exact match after lowercasing)
  if (JUNK_WORDS.has(stripped.toLowerCase())) {
    return { valid: false, message: "That doesn't look like a gratitude entry. Give it another try!" };
  }

  // Block keyboard-mash / garbage patterns
  if (GARBAGE_PATTERNS.some((re) => re.test(stripped))) {
    return { valid: false, message: "That doesn't look like a gratitude entry. Give it another try!" };
  }

  // Block profanity / explicit content
  if (profanityFilter.isProfane(trimmed)) {
    return { valid: false, message: "Let's keep things positive! Please revise your message." };
  }

  return { valid: true };
}
