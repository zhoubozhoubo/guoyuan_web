<template>
  <div>
    <Row>
      <Col span="24">
        <Card style="margin-bottom: 10px">
          <!--搜索表单-->
          <Form inline>
            <FormItem style="margin-bottom: 0">
              <Input v-model="searchConf.name" clearable placeholder="名称"/>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <Input v-model="searchConf.origin_place" clearable placeholder="产地"/>
            </FormItem>
            <FormItem style="margin-bottom: 0">
              <Select v-model="searchConf.status" clearable placeholder='状态' style="width:100px">
                <Option value="0">禁用</Option>
                <Option value="1">启用</Option>
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
        <span>{{formItem.goods_id ? '编辑' : '新增'}}</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="100">
        <FormItem label="名称" prop="name">
          <Input v-model="formItem.name" placeholder="名称"/>
        </FormItem>
        <FormItem label="图片" prop="img">
          <div class="demo-upload-list" v-if="formItem.img">
            <img :src="formItem.img">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView()"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleImgRemove()"></Icon>
            </div>
          </div>
          <input v-if="formItem.img" v-model="formItem.img" type="hidden" name="image">
          <Upload type="drag"
                  v-if="!formItem.img"
                  :action="uploadUrl"
                  :headers="uploadHeader"
                  :format="['jpg','jpeg','png']"
                  :max-size="5120"
                  :on-success="handleImgSuccess"
                  :on-format-error="handleImgFormatError"
                  :on-exceeded-size="handleImgMaxSize"
                  style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
        <FormItem label="标签" prop="tag">
          <CheckboxGroup v-model="formItem.tags">
            <Checkbox v-for="(tag, index) in tagsList" :label="tag.tag_id">{{tag.name}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="简介" prop="synopsis">
          <Input v-model="formItem.synopsis" placeholder="简介"/>
        </FormItem>
        <FormItem label="价格" prop="money">
          <Input v-model="formItem.money" placeholder="价格"/>
        </FormItem>
        <FormItem label="原价格" prop="old_money">
          <Input v-model="formItem.old_money" placeholder="原价格"/>
        </FormItem>
        <FormItem label="赠送钻石数" prop="diamond">
          <Input v-model="formItem.diamond" placeholder="赠送钻石数"/>
        </FormItem>
        <FormItem label="规格描述" prop="specs">
          <Input v-model="formItem.specs" placeholder="规格描述"/>
        </FormItem>
        <FormItem label="产地" prop="origin_place">
          <Input v-model="formItem.origin_place" placeholder="产地"/>
        </FormItem>
        <FormItem label="储存方式" prop="storage_way">
          <Input v-model="formItem.storage_way" placeholder="储存方式"/>
        </FormItem>
        <FormItem label="详情图片" prop="content_img">
          <div class="demo-upload-list" v-if="formItem.content_img">
            <img :src="formItem.content_img">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleViewContent()"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleImgRemoveContent()"></Icon>
            </div>
          </div>
          <input v-if="formItem.content_img" v-model="formItem.content_img" type="hidden" name="image">
          <Upload type="drag"
                  v-if="!formItem.content_img"
                  :action="uploadUrl"
                  :headers="uploadHeader"
                  :format="['jpg','jpeg','png']"
                  :max-size="5120"
                  :on-success="handleImgSuccessContent"
                  :on-format-error="handleImgFormatError"
                  :on-exceeded-size="handleImgMaxSize"
                  style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel" style="margin-right: 8px">取消</Button>
        <Button type="primary" @click="submit" :loading="modalSetting.loading">确定</Button>
      </div>
    </Modal>
    <!--查看大图-->
    <Modal v-model="modalSeeingImg.show"
           footer-hide
           class-name="fl-image-modal">
      <img :src="modalSeeingImg.img" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
  import {baseUrl} from '@/libs/api.request'
  import {getToken} from '@/libs/util'
  import {getDataList, coruData, getTagList} from '@/api/goods_list'

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
          vm.formItem.goods_id = currentRow.goods_id;
          vm.formItem.name = currentRow.name;
          vm.formItem.img = currentRow.img;
          vm.formItem.synopsis = currentRow.synopsis;
          vm.formItem.tags = currentRow.tags;
          vm.formItem.money = String(currentRow.money);
          vm.formItem.old_money = String(currentRow.old_money);
          vm.formItem.diamond = String(currentRow.diamond);
          vm.formItem.specs = currentRow.specs;
          vm.formItem.origin_place = currentRow.origin_place;
          vm.formItem.storage_way = currentRow.storage_way;
          vm.formItem.content_img = currentRow.content_img;
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
          coruData({goods_id: currentRow.goods_id, is_delete: 1}).then(response => {
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
        // 上传文件地址
        uploadUrl: baseUrl + 'Index/upload',
        // 上传头部信息
        uploadHeader: {'apiAuth': getToken()},
        // 初始化表格列
        columnsList: [{title: '名称', key: 'name', align: 'center'}, {
          title: '图片',
          key: 'img',
          align: 'center'
        }, {title: '简介', key: 'synopsis', align: 'center'}, {title: '价格', key: 'money', align: 'center'}, {
          title: '原价格',
          key: 'old_money',
          align: 'center'
        }, {title: '赠送钻石数', key: 'diamond', align: 'center'}, {
          title: '规格描述',
          key: 'specs',
          align: 'center'
        }, {title: '产地', key: 'origin_place', align: 'center'}, {
          title: '储存方式',
          key: 'storage_way',
          align: 'center'
        }, {title: '详情图片', key: 'content_img', align: 'center'}, {
          title: '状态',
          key: 'status',
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
        searchConf: {name: '', origin_place: '', status: ''},
        // 表单属性
        formItem: {
          goods_id: '',
          name: '',
          img: '',
          tags: [],
          synopsis: '',
          money: '',
          old_money: '',
          diamond: '',
          specs: '',
          origin_place: '',
          storage_way: '',
          content_img: ''
        },
        // modal属性
        modalSetting: {
          show: false,
          loading: false,
          index: 0
        },
        // 图片modal
        modalSeeingImg: {
          img: '',
          show: false
        },
        // 表单验证
        ruleValidate: {
          name: [{required: true, message: "请输入名称", trigger: "blur"}],
          img: [{required: true, message: "请上传图片", trigger: "blur"}],
          money: [{required: true, message: "请输入价格", trigger: "blur"}],
          old_money: [{required: true, message: "请输入原价格", trigger: "blur"}],
          diamond: [{required: true, message: "请输入赠送钻石数", trigger: "blur"}],
          specs: [{required: true, message: "请输入规格描述", trigger: "blur"}],
          content_img: [{required: true, message: "请上传详情图片", trigger: "blur"}],
        },
        // 标签列表
        tagsList: {}
      }
    },
    created() {
      this.init()
      this.getTagsList()
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
          // 图片列
          if (item.key === 'img') {
            item.render = (h, param) => {
              let currentRowData = vm.tableData[param.index];
              if (currentRowData.img) {
                return h('img', {
                  style: {
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    margin: '5px 0'
                  },
                  attrs: {
                    src: currentRowData.img,
                    shape: 'square',
                    size: 'large'
                  },
                  on: {
                    click: (e) => {
                      vm.modalSeeingImg.img = currentRowData.img;
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
          if (item.key === 'old_money') {
            item.render = (h, param) => {
              let currentRowData = vm.tableData[param.index];
              return h('Tag', {
                attrs: {
                  color: 'blue'
                }
              }, currentRowData.old_money);
            };
          }
          // 标签列
          if (item.key === 'diamond') {
            item.render = (h, param) => {
              let currentRowData = vm.tableData[param.index];
              return h('Tag', {
                attrs: {
                  color: 'blue'
                }
              }, currentRowData.diamond);
            };
          }
          // 图片列
          if (item.key === 'content_img') {
            item.render = (h, param) => {
              let currentRowData = vm.tableData[param.index];
              if (currentRowData.content_img) {
                return h('img', {
                  style: {
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    margin: '5px 0'
                  },
                  attrs: {
                    src: currentRowData.content_img,
                    shape: 'square',
                    size: 'large'
                  },
                  on: {
                    click: (e) => {
                      vm.modalSeeingImg.img = currentRowData.content_img;
                      vm.modalSeeingImg.show = true;
                    }
                  }
                });
              } else {
                return h('Tag', {}, '暂无图片');
              }
            };
          }
          // 开关列
          if (item.key === 'status') {
            item.render = (h, param) => {
              let currentRowData = vm.tableData[param.index];
              return h('i-switch', {
                attrs: {
                  size: 'large'
                },
                props: {
                  'true-value': 1,
                  'false-value': 0,
                  value: currentRowData.status
                },
                on: {
                  'on-change': function (status) {
                    coruData({goods_id: currentRowData.goods_id, status: status}).then(response => {
                      vm.$Message.success(response.data.msg)
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
              ]);
            };
          }
        })
      },
      // 新增
      alertAdd() {
        this.formItem.goods_id = 0
        this.modalSetting.show = true
      },
      // 图片上传一系列
      handleView() {
        this.modalSeeingImg.img = this.formItem.img
        this.modalSeeingImg.show = true
      },
      handleViewContent() {
        this.modalSeeingImg.img = this.formItem.content_img
        this.modalSeeingImg.show = true
      },
      handleImgRemove() {
        this.formItem.img = '';
      },
      handleImgRemoveContent() {
        this.formItem.content_img = '';
      },
      handleImgFormatError(file) {
        this.$Notice.warning({
          title: '文件类型不合法',
          desc: file.name + '的文件类型不正确，请上传jpg或者png图片。'
        });
      },
      handleImgMaxSize(file) {
        this.$Notice.warning({
          title: '文件大小不合法',
          desc: file.name + '太大啦请上传小于5M的文件。'
        });
      },
      handleImgSuccess(response) {
        if (response.code === 1) {
          this.$Message.success(response.msg);
          this.formItem.img = response.data.fileUrl;
        } else {
          this.$Message.error(response.msg);
        }
      },
      handleImgSuccessContent(response) {
        if (response.code === 1) {
          this.$Message.success(response.msg);
          this.formItem.content_img = response.data.fileUrl;
        } else {
          this.$Message.error(response.msg);
        }
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
              this.doCancel()
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
          this.formItem.goods_id = 0
          this.formItem.tags = []
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
      // 获取tags数据列表
      getTagsList() {
        getTagList().then(res => {
          this.tagsList = res.data.data.list
        })
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
  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
<style>
</style>
