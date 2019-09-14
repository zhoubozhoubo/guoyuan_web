<template>
    <div>
        <Row>
            <Col span="24">
            <Card style="margin-bottom: 10px">
                <!--搜索表单-->
                <Form inline>
                                        <FormItem style="margin-bottom: 0">
                                            <Select v-model="searchConf.type" clearable placeholder='类型' style="width:100px">
                                                        <Option value="1">自己</Option>
                                                        <Option value="2">好友</Option>
                                                    </Select>
                                        </FormItem>
                                        <FormItem style="margin-bottom: 0">
                                            <DatePicker type="date" @on-change="searchConf.date=$event" placeholder="选择日期" style="width: 150px"></DatePicker>
                                        </FormItem>
                                        <FormItem style="margin-bottom: 0">
                        <Button type="primary" shape="circle" icon="ios-search" @click="search">{{ $t('find_button') }}/{{ $t('refresh_button') }}</Button>
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
        import {getDataList,coruData} from '@/api/user_pour_walter_list'

    
    export default {
        name: 'list',
        components: {
        },
        data() {
            return {
                                // 初始化表格列
                columnsList:[{title:'用户果树id',key:'user_tree_id',align:'center'},{title:'用户id',key:'user_id',align:'center'},{title:'对象用户id',key:'to_user_id',align:'center'},{title:'类型',key:'type',align:'center'},{title:'日期',key:'date',align:'center'},{title:'创建日期',key:'gmt_create',align:'center'}],
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
                                searchConf:{type:'',date:''},
                                // 表单属性
                                formItem:{},
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
                    if (item.key === 'date') {
                        item.render = (h, param) => {
                            let currentRowData = vm.tableData[param.index];
                            return h('Tag', {
                                attrs: {
                                    color: 'blue'
                                }
                            }, currentRowData.date);
                        };
                    }
                                                                                                })
            },
                        // 取消表单数据
            doCancel(data) {
                if (!data) {
                    this.formItem.id = 0
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
