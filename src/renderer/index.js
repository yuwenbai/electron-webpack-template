// Initial welcome page. Delete the following line to remove it.
"use strict";
import React from "react";
import { render } from "react-dom";
import Wheel from "./Wheel";
import "./styles.css";

const styles = document.createElement("style");
// styles.innerText = `@import url(https://unpkg.com/spectre.css/dist/spectre.min.css);.empty{display:flex;flex-direction:column;justify-content:center;height:100vh;position:relative}.footer{bottom:0;font-size:13px;left:50%;opacity:.9;position:absolute;transform:translateX(-50%);width:100%}`;
const script = document.createElement("script");
script.setAttribute("type", "text/javascript"),
  //   (script.onload = init),
  document.head.appendChild(script),
  document.head.appendChild(styles);
// function init() {
console.log(" 1111 ");
render(
  <div
    style={{
      height: "240px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#000",
    }}
  >
    <div style={{ width: 70, height: 180 }}>
      <Wheel initIdx={1} length={24} width={23} loop={false} />
    </div>
    <div style={{ width: 70, height: 180 }}>
      <Wheel
        initIdx={35}
        length={60}
        width={23}
        loop={false}
        perspective="left"
      />
    </div>
  </div>,
  document.getElementById("app")
);
//   (Vue.config.devtools = false),
//     (Vue.config.productionTip = false),
//     new Vue({
//       data: {
//         versions: {
//           electron: process.versions.electron,
//           electronWebpack: require("electron-webpack/package.json").version,
//         },
//       },
//       methods: {
//         open(b) {
//           require("electron").shell.openExternal(b);
//         },
//       },
//       template: `<div><div class=empty><p class="empty-title h5">Welcome to your new project!<p class=empty-subtitle>Get qwdqwd now and take advantage of the great documentation at hand.<div class=empty-action><button @click="open('https://webpack.electron.build')"class="btn btn-primary">Documentation</button> <button @click="open('https://electron.atom.io/docs/')"class="btn btn-primary">Electron</button><br><ul class=breadcrumb><li class=breadcrumb-item>electron-webpack v{{ versions.electronWebpack }}</li><li class=breadcrumb-item>electron v{{ versions.electron }}</li></ul></div><p class=footer>This intitial landing page can be easily removed from <code>src/renderer/index.js</code>.</p></div></div>`,
//     }).$mount("#app");
// }
