import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Switch,
  Cascader,
  Card,
  Form,
  Input,
  Select,
  Table,
  Icon,
  Button,
  Dropdown,
  Menu,
  Modal,
  message,
  Badge,
  Divider,
  Drawer,
  Popconfirm,
  Steps,
  Radio,
  Tooltip,
} from 'antd';
// import StandardTable from '@/components/StandardTable';
import MyStandardTable from '@/components/MyStandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'success'];
const status = ['禁止', '正常'];
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

const CreateForm = Form.create()(props => {
  const options = [{
    value: '浙江省',
    label: '浙江省',
    children: [{
      value: '宁波市',
      label: '宁波市',
      children: [
        {
        value: '鄞州区',
        label: '鄞州区',
        },
        {
          value: '海曙区',
          label: '海曙区',
        },
        {
          value: '江北区',
          label: '江北区',
        },
        {
          value: '北仑区',
          label: '北仑区',
        },
        {
          value: '镇海区',
          label: '镇海区',
        },
        {
          value: '奉化区',
          label: '奉化区',
        }
      ],
    }],
  }];

  const { row,isEdit,modalVisible, form, handleAdd,handleEdit, handleModalVisible } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      isEdit?handleEdit(fieldsValue):handleAdd(fieldsValue);
    });
  };
  function onChange(value) {
    console.log(value);
  }

  return (
    <Modal
      destroyOnClose
      title={isEdit?"编辑公厕":"新增公厕"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem {...formItemLayout} label="公厕名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入公厕名称'}],
          initialValue:isEdit?row.restRoomName:undefined
        })(<Input placeholder="请输入公厕名称" />)}
      </FormItem>

      <FormItem {...formItemLayout} label="所在地区">
        {form.getFieldDecorator('region', {
          rules: [
            {
              required: true,
              message: "请选择区域",
            },
          ],
          // initialValue: ['浙江省', '宁波市', '鄞州区'],
          initialValue:isEdit?row.region.split(","):['浙江省', '宁波市', '鄞州区'],
        })(
          <Cascader options={options} onChange={onChange} />,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="详细地址">
        {form.getFieldDecorator('address', {
          rules: [{ required: true, message: '请输入详细地址' }],
          initialValue:isEdit?row.address:undefined
        })(<Input placeholder="请输入详细地址" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="公厕IP">
        {form.getFieldDecorator('ip', {
          rules: [{ required: false, message: '请输入公厕的ip地址'}],
          initialValue:isEdit?row.ip:undefined
        })(<Input placeholder="请输入公厕的ip地址" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="开放状态">
        {form.getFieldDecorator('status',{ valuePropName: 'checked', initialValue:row===undefined?true:row.status===0?false:true })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="责任保洁员">
        {form.getFieldDecorator('cleaner', {
          rules: [{ required: false, message: '请输入责任保洁员姓名' }],
          initialValue:isEdit?row.cleaner:undefined
        })(<Input placeholder="请输入责任保洁员姓名" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="备注">
        {form.getFieldDecorator('remark', {
          rules: [{ required: false, message: '备注' }],
          initialValue:isEdit?row.remark:undefined
        })(<TextArea placeholder="请输入备注信息" autosize={{ minRows: 2, maxRows: 4 }} />)}
      </FormItem>
      <FormItem {...formItemLayout} label="">
        {form.getFieldDecorator('restRoomId', {
          rules: [{ required: false, message: '' }],
          initialValue:isEdit?row.restRoomId:undefined
        })(<Input type="hidden" />)}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ member, loading }) => ({
  member,
  loading: loading.effects['member/fetch'],
}))
@Form.create()
class Index extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},

    nowRestRoomId:undefined,
    nowRow:undefined,
    isEdit:false,

    drawerVisible: false,
    drawerName:"",
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'member/fetch',
      payload: {
        page: 0,
        size: 10,
      },
    });
  }


  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };


  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };


  handleModalVisible = (flag,isedit) => {
    this.setState({
      modalVisible: !!flag,
      isEdit:isedit
    });
  };

  handleRestRoomAdd = fields => {
    const { dispatch } = this.props;
    console.log(`add${JSON.stringify(fields)}`);
    dispatch({
      type: 'restroom/addRestRoom',
      payload: {
        ...fields,
        status:fields.status===true?1:0
      },
      callback: (v)=>{
        if(v.code===0) {
          message.success("添加成功");
          dispatch({
            type: 'restroom/fetch',
            callback:(a)=>{console.log(JSON.stringify(a))},
          });
          this.handleModalVisible();
        }
        else message.error(v.msg);
      },
    });
  };

  handleRestRoomEdit = fields => {
    const { dispatch } = this.props;
    console.log(`编辑妈的${JSON.stringify(fields)}`);
    dispatch({
      type: 'restroom/updateRestRoom',
      payload: {
        ...fields,
        status:fields.status===true?1:0
      },
      callback: (v)=>{
        if(v.code===0) {
          message.success("编辑成功");
          dispatch({
            type: 'restroom/fetch',
            callback:(a)=>{console.log(JSON.stringify(a))},
          });
          this.handleModalVisible();
        }
        else message.error(v.msg);
      },
    });
  };

  render() {
    const {
      member: { list },
      loading,
    } = this.props;
    console.log(`老子来了～～～～～～${JSON.stringify(list)}`);
    const { isEdit,nowRow,selectedRows, modalVisible} = this.state;


    // "token": null,
    //   "userId": 1,
    //   "username": "baymin",
    //   "relName": "超级管理员",
    //   "userHeadUrl": "https://upload.jianshu.io/users/upload_avatars/6639127/07e46067-9c7b-4df9-9c1f-b590818e295b.jpg",
    //   "department": "厕所终结者",
    //   "userStatus": 1,
    //   "createTime": "2018-12-18 18:48:34",
    //   "level": {
    //   "levelName": "管理员",
    //     "remark": "管理员",
    //     "status": 1
    // }

    const columns = [
      {
        title: '账号',
        dataIndex: 'username',
      },
      {
        title: '昵称',
        dataIndex: 'relName',
      },
      {
        title: '部门',
        dataIndex: 'department',
      },
      {
        title: 'level',
        dataIndex: 'level.levelName',
      },
      {
        title: '状态',
        dataIndex: 'userStatus',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
        ],
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        width: 300,
        fixed: 'right',
        render: (record) => (
          <Fragment>
            <Popconfirm
              title="重置后密码为123456,确定重置?"
              okText="确定"
              cancelText="取消"
              onConfirm={()=>{
                const {dispatch} = this.props;
                dispatch({
                  type: 'member/resetPass',
                  payload: {
                    username: record.username,
                    password: 'e10adc3949ba59abbe56e057f20f883e'
                  },
                  callback: (v) => {
                    if(v.code===0) message.success("重置成功");
                    else message.error("重置失败");
                  },
                });
              }}
            >
              <a href="#">密码重置</a>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除该用户么?"
              okText="确定"
              cancelText="取消"
              onConfirm={()=>{
                const {dispatch} = this.props;
                dispatch({
                  type: 'member/deleteUser',
                  payload: {
                    userId: record.userId,
                  },
                  callback: (v) => {
                    message.success("删除成功");
                    dispatch({
                      type: 'member/fetch',
                      callback: (a) => {
                        console.log(JSON.stringify(a))
                      },
                    });
                  },
                });
              }}
            >
              <a href="#">删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];


    const addRestroomParentMethods = {
      handleAdd: this.handleRestRoomAdd,
      handleEdit: this.handleRestRoomEdit,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderWrapper title="账号管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/*<div className={styles.tableListForm}>{this.renderForm()}</div>*/}
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true,false)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Popconfirm
                    title="删除后用户不可登录，确定么?"
                    okText="确定"
                    cancelText="取消"
                    onConfirm={()=> {
                      const {dispatch} = this.props;
                      for (let i=0;i<selectedRows.length;i++) {
                        const item=selectedRows[i];
                        dispatch({
                          type: 'restroom/deleteRestRoom',
                          payload: {
                            restRoomId: item.restRoomId,
                          },
                          callback: (v) => {
                            message.success("删除成功");
                            dispatch({
                              type: 'restroom/fetch',
                              callback: (a) => {
                                console.log(JSON.stringify(a))
                              },
                            });
                          },
                        });
                      }
                      this.setState({selectedRows:[]});
                    }}
                  >
                    <Button>删除</Button>
                  </Popconfirm>
                  {/*<Dropdown overlay={menu}>*/}
                    {/*<Button>*/}
                    {/*更多操作 <Icon type="down" />*/}
                    {/*</Button>*/}
                  {/*</Dropdown>*/}
                </span>
              )}
            </div>

            <MyStandardTable
              rowKey="userId"
              scroll={{ x: 1000 }}
              selectedRows={selectedRows}
              loading={loading}
              data={list===undefined?undefined:list.data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm isEdit={isEdit} row={nowRow===undefined?undefined:nowRow} {...addRestroomParentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default Index;
