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
      g3d: {}
    };
  },
  methods: {
    initHT() {
      this.initDataModel();
    },
    showgem(type, color) {
      var node = new ht.Node();
      node.s({
        shape3d: type,
        "wf.visible": "selected",
        "3d.selectable": false,
        "shape3d.color": color
      });

      this.dataModel.add(node);
      this.objs[type] = node;
    },
    initDataModel() {
      let dataModel = new ht.DataModel();
      let g3d = new ht.graph3d.Graph3dView(dataModel);
      g3d.setEye(-200, 350, 350);
      g3d.setDashDisabled(false);
      // g3d.setCenterAxisVisible(true);  // 展示坐标轴
      g3d.getView().style.background = "#000";
      g3d.addToDOM();
      this.dataModel = dataModel;
      this.g3d = g3d;

      this.dataModel.clear();
      this.g3d.setCenter([0, 0, 0]);
      ht.Default.loadObj("3dobj/003.obj", null, {
        center: false,
        shape3d: "gem003",
        s3: [0.04, 0.04, 0.04], // make gem smaller
        finishFunc: () => {
          this.showgem("gem003", "#2D8EFF");
          if (Object.keys(this.objs).length === 3) {
            this.triggerBoom();
          }
        }
      });
      ht.Default.loadObj("3dobj/001.obj", null, {
        center: false,
        shape3d: "gem001",
        s3: [0.04, 0.04, 0.04], // make gem smaller
        finishFunc: () => {
          this.showgem("gem001", "#36C626");
          if (Object.keys(this.objs).length === 3) {
            this.triggerBoom();
          }
        }
      });
      ht.Default.loadObj("3dobj/002.obj", null, {
        center: false,
        shape3d: "gem002",
        s3: [0.04, 0.04, 0.04], // make gem smaller
        finishFunc: () => {
          this.showgem("gem002", "#F5222D");
          if (Object.keys(this.objs).length === 3) {
            this.triggerBoom();
          }
        }
      });
    },
    triggerBoom() {
      // 第一个OBJ和第三个OBJ弹出，展示爆炸效果
      let obj1 = this.objs["gem003"],
        obj2 = this.objs["gem002"];
      ht.Default.startAnim({
        frames: 16, // 动画帧数
        interval: 10, // 动画帧间隔毫秒数
        easing: t => {
          return t * t;
        }, // 动画缓动函数，默认采用`ht.Default.animEasing`
        finishFunc: () => {
          this.initTask();
        }, // 动画结束后调用的函数。
        action: v => {
          var p1 = obj1.getPosition();
          var p2 = obj2.getPosition();
          obj1.p3(p1.x, p1.y + 55 * v, 0);
          obj2.p3(p2.x, p2.y - 55 * v, 0);
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
