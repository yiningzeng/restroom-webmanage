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
  Tooltip,
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
const status = ['关闭', '开启', '已上线', '异常'];
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

const CreateBoardForm = Form.create()(props => {

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

const CreateGasForm = Form.create()(props => {
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
      title="新增气体监控设备"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem {...formItemLayout} label="设备编号">
        {form.getFieldDecorator('gasDeviceParentId', {
          rules: [{ required: true, message: '请输入设备编号'}],
        })(<Input placeholder="请输入设备编号" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="终端编号">
        {form.getFieldDecorator('gasDeviceId', {
          rules: [{ required: true, message: '请输入终端编号'}],
        })(<Input placeholder="请输入终端编号" />)}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={
          <span>
            类型
            <em className={styles.optional}>
              <Tooltip title="选择南厕女厕">
                <Icon type="info-circle-o" style={{ marginRight: 4 ,marginLeft:4}} />
              </Tooltip>
            </em>
          </span>
        }
      >
        {form.getFieldDecorator('type',{initialValue:1})(
          <Radio.Group>
            <Radio value={1}>女厕</Radio>
            <Radio value={0}>男厕</Radio>
          </Radio.Group>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="状态">
        {form.getFieldDecorator('status',{ valuePropName: 'checked',initialValue:true })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="">
        {form.getFieldDecorator('restRoomId', {
          initialValue: restRoomId,
        })(<Input type="hidden" />)}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ restroom,device, loading }) => ({
  restroom,
  device,
  loading: loading.effects['restroom/fetch'],
  loadingDevice: loading.effects['device/fetch']
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
    gasModalVisible:false,

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


  drawerDeviceAdd=(drawerName)=>{
    switch(drawerName) {
      case "摄像头":
        this.setState({
          addCameraModalVisible: true,
        });
        break;
      case "公告屏":

        break;
      case "气体设备":
        this.setState({
          gasModalVisible: true,
        });
        break;
    }

  };

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

  handleCameraModalVisible = flag => {
    this.setState({
      addCameraModalVisible: !!flag,
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
      restroom: { list },
      device: { deviceList },
      loading,
      loadingDevice,
    } = this.props;
    console.log(`老子来了～～～～～～${JSON.stringify(list)}`);
    const { isEdit,drawerVisible,drawerName,nowRow,selectedRows, modalVisible,addCameraModalVisible,gasModalVisible,nowRestRoomId, updateModalVisible, stepFormValues } = this.state;


    //region item 操作菜单

    const deviceManage = (key, currentItem) => {
      let info="";
      if (key === 'camera')info="摄像头";
      else if (key === 'board') info="公告屏";
      else if (key === 'gas') info="气体设备";

      this.setState({drawerName:info,nowRestRoomId:currentItem.restRoomId});

      const { dispatch } = this.props;
      // message.success(`start search${currentItem.restRoomId}`);

      dispatch({
        type: 'device/fetch',
        deviceType: key,
        payload: {
          restRoomId:currentItem.restRoomId,
          page:0,
          size:100,
        },
        callback: (v)=>{
          console.log(JSON.stringify(v));
          if(v.code===0) {
            // message.success("查询成功");
            // dispatch({
            //   type: 'restroom/fetch',
            //   callback:(a)=>{console.log(JSON.stringify(a))},
            // });

          }
          else message.error(v.msg);
        },
      });


      this.showDrawerVisible(currentItem);
    };

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
    //endregion


    const columns = [
      {
        title: '公厕名称',
        dataIndex: 'restRoomName',
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
        title: '公厕IP',
        dataIndex: 'ip',
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
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        width: 300,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={()=>{this.setState({nowRow:record});this.handleModalVisible(true,true)}}>编辑</a>
            <Divider type="vertical" />
            <DeviceMoreBtn current={record} />
          </Fragment>
        ),
      },
    ];

    //region 抽屉的列
    const cameraColums=[
      {
        title: '编号',
        dataIndex: 'cameraId',
      },
      {
        title: 'IP',
        dataIndex: 'ip',
      },
      {
        title: '登录名',
        dataIndex: 'username',
      },
      {
        title: '密码',
        dataIndex: 'password',
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
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '操作',
        width: 100,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <Popconfirm
              title="确定删除?"
              okText="确定"
              cancelText="取消"
              onConfirm={()=> {
                const { dispatch } = this.props;
                dispatch({
                  type: 'device/deleteCamera',
                  payload: {
                    cameraId: record.cameraId,
                  },
                  callback: (v) => {
                    message.success("删除成功");
                    dispatch({
                      type: 'device/fetch',
                      deviceType: 'camera',
                      payload: {
                        restRoomId:this.state.nowRestRoomId,
                        page:0,
                        size:100,
                      },
                    });
                  },
                });
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const gasColums=[

      {
        title: '设备号',
        dataIndex: 'gasDeviceParentId',
      },
      {
        title: '终端号',
        dataIndex: 'gasDeviceId',
      },
      {
        title: '类型',
        dataIndex: 'type',
        render(val) {
          return val==="0"?"男厕":"女厕";
        },
      },
      {
        title: '密码',
        dataIndex: 'password',
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
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '操作',
        width: 100,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <Popconfirm
              title="确定删除?"
              okText="确定"
              cancelText="取消"
              onConfirm={()=> {
                const { dispatch } = this.props;
                dispatch({
                  type: 'device/deleteGas',
                  payload: {
                    gasDeviceId: record.gasDeviceId,
                  },
                  callback: (v) => {
                    message.success("删除成功");
                    dispatch({
                      type: 'device/fetch',
                      deviceType: 'gas',
                      payload: {
                        restRoomId:this.state.nowRestRoomId,
                        page:0,
                        size:100,
                      },
                    });
                  },
                });
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    const boardColums=[
      {
        title: '编号',
        dataIndex: 'cameraId',
      },
      {
        title: 'IP',
        dataIndex: 'ip',
      },
      {
        title: '登录名',
        dataIndex: 'username',
      },
      {
        title: '密码',
        dataIndex: 'password',
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
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '操作',
        width: 100,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <Popconfirm
              title="确定删除?"
              okText="确定"
              cancelText="取消"
              onConfirm={()=> {
                const { dispatch } = this.props;
                dispatch({
                  type: 'device/deleteCamera',
                  payload: {
                    cameraId: record.cameraId,
                  },
                  callback: (v) => {
                    message.success("删除成功");
                    dispatch({
                      type: 'device/fetch',
                      deviceType: 'camera',
                      payload: {
                        restRoomId:this.state.nowRestRoomId,
                        page:0,
                        size:100,
                      },
                    });
                  },
                });
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    //endregion

    const addRestroomParentMethods = {
      handleAdd: this.handleRestRoomAdd,
      handleEdit: this.handleRestRoomEdit,
      handleModalVisible: this.handleModalVisible,
    };
    const addCameraParentMethods = {
      restRoomId: nowRestRoomId,
      handleAdd: fields => {
        const { dispatch } = this.props;
        console.log(`add${JSON.stringify(fields)}`);
        dispatch({
          type: 'device/addCamera',
          payload: {
            ...fields,
            status:fields.status===true?1:0
          },
          callback: (v)=>{
            if(v.code===0) {
              message.success("新增成功");
              dispatch({
                type: 'device/fetch',
                deviceType: 'camera',
                payload: {
                  restRoomId:this.state.nowRestRoomId,
                  page:0,
                  size:100,
                },
              });
              // dispatch({
              //   type: 'restroom/fetch',
              //   callback:(a)=>{console.log(JSON.stringify(a))},
              // });
              this.setState({addCameraModalVisible:false});
            }
            else message.error(v.msg);
          },
        });
      },
      handleModalVisible: this.handleCameraModalVisible,
    };

    const addGasMethods = {
      restRoomId: nowRestRoomId,
      handleAdd: fields => {
        const { dispatch } = this.props;
        console.log(`add-gas--${JSON.stringify(fields)}`);
        dispatch({
          type: 'device/addGas',
          payload: {
            ...fields,
            status:fields.status===true?1:0
          },
          callback: (v)=>{
            if(v.code===0) {
              message.success("新增成功");
              dispatch({
                type: 'device/fetch',
                deviceType: 'gas',
                payload: {
                  restRoomId:this.state.nowRestRoomId,
                  page:0,
                  size:100,
                },
              });
              // dispatch({
              //   type: 'restroom/fetch',
              //   callback:(a)=>{console.log(JSON.stringify(a))},
              // });
              this.setState({gasModalVisible:false});
            }
            else message.error(v.msg);
          },
        });
      },
      handleModalVisible: ()=>{
        this.setState({
          gasModalVisible: false,
        });
      },
    };

    return (
      <PageHeaderWrapper title="公厕管理">
        <Drawer
          title={nowRow===undefined?'设备列表':`${nowRow.restRoomName} > ${drawerName}-设备列表`}
          width="45%"
          placement="right"
          closable={false}
          onClose={this.hideDrawerVisible}
          visible={drawerVisible}
        >
          <Table
            rowKey="taskId"
            scroll={{ x: 800 }}
            loading={loadingDevice}
            dataSource={deviceList===undefined?[]:deviceList.data===undefined?[]:deviceList.data.content}
            columns={drawerName==="摄像头"?cameraColums:drawerName==="气体设备"?gasColums:boardColums}
            pagination={false}
          />
          <Button type="dashed" onClick={()=>this.drawerDeviceAdd(drawerName)} style={{ width: '100%',top: 10 }}>
            <Icon type="plus" /> {`新增${drawerName}`}
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
        <CreateGasForm {...addGasMethods} modalVisible={gasModalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
