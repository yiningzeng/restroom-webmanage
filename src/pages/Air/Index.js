import React, { PureComponent, Suspense } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { getTimeDistance } from '@/utils/utils';
import { Row, Col, Card, Form, Badge, List, Avatar,Icon, message } from 'antd';
import DataSet from "@antv/data-set";
// import StandardTable from '@/components/StandardTable';
import MyStandardTable from '@/components/MyStandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';
import fuckStyles from './Analysis.less';
import { Map,Marker,InfoWindow } from "react-amap";
import InfiniteScroll from 'react-infinite-scroller';
import { TimelineChart } from '@/components/Charts';


const SalesCard = React.lazy(() => import('./SalesCard'));
const GasCard = React.lazy(() => import('./GasCard'));
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
    rangePickerValue: getTimeDistance('day'),
    restRoomId: 1,
    isActive: "today",

    rangePickerValueGas: getTimeDistance('day'),
    restRoomIdGas: 1,
    isActiveGas: "today",

    gasFlow:undefined,
    weatherInfo: undefined,
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
      rangePickerValue: [moment().subtract(1, "days"),moment(new Date())]
    });
    sessionStorage.setItem("select", "today");
    sessionStorage.setItem("startTime", getTimeDistance("today")[0]);
    sessionStorage.setItem("endTime", getTimeDistance("today")[1]);
    dispatch({
      type: 'restroom/weather',
      payload: {
        page:0,
        size:1000,
      },
      callback:(a)=>{this.setState({...this.state,weatherInfo:a})},
    });
    const startTime=moment(sessionStorage.getItem("startTime")).format('YYYY-MM-DD 06:00:00');
    const endTime = moment(sessionStorage.getItem("endTime")).format('YYYY-MM-DD 22:00:00');
    // message.success("fuckckckckck"+JSON.stringify(this.state.rangePickerValue));
    dispatch({
      type: 'restroom/fetch',
      payload: {
        page:0,
        size:1000,
      },
      callback:(a)=>{
        dispatch({
          type: 'restroom/getFuckFlow',
          payload: {//1?endTm=1557368198&startTm=1557281798
            restRoomId: 1,
            startTm: startTime,//moment().subtract(1, "days").format('YYYY-MM-DD 00:00:00'),
            endTm: endTime,//moment(new Date()).format('YYYY-MM-DD 00:00:00'),
          },
          callback:(a)=>{
            // this.setState(gasFlow: a.)
            // message.success(`${JSON.stringify(this.state.gasFlow)}`);
          },
        });
      },
    });

    // region 获取气体数据
    dispatch({
      type: 'device/queryHomeGasList',
      payload: {//1?endTm=1557368198&startTm=1557281798
        restRoomId: 1,
        startTm: startTime,
        endTm: endTime,
      },
      callback:(a)=>{
        console.log("v2最新气体数据:"+JSON.stringify(a));
        // this.setState(gasFlow: a.)
        // message.success(`${JSON.stringify(this.state.gasFlow)}`);
      },
    });
    //endregion
  }

  //region 客流
  searchData = (activeKey,searchType) =>{
    // message.error(activeKey+" "+searchType);
    const { dispatch } = this.props;
    this.setState({
      ...this.state,
      restRoomId: activeKey
    });
    let startformat='YYYY-MM-DD 06:00:00';
    let endformat='YYYY-MM-DD 22:00:00';
    if(searchType === 1){
      startformat='YYYY-MM-DD 00:00:00';
      endformat='YYYY-MM-DD 23:59:59';
    }
    const startTime = moment(sessionStorage.getItem("startTime")).format(startformat);
    const endTime = moment(sessionStorage.getItem("endTime")).format(endformat);
    // message.success("malegebi"+JSON.stringify(startTime)+" "+JSON.stringify(endTime));
    try
    {
      // region 获取气体数据
      dispatch({
        type: 'device/queryHomeGasList',
        payload: {//1?endTm=1557368198&startTm=1557281798
          restRoomId: activeKey,
          startTm: startTime,
          endTm: endTime,
        },
        callback:(a)=>{
          console.log("v2最新气体数据:"+JSON.stringify(a));
          // this.setState(gasFlow: a.)
          // message.success(`${JSON.stringify(this.state.gasFlow)}`);
        },
      });
      //endregion
    }
    catch (e) {
    }
  }

  selectDate = type => {
    sessionStorage.setItem("startTime", getTimeDistance(type)[0]);
    sessionStorage.setItem("endTime", getTimeDistance(type)[1]);
    sessionStorage.setItem("select", type);
    this.setState({
      isActive: type,
      rangePickerValue: [...getTimeDistance(type)],
    });
    if(type !== "today") this.searchData(this.state.restRoomId,1);
    else this.searchData(this.state.restRoomId, 0);

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

  isActive = type => {
    if(sessionStorage.getItem("select") === type)return fuckStyles.currentDate;
    return '';
  };
  //endregion

  //region 控制质量图表
  searchDataGas = (activeKey,searchType) =>{
    // activeKey = activeKey.replace("gas-","");
    // message.error(activeKey+" "+searchType);
    const { dispatch } = this.props;
    this.setState({
      ...this.state,
      restRoomIdGas: activeKey
    });
    let startformat='YYYY-MM-DD 06:00:00';
    let endformat='YYYY-MM-DD 22:00:00';
    if(searchType === 1){
      startformat='YYYY-MM-DD 00:00:00';
      endformat='YYYY-MM-DD 23:59:59';
    }
    const startTime = moment(sessionStorage.getItem("startTimeGas")).format(startformat);
    const endTime = moment(sessionStorage.getItem("endTimeGas")).format(endformat);
    // message.success("malegebi"+JSON.stringify(startTime)+" "+JSON.stringify(endTime));
    try
    {
      // region 获取气体数据
      dispatch({
        type: 'device/queryHomeGasList',
        payload: {//1?endTm=1557368198&startTm=1557281798
          restRoomId: activeKey,
          startTm: startTime,
          endTm: endTime,
        },
        callback:(a)=>{
          console.log("v2最新气体数据:"+JSON.stringify(a));
          // this.setState(gasFlow: a.)
          // message.success(`${JSON.stringify(this.state.gasFlow)}`);
        },
      });
      //endregion
    }
    catch (e) {
    }
  }

  selectDateGas = type => {
    sessionStorage.setItem("startTimeGas", getTimeDistance(type)[0]);
    sessionStorage.setItem("endTimeGas", getTimeDistance(type)[1]);
    sessionStorage.setItem("selectGas", type);
    this.setState({
      isActiveGas: type,
      rangePickerValueGas: [...getTimeDistance(type)],
    });
    if(type !== "today") this.searchDataGas(this.state.restRoomIdGas,1);
    else this.searchDataGas(this.state.restRoomIdGas, 0);

    // this.searchData(this.state.restRoomId);
  };


  handleRangePickerChangeGas = rangePickerValue => {
    sessionStorage.setItem("startTimeGas", rangePickerValue[0]);
    sessionStorage.setItem("endTimeGas", rangePickerValue[1]);
    // message.success("handleRangePickerChange"+JSON.stringify(rangePickerValue));
    this.setState({
      rangePickerValueGas: [...rangePickerValue],
    });
    this.searchDataGas(this.state.restRoomIdGas);
    // this.searchData(this.state.restRoomId);
    // dispatch({
    //   type: 'chart/fetchSalesData',
    // });
  };

  isActiveGas = type => {
    if(sessionStorage.getItem("selectGas") === type)return fuckStyles.currentDate;
    return '';
  };
  //endregion

  render() {
    const {
      restroom: { list, fuckFlow },
      loading,
      device: {gasFlow},
      dispatch
    } = this.props;


    // message.success(JSON.stringify(list));
    const styleA = {
      position: 'absolute',
      top: '10px',
      left: '10px',
      padding: '5px 10px',
      border: '1px solid #d3d3d3',
      backgroundColor: '#92c0ff',
      opacity: '0.4',
      border:'4px solid #2bccff',
      // border-radius: '20px',
    }
    const styleB = {
      position: 'absolute',
      right: '10px',
      bottom: '10px',
      padding: '10px',
      color: '#fff',
      backgroundColor: 'red'
    }
    const styleColorwhite={
      color:"white"
    }
    let yourFuckFlow=[{"number": 0,"show_time":""}];
    try
    {
      yourFuckFlow= fuckFlow.data;
    }
    catch (e) {

    }

    //region 气体数据
    let dv = undefined;
    try
    {
      const ds = new DataSet();
      dv = ds.createView().source(gasFlow.data);
      dv.transform({
        type: "fold",
        fields: ["大厅", "女厕", "男厕", "无障碍"],
        // 展开字段集
        key: "city",
        // key字段
        value: "temperature" // value字段
      });
      console.log("gasFlow:dv"+dv);
      // message.success(JSON.stringify(dv));
    }
    catch (e) {
    }
    //endregion 气体数据


    // message.error(JSON.stringify(yourFuckFlow));
    // message.error("fffffffff"+JSON.stringify(this.state.rangePickerValue));Math.round([0].valueOf()/1000),//Math.round(moment().subtract(1, "days").valueOf()/1000),

    const  fuckTime =[moment(sessionStorage.getItem("startTime")),moment(sessionStorage.getItem("endTime"))];
    const  fuckTimeGas =[moment(sessionStorage.getItem("startTimeGas")),moment(sessionStorage.getItem("endTimeGas"))];

    return (
      <PageHeaderWrapper>
        <Card
          style={{ padding: '0' }}
          bordered={false}
          className="colortransparent"
        >
          <Row>

            <Col span={4} id="dazhu">
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
                    color="white!important"
                    rowKey="id"
                    loading={loading}
                    dataSource={list===undefined?[]:list.data===undefined?[]:list.data.content}
                    renderItem={item => (
                      <List.Item onClick={()=>{
                        try {
                          this.searchData(item.restRoomId,sessionStorage.getItem("select")==="today"?0:1);

                          this.setState({
                            ...this.state,
                            infoWindow: {
                              ...this.state.infoWindow,
                              visible: true,
                              name: item.restRoomName,
                              position: [item.longitude, item.latitude],
                              videoStatus: item.deviceCameras.length > 0 && item.deviceCameras[0].online === 1 ? "success" : "error",
                              videoStatusTest: item.deviceCameras.length > 0 && item.deviceCameras[0].online === 1 ? "摄像正常" : "摄像头离线",
                              boardStatus: item.deviceCameras.length > 0 && item.deviceCameras[0].online === 1 ? "success" : "error",
                              boardStatusText: item.deviceCameras.length > 0 && item.deviceCameras[0].online === 1 ? "公告正常" : "公告屏离线",
                              // gasStatus:
                            }
                          });
                        }
                        catch (e) {
                        }
                        console.log("点点:",(item));
                        console.log("点点:",(this.state.infoWindow));

                      }}
                      >
                        <List.Item.Meta
                          title={item.restRoomName}
                          description={<div class="mineclassone">
                          {item.deviceCameras.length>0 && item.deviceCameras[0].online === 1 ?
                          <span style={{ color: "#66CD00", marginRight: 8 }}><Icon type="check-square" />摄像正常</span>:
                          <span style={{ color: "#FF0000", marginRight: 8 }}><Icon type="close-square" />摄像头离线</span>}
                          <br />
                          <span style={{ color: "#66CD00", marginRight: 8 }}><Icon type="check-square" />{this.state.infoWindow.gasStatusText}</span>
                          <br />
                          {item.deviceCameras.length>0 && item.deviceCameras[0].online === 1 ?
                          <span style={{ color: "#66CD00", marginRight: 8 }}><Icon type="check-square" />公告正常</span>:
                          <span style={{ color: '#FF0000', marginRight: 8 }}><Icon type="close-square" />公告屏离线</span>}
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
                <Col span={10}>
                  <div>
                    <div style={{background: 'whitesmoke',margin:'10px'}}>
                      <div style={{'text-align': 'center','font-size':'28px'}}>空气状况</div>
                      <div style={{'text-align': 'center',display:'flex','margin-top':'20px'}}><span style={{flex:'1'}}>大厅</span><span style={{flex:'1'}}>第三卫</span><span style={{flex:'1'}}>男厕</span><span style={{flex:'1'}}>女厕</span></div>
                      <div style={{'text-align': 'center',display:'flex','margin-top':'6px'}}><span style={{flex:'1'}}>26℃</span><span style={{flex:'1'}}>26℃</span><span style={{flex:'1'}}>26℃</span><span style={{flex:'1'}}>26℃</span></div>
                      <div style={{'text-align': 'center',display:'flex','margin-top':'6px','margin-bottom':'20px'}}><span style={{flex:'1'}}>优</span><span style={{flex:'1'}}>良</span><span style={{flex:'1'}}>优</span><span style={{flex:'1'}}>良</span></div>
                      <Suspense fallback={null}>
                        <GasCard
                          className={styles.chartInfinite}
                          rangePickerValue={fuckTimeGas}
                          salesData={dv}
                          isActive={this.isActiveGas}
                          handleRangePickerChange={this.handleRangePickerChangeGas}
                          loading={loading}
                          selectDate={this.selectDateGas}
                          tabOnClick={this.searchDataGas}
                        />
                      </Suspense>
                      <div style={{'text-align': 'center','font-size':'16px',margin:'20px'}}>空气指标质量等级参考</div>
                      <div style={{'text-align': 'center',display:'flex',margin:'2px 50px'}}><span style={{flex:'1'}}>优秀</span><span style={{flex:'1'}}>良好</span><span style={{flex:'1'}}>一般</span><span style={{flex:'1'}}>很差</span><span style={{flex:'1'}}>极差</span></div>
                      <div style={{'text-align': 'center',display:'flex',margin:'2px 50px',height:'20px'}}><span style={{flex:'1','background-color':'#ADFF2F'}}></span><span style={{flex:'1','background-color':'green'}}></span><span style={{flex:'1','background-color':'yellow'}}></span><span style={{flex:'1','background-color':'red'}}></span><span style={{flex:'1','background-color':'darkred'}}></span></div>
                      <div style={{'text-align': 'left',display:'flex',margin:'2px 50px'}}><span style={{flex:'1'}}>1</span><span style={{flex:'1'}}>3</span><span style={{flex:'1'}}>5</span><span style={{flex:'1'}}>7</span><span style={{flex:'1'}}>9</span>10</div>
                    </div>
                  </div>
                </Col>
                <Col span={14}>
                  <Row>
                      <div style={{background: 'whitesmoke',margin:'10px',height:'300px'}}> 
                        <div style={{'text-align': 'center',display:'flex',margin:'2px 50px','padding-top':'30px','font-size':'16px'}}><span style={{flex:'1'}}>空气质量</span><span style={{flex:'1'}}>本周</span><span style={{flex:'1'}}>本月</span><span style={{flex:'1'}}>本年</span></div>
                        <div style={{'text-align': 'center',display:'flex',margin:'2px 50px','padding-top':'20px'}}><span style={{flex:'1',color:"darkred"}}><span style={{width:'30px',height:'10px','margin-right':'10px',display: 'inline-block','background-color':"darkred"}}></span>极差</span><span style={{flex:'1'}}>2天</span><span style={{flex:'1'}}>10天</span><span style={{flex:'1'}}>120天</span></div>
                        <div style={{'text-align': 'center',display:'flex',margin:'2px 50px','padding-top':'10px'}}><span style={{flex:'1',color:"red"}}><span style={{width:'30px',height:'10px','margin-right':'10px',display: 'inline-block','background-color':"red"}}></span>很差</span><span style={{flex:'1'}}>2天</span><span style={{flex:'1'}}>10天</span><span style={{flex:'1'}}>120天</span></div>
                        <div style={{'text-align': 'center',display:'flex',margin:'2px 50px','padding-top':'10px'}}><span style={{flex:'1',color:"yellow"}}><span style={{width:'30px',height:'10px','margin-right':'10px',display: 'inline-block','background-color':"yellow"}}></span>一般</span><span style={{flex:'1'}}>2天</span><span style={{flex:'1'}}>10天</span><span style={{flex:'1'}}>120天</span></div>
                        <div style={{'text-align': 'center',display:'flex',margin:'2px 50px','padding-top':'10px'}}><span style={{flex:'1',color:"green"}}><span style={{width:'30px',height:'10px','margin-right':'10px',display: 'inline-block','background-color':"green"}}></span>良好</span><span style={{flex:'1'}}>2天</span><span style={{flex:'1'}}>10天</span><span style={{flex:'1'}}>120天</span></div>
                        <div style={{'text-align': 'center',display:'flex',margin:'2px 50px','padding-top':'10px'}}><span style={{flex:'1',color:"#ADFF2F"}}><span style={{width:'30px',height:'10px','margin-right':'10px',display: 'inline-block','background-color':"#ADFF2F"}}></span>优秀</span><span style={{flex:'1'}}>2天</span><span style={{flex:'1'}}>10天</span><span style={{flex:'1'}}>120天</span></div>
                      </div>
                  </Row>
                  <Row>
                      <div style={{background: 'whitesmoke',margin:'10px'}}>
                      <Suspense fallback={null}>
                        <SalesCard
                          className={styles.chartInfinite}
                          rangePickerValue={fuckTime}
                          allNum={fuckFlow.status}
                          salesData={yourFuckFlow}
                          isActive={this.isActive}
                          handleRangePickerChange={this.handleRangePickerChange}
                          loading={loading}
                          selectDate={this.selectDate}
                          tabOnClick={this.searchData}
                        />
                      </Suspense>
                      </div>
                  </Row>
                </Col>
            </Col>
          </Row>

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Index;
