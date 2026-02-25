const config = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
  // Nếu bạn có dùng các thư viện node native như crypto, hãy thêm vào đây
  edgeExternals: ["node:crypto"],
};

export default config;
