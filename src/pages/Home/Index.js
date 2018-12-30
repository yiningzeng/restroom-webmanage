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
import { Map,Marker,InfoWindow } from "react-amap";

//高德地图组件使用方法 https://elemefe.github.io/react-amap/components/infowindow
/* eslint react/no-multi-comp:0 */
@connect(({ restroom,device, loading }) => ({
  restroom,
  device,
  loading: loading.effects['restroom/fetch'],
  loadingDevice: loading.effects['device/fetch']
}))
@Form.create()
class Index extends PureComponent {
  state = {
    infoWindowVisible:false
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'restroom/fetch',
      callback:(a)=>{console.log(JSON.stringify(a))},
    });
  }



  render() {
    const {dispatch} = this.props;
    const styleA = {
      position: 'absolute',
      top: '10px',
      left: '10px',
      padding: '5px 10px',
      border: '1px solid #d3d3d3',
      backgroundColor: '#f9f9f9'
    }
    const styleB = {
      position: 'absolute',
      right: '10px',
      bottom: '10px',
      padding: '10px',
      color: '#fff',
      backgroundColor: '#000'
    }
    const markerEvents = {
      created: (instance) => {
        console.log('Marker 实例创建成功；如果你需要对原生实例进行操作，可以从这里开始；');
        console.log(instance);
      },
      click: (e) => {
        this.setState({infoWindowVisible:true});
        console.log("你点击了这个图标；调用参数为：");
        console.log(e);
      },
      dblclick: (e) => {
        this.setState({infoWindowVisible:true});
        console.log("你刚刚双击了这个图标；调用参数为：");
        console.log(e);
      },
      // ... 支持绑定所有原生的高德 Marker 事件
    }
    return (
      <PageHeaderWrapper title="公厕管理">
        <Card bordered={false}>
          <div className={styles.home}>
            <Map center={[121.554074,29.834609]} zoom={13} plugins={['ToolBar']} zoomEnable amapkey="9859d68e8038928bd46f12fafc6f263c">
              <Marker position={[121.554074,29.834609]} clickable events={markerEvents} />
              <InfoWindow
                position={[121.554074,29.835609]}
                visible={this.state.infoWindowVisible}
                isCustom
              >
                <h3>Window 1</h3>
                <p>This is a window</p>
                <p>Changing Value:</p>
                <button onClick={() => {this.setState({infoWindowVisible:false})}}>Close Window</button>
              </InfoWindow>
              <div className="customLayer" style={styleA}>
                <h4>A Custom Layer</h4>
                <p>Current Center Is: </p>
              </div>
              <div className="customLayer" style={styleB}>
                <p> Another Custom Layer</p>
                <Button onClick={()=>{alert('You Clicked!')}}>An Ant Design Button</Button>
              </div>
            </Map>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Index;
