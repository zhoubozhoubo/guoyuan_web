<template>
  <div>
    <Row>
      <Col span="24">
        <Card style="margin-bottom: 10px">
          <!--搜索表单-->
          <Form inline>
            <FormItem style="margin-bottom: 0">
              <Select v-model="searchConf.type" clearable placeholder='订单类型' style="width:100px">
              </Select>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <Select v-model="searchConf.status" clearable placeholder='订单状态' style="width:100px">
                <Option value="1">待付款</Option>
                <Option value="2">待收货</Option>
                <Option value="3">已完成</Option>
                <Option value="4">已取消</Option>
              </Select>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <DatePicker type="daterange" @on-change="searchConf.gmt_create=$event" placeholder="选择日期范围"
                          style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <Button type="primary" shape="circle" icon="ios-search" @click="search">{{ $t('find_button') }}/{{
                $t('refresh_button') }}
              </Button>
            </FormItem>
          </Form>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <Card>
          <div>
            <Table :loading="tableShow.loading" :columns="columnsList" :data="tableData" border disabled-hover></Table>
          </div>
          <div style="text-align: center;margin-top: 15px">
            <Page :total="tableShow.listCount" :current="tableShow.currentPage"
                  :page-size="tableShow.pageSize" @on-change="changePage"
                  @on-page-size-change="changeSize" show-elevator show-sizer show-total></Page>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import {getDataList, coruData} from '@/api/order_list'

  // 商品
  const goodsButton = (vm, h, currentRow, index) => {
    return h('Button', {
      props: {
        type: 'primary'
      },
      style: {
        margin: '5px'
      },
      on: {
        'click': () => {
          vm.$router.push({
            name: 'order_goods',
            params: { order_id: currentRow.order_id }
          });
        }
      }
    }, '商品');
  };


  export default {
    name: 'list',
    components: {},
    data() {
      return {
        // 初始化表格列
        columnsList: [{title: '订单类型', key: 'type', align: 'center'}, {
          title: '用户id',
          key: 'user_id',
          align: 'center'
        }, {title: '价格', key: 'money', align: 'center'}, {
          title: '用户地址id',
          key: 'user_address_id',
          align: 'center'
        }, {title: '支付时间', key: 'pay_time', align: 'center'}, {
          title: '订单状态',
          key: 'status',
          align: 'center'
        }, {title: '创建日期', key: 'gmt_create', align: 'center'}, {
          title: '操作',
          key: 'handle',
          align: 'center',
          handle: ['order_goods']
        }],
        // 表格数据
        tableData: [],
        // 表格显示分页属性
        tableShow: {
          loading: true,
          currentPage: 1,
          pageSize: 10,
          listCount: 0
        },
        // 搜索配置
        searchConf: {type: '', status: '', gmt_create: ''},
        // 表单属性
        formItem: {},
        // modal属性
        modalSetting: {
          show: false,
          loading: false,
          index: 0
        },
      }
    },
    created() {
      this.init()
      this.getList()
    },
    methods: {
      // 页面初始化
      init() {
        let vm = this
        this.columnsList.forEach(item => {
          // 操作列
          if (item.key === 'handle') {
            item.render = (h, param) => {
              let currentRowData = vm.tableData[param.index]
              return h('div', [
                goodsButton(vm, h, currentRowData, param.index)
              ])
            }
          }
          // 标签列
          if (item.key === 'type') {
            item.render = (h, param) => {
              let currentRowData = vm.tableData[param.index];
              return h('Tag', {
                attrs: {
                  color: 'blue'
                }
              }, currentRowData.type);
            };
          }
          // 标签列
          if (item.key === 'money') {
            item.render = (h, param) => {
              let currentRowData = vm.tableData[param.index];
              return h('Tag', {
                attrs: {
                  color: 'blue'
                }
              }, currentRowData.money);
            };
          }
          // 标签列
          if (item.key === 'status') {
            item.render = (h, param) => {
              let currentRowData = vm.tableData[param.index];
              return h('Tag', {
                attrs: {
                  color: 'blue'
                }
              }, currentRowData.status);
            };
          }
        })
      },
      // 取消表单数据
      doCancel(data) {
        if (!data) {
          this.formItem.order_id = 0
          this.$refs['myForm'].resetFields()
          this.modalSetting.loading = false
          this.modalSetting.index = 0
        }
      },
      // 数据分页一系列
      changePage(page) {
        this.tableShow.currentPage = page
        this.getList()
      },
      changeSize(size) {
        this.tableShow.pageSize = size
        this.getList()
      },
      // 搜索
      search() {
        this.tableShow.loading = true
        this.tableShow.currentPage = 1
        this.getList()
      },
      // 获取数据列表
      getList() {
        this.tableShow.loading = true;
        getDataList(this.tableShow, this.searchConf).then(res => {
          this.tableData = res.data.data.list
          this.tableShow.listCount = res.data.data.count
          this.tableShow.loading = false;
        })
      }
    }
  }
</script>

<style scoped>
</style>
<style>
</style>
