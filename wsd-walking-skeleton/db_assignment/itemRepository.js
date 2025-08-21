let item = "Nothing"
let kv;

/**
 * Open KV once and reuse it.
 */
async function getKv() {
  if (!kv) {
    kv = await Deno.openKv();
  }
  return kv;
}

/**
 * Get the item from Deno KV.
 * If nothing stored, return "Nothing."
 */
const getItem = async () => {
  const kv = await getKv();
  const res = await kv.get(["item"]);
  return res.value ?? "Nothing.";
};

/**
 * Set the item in Deno KV.
 */
const setItem = async (i) => {
  const kv = await getKv();
  await kv.set(["item"], i);
};

export { getItem, setItem };