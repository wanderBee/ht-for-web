<template>
  <div class="home"></div>
</template>

<script>
// @ is an alias to /src
// import Hightopo from "@/components/HighTopo.vue";
let ht = window.ht;
export default {
  name: "home",
  components: {
    // Hightopo
  },
  data() {
    return {
      dataModel: {},
      objs: {},
      g3d: {},
      booming: false,
      defaultColors: ["#2D8EFF", "#36C626", "#F5222D"],
      defaultMats: ["铝合金", "钢制品", "铁制品"],
      defaultSizes: ["300 x 200 x 100", "150 x 250 x 70", "180 x 270 x 250"],
      defaultUrls: [
        "http://www.cnlaunch.com",
        "http://www.cnlaunch.com",
        "http://www.cnlaunch.com"
      ],
      defaultImages: [
        "/image/pix02.jpg",
        "/image/pix03.jpg",
        "/image/pix01.jpg"
      ],
      isAnimating: false
    };
  },
  methods: {
    initHT() {
      this.initDataModel();
      // this.initTask();
    },
    createNode(dataModel, type) {
      var node = new ht.Node();
      let currentColor = this.defaultColors[Object.keys(this.objs).length];
      let currentMat = this.defaultMats[Object.keys(this.objs).length];
      let currentSize = this.defaultSizes[Object.keys(this.objs).length];
      let currentUrl = this.defaultUrls[Object.keys(this.objs).length];
      let currentImage = this.defaultImages[Object.keys(this.objs).length];
      node.s({
        shape3d: type,
        "shape3d.color": currentColor,
        "wf.visible": "selected",
        "3d.selectable": true,
        "3d.movable": false
      });
      node.a({
        mat: currentMat,
        size: currentSize,
        url: currentUrl,
        image: currentImage
      });

      dataModel.add(node);
      this.objs[type] = node;
    },
    loadObj(type, url) {
      return new Promise((resolve, reject) => {
        ht.Default.loadObj(url, null, {
          center: false,
          shape3d: type,
          s3: [0.04, 0.04, 0.04], // make gem smaller
          finishFunc: modelMap => {
            if (modelMap) {
              resolve(type);
            } else {
              reject(null);
            }
          }
        });
      });
    },
    initDataModel() {
      let loadObj01 = this.loadObj("gem001", "3dobj/001.obj");
      let loadObj02 = this.loadObj("gem002", "3dobj/002.obj");
      let loadObj03 = this.loadObj("gem003", "3dobj/003.obj");
      Promise.all([loadObj01, loadObj02, loadObj03]).then(results => {
        let dataModel = new ht.DataModel();

        let g3d = new ht.graph3d.Graph3dView(dataModel);
        g3d.setEye(-200, 350, 350);
        g3d.setDashDisabled(false);
        g3d.getView().style.background = "#c2c2c2";
        g3d.addToDOM();

        var div = document.createElement("div");
        div.classList.add("popper");
        div.innerHTML = `
            <div class="popper-head">
              选中图元零件展现具体信息
            </div>
            <div class="popper-body">
            </div>
          `;
        g3d.getView().appendChild(div);

        results.forEach(res => {
          if (res) {
            this.createNode(dataModel, res);
          }
        });

        this.dataModel = dataModel;
        this.g3d = g3d;

        this.triggerBoom();
        this.g3dMi();
      });
    },
    triggerBoom() {
      // 第一个OBJ和第三个OBJ弹出，展示爆炸效果
      let obj1 = this.objs["gem003"],
        obj2 = this.objs["gem002"];
      ht.Default.startAnim({
        frames: 12, // 动画帧数
        interval: 5, // 动画帧间隔毫秒数
        easing: t => {
          return t * t;
        }, // 动画缓动函数，默认采用`ht.Default.animEasing`
        finishFunc: () => {
          this.booming = !this.booming;
          this.isAnimating = false;
          this.initTask();
        }, // 动画结束后调用的函数。
        action: v => {
          var p1 = obj1.getPosition();
          var p2 = obj2.getPosition();
          if (!this.booming) {
            obj1.p3(p1.x, p1.y + 55 * v, 0);
            obj2.p3(p2.x, p2.y - 55 * v, 0);
          } else {
            obj1.p3(p1.x, 0, 0);
            obj2.p3(p2.x, 0, 0);
          }
        }
      });
    },
    g3dMi() {
      this.g3d.mi(e => {
        console.log("e.kind", e.kind);
        if (e.kind === "clickData") {
          let node = e.data;
          let displayContent = document.querySelector(".popper .popper-body");
          if (displayContent) {
            console.log("e.data:", node, node.s("shape3d"), node.a("mat"));
            displayContent.innerHTML = `
            <ul>
              <li>名称：<span style="color:${node.s("shape3d.color")}">${node.s(
              "shape3d"
            )}</span></li>
              <li>材质： ${node.a("mat")}</li>
              <li>尺寸： ${node.a("size")}</li>
              <li>购买链接： <a target="_blank" href="${node.a(
                "url"
              )}">${node.a("url")}</a></li>
            <li><image src="${node.a("image")}"/></li>
              </ul>
            `;
          }
        }
      });
    },
    initEvents() {
      let g3dView = this.g3d.getView();
      g3dView.addEventListener(
        "dblclick",
        e => {
          if (this.isAnimating || !ht.Default.isLeftButton(e)) {
            return;
          }
          e.preventDefault();
          this.isAnimating = true;
          this.triggerBoom();
        },
        false
      );
      this.g3dMi();
    },
    initTask() {
      let rotationTask = {
        interval: 16,
        action: () => {
          Object.keys(this.objs).forEach(key => {
            let node = this.objs[key];
            node.setRotation(node.getRotation() + Math.PI / 180);
          });
        }
      };
      this.dataModel.addScheduleTask(rotationTask);
    }
  },
  mounted() {
    this.initHT();
  }
};
</script>

<style lang="less">
.popper {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 320px;
  background: #fff;
  border: 1px solid #dedede;
  font-size: 14px;

  .popper-head {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #333;
    border-bottom: 1px solid #dedede;
    height: 50px;
  }
  .popper-body {
    padding: 16px;

    ul,
    li {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  }
}
</style>
