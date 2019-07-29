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
      isAnimating: false
    };
  },
  methods: {
    initHT() {
      this.initDataModel();
      // this.initTask();
    },
    showgem(type) {
      var node = new ht.Node();
      node.s({
        shape3d: type,
        "wf.visible": "selected",
        "3d.selectable": false
      });

      this.dataModel.add(node);
      this.objs[type] = node;
    },
    initDataModel() {
      let dataModel = new ht.DataModel();
      let g3d = new ht.graph3d.Graph3dView(dataModel);
      g3d.setEye(-200, 350, 350);
      g3d.setDashDisabled(false);
      g3d.getView().style.background = "#c2c2c2";
      g3d.addToDOM();
      this.dataModel = dataModel;
      this.g3d = g3d;

      this.dataModel.clear();
      this.g3d.setCenter([0, 0, 0]);
      ht.Default.loadObj("3dobj/003.obj", null, {
        center: false,
        shape3d: "gem003",
        s3: [0.04, 0.04, 0.04], // make gem smaller
        finishFunc: (modelMap, array, rawS3) => {
          this.showgem("gem003", rawS3);
        }
      });
      ht.Default.loadObj("3dobj/001.obj", null, {
        center: false,
        shape3d: "gem001",
        s3: [0.04, 0.04, 0.04], // make gem smaller
        finishFunc: (modelMap, array, rawS3) => {
          this.showgem("gem001", rawS3);
        }
      });
      ht.Default.loadObj("3dobj/002.obj", null, {
        center: false,
        shape3d: "gem002",
        s3: [0.04, 0.04, 0.04], // make gem smaller
        finishFunc: (modelMap, array, rawS3) => {
          this.showgem("gem002", rawS3);
        }
      });

      let graphView = this.g3d.getView();
      graphView.addEventListener(
        "dblclick",
        e => {
          if (this.isAnimating || !ht.Default.isLeftButton(e)) {
            return;
          }
          e.preventDefault();
          this.isAnimating = true;
          console.log(">>> this.booming triggerBoom:", this.booming);
          this.triggerBoom();
        },
        false
      );
      graphView.addEventListener(
        "tap",
        e => {
          if (this.isAnimating || !ht.Default.isLeftButton(e)) {
            return;
          }
          e.preventDefault();
          this.isAnimating = true;
          console.log(">>> this.booming triggerBoom:", this.booming);
          this.triggerBoom();
        },
        false
      );
      graphView.addEventListener(
        "contextmenu",
        e => {
          e.preventDefault();
          alert("您点击了节点，具体节点信息暂时尚未发布。");
        },
        false
      );
    },
    triggerRightClick(event) {
      alert("click node...");
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
