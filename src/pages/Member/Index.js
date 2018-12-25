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
import forge from 'node-forge';
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
      title={isEdit?"编辑用户":"新增用户"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem {...formItemLayout} label="姓名">
        {form.getFieldDecorator('relName', {
          rules: [{ required: true, message: '请输入姓名'}],
          initialValue:isEdit?row.relName:undefined
        })(<Input placeholder="请输入姓名" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="账号">
        {form.getFieldDecorator('username', {
          rules: [{ required: true, message: '请输入账号'}],
          initialValue:isEdit?row.username:undefined
        })(<Input placeholder="请输入账号" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="密码">
        {form.getFieldDecorator('password', {
          rules: [{ required: true, message: '请输入密码'}],
          initialValue:isEdit?"**********":undefined
        })(<Input disabled={isEdit?true:false} placeholder="请输入密码" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="部门">
        {form.getFieldDecorator('department', {
          rules: [{ required: true, message: '请输入部门' }],
          initialValue:isEdit?row.department:undefined
        })(<Input placeholder="请输入部门" />)}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={
          <span>
            账号类型
            <em className={styles.optional}>
              <Tooltip title="选择账号类型">
                <Icon type="info-circle-o" style={{marginRight: 4, marginLeft: 4}} />
              </Tooltip>
            </em>
          </span>
        }
      >
        {form.getFieldDecorator('level',{initialValue:1})(
          <Radio.Group>
            <Radio value={1}>普通账号</Radio>
            <Radio value={2}>管理员</Radio>
          </Radio.Group>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="状态">
        {form.getFieldDecorator('userStatus',{ valuePropName: 'checked',initialValue:true })(<Switch checkedChildren="正常" unCheckedChildren="禁用" />)}
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

  handleAdd = fields => {
    const { dispatch } = this.props;
    console.log(`add${JSON.stringify(fields)}`);

    const md = forge.md.md5.create();
    md.update(fields.password);
    // values.password="1232312323";
    const password=md.digest().toHex();
    console.log(md.digest().toHex());


    dispatch({
      type: 'member/addUser',
      payload: {
        ...fields,
        password:password,
        userStatus:fields.userStatus===true?1:0
      },
      callback: (v)=>{
        if(v.code===0) {
          message.success("添加成功");
          dispatch({
            type: 'member/fetch',
            callback:(a)=>{console.log(JSON.stringify(a))},
          });
          this.handleModalVisible();
        }
        else message.error(v.msg);
      },
    });
  };

  handleEdit = fields => {
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
                if(record.userId.toString()===sessionStorage.getItem("userId")){message.error("不可以删除自己");return;}
                if(sessionStorage.getItem("level")==="普通用户"){message.error("没有删除的权限");return;}
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


    const addModelMethods = {
      handleAdd: this.handleAdd,
      handleEdit: this.handleEdit,
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
        <CreateForm isEdit={isEdit} row={nowRow===undefined?undefined:nowRow} {...addModelMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default Index;
