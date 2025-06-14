export default {
  async fetch(request: Request, env: { ASSETS: any }) {
    return env.ASSETS.fetch(request)
  },
}
