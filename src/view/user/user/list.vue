<template>
  <div>
    <Row>
      <Col span="24">
        <Card style="margin-bottom: 10px">
          <!--搜索表单-->
          <Form inline>
            <FormItem style="margin-bottom: 0">
              <Input v-model="searchConf.nickname" clearable placeholder="昵称"/>
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
    <!--查看大图-->
    <Modal v-model="modalSeeingImg.show"
           footer-hide
           class-name="fl-image-modal">
      <img :src="modalSeeingImg.img" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
  import {getDataList, coruData} from '@/api/user_list'

  // 地址
  const addressButton = (vm, h, currentRow, index) => {
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
            name: 'user_address',
            params: { user_id: currentRow.user_id }
          });
        }
      }
    }, '地址');
  };

  // 好友
  const friendsButton = (vm, h, currentRow, index) => {
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
            name: 'user_friends',
            params: { user_id: currentRow.user_id }
          });
        }
      }
    }, '好友');
  };

  // 果树
  const treeButton = (vm, h, currentRow, index) => {
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
            name: 'user_tree',
            params: { user_id: currentRow.user_id }
          });
        }
      }
    }, '果树');
  };

  // 仓库
  const warehouseButton = (vm, h, currentRow, index) => {
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
            name: 'user_warehouse',
            params: { user_id: currentRow.user_id }
          });
        }
      }
    }, '仓库');
  };

  // 购物车
  const carButton = (vm, h, currentRow, index) => {
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
            name: 'user_car',
            params: { user_id: currentRow.user_id }
          });
        }
      }
    }, '购物车');
  };

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
          coruData({user_id: currentRow.user_id, is_delete: 1}).then(response => {
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
        columnsList: [{title: '昵称', key: 'nickname', align: 'center'}, {
          title: '头像',
          key: 'avatarurl',
          align: 'center'
        }, {title: '创建日期', key: 'gmt_create', align: 'center'}, {
          title: '操作',
          key: 'handle',
          align: 'center',
          handle: ['address']
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
        searchConf: {nickname: ''},
        // 表单属性
        formItem: {},
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
                addressButton(vm, h, currentRowData, param.index),
                friendsButton(vm, h, currentRowData, param.index),
                treeButton(vm, h, currentRowData, param.index),
                warehouseButton(vm, h, currentRowData, param.index),
                carButton(vm, h, currentRowData, param.index)
              ])
            }
          }
          // 图片列
          if (item.key === 'avatarurl') {
            item.render = (h, param) => {
              let currentRowData = vm.tableData[param.index];
              if (currentRowData.avatarurl) {
                return h('img', {
                  style: {
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    margin: '5px 0'
                  },
                  attrs: {
                    src: currentRowData.avatarurl,
                    shape: 'square',
                    size: 'large'
                  },
                  on: {
                    click: (e) => {
                      vm.modalSeeingImg.img = currentRowData.avatarurl;
                      vm.modalSeeingImg.show = true;
                    }
                  }
                });
              } else {
                return h('Tag', {}, '暂无图片');
              }
            };
          }
        })
      },
      // 取消表单数据
      doCancel(data) {
        if (!data) {
          this.formItem.user_id = 0
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
