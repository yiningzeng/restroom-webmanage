import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Switch,
  Cascader,
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Table,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Drawer,
  Popconfirm,
  Steps,
  Radio,
} from 'antd';
// import StandardTable from '@/components/StandardTable';
import MyStandardTable from '@/components/MyStandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '开放', '已上线', '异常'];
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

const CreateCameraForm = Form.create()(props => {

  const { restRoomId,modalVisible, form, handleAdd, handleModalVisible } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="新增摄像头"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem {...formItemLayout} label="摄像头IP">
        {form.getFieldDecorator('ip', {
          rules: [{ required: true, message: '请输入摄像头IP带端口'}],
        })(<Input placeholder="请输入摄像头IP带端口" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="相机登录名">
        {form.getFieldDecorator('username', {
          rules: [{ required: true, message: '请输入相机登录名'}],
        })(<Input placeholder="请输入相机登录名" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="相机登录密码">
        {form.getFieldDecorator('password', {
          rules: [{ required: true, message: '请输入相机登录密码'}],
        })(<Input placeholder="请输入相机登录密码" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="相机状态">
        {form.getFieldDecorator('status',{ valuePropName: 'checked',initialValue:true })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="备注">
        {form.getFieldDecorator('remark', {
          rules: [{ required: false, message: '备注' }],
        })(<TextArea placeholder="请输入备注信息" autosize={{ minRows: 2, maxRows: 4 }} />)}
      </FormItem>
      <FormItem {...formItemLayout} label="">
        {form.getFieldDecorator('restRoomId', {
          initialValue: restRoomId,
        })(<Input type="hidden" />)}
      </FormItem>
      {/*<FormItem {...formItemLayout} label="">*/}
        {/*{form.getFieldDecorator('restRoomId', {*/}
          {/*initialValue: restRoomId,*/}
        {/*})(<Input />)}*/}
      {/*</FormItem>*/}
    </Modal>
  );
});
@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        name: props.values.name,
        desc: props.values.desc,
        key: props.values.key,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      currentStep: 0,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }


  handleNext = currentStep => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            handleUpdate(formVals);
          }
        }
      );
    });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  renderContent = (currentStep, formVals) => {
    const { form } = this.props;
    if (currentStep === 1) {
      return [
        <FormItem key="target" {...this.formLayout} label="监控对象">
          {form.getFieldDecorator('target', {
            initialValue: formVals.target,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">表一</Option>
              <Option value="1">表二</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="template" {...this.formLayout} label="规则模板">
          {form.getFieldDecorator('template', {
            initialValue: formVals.template,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">规则模板一</Option>
              <Option value="1">规则模板二</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="type" {...this.formLayout} label="规则类型">
          {form.getFieldDecorator('type', {
            initialValue: formVals.type,
          })(
            <RadioGroup>
              <Radio value="0">强</Radio>
              <Radio value="1">弱</Radio>
            </RadioGroup>
          )}
        </FormItem>,
      ];
    }
    if (currentStep === 2) {
      return [
        <FormItem key="time" {...this.formLayout} label="开始时间">
          {form.getFieldDecorator('time', {
            rules: [{ required: true, message: '请选择开始时间！' }],
          })(
            <DatePicker
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择开始时间"
            />
          )}
        </FormItem>,
        <FormItem key="frequency" {...this.formLayout} label="调度周期">
          {form.getFieldDecorator('frequency', {
            initialValue: formVals.frequency,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="month">月</Option>
              <Option value="week">周</Option>
            </Select>
          )}
        </FormItem>,
      ];
    }
    return [
      <FormItem key="name" {...this.formLayout} label="规则名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入规则名称！' }],
          initialValue: formVals.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="desc" {...this.formLayout} label="规则描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
          initialValue: formVals.desc,
        })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
      </FormItem>,
    ];
  };

  renderFooter = currentStep => {
    const { handleUpdateModalVisible, values } = this.props;
    if (currentStep === 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          取消
        </Button>,
        <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
          下一步
        </Button>,
      ];
    }
    if (currentStep === 2) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          完成
        </Button>,
      ];
    }
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        下一步
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { currentStep, formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="规则配置"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
          <Step title="基本信息" />
          <Step title="配置规则属性" />
          <Step title="设定调度周期" />
        </Steps>
        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ restroom, loading }) => ({
  restroom,
  loading: loading.effects['restroom/fetch'],
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},

    addCameraModalVisible:false,

    nowRestRoomId:undefined,
    nowRow:undefined,
    isEdit:false,

    drawerVisible: false,
    drawerName:"",
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'restroom/fetch',
      callback:(a)=>{console.log(JSON.stringify(a))},
    });
  }

  //region 抽屉
  hideDrawerVisible = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  showDrawerVisible=(record)=>{
    const { dispatch } = this.props;
    sessionStorage.setItem("restRoomId",record.restRoomId);
    // dispatch({
    //   type: 'workPost/fetchWorkPostTaskList',
    //   payload: {
    //     workPostId: record.postId,
    //   },
    // });
    this.setState({
      drawerVisible: true,
      nowRow:record,
    });
  };
  //endregion

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

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag,isedit) => {
    this.setState({
      modalVisible: !!flag,
      isEdit:isedit
    });
  };

  handleCameraModalVisible = flag => {
    this.setState({
      addCameraModalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
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

  handleAddCamera = fields => {
    const { dispatch } = this.props;
    console.log(`add${JSON.stringify(fields)}`);
    dispatch({
      type: 'restroom/addRestRoom',
      payload: {
        ...fields,
        status:fields.status===true?1:0
      },
      callback: this.addCallback,
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };


   deleteConfirm=(e)=> {
    console.log(e);
    message.success('Click on Yes');
  }

  render() {
    const {
      restroom: { list },
      loading,
    } = this.props;
    console.log(`老子来了～～～～～～${JSON.stringify(list)}`);
    const { isEdit,drawerVisible,drawerName,nowRow,selectedRows, modalVisible,addCameraModalVisible,nowRestRoomId, updateModalVisible, stepFormValues } = this.state;

    const add = (key, currentItem) => {
      if (key === 'camera'){
        this.setState({addCameraModalVisible:true,nowRestRoomId:currentItem.restRoomId});

      }
      else if (key === 'board') {

      }
      else if (key === 'gas') {

      }
    };
    const deviceManage = (key, currentItem) => {
      let info="";
      if (key === 'camera'){
        //this.setState({addCameraModalVisible:true,nowRestRoomId:currentItem.restRoomId});
        info="摄像头";
      }
      else if (key === 'board') {
        info="公告屏";
      }
      else if (key === 'gas') {
        info="气体设备";

      }
      this.setState({drawerName:info});
      this.showDrawerVisible(currentItem);
    };

    const AddMoreBtn = props => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => {add(key, props.current)}}>
            <Menu.Item key="camera">新增摄像头</Menu.Item>
            <Menu.Item key="board">新增公告屏</Menu.Item>
            <Menu.Item key="gas">新增气体设备</Menu.Item>
          </Menu>
        }
      >
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    /**
     *    <a onClick={this.showDrawerVisible.bind(this,record)}>摄像头</a>
     <Divider type="vertical" />
     <a onClick={this.showDrawerVisible.bind(this,record)}>公告屏</a>
     <Divider type="vertical" />
     <a onClick={this.showDrawerVisible.bind(this,record)}>气体设备</a>
     * */
    const DeviceMoreBtn = props => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => {deviceManage(key, props.current)}}>
            <Menu.Item key="camera">摄像头</Menu.Item>
            <Menu.Item key="board">公告屏</Menu.Item>
            <Menu.Item key="gas">气体设备</Menu.Item>
          </Menu>
        }
      >
        <a>
          设备管理 <Icon type="down" />
        </a>
      </Dropdown>
    );



    const columns = [
      {
        title: '公厕名称',
        dataIndex: 'restRoomName',
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
          {
            text: status[2],
            value: 2,
          },
          {
            text: status[3],
            value: 3,
          },
        ],
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '责任保洁',
        dataIndex: 'cleaner',
      },
      {
        title: '地区',
        dataIndex: 'region',
      },
      {
        title: '详细地址',
        dataIndex: 'address',
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        width: 300,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            {/*<a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>*/}
            {/*<Divider type="vertical" />*/}
            {/*<a href="">订阅警报</a>*/}

            <a onClick={()=>{this.setState({nowRow:record});this.handleModalVisible(true,true)}}>编辑</a>
            <Divider type="vertical" />
            <DeviceMoreBtn current={record} />
            <Divider type="vertical" />
            <AddMoreBtn current={record} />

          </Fragment>
        ),
      },
    ];


    const addRestroomParentMethods = {
      handleAdd: this.handleRestRoomAdd,
      handleEdit: this.handleRestRoomEdit,
      handleModalVisible: this.handleModalVisible,
    };
    const addCameraParentMethods = {
      restRoomId: nowRestRoomId,
      handleAdd: this.handleAddCamera,
      handleModalVisible: this.handleCameraModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="公厕管理">
        <Drawer
          title={nowRow===undefined?'设备列表':`${nowRow.restRoomName} > ${drawerName}-设备列表`}
          width="55%"
          placement="right"
          closable={false}
          onClose={this.hideDrawerVisible}
          visible={drawerVisible}
        >
          <Table
            rowKey="taskId"
            scroll={{ x: 600 }}
            loading={loading}
            dataSource={[]}
            columns={undefined}
            pagination={false}
            // onSelectRow={this.handleSelectRows}
            // onChange={this.handleStandardTableChange}
            // expandedRowRender={expandedRowRender}
          />
          <Button type="dashed" onClick={this.newWorkPostTask} style={{ width: '100%',top: 10 }}>
            <Icon type="plus" /> 新增
          </Button>
        </Drawer>
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
                    title="将会删除该公厕下所有的设备，确定么?"
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
              rowKey="restRoomId"
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
        <CreateCameraForm {...addCameraParentMethods} modalVisible={addCameraModalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
