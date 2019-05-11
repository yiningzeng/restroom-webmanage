import React, { PureComponent, Suspense } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { getTimeDistance } from '@/utils/utils';
import { Row, Col, Card, Form, Badge, List, Avatar } from 'antd';
import DataSet from "@antv/data-set";
// import StandardTable from '@/components/StandardTable';
import MyStandardTable from '@/components/MyStandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';
import { Map,Marker,InfoWindow } from "react-amap";
import InfiniteScroll from 'react-infinite-scroller';
import { TimelineChart } from '@/components/Charts';


const SalesCard = React.lazy(() => import('./SalesCard'));
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
    rangePickerValue: getTimeDistance('year'),
    gasFlow:undefined,
    weatherInfo:{
      time:undefined,
      data:undefined
    },
    map:{
      center:[121.554074,29.834609],
    },
    infoWindow:{
      position:[121.554074,29.834609],
      visible:false,
      name:undefined,
      status:'processing',
      statusText:'公厕开放',
      videoStatus:'default',
      videoStatusTest:'视频正常',
      gasStatus:'success',//
      gasStatusText:'气味正常',//
      boardStatus:'success',
      boardStatusText:'公告正常',
    }
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'restroom/weather',
      payload: {
        page:0,
        size:1000,
      },
      callback:(a)=>{this.setState({weatherInfo:a})},
    });
    dispatch({
      type: 'restroom/fetch',
      payload: {
        page:0,
        size:1000,
      },
      callback:(a)=>{
        console.log(JSON.stringify(a));
        dispatch({
          type: 'device/queryHomeGasList',
          payload: {//1?endTm=1557368198&startTm=1557281798
            restRoomId: 1,
            startTm:Math.round(moment().subtract(1, "days").valueOf()/1000),
            endTm:Math.round(new Date().getTime()/1000),
          },
          callback:(a)=>{
            console.log("气体数据啦啦啦:"+JSON.stringify(a));
            // this.setState(gasFlow: a.)
            // message.success(`${JSON.stringify(this.state.gasFlow)}`);
          },
        });
      },
    });

  }


  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  render() {
    const {
      restroom: { list },
      device: {gasFlow},
      loading,
      loadingDevice,
      dispatch
    } = this.props;

    let histroy=[];
    try
    {
  
      if( gasFlow.code === 0 ){
        histroy = gasFlow.data.data.items[0].histroyList
      }
    }
    catch (e) {
      
    }
   


    // message.success(JSON.stringify(list));
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
    console.log(JSON.stringify(this.state.weatherInfo));
    // message.success(JSON.stringify(this.state.weatherInfo));
    // const markerEvents =
    let dv=undefined;
    try
    {
      if(histroy===null || histroy ===undefined)   histroy=[{"df":0,"大厅":0,"男厕":0,"女厕":0,"无障碍":0,"x":"0"}];
      if (histroy !== undefined){
        const ds = new DataSet();
        console.log("gasFlowgasFlowgasFlowgasFlow:"+JSON.stringify(histroy));
        dv = ds.createView().source(histroy);
        dv.transform({
          type: "fold",
          fields: ["大厅", "女厕", "男厕", "无障碍"],
          // 展开字段集
          key: "city",
          // key字段
          value: "temperature" // value字段
        });
        console.log("gasFlowgasFlowgasFlowgasFlow:"+dv);
      }
    }
    catch (e) {
      
    }



    const salesData = [];
    for (let i = 0; i < 12; i += 1) {
      salesData.push({
        x: `${i + 1}月`,
        y: Math.floor(Math.random() * 1000) + 200,
      });
    }

    const cols = {
      month: {
        range: [0, 1]
      }
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Row>
            <Col span={4}>
              <div className={styles.infinite}>
                <InfiniteScroll
                  initialLoad={false}
                  pageStart={0}
                  loadMore={this.handleInfiniteOnLoad}
                  hasMore={!this.state.loading && this.state.hasMore}
                  useWindow={false}
                >
                  <List
                    size="large"
                    rowKey="id"
                    loading={loading}
                    dataSource={list===undefined?[]:list.data===undefined?[]:list.data.content}
                    renderItem={item => (
                      <List.Item onClick={()=>{
                        try
                        {
                          dispatch({
                            type: 'device/queryHomeGasList',
                            payload: {//1?endTm=1557368198&startTm=1557281798
                              restRoomId: item.restRoomId,
                              startTm:Math.round(moment().subtract(1, "days").valueOf()/1000),
                              endTm:Math.round(new Date().getTime()/1000),
                            },
                            callback:(a)=>{
                              console.log("气体数据啦啦啦:"+JSON.stringify(a));
                              // this.setState(gasFlow: a.)
                              // message.success(`${JSON.stringify(this.state.gasFlow)}`);
                            },
                          });
                          this.setState({
                            infoWindow:{
                              ...this.state.infoWindow,
                              visible:true,
                              name:item.restRoomName,
                              position:[item.longitude, item.latitude],
                              videoStatus: item.deviceCameras.length>0?"success":"error",
                              videoStatusTest: item.deviceCameras.length>0?"视频正常":"未安装摄像头",
                              // gasStatus:
                            }});
                        }
                        catch (e) {
                          console.log("获取气体数据出错:"+e.toString());
                        }
                        console.log("点点:"+JSON.stringify(item));
                        console.log("点点:"+JSON.stringify(this.state.infoWindow));

                      }}
                      >
                        <List.Item.Meta
                          avatar={<Avatar src={item.img} shape="square" size="large" />}
                          title={item.restRoomName}
                          description={<div>
                            <Badge status={item.deviceCameras.length>0?"success":"error"} text={item.deviceCameras.length>0?"视频正常":"未安装摄像头"} />
                            <br />
                            <Badge status={this.state.infoWindow.gasStatus} text={this.state.infoWindow.gasStatusText} />
                            <br />
                            <Badge status={this.state.infoWindow.boardStatus} text={this.state.infoWindow.boardStatusText} />
                          </div>}
                        />

                        {/*<ListContent data={item} />*/}
                      </List.Item>
                    )}
                  />
                </InfiniteScroll>
              </div>

            </Col>
            <Col span={20}>
              <div className={styles.home}>
                <Map center={this.state.map.center} zoom={13} plugins={['ToolBar']} zoomEnable amapkey="9859d68e8038928bd46f12fafc6f263c">
                  {
                    list!==undefined&&list.data!==undefined&&list.data.content!==undefined&&
                    list.data.content.map((item, i) => (
                      <Marker
                        position={[item.longitude,item.latitude]}
                        clickable
                        events={{
                        created: (instance) => {
                          console.log('Marker 实例创建成功；如果你需要对原生实例进行操作，可以从这里开始；');
                          console.log(instance);
                        },
                        click: (e) => {
                          this.setState({infoWindow:{
                            ...this.state.infoWindow,
                              visible:true,
                              name:item.restRoomName,
                              position:[item.longitude, item.latitude],
                              videoStatus: item.deviceCameras.length>0?"success":"error",
                              videoStatusTest: item.deviceCameras.length>0?"视频正常":"未安装摄像头",
                              // gasStatus:
                          }});
                          console.log(`你点击了这个图标；调用参数为：${item.restRoomName}`);
                          console.log(e);




                        },
                        dblclick: (e) => {
                          // this.setState({infoWindowVisible:true});
                          console.log(`你刚刚双击了这个图标；调用参数为：${item.restRoomName}`);
                          console.log(e);
                        },
                        // ... 支持绑定所有原生的高德 Marker 事件
                      }}
                      />
                    ))
                  }
                  <InfoWindow
                    position={this.state.infoWindow.position}
                    visible={this.state.infoWindow.visible}
                    isCustom
                  >
                    <h3>{this.state.infoWindow.name}</h3>
                    <Badge status={this.state.infoWindow.status} text={this.state.infoWindow.statusText} />
                    <br />
                    <Badge status={this.state.infoWindow.videoStatus} text={this.state.infoWindow.videoStatusTest} />
                    <br />
                    <Badge status={this.state.infoWindow.gasStatus} text={this.state.infoWindow.gasStatusText} />
                    <br />
                    <Badge status={this.state.infoWindow.boardStatus} text={this.state.infoWindow.boardStatusText} />
                    <br />
                    <button onClick={() => {this.setState({infoWindow:{...this.state.infoWindow,visible:false}})}}>关闭</button>
                  </InfoWindow>
                  <Card className="customLayer" style={styleA}>
                    <Card.Meta
                      title={`宁波${this.state.weatherInfo}`===undefined?undefined: this.state.weatherInfo.data===undefined?undefined:`宁波 ${this.state.weatherInfo.data.forecast[0].type} ${this.state.weatherInfo.data.wendu}℃`}
                      description={this.state.weatherInfo===undefined?undefined:moment(this.state.weatherInfo.time).fromNow()}
                    />
                  </Card>
                  {/*<div className="customLayer" style={styleA}>*/}
                  {/*<h4>宁波</h4>*/}
                  {/*<p>{this.state.weatherInfo===undefined?undefined:moment(this.state.weatherInfo.time).fromNow()}</p>*/}
                  {/*</div>*/}
                  {/*<div className="customLayer" style={styleB}>*/}
                  {/*<p> Another Custom Layer</p>*/}
                  {/*<Button onClick={()=>{alert('You Clicked!')}}>An Ant Design Button</Button>*/}
                  {/*</div>*/}
                </Map>
              </div>
              <div style={{ padding: '0 24px' }}>
                <Suspense fallback={null}>
                  <SalesCard
                    rangePickerValue={this.state.rangePickerValue}
                    salesData={salesData}
                    isActive={this.isActive}
                    handleRangePickerChange={this.handleRangePickerChange}
                    loading={loading}
                    selectDate={this.selectDate}
                  />
                </Suspense>
              </div>
            </Col>
          </Row>

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Index;
