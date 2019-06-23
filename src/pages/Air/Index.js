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
@connect(({ restroom,device, nothing, loading }) => ({
  restroom,
  device,
  nothing,
  loading: loading.effects['restroom/fetch'],
  loadingDevice: loading.effects['device/fetch']
}))
@Form.create()
class Index extends PureComponent {
  state = {
    nothing: {
      week: [],
      month: [],
      year: [],
    },
    selectMonth: moment().month()+"",

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

    this.setNothing(1);

    this.getNothingDailyData(1, moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'), moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'));
  }

  // 更具时间获取气体数据，返回的是每天的总和数据
  startGetNothingDailyData=(id, as)=>{
    // message.success(as);
    switch (as) {
      case "0":
        this.getNothingDailyData(id, moment().year()+'-01-01 00:00:00', moment().year()+'-01-31 23:59:59');
        break;
      case "1":
        this.getNothingDailyData(id, moment().year()+'-02-01 00:00:00', moment().year()+'-02-29 23:59:59');
        break;
      case "2":
        this.getNothingDailyData(id, moment().year()+'-03-01 00:00:00', moment().year()+'-03-31 23:59:59');
        break;
      case "3":
        this.getNothingDailyData(id, moment().year()+'-04-01 00:00:00', moment().year()+'-04-30 23:59:59');
        break;
      case "4":
        this.getNothingDailyData(id, moment().year()+'-05-01 00:00:00', moment().year()+'-05-31 23:59:59');
        break;
      case "5":
        this.getNothingDailyData(id, moment().year()+'-06-01 00:00:00', moment().year()+'-06-30 23:59:59');
        break;
      case "6":
        this.getNothingDailyData(id, moment().year()+'-07-01 00:00:00', moment().year()+'-07-31 23:59:59');
        break;
      case "7":
        this.getNothingDailyData(id, moment().year()+'-08-01 00:00:00', moment().year()+'-08-31 23:59:59');
        break;
      case "8":
        this.getNothingDailyData(id, moment().year()+'-09-01 00:00:00', moment().year()+'-09-30 23:59:59');
        break;
      case "9":
        this.getNothingDailyData(id, moment().year()+'-10-01 00:00:00', moment().year()+'-10-31 23:59:59');
        break;
      case "10":
        this.getNothingDailyData(id, moment().year()+'-11-01 00:00:00', moment().year()+'-11-30 23:59:59');
        break;
      case "11":
        this.getNothingDailyData(id, moment().year()+'-12-01 00:00:00', moment().year()+'-12-31 23:59:59');
        break;
    }
  };

  getNothingDailyData = (id, startTime, endTime) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'nothing/getStatisticList',
      payload: {//1?endTm=1557368198&startTm=1557281798
        restRoomId: id,
        startTm: startTime,
        endTm: endTime,
      },
      callback:(a)=>{
        dispatch({
          type: 'nothing/getFuckGasInfoQuery',
          payload: {//1?endTm=1557368198&startTm=1557281798
            restRoomId: id,
          },
          callback:(a)=>{
            // message.success(`${JSON.stringify(a)}`);
          },
        });
        // message.success(`${JSON.stringify(a)}`);
      },
    });

  }

  // 获取气体状态在选择时间内出现的次数
  setNothing = (id) =>{
    const { dispatch } = this.props;
    // region 获取气体状态在选择时间内出现的次数
    dispatch({
      type: 'nothing/getStatistic',
      payload: {//1?endTm=1557368198&startTm=1557281798
        restRoomId: id,
        startTm: moment().startOf('week').format('YYYY-MM-DD HH:mm:ss'),
        endTm: moment().endOf('week').format('YYYY-MM-DD HH:mm:ss'),
      },
      callback:(a)=>{
        this.setState({nothing: {...this.state.nothing, week: a.data}});
        // this.setState(gasFlow: a.)
        // message.success(`${JSON.stringify(this.state.gasFlow)}`);
      },
    });
    dispatch({
      type: 'nothing/getStatistic',
      payload: {//1?endTm=1557368198&startTm=1557281798
        restRoomId: id,
        startTm: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        endTm: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
      },
      callback:(a)=>{
        this.setState({nothing: {...this.state.nothing, month: a.data}});
        // this.setState(gasFlow: a.)
        // message.success(`${JSON.stringify(this.state.gasFlow)}`);
      },
    });
    dispatch({
      type: 'nothing/getStatistic',
      payload: {//1?endTm=1557368198&startTm=1557281798
        restRoomId: id,
        startTm: moment().startOf('year').format('YYYY-MM-DD HH:mm:ss'),
        endTm: moment().endOf('year').format('YYYY-MM-DD HH:mm:ss'),
      },
      callback:(a)=>{
        this.setState({nothing: {...this.state.nothing, year: a.data}});
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

      this.setNothing(activeKey);
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
      nothing: { statisticList, fuckGasInfo },
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
                        // try {
                          this.searchData(item.restRoomId,sessionStorage.getItem("select")==="today"?0:1);

                          this.setState({
                            ...this.state,
                            restRoomId: item.restRoomId,
                            restRoomIdGas: item.restRoomId,
                            infoWindow: {
                              ...this.state.infoWindow,
                              visible: true,
                              name: item.restRoomName,
                              position: [item.longitude, item.latitude],
                              videoStatus: item.deviceCameras.length > 0 && item.deviceCameras.filter(v => v.online===0).length===0 ? "success" : "error",
                              videoStatusTest: item.deviceCameras.length > 0 && item.deviceCameras.filter(v => v.online===0).length===0 ? "摄像头正常" : "摄像头离线",
                              boardStatus: item.deviceBoards.length > 0 && item.deviceBoards.filter(v => v.online===0).length>0 ? "error" : "success",
                              boardStatusText: item.deviceBoards.length > 0 && item.deviceBoards.filter(v => v.online===0).length>0 ? "公告屏离线" : "公告屏正常",
                              gasStatus: item.deviceGases.length > 0 && item.deviceGases.filter(v => v.score===0).length>0 ? "error":"success",
                              gasStatusText: item.deviceGases.length > 0 && item.deviceGases.filter(v => v.score===0).length>0 ? "测气仪离线":"测气仪正常",
                              // gasStatus:
                            }
                          });
                          this.startGetNothingDailyData(item.restRoomId,this.state.selectMonth);
                        // }
                        // catch (e) {
                        //   console.error(e);
                        // }
                        // console.log("点点:",(item));
                        // console.log("点点:",(this.state.infoWindow));

                      }}
                      >
                        <List.Item.Meta
                          title={item.restRoomName}
                          description={<div class="mineclassone">
                            {item.deviceCameras.length>0 && item.deviceCameras.filter(v => v.online===0).length===0 ?
                              <span style={{ color: "#66CD00", marginRight: 8 }}><Icon type="check-square" />摄像头正常</span>:
                              <span style={{ color: "#FF0000", marginRight: 8 }}><Icon type="close-square" />摄像头离线</span>}
                            <br />
                            {item.deviceGases.length > 0 && item.deviceGases.filter(v => v.score===0).length>0 ?
                              <span style={{ color: "#FF0000", marginRight: 8 }}><Icon type="close-square" />测气仪离线</span>:
                              <span style={{ color: "#66CD00", marginRight: 8 }}><Icon type="check-square" />测气仪正常</span>}
                            <br />
                            {item.deviceBoards.length > 0 && item.deviceBoards.filter(v => v.online===0).length===0 ?
                              <span style={{ color: "#66CD00", marginRight: 8 }}><Icon type="check-square" />公告屏正常</span>:
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
                <Col span={12}>
                  <div>
                    <div style={{background: 'whitesmoke',margin:'10px'}}>
                      <div style={{'text-align': 'center','font-size':'28px'}}>空气状况</div>
                      <div style={{'text-align': 'center',display:'flex','margin-top':'20px'}}><span style={{flex:'1'}}>大厅</span><span style={{flex:'1'}}>无障碍</span><span style={{flex:'1'}}>男厕</span><span style={{flex:'1'}}>女厕</span></div>
                      <div style={{'text-align': 'center',display:'flex','margin-top':'6px'}}><span style={{flex:'1'}}>
                        {//大厅 fuckGasInfo {0：大厅|1：女厕|2：男厕|3：无障碍}
                          fuckGasInfo.data.filter(v => v.type===0).length===0?"未知":fuckGasInfo.data.filter(v => v.type===0)[0].temperature
                        }℃</span><span style={{flex:'1'}}>
                         {//无障碍 fuckGasInfo
                           fuckGasInfo.data.filter(v => v.type===3).length===0?"未知":fuckGasInfo.data.filter(v => v.type===3)[0].temperature
                         }℃</span><span style={{flex:'1'}}>
                        {//男厕 fuckGasInfo
                          fuckGasInfo.data.filter(v => v.type===2).length===0?"未知":fuckGasInfo.data.filter(v => v.type===2)[0].temperature
                        }℃</span><span style={{flex:'1'}}>
                         {//女厕 fuckGasInfo
                           fuckGasInfo.data.filter(v => v.type===1).length===0?"未知":fuckGasInfo.data.filter(v => v.type===1)[0].temperature
                         }℃</span></div>
                      <div style={{'text-align': 'center',display:'flex','margin-top':'6px','margin-bottom':'20px'}}><span style={{flex:'1'}}>
                        {//大厅 fuckGasInfo {0：大厅|1：女厕|2：男厕|3：无障碍}
                          fuckGasInfo.data.filter(v => v.type===0).length===0?"未知":fuckGasInfo.data.filter(v => v.type===0)[0].score
                        }
                      </span><span style={{flex:'1'}}>
                          {//无障碍 fuckGasInfo
                            fuckGasInfo.data.filter(v => v.type===3).length===0?"未知":fuckGasInfo.data.filter(v => v.type===3)[0].score
                          }
                      </span><span style={{flex:'1'}}>
                             {//男厕 fuckGasInfo
                               fuckGasInfo.data.filter(v => v.type===2).length===0?"未知":fuckGasInfo.data.filter(v => v.type===2)[0].score
                             }
                      </span><span style={{flex:'1'}}>
                             {//女厕 fuckGasInfo
                               fuckGasInfo.data.filter(v => v.type===1).length===0?"未知":fuckGasInfo.data.filter(v => v.type===1)[0].score
                             }
                      </span></div>
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
                <Col span={12}>
                  <Row>
                      <div style={{background: 'whitesmoke',margin:'10px',height:'300px'}}> 
                        <div style={{'text-align': 'center',display:'flex',margin:'2px 50px','padding-top':'30px','font-size':'16px'}}><span style={{flex:'1'}}>空气质量</span><span style={{flex:'1'}}>本周</span><span style={{flex:'1'}}>本月</span><span style={{flex:'1'}}>本年</span></div>
                        <div style={{'text-align': 'center',display:'flex',margin:'2px 50px','padding-top':'20px'}}><span style={{flex:'1',color:"darkred"}}><span style={{width:'30px',height:'10px','margin-right':'10px',display: 'inline-block','background-color':"darkred"}}></span>极差</span><span style={{flex:'1'}}>{
                          // 本周 极差
                          this.state.nothing.week.filter(v=> v.remark === '极差').length===0?0:this.state.nothing.week.filter(v=> v.remark === '极差')[0].num
                        }天</span><span style={{flex:'1'}}>{
                          // 本月 极差
                          this.state.nothing.month.filter(v=> v.remark === '极差').length===0?0:this.state.nothing.month.filter(v=> v.remark === '极差')[0].num
                        }天</span><span style={{flex:'1'}}>{
                          // 本年 极差
                          this.state.nothing.year.filter(v=> v.remark === '极差').length===0?0:this.state.nothing.year.filter(v=> v.remark === '极差')[0].num
                        }天</span></div>
                        <div style={{'text-align': 'center',display:'flex',margin:'2px 50px','padding-top':'10px'}}><span style={{flex:'1',color:"red"}}><span style={{width:'30px',height:'10px','margin-right':'10px',display: 'inline-block','background-color':"red"}}></span>很差</span><span style={{flex:'1'}}>{
                          // 本周 很差
                          this.state.nothing.week.filter(v=> v.remark === '很差').length===0?0:this.state.nothing.week.filter(v=> v.remark === '很差')[0].num
                        }天</span><span style={{flex:'1'}}>{
                          // 本月 很差
                          this.state.nothing.month.filter(v=> v.remark === '很差').length===0?0:this.state.nothing.month.filter(v=> v.remark === '很差')[0].num
                        }天</span><span style={{flex:'1'}}>{
                          // 本年 极差
                          this.state.nothing.year.filter(v=> v.remark === '很差').length===0?0:this.state.nothing.year.filter(v=> v.remark === '很差')[0].num
                        }天</span></div>
                        <div style={{'text-align': 'center',display:'flex',margin:'2px 50px','padding-top':'10px'}}><span style={{flex:'1',color:"yellow"}}><span style={{width:'30px',height:'10px','margin-right':'10px',display: 'inline-block','background-color':"yellow"}}></span>一般</span><span style={{flex:'1'}}>{
                          // 本周 一般
                          this.state.nothing.week.filter(v=> v.remark === '一般').length===0?0:this.state.nothing.week.filter(v=> v.remark === '一般')[0].num
                        }天</span><span style={{flex:'1'}}>{
                          // 本月 一般
                          this.state.nothing.month.filter(v=> v.remark === '一般').length===0?0:this.state.nothing.month.filter(v=> v.remark === '一般')[0].num
                        }天</span><span style={{flex:'1'}}>{
                          // 本年 一般
                          this.state.nothing.year.filter(v=> v.remark === '一般').length===0?0:this.state.nothing.year.filter(v=> v.remark === '一般')[0].num
                        }天</span></div>
                        <div style={{'text-align': 'center',display:'flex',margin:'2px 50px','padding-top':'10px'}}><span style={{flex:'1',color:"green"}}><span style={{width:'30px',height:'10px','margin-right':'10px',display: 'inline-block','background-color':"green"}}></span>良好</span><span style={{flex:'1'}}>{
                          // 本周 良好
                          this.state.nothing.week.filter(v=> v.remark === '良好').length===0?0:this.state.nothing.week.filter(v=> v.remark === '良好')[0].num
                        }天</span><span style={{flex:'1'}}>{
                          // 本月 良好
                          this.state.nothing.month.filter(v=> v.remark === '良好').length===0?0:this.state.nothing.month.filter(v=> v.remark === '良好')[0].num
                        }天</span><span style={{flex:'1'}}>{
                          // 本年 良好
                          this.state.nothing.year.filter(v=> v.remark === '良好').length===0?0:this.state.nothing.year.filter(v=> v.remark === '良好')[0].num
                        }天</span></div>
                        <div style={{'text-align': 'center',display:'flex',margin:'2px 50px','padding-top':'10px'}}><span style={{flex:'1',color:"#ADFF2F"}}><span style={{width:'30px',height:'10px','margin-right':'10px',display: 'inline-block','background-color':"#ADFF2F"}}></span>优秀</span><span style={{flex:'1'}}>{
                          // 本周 优秀
                          this.state.nothing.week.filter(v=> v.remark === '优秀').length===0?0:this.state.nothing.week.filter(v=> v.remark === '优秀')[0].num
                        }天</span><span style={{flex:'1'}}>{
                          // 本月 优秀
                          this.state.nothing.month.filter(v=> v.remark === '优秀').length===0?0:this.state.nothing.month.filter(v=> v.remark === '优秀')[0].num
                        }天</span><span style={{flex:'1'}}>{
                          // 本年 优秀
                          this.state.nothing.year.filter(v=> v.remark === '优秀').length===0?0:this.state.nothing.year.filter(v=> v.remark === '优秀')[0].num
                        }天</span></div>
                      </div>
                  </Row>
                  <Row>
                      <div style={{background: 'whitesmoke',margin:'10px'}}>
                      <Suspense fallback={null}>
                        <SalesCard
                          onSelectHandleChange={(as)=>{
                            this.setState({selectMonth: as});
                            this.startGetNothingDailyData(as);
                          }}
                          className={styles.chartInfinite}
                          rangePickerValue={fuckTime}
                          allNum={fuckFlow.status}
                          salesData={statisticList.data}
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
