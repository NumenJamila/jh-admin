<template>
  <div>
    <Button type="primary" icon="md-add" style="margin-right: 20px;" @click="add"></Button>

    <Button type="primary" icon="ios-trash" @click="deleteItem"></Button>

    <Row v-for="(item,index) in formItem.cooperFlow" :key="index">
      <!--Parameter-->
      <Col :span="4">
        <div class="grid-content bg-purple">
          <Date-picker
            placeholder="选择日期"
            type="datetime"
            :value="item.date"
            :key="item.date"
            format="yyyy-MM-dd HH:mm"
            @on-change="item.date=$event"
          ></Date-picker>
        </div>
      </Col>
      <Col :span="4">
        <div class="grid-content bg-purple">
          <Input placeholder="请输入内容" v-model="item.flow" clearable></Input>
        </div>
      </Col>
      <Col :span="4">
        <div class="grid-content bg-purple">
          <Input placeholder="请输入内容" v-model="item.department" clearable></Input>
        </div>
      </Col>
      <Col :span="4">
        <div class="grid-content bg-purple">
          <Input placeholder="请输入内容" v-model="item.operator" clearable></Input>
        </div>
      </Col>
      <Col :span="4">
        <div class="grid-content bg-purple">
          <Input placeholder="请输入内容" v-model="item.phone" clearable></Input>
        </div>
      </Col>

      <!--Del-->
      <Col :span="4">
        <div class="grid-content bg-purple-light" id="checkboxSpacingDiv">
          <!-- `checked` 为 true 或 false -->
          <Checkbox v-model="item.isDelete" size="small"></Checkbox>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  name: "VueArrays_32",
  data() {
    return {
      formItem: {
        cooperFlow: [
          {
            flow: "合同发起",
            date: "2018-09-09 08:45",
            department: "衣联网",
            operator: "李某某",
            phone: "15798949874",
            email: "limoumou@haier.com"
          },
          {
            flow: "合同审核",
            date: "2018-09-09 10:00",
            department: "合同部",
            operator: "张某某",
            phone: "15798949874",
            email: "limoumou@haier.com"
          },
          {
            flow: "法务审核",
            date: "2018-09-09 11:45",
            department: "法务部",
            operator: "赵某某",
            phone: "15798949874",
            email: "limoumou@haier.com"
          },
          {
            flow: "财务审核",
            date: "2018-09-09 14:45",
            department: "财务部",
            operator: "钱某某",
            phone: "15798949874",
            email: "limoumou@haier.com"
          }
        ]
      }
    };
  },
  methods: {
    add() {
      this.formItem.cooperFlow.push({
            flow: "",
            date: "",
            department: "",
            operator: "",
            phone: "",
            email: ""
      });
    },
    deleteItem() {
      /*遍历数组，然后根据选中的状态获取对应的下标，然后进行删除*/
      for (let i = 0; i < this.formItem.cooperFlow.length; i++) {
        let obj = this.formItem.cooperFlow[i];
        if (obj.isDelete) {
          this.formItem.cooperFlow.splice(i, 1);
          i--;
        }
      }
    }
  }
};
</script>

 
<style scoped="scoped">
#product_tree {
  touch-action: none;
  z-index: 999;
}

#rtbtn {
  position: fixed;
  width: 25px;
  height: 25px;
  top: 20px;
  border-radius: 4px;
  box-sizing: content-box;
  background: #fff;
  border: 1px solid rgb(83, 99, 187);
  z-index: 9999;
  text-align: center;
  right: 30px;
}

#rtbtn img {
  width: 26px;
}

#download {
  position: fixed;
  width: 25px;
  height: 25px;
  top: 20px;
  border-radius: 4px;
  background: #fff;
  border: 1px solid rgb(83, 99, 187);
  z-index: 9999;
  text-align: center;
  right: 80px;
}

@media screen and (orientation: portrait) {
  /*屏幕旋转90*/
  #product_tree {
    transform-origin: 0 0;
    transform: rotateZ(90deg) translateY(-100%);
  }
}

#product_tree > .centralText {
  font: 23spx sans-serif;
  fill: #222;
}

#product_tree > .downwardNode text,
#product_tree > .upwardNode text {
  font: 15px sans-serif;
}
</style>
