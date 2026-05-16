function log(label, data = null) {
  console.log("\n================================");
  console.log(`[LOG] ${label}`);
  if (data) console.log(JSON.stringify(data, null, 2));
  console.log("================================\n");
}

module.exports = { log };