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
              <Select v-model="searchConf.stage" clearable placeholder='阶段' style="width:100px">
                <Option value="1">种子</Option>
                <Option value="2">发芽</Option>
                <Option value="3">成长</Option>
                <Option value="4">开花</Option>
                <Option value="5">结果</Option>
                <Option value="6">成熟</Option>
              </Select>
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
  import {getDataList, coruData} from '@/api/user_tree_list'


  export default {
    name: 'list',
    components: {},
    data() {
      return {
        // 初始化表格列
        columnsList: [{title: '用户id', key: 'user_id', align: 'center'}, {
          title: '果树id',
          key: 'tree_id',
          align: 'center'
        }, {title: '阶段', key: 'stage', align: 'center'}, {
          title: '水滴数',
          key: 'walter_number',
          align: 'center'
        }, {title: '小化肥数', key: 'little_fertilizer_number', align: 'center'}, {
          title: '大化肥数',
          key: 'big_fertilizer_number',
          align: 'center'
        }, {title: '创建日期', key: 'gmt_create', align: 'center'}],
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
        searchConf: {user_id: '', stage: ''},
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
      this.searchConf.user_id = this.$route.params.user_id
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
          // 标签列
          if (item.key === 'stage') {
            item.render = (h, param) => {
              let currentRowData = vm.tableData[param.index];
              return h('Tag', {
                attrs: {
                  color: 'blue'
                }
              }, currentRowData.stage);
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
          this.formItem.user_tree_id = 0
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
