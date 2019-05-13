import React, { PureComponent, Suspense } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { getTimeDistance } from '@/utils/utils';
import { Row, Col, Card, Form, Badge, List, Avatar,Icon } from 'antd';
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
    rangePickerValue: undefined,
    restRoomId: 1,


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

    this.setState({
      ...this.state,
      rangePickerValue: [moment().subtract(3, "days"),moment(new Date())]
    });
    sessionStorage.setItem("startTime", moment().subtract(3, "days"));
    sessionStorage.setItem("endTime", moment(new Date()));
    dispatch({
      type: 'restroom/weather',
      payload: {
        page:0,
        size:1000,
      },
      callback:(a)=>{this.setState({...this.state,weatherInfo:a})},
    });
    // message.success("fuckckckckck"+JSON.stringify(this.state.rangePickerValue));
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
            startTm:Math.round(this.state.rangePickerValue[0].valueOf()/1000),
            endTm:Math.round(this.state.rangePickerValue[1]/1000),
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

  searchData = (activeKey) =>{
    const { dispatch } = this.props;
    this.setState({
      ...this.state,
      restRoomId: activeKey
    });
    const  fuckTime =[moment(sessionStorage.getItem("startTime")),moment(sessionStorage.getItem("endTime"))];
    const startTime=Math.round(fuckTime[0].valueOf()/1000);
    const endTime = Math.round(fuckTime[1].valueOf()/1000);
    // message.success("malegebi"+JSON.stringify(startTime)+" "+JSON.stringify(endTime));
    try
    {
      dispatch({
        type: 'device/queryHomeGasList',
        payload: {//1?endTm=1557368198&startTm=1557281798
          restRoomId: activeKey,
          startTm: startTime,//Math.round([0].valueOf()/1000),//Math.round(moment().subtract(1, "days").valueOf()/1000),
          endTm: endTime,//Math.round(this.state.rangePickerValue[1].valueOf()/1000),//Math.round(new Date().getTime()/1000),
        },
        callback:(a)=>{
          console.log("气体数据啦啦啦:"+JSON.stringify(a));
          // this.setState(gasFlow: a.)
          // message.success(`${JSON.stringify(this.state.gasFlow)}`);
        },
      });
    }
    catch (e) {
      console.log("获取气体数据出错:"+e.toString());
    }
  }

  selectDate = type => {
    sessionStorage.setItem("startTime", getTimeDistance(type)[0]);
    sessionStorage.setItem("endTime", getTimeDistance(type)[1]);
    this.setState({
      ...this.state,
      rangePickerValue: [...getTimeDistance(type)],
    });
    this.searchData(this.state.restRoomId);
    // this.searchData(this.state.restRoomId);
  };


  handleRangePickerChange = rangePickerValue => {
    sessionStorage.setItem("startTime", rangePickerValue[0]);
    sessionStorage.setItem("endTime", rangePickerValue[1]);
    // message.success("handleRangePickerChange"+JSON.stringify(rangePickerValue));
    this.setState({
      rangePickerValue: [...rangePickerValue],
    });
    this.searchData(this.state.restRoomId);
    // this.searchData(this.state.restRoomId);
    // dispatch({
    //   type: 'chart/fetchSalesData',
    // });
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
      if(histroy===null || histroy ===undefined)   histroy=[{"客流": 0,"x":"0"}];
      if (histroy !== undefined){
        const ds = new DataSet();
        console.log("gasFlowgasFlowgasFlowgasFlow:"+JSON.stringify(histroy));
        dv = ds.createView().source(histroy);
        dv.transform({
          type: "fold",
          fields: ["客流"],
          // 展开字段集
          key: "city",
          // key字段
          value: "temperature" // value字段
        });
        console.log("gasFlowgasFlowgasFlowgasFlow:"+dv);
      }
      // message.success(JSON.stringify(dv));
    }
    catch (e) {
      
    }

    // message.error("fffffffff"+JSON.stringify(this.state.rangePickerValue));Math.round([0].valueOf()/1000),//Math.round(moment().subtract(1, "days").valueOf()/1000),

    const  fuckTime =[moment(sessionStorage.getItem("startTime")),moment(sessionStorage.getItem("endTime"))];


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
                            ...this.state,
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
                             <span>
                              <Icon type="check-square" style={{ color: '#66CD00', marginRight: 8 }} />  {item.deviceCameras.length>0?"视频正常":"未安装摄像头"}
                            </span>
                            <br />
                            <span>
                              <Icon type="check-square" style={{ color: '#66CD00', marginRight: 8 }} />     {this.state.infoWindow.gasStatusText}
                            </span>
                            <br />
                            <span>
                              <Icon type="check-square" style={{ color: '#66CD00', marginRight: 8 }} />     {this.state.infoWindow.boardStatusText}
                            </span>
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
                          this.setState({
                            ...this.state,
                            infoWindow:{
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
                    <button onClick={() => {this.setState({...this.state,infoWindow:{...this.state.infoWindow,visible:false}})}}>关闭</button>
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
                    rangePickerValue={fuckTime}
                    salesData={dv}
                    isActive={this.isActive}
                    handleRangePickerChange={this.handleRangePickerChange}
                    loading={loading}
                    selectDate={this.selectDate}
                    tabOnClick={this.searchData}
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
