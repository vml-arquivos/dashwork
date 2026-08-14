function readPackage(pkg) {
  if (pkg.name === "express" && pkg.dependencies?.["path-to-regexp"] === "0.1.12") {
    pkg.dependencies["path-to-regexp"] = "0.1.13";
  }
  if (pkg.name === "recharts" && pkg.dependencies?.lodash) {
    pkg.dependencies.lodash = "^4.18.1";
  }
  if (pkg.name === "express-rate-limit" && pkg.dependencies?.["ip-address"]) {
    pkg.dependencies["ip-address"] = "^10.5.0";
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
