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
              <Input v-model="searchConf.name" clearable placeholder="姓名"/>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <Input v-model="searchConf.phone" clearable placeholder="手机号"/>
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
        <span>{{formItem.user_address_id ? '编辑' : '新增'}}</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="100">
        <FormItem label="姓名" prop="name">
          <Input v-model="formItem.name" placeholder="姓名"/>
        </FormItem>
        <FormItem label="性别" prop="sex">
          <RadioGroup v-model="formItem.sex">
            <Radio label="1">男</Radio>
            <Radio label="2">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="手机号" prop="phone">
          <Input v-model="formItem.phone" placeholder="手机号"/>
        </FormItem>
        <FormItem label="详细地址" prop="address">
          <Input v-model="formItem.address" placeholder="详细地址"/>
        </FormItem>
        <FormItem label="类型" prop="type">
          <RadioGroup v-model="formItem.type">
            <Radio label="0">无</Radio>
            <Radio label="1">家</Radio>
            <Radio label="2">学校</Radio>
            <Radio label="3">公司</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否默认" prop="is_default">
          <RadioGroup v-model="formItem.is_default">
            <Radio label="0">非默认</Radio>
            <Radio label="1">默认</Radio>
          </RadioGroup>
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
  import {getDataList, coruData} from '@/api/user_address_list'

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
          vm.formItem.user_address_id = currentRow.user_address_id;
          vm.formItem.name = currentRow.name;
          vm.formItem.sex = String(currentRow.sex);
          vm.formItem.phone = currentRow.phone;
          vm.formItem.address = currentRow.address;
          vm.formItem.type = String(currentRow.type);
          vm.formItem.is_default = String(currentRow.is_default);
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
          coruData({user_address_id: currentRow.user_address_id, is_delete: 1}).then(response => {
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
        columnsList: [{title: '姓名', key: 'name', align: 'center'}, {
          title: '性别',
          key: 'sex',
          align: 'center'
        }, {title: '手机号', key: 'phone', align: 'center'}, {
          title: '详细地址',
          key: 'address',
          align: 'center'
        }, {title: '类型', key: 'type', align: 'center'}, {
          title: '是否默认',
          key: 'is_default',
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
        searchConf: {user_id: '', name: '', phone: ''},
        // 表单属性
        formItem: {user_address_id: '', name: '', sex: '', phone: '', address: '', type: '', is_default: 0},
        // modal属性
        modalSetting: {
          show: false,
          loading: false,
          index: 0
        },
        // 表单验证
        ruleValidate: {
          name: [{required: true, message: "请输入姓名", trigger: "blur"}],
          sex: [{required: true, message: "请选择性别", trigger: "change"}],
          phone: [{required: true, message: "请输入手机号", trigger: "blur"}],
          address: [{required: true, message: "请输入详细地址", trigger: "blur"}],
        }
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
              return h('div', [
                editButton(vm, h, currentRowData, param.index),
                deleteButton(vm, h, currentRowData, param.index)
              ])
            }
          }
          // 标签列
          if (item.key === 'sex') {
            item.render = (h, param) => {
              let currentRowData = vm.tableData[param.index];
              return h('Tag', {
                attrs: {
                  color: 'blue'
                }
              }, currentRowData.sex);
            };
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
          if (item.key === 'is_default') {
            item.render = (h, param) => {
              let currentRowData = vm.tableData[param.index];
              return h('Tag', {
                attrs: {
                  color: 'blue'
                }
              }, currentRowData.is_default);
            };
          }
        })
      },
      // 返回上一页
      goBack() {
        this.$router.go(-1)
      },
      // 新增
      alertAdd() {
        this.formItem.user_address_id = 0
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
          this.formItem.user_address_id = 0
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
