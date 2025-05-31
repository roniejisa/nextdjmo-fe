export function cfl(sentence) {
  if (!sentence) return "";
  return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
}