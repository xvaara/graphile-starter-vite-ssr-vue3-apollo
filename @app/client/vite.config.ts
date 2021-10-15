import path from 'path'
import Vue from '@vitejs/plugin-vue'
import LinkAttributes from 'markdown-it-link-attributes'
import Prism from 'markdown-it-prism'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Markdown from 'vite-plugin-md'
import Pages from 'vite-plugin-pages'
import WindiCSS from 'vite-plugin-windicss'
import viteSSR from 'vite-ssr/plugin.js'

const markdownWrapperClasses = 'prose prose-sm m-auto text-left'

export const ssrTransformCustomDir = () => ({
  props: [],
  needRuntime: true,
})

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  server: {
    fs: {
      strict: true,
    },
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/head',
      '@vueuse/core',
      '@vue/apollo-composable',
    ],
    exclude: ['vue-demi'],
  },
  define: {
    __ROOT_URL__: JSON.stringify(process.env.ROOT_URL),
  },
  plugins: [
    viteSSR(),
    Vue({
      include: [/\.vue$/, /\.md$/],
      template: {
        ssr: true,
        compilerOptions: {
          directiveTransforms: {
            'b-modal': ssrTransformCustomDir,
            'b-popover': ssrTransformCustomDir,
            'b-toggle': ssrTransformCustomDir,
            'b-tooltip': ssrTransformCustomDir,
            'b-visible': ssrTransformCustomDir,
          },
        },
      },
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ['vue', 'md'],
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/head',
        '@vueuse/core',
        {
          '@vue/apollo-composable': ['useQuery', 'useMutation'],
        },
        {
          '~/utils/apollo': ['useResult'],
        },
      ],
      dts: path.resolve(__dirname, 'src', 'auto-imports.d.ts'),
    }),
    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],

      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],

      // custom resolvers
      resolvers: [
        // auto import icons
        // https://github.com/antfu/unplugin-icons
        IconsResolver({
          componentPrefix: '',
          // enabledCollections: ['carbon']
        }),
      ],
      dts: path.resolve(__dirname, 'src', 'components.d.ts'),
    }),
    Icons({
      autoInstall: true,
    }),
    Markdown({
      wrapperClasses: markdownWrapperClasses,
      headEnabled: true,
      markdownItSetup(md) {
        // https://prismjs.com/
        md.use(Prism)
        md.use(LinkAttributes, {
          pattern: /^https?:\/\//,
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })
      },
    }),
    WindiCSS({
      safelist: markdownWrapperClasses,
    }),
  ],
})
