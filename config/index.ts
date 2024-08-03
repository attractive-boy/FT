import Components from "unplugin-vue-components/webpack";
import NutUIResolver from "@nutui/auto-import-resolver";
import { UnifiedWebpackPluginV5 } from "weapp-tailwindcss";
import path from "path";

const config = {
  projectName: "myApp",
  alias: {
    "@/components": path.resolve(__dirname, "..", "src/components"),
    "@/utils": path.resolve(__dirname, "..", "src/utils"),
    "@": path.resolve(__dirname, "..", "src"),
  },
  date: "2024-6-6",
  designWidth(input) {
    if (input?.file?.replace(/\\+/g, "/").indexOf("@nutui") > -1) {
      return 375;
    }
    return 750;
  },
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1,
  },
  sourceRoot: "src",
  outputRoot: "dist",
  plugins: ["@tarojs/plugin-html"],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: "vue3",
  compiler: {
    type: "webpack5",
    prebundle: { enable: false },
  },
  sass: {
    data: `@import "@nutui/nutui-taro/dist/styles/variables.scss";`,
  },
  mini: {
    webpackChain(chain) {
      chain.plugin("unplugin-vue-components").use(
        Components({
          resolvers: [
            NutUIResolver({
              importStyle: "sass",
              taro: true,
            }),
          ],
        })
      );
      chain.merge({
        plugin: {
          install: {
            plugin: UnifiedWebpackPluginV5,
            args: [
              {
                appType: "taro",
                injectAdditionalCssVarScope: true,
              },
            ],
          },
        },
      });
      
      // Enable HMR for mini apps
      if (process.env.NODE_ENV === 'development') {
        chain.devServer
          .hot(true)
          .open(true); // Automatically open the browser
      }
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          // selectorBlackList: ['nut-']
        },
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true,
    },
  },
  h5: {
    webpackChain(chain) {
      chain.plugin("unplugin-vue-components").use(
        Components({
          resolvers: [
            NutUIResolver({
              importStyle: "sass",
              taro: true,
            }),
          ],
        })
      );

      // Enable HMR for H5 apps
      if (process.env.NODE_ENV === 'development') {
        chain.devServer
          .hot(true)
          .open(true); // Automatically open the browser
      }
    },
    publicPath: "/",
    staticDirectory: "static",
    esnextModules: ["icons-vue-taro", "nutui-taro"],
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
  },
  cache:{
    enable: true,
  }
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"));
  }
  return merge({}, config, require("./prod"));
};
