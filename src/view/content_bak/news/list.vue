<style lang="less" scoped>
  @import './list.less';
</style>
<template>
  <div>
    <Row>
      <Col span="24">
        <Card style="margin-bottom: 10px">
          <Form inline>
            <FormItem style="margin-bottom: 0">
              <Input v-model="searchConf.title" clearable placeholder="标题"/>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <DatePicker type="date" @on-change="searchConf.date=$event" placeholder="日期" style="width: 150px"></DatePicker>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <Select v-model="searchConf.status" clearable placeholder='状态' style="width:100px">
                <Option :value="1">启用</Option>
                <Option :value="0">禁用</Option>
              </Select>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <Button type="primary" @click="search">{{ $t('find_button') }}/{{ $t('refresh_button') }}</Button>
            </FormItem>
          </Form>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <Card>
          <p slot="title" style="height: 32px">
            <Button type="primary" @click="alertAdd" icon="md-add">{{ $t('add_button') }}</Button>
          </p>
          <div>
            <Table :loading="loading" :columns="columnsList" :data="tableData" border disabled-hover></Table>
          </div>
          <div class="margin-top-15" style="text-align: center">
            <Page :total="tableShow.listCount" :current="tableShow.currentPage"
                  :page-size="tableShow.pageSize" @on-change="changePage"
                  @on-page-size-change="changeSize" show-elevator show-sizer show-total></Page>
          </div>
        </Card>
      </Col>
    </Row>
    <Modal v-model="modalSetting.show" width="800" :styles="{top: '30px'}" @on-visible-change="doCancel">
      <p slot="header" style="color:#2d8cf0">
        <Icon type="md-alert"></Icon>
        <span>{{formItem.id ? '编辑' : '新增'}}用户</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="80">
        <FormItem label="标题" prop="title">
          <Input v-model="formItem.title" placeholder="标题" clearable></Input>
        </FormItem>
        <FormItem label="类型" prop="type">
          <Select v-model="formItem.type" style="width:200px">
            <Option value="1">Option1</Option>
            <Option value="2">Option2</Option>
            <Option value="3">Option3</Option>
          </Select>
        </FormItem>
        <FormItem label="设备" prop="device">
          <RadioGroup v-model="formItem.device">
            <Radio label="0">不限</Radio>
            <Radio label="1">手机</Radio>
            <Radio label="2">电脑</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="标签" prop="tags">
          <CheckboxGroup v-model="formItem.tags">
            <Checkbox label="1">社会</Checkbox>
            <Checkbox label="2">娱乐</Checkbox>
            <Checkbox label="3">时事</Checkbox>
            <Checkbox label="4">国际</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="封面" prop="img">
          <div class="demo-upload-list" v-if="formItem.img">
            <img :src="formItem.img">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView()"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleImgRemove()"></Icon>
            </div>
          </div>
          <input v-if="formItem.img" v-model="formItem.img" type="hidden" name="image">
          <Upload type="drag"
                  :action="uploadUrl"
                  :headers="uploadHeader"
                  v-if="!formItem.img"
                  :format="['jpg','jpeg','png']"
                  :max-size="5120"
                  :on-success="handleImgSuccess"
                  :on-format-error="handleImgFormatError"
                  :on-exceeded-size="handleImgMaxSize"
                  style="display: inline-block;width:58px">
            <div style="width: 58px;height:58px;line-height: 58px">
              <Icon type="md-camera" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
        <FormItem label="简介" prop="synopsis">
          <Input type="textarea" :rows="4" v-model="formItem.synopsis" placeholder="简介"/>
        </FormItem>
        <FormItem label="内容" prop="synopsis">
          <vue-ueditor-wrap v-model="formItem.content" :config="myConfig"></vue-ueditor-wrap>
        </FormItem>
        <FormItem label="作者" prop="author">
          <Input v-model="formItem.author" placeholder="作者"></Input>
        </FormItem>
        <FormItem label="日期" prop="date">
          <DatePicker type="date" @on-change="formItem.date=$event" :value="formItem.date" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="时间" prop="time">
          <TimePicker type="time" @on-change="formItem.time=$event" :value="formItem.time" placeholder="选择时间" style="width: 200px"></TimePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="submit" :loading="modalSetting.loading">确定</Button>
      </div>
    </Modal>
    <!--查看大图-->
    <Modal v-model="modalSeeingImg.show" width="700" class-name="fl-image-modal" footer-hide>
      <img :src="modalSeeingImg.img" v-if="modalSeeingImg.show" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
import { getList, coruData } from '@/api/news'
import { baseUrl } from '@/libs/api.request'
import { getToken } from '@/libs/util'

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
        vm.formItem.id = currentRow.id
        vm.formItem.type = String(currentRow.type)
        vm.formItem.title = currentRow.title
        vm.formItem.img = currentRow.img
        vm.formItem.content = currentRow.content
        vm.formItem.synopsis = currentRow.synopsis
        vm.formItem.author = currentRow.author
        vm.formItem.date = currentRow.date
        vm.formItem.device = String(currentRow.device)
        vm.formItem.tags = currentRow.tags
        vm.formItem.time = currentRow.time
        vm.modalSetting.show = true
        vm.modalSetting.index = index
      }
    }
  }, vm.$t('edit_button'))
}

const deleteButton = (vm, h, currentRow, index) => {
  return h('Poptip', {
    props: {
      confirm: true,
      title: '您确定要删除这条数据吗? ',
      transfer: true
    },
    on: {
      'on-ok': () => {
        coruData({ id: currentRow.id, is_delete: 1 }).then(response => {
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
        placement: 'top'
      }
    }, vm.$t('delete_button'))
  ])
}

export default {
  name: 'news_list',
  data () {
    return {
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: 'http://35.201.165.105:8000/controller.php',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/UEditor/'
      },
      loading: true,
      uploadUrl: baseUrl + 'Index/upload',
      uploadHeader: { 'apiAuth': getToken() },
      columnsList: [
        {
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },
        {
          title: '标题',
          align: 'center',
          key: 'title',
          minWidth: 120
        },
        {
          title: '封面',
          align: 'center',
          render: (h, params) => {
            let vm = this
            return h('img', {
              style: {
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                margin: '5px 0'
              },
              attrs: {
                src: params.row.img,
                shape: 'square',
                size: 'large'
              },
              on: {
                click: e => {
                  vm.modalSeeingImg.img = params.row.img
                  vm.modalSeeingImg.show = true
                }
              }
            })
          },
          width: 100
        },
        {
          title: '日期',
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.date)
          },
          width: 100
        },
        {
          title: '状态',
          align: 'center',
          width: 100,
          render: (h, params) => {
            let vm = this
            return h('i-switch', {
              attrs: {
                size: 'large'
              },
              props: {
                'true-value': 1,
                'false-value': 0,
                value: params.row.status
              },
              on: {
                'on-change': function (status) {
                  coruData({ id: params.row.id, status: status }).then(response => {
                    vm.$Message.success(response.data.msg)
                    vm.getList()
                  }).catch(() => {
                  })
                }
              }
            }, [
              h('span', {
                slot: 'open'
              }, vm.$t('open_choose')),
              h('span', {
                slot: 'close'
              }, vm.$t('close_choose'))
            ])
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return h('div', [
              editButton(this, h, params.row, params.index),
              deleteButton(this, h, params.row, params.index)
            ])
          }
        }
      ],
      tableData: [],
      groupList: [],
      tableShow: {
        currentPage: 1,
        pageSize: 10,
        listCount: 0
      },
      searchConf: {
        title: '',
        date: '',
        status: ''
      },
      modalSetting: {
        show: false,
        loading: false,
        index: 0
      },
      // 初始化图片弹出框
      modalSeeingImg: {
        img: '',
        show: false
      },
      formItem: {
        type: '',
        title: '',
        img: '',
        content: '',
        synopsis: '',
        author: '',
        date: '',
        device: '0',
        tags: [],
        time: '',
        id: 0
      },
      ruleValidate: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        img: [
          { required: true, message: '请上传封面', trigger: 'change' }
        ],
        synopsis: [
          { required: true, message: '请输入简介', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入作者', trigger: 'blur' }
        ],
        device: [
          { required: true, message: '请选择设备', trigger: 'change' }
        ],
        date: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    alertAdd () {
      this.modalSetting.show = true
    },
    submit () {
      let vm = this
      this.$refs['myForm'].validate((valid) => {
        if (valid) {
          vm.modalSetting.loading = true
          coruData(vm.formItem).then(response => {
            vm.modalSetting.loading = false
            vm.$Message.success(response.data.msg)
            vm.getList()
            vm.cancel()
          }).catch(() => {
            vm.modalSetting.loading = false
          })
        }
      })
    },
    cancel () {
      this.modalSetting.show = false
    },
    doCancel (data) {
      if (!data) {
        this.formItem.id = 0
        this.$refs['myForm'].resetFields()
        this.modalSetting.loading = false
        this.modalSetting.index = 0
      }
    },
    changePage (page) {
      this.tableShow.currentPage = page
      this.getList()
    },
    changeSize (size) {
      this.tableShow.pageSize = size
      this.getList()
    },
    search () {
      this.loading = true
      this.tableShow.currentPage = 1
      this.getList()
    },
    // 图片上传一系列
    handleView () {
      this.modalSeeingImg.img = this.formItem.img
      this.modalSeeingImg.show = true
    },
    handleImgRemove () {
      this.formItem.img = ''
    },
    handleImgFormatError (file) {
      this.$Notice.warning({
        title: '文件类型不合法',
        desc: file.name + '的文件类型不正确，请上传jpg或者png图片。'
      })
    },
    handleImgMaxSize (file) {
      this.$Notice.warning({
        title: '文件大小不合法',
        desc: file.name + '太大啦请上传小于5M的文件。'
      })
    },
    handleImgSuccess (response) {
      if (response.code === 1) {
        this.$Message.success(response.msg)
        this.formItem.img = response.data.fileUrl
      } else {
        this.$Message.error(response.msg)
      }
    },
    getList () {
      let vm = this
      getList(vm.tableShow, vm.searchConf).then(response => {
        vm.loading = false
        vm.tableData = response.data.data.list
        vm.tableShow.listCount = response.data.data.count
      })
    }
  }
}
</script>
