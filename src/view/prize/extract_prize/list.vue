<template>
  <div>
    <Row>
      <Col span="24">
        <Card style="margin-bottom: 10px">
          <!--搜索表单-->
          <Form inline>
            <FormItem style="margin-bottom: 0">
              <Select v-model="searchConf.resources_type" clearable placeholder='资源类型' style="width:100px">
                <Option value="1">水滴</Option>
                <Option value="2">小化肥</Option>
                <Option value="3">大化肥</Option>
                <Option value="4">钻石</Option>
                <Option value="5">谢谢参与</Option>
              </Select>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <Input v-model="searchConf.name" clearable placeholder="名称"/>
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
          <p slot="title" style="height: 40px">
            <Button type="primary" @click="alertAdd" icon="md-add">{{ $t('add_button') }}</Button>
          </p>
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
    <!--新增、编辑Modal-->
    <Modal v-model="modalSetting.show" width="700" :styles="{top: '30px'}" @on-visible-change="doCancel">
      <p slot="header" style="color:#2d8cf0;">
        <Icon type="md-information-circle"></Icon>
        <span>{{formItem.extract_prize_id ? '编辑' : '新增'}}</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="100">
        <FormItem label="资源类型" prop="resources_type">
          <Select v-model="formItem.resources_type" style="width:200px">
            <Option value="1">水滴</Option>
            <Option value="2">小化肥</Option>
            <Option value="3">大化肥</Option>
            <Option value="4">钻石</Option>
            <Option value="5">谢谢参与</Option>
          </Select>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="formItem.name" placeholder="名称"/>
        </FormItem>
        <FormItem label="数量" prop="number">
          <Input v-model="formItem.number" placeholder="数量"/>
        </FormItem>
        <FormItem label="概率" prop="probability">
          <Input v-model="formItem.probability" placeholder="概率"/>
        </FormItem>
        <FormItem label="排序" prop="sort">
          <Input v-model="formItem.sort" placeholder="排序"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="submit" :loading="modalSetting.loading">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {getDataList, coruData} from '@/api/extract_prize_list'

  // 编辑
  const editButton = (vm, h, currentRow, index) => {
    return h('Button', {
      props: {
        type: 'primary'
      },
      style: {
        margin: '0 5px'
      },
      on: {
        'click': () => {
          vm.formItem.extract_prize_id = currentRow.extract_prize_id;
          vm.formItem.resources_type = String(currentRow.resources_type);
          vm.formItem.name = currentRow.name;
          vm.formItem.number = String(currentRow.number);
          vm.formItem.probability = String(currentRow.probability);
          vm.formItem.sort = currentRow.sort;
          vm.modalSetting.show = true
          vm.modalSetting.index = index
        }
      }
    }, vm.$t('edit_button'))
  }
  //删除
  const deleteButton = (vm, h, currentRow, index) => {
    return h('Poptip', {
      props: {
        confirm: true,
        title: '您确定要删除这条数据吗? ',
        transfer: true
      },
      on: {
        'on-ok': () => {
          coruData({extract_prize_id: currentRow.extract_prize_id, is_delete: 1}).then(response => {
            vm.tableData.splice(index, 1)
            vm.$Message.success(response.data.msg)
          }).catch(() => {
          })
        }
      }
    }, [
      h('Button', {
        style: {
          margin: '0 5px'
        },
        props: {
          type: 'error',
          placement: 'top',
        }
      }, vm.$t('delete_button'))
    ])
  }

  export default {
    name: 'list',
    components: {},
    data() {
      return {
        // 初始化表格列
        columnsList: [{title: '资源类型', key: 'resources_type', align: 'center'}, {
          title: '名称',
          key: 'name',
          align: 'center'
        }, {title: '数量', key: 'number', align: 'center'}, {
          title: '概率',
          key: 'probability',
          align: 'center'
        }, {title: '排序', key: 'sort', align: 'center'}, {
          title: '创建日期',
          key: 'gmt_create',
          align: 'center'
        }, {title: '操作', key: 'handle', align: 'center', handle: ['edit', 'delete']}],
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
        searchConf: {resources_type: '', name: '', gmt_create: ''},
        // 表单属性
        formItem: {extract_prize_id: '', resources_type: '', name: '', number: '', probability: '', sort: ''},
        // modal属性
        modalSetting: {
          show: false,
          loading: false,
          index: 0
        },
        // 表单验证
        ruleValidate: {
          resources_type: [{required: true, message: "请选择类型", trigger: "blur"}],
          name: [{required: true, message: "请输入名称", trigger: "blur"}],
          number: [{required: true, message: "请输入数量", trigger: "blur"}],
          probability: [{required: true, message: "请输入概率", trigger: "blur"}],
        }
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
                editButton(vm, h, currentRowData, param.index),
                deleteButton(vm, h, currentRowData, param.index)
              ])
            }
          }
          // 标签列
          if (item.key === 'resources_type') {
            item.render = (h, param) => {
              let currentRowData = vm.tableData[param.index];
              return h('Tag', {
                attrs: {
                  color: 'blue'
                }
              }, currentRowData.resources_type);
            };
          }
          // 标签列
          if (item.key === 'probability') {
            item.render = (h, param) => {
              let currentRowData = vm.tableData[param.index];
              return h('Tag', {
                attrs: {
                  color: 'blue'
                }
              }, currentRowData.probability);
            };
          }
        })
      },
      // 新增
      alertAdd() {
        this.formItem.extract_prize_id = 0
        this.modalSetting.show = true
      },
      // 提交
      submit() {
        this.$refs['myForm'].validate((valid) => {
          if (valid) {
            this.modalSetting.loading = true
            coruData(this.formItem).then(response => {
              this.modalSetting.loading = false
              this.$Message.success(response.data.msg)
              this.getList()
              this.cancel()
            }).catch(() => {
              this.modalSetting.loading = false
            })
          }
        })
      },
      // 取消表单显示
      cancel() {
        this.modalSetting.show = false
      },
      // 取消表单数据
      doCancel(data) {
        if (!data) {
          this.formItem.extract_prize_id = 0
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
