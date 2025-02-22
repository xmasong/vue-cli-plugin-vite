import path from 'path'
import { defineConfig, Plugin } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import envCompatible from 'vite-plugin-env-compatible'
import vueCli, { VueCliOptions } from 'vite-plugin-vue-cli'
import mpa from 'vite-plugin-mpa'
import { Options } from './options'
import { name } from '../package.json'

const resolve = (p: string) => path.resolve(process.cwd(), p)

// vue.config.js
let vueConfig: VueCliOptions = {}
try {
  vueConfig = require(resolve('vue.config.js')) || {}
} catch (e) {
  /**/
}

const pluginOptions = vueConfig.pluginOptions || {}
const viteOptions: Options = pluginOptions.vite || {}
const extraPlugins = viteOptions.plugins || []

if (viteOptions.alias) {
  console.log(
    `[${name}]: pluginOptions.vite.alias is deprecated, will auto-resolve from chainWebpack / configureWebpack`,
  )
}

const useMPA = Boolean(vueConfig.pages)

const plugins = [
  envCompatible(),
  vueCli(vueConfig),
  createVuePlugin(viteOptions.vitePluginVue2Options),
  useMPA
    ? mpa({
        // special use main.html for vue-cli
        filename: 'main.html',
      })
    : undefined,
  ...extraPlugins,
].filter(Boolean) as Plugin[]

// @see https://vitejs.dev/config/
export default defineConfig({
  plugins,
  optimizeDeps: viteOptions.optimizeDeps,
})
