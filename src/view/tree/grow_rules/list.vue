<template>
  <div>
    <Row>
      <Col span="24">
        <Card style="margin-bottom: 10px">
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
        <span>{{formItem.grow_rules_id ? '编辑' : '新增'}}</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="100">
        <FormItem label="阶段" prop="stage">
          <Select v-model="formItem.stage" style="width:200px">
            <Option value="1">第一阶段</Option>
            <Option value="2">第二阶段</Option>
            <Option value="3">第三阶段</Option>
            <Option value="4">第四阶段</Option>
            <Option value="5">第五阶段</Option>
          </Select>
        </FormItem>
        <FormItem label="阶段开始名称" prop="start">
          <Input v-model="formItem.start" placeholder="阶段开始名称"/>
        </FormItem>
        <FormItem label="阶段结束名称" prop="end">
          <Input v-model="formItem.end" placeholder="阶段结束名称"/>
        </FormItem>
        <FormItem label="水滴数" prop="walter_number">
          <Input v-model="formItem.walter_number" placeholder="水滴数"/>
        </FormItem>
        <FormItem label="小化肥数" prop="little_fertilizer_number">
          <Input v-model="formItem.little_fertilizer_number" placeholder="小化肥数"/>
        </FormItem>
        <FormItem label="大化肥数" prop="big_fertilizer_number">
          <Input v-model="formItem.big_fertilizer_number" placeholder="大化肥数"/>
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
  import {getDataList, coruData} from '@/api/grow_rules_list'

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
          vm.formItem.grow_rules_id = currentRow.grow_rules_id;
          vm.formItem.stage = String(currentRow.stage);
          vm.formItem.start = currentRow.start;
          vm.formItem.end = currentRow.end;
          vm.formItem.walter_number = currentRow.walter_number;
          vm.formItem.little_fertilizer_number = currentRow.little_fertilizer_number;
          vm.formItem.big_fertilizer_number = currentRow.big_fertilizer_number;
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
          coruData({grow_rules_id: currentRow.grow_rules_id, is_delete: 1}).then(response => {
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
        columnsList: [{title: '阶段', key: 'stage', align: 'center'}, {
          title: '阶段开始名称',
          key: 'start',
          align: 'center'
        }, {title: '阶段结束名称', key: 'end', align: 'center'}, {
          title: '水滴数',
          key: 'walter_number',
          align: 'center'
        }, {title: '小化肥数', key: 'little_fertilizer_number', align: 'center'}, {
          title: '大化肥数',
          key: 'big_fertilizer_number',
          align: 'center'
        }, {title: '创建日期', key: 'gmt_create', align: 'center'}, {
          title: '操作',
          key: 'handle',
          align: 'center',
          handle: ['edit', 'delete']
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
        searchConf: {},
        // 表单属性
        formItem: {
          grow_rules_id: '',
          stage: '',
          start: '',
          end: '',
          walter_number: '',
          little_fertilizer_number: '',
          big_fertilizer_number: ''
        },
        // modal属性
        modalSetting: {
          show: false,
          loading: false,
          index: 0
        },
        // 表单验证
        ruleValidate: {
          stage: [{required: true, message: "请选择阶段", trigger: "blur"}],
          start: [{required: true, message: "请输入阶段开始名称", trigger: "blur"}],
          end: [{required: true, message: "请输入阶段结束名称", trigger: "blur"}],
          walter_number: [{required: true, message: "请输入水滴数", trigger: "blur"}],
          little_fertilizer_number: [{required: true, message: "请输入小化肥数", trigger: "blur"}],
          big_fertilizer_number: [{required: true, message: "请输入大化肥数", trigger: "blur"}],
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
          if (item.key === 'walter_number') {
            item.render = (h, param) => {
              let currentRowData = vm.tableData[param.index];
              return h('Tag', {
                attrs: {
                  color: 'blue'
                }
              }, currentRowData.walter_number);
            };
          }
          // 标签列
          if (item.key === 'little_fertilizer_number') {
            item.render = (h, param) => {
              let currentRowData = vm.tableData[param.index];
              return h('Tag', {
                attrs: {
                  color: 'blue'
                }
              }, currentRowData.little_fertilizer_number);
            };
          }
          // 标签列
          if (item.key === 'big_fertilizer_number') {
            item.render = (h, param) => {
              let currentRowData = vm.tableData[param.index];
              return h('Tag', {
                attrs: {
                  color: 'blue'
                }
              }, currentRowData.big_fertilizer_number);
            };
          }
        })
      },
      // 新增
      alertAdd() {
        this.formItem.grow_rules_id = 0
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
          this.formItem.grow_rules_id = 0
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
