<template>
  <div>
    <Row>
      <Col span="24">
        <Card style="margin-bottom: 10px">
          <p slot="title" style="height: 32px">
            <Button type="info" @click="goBack" icon="md-arrow-round-back">返回</Button>
          </p>
          <!--搜索表单-->
          <Form inline>
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
  import {getDataList, coruData} from '@/api/order_goods_list'


  export default {
    name: 'list',
    components: {},
    data() {
      return {
        // 初始化表格列
        columnsList: [{title: '订单id', key: 'order_id', align: 'center'}, {
          title: '商品id',
          key: 'goods_id',
          align: 'center'
        }, {title: '数量', key: 'number', align: 'center'}, {title: '价格', key: 'money', align: 'center'}],
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
        searchConf: {order_id: ''},
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
      this.searchConf.order_id = this.$route.params.order_id
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
            }
          }
          // 图片列
          if (item.key === 'goods_id') {
            item.render = (h, param) => {
              let currentRowData = vm.tableData[param.index];
              if (currentRowData.goods_id) {
                return h('img', {
                  style: {
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    margin: '5px 0'
                  },
                  attrs: {
                    src: currentRowData.goods_id,
                    shape: 'square',
                    size: 'large'
                  },
                  on: {
                    click: (e) => {
                      vm.modalSeeingImg.img = currentRowData.goods_id;
                      vm.modalSeeingImg.show = true;
                    }
                  }
                });
              } else {
                return h('Tag', {}, '暂无图片');
              }
            };
          }
          // 标签列
          if (item.key === 'number') {
            item.render = (h, param) => {
              let currentRowData = vm.tableData[param.index];
              return h('Tag', {
                attrs: {
                  color: 'blue'
                }
              }, currentRowData.number);
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
        })
      },
      // 返回上一页
      goBack() {
        this.$router.go(-1)
      },
      // 取消表单数据
      doCancel(data) {
        if (!data) {
          this.formItem.order_goods_id = 0
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
