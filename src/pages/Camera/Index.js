import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {Row, Col, Form, Card, Select, List, Modal,Divider,message,  Drawer} from 'antd';
import Trend from '@/components/Trend';
import TagSelect from '@/components/TagSelect';
import AvatarList from '@/components/AvatarList';
import { MiniArea } from '@/components/Charts';
import Ellipsis from '@/components/Ellipsis';
import StandardFormRow from '@/components/StandardFormRow'

import styles from './Index.less';
import numeral from "numeral";

const { Option } = Select;
const FormItem = Form.Item;

/* eslint react/no-array-index-key: 0 */

@connect(({ restroom, loading }) => ({
  restroom,
  loading: loading.effects['restroom/fetch'],
}))
@Form.create({
  // onValuesChange({ dispatch }, changedValues, allValues) {
  //   // 表单项变化时请求数据
  //   // eslint-disable-next-line
  //   console.log(changedValues, allValues);
  //   // 模拟查询表单生效
  //   dispatch({
  //     type: 'list/fetch',
  //     payload: {
  //       count: 8,
  //     },
  //   });
  // },
})
class CoverCardList extends PureComponent {

  state = {
    modal1Visible: false,
    gasData:[{"x":"2018-12-20","y":50},{"x":"2018-12-21","y":5},{"x":"2018-12-22","y":4},{"x":"2018-12-23","y":2},{"x":"2018-12-24","y":4},{"x":"2018-12-25","y":7},{"x":"2018-12-26","y":5},{"x":"2018-12-27","y":6},{"x":"2018-12-28","y":5},{"x":"2018-12-29","y":9},{"x":"2018-12-30","y":6},{"x":"2018-12-31","y":3},{"x":"2019-01-01","y":1},{"x":"2019-01-02","y":5},{"x":"2019-01-03","y":3},{"x":"2019-01-04","y":6},{"x":"2019-01-05","y":5}]
  }

  setModal1Visible(modal1Visible) {
    this.setState({ modal1Visible });
  }


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'restroom/fetch',
      callback:(a)=>{console.log(JSON.stringify(a))},
    });
  }

  playVideo=(item)=>{
    message.success("sdsdsdsds");
    this.setModal1Visible(true)
  }

  render() {
    const {
      restroom: { list:{ data }},
      loading,
      form,
    } = this.props;
    const { getFieldDecorator } = form;


    const content=data===undefined?[]:data.content;
    console.log(`fuck=====${JSON.stringify(content)}`);

    const cardList = content ? (
      <List
        rowKey="restRoomId"
        loading={loading}
        grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
        dataSource={content}
        renderItem={item => (
          <List.Item>
            <Card
              onClick={this.playVideo.bind(this,"sd")}
              className={styles.card}
              // extra={<Button>asds</Button>}
              hoverable
              cover={<img alt={item.restRoomName} src="https://ss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/map/pic/item/a9d3fd1f4134970a4f3e0c1398cad1c8a7865db8.jpg" />}
              // cover={
              //   <video src="http://www.w3school.com.cn/i/movie.ogg" controls="controls">
              //     your browser does not support the video tag
              //   </video>
              // }
            >
              <Card.Meta title={item.restRoomName}/>
              <div>
                <Trend flag="down">
                  气体指数
                  <span className={styles.trendText}>11%</span>
                </Trend>
                <Trend flag="up" style={{ marginRight: 16,marginTop:-10 }}>
                  客流量:
                  <span className={styles.trendText}>{numeral(12423).format('0,0')}</span>
                </Trend>
              </div>

              <MiniArea line height={55} data={this.state.gasData} />
              <Divider style={{marginTop: "4px"}} />

              <div className={styles.cardItemContent}>
                <span>{`更新时间:${moment("2018-12-20 23:10:34").fromNow()}`}  责任人: 张红艳</span>
                {/*<div className={styles.avatarList}>*/}
                  {/*<span>责任人:</span>*/}
                  {/*<AvatarList size="mini">*/}
                    {/*/!*{item.members.map((member, i) => (*/}
                      {/*<AvatarList.Item*/}
                        {/*key={`${item.id}-avatar-${i}`}*/}
                        {/*src={member.avatar}*/}
                        {/*tips={member.name}*/}
                      {/*/>*/}
                    {/*))}*!/*/}
                  {/*</AvatarList>*/}
                {/*</div>*/}
              </div>
            </Card>
          </List.Item>
        )}
      />
    ) : null;

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <div className={styles.coverCardList}>
        <Modal
          title="20px to Top"
          width="70%"
          footer={null}
          style={{ top: 20,bottom:20 }}
          visible={this.state.modal1Visible}
          onOk={() => this.setModal1Visible(false)}
          onCancel={() => this.setModal1Visible(false)}
        >
          {/*可以用iframe引用海康摄像头的sdk*/}
          {/*<iframe style={{border:0,width:"100%",height:630,}} src="http://www.baidu.com"/>*/}
          <video height="500" width="100%" src="http://www.w3school.com.cn/i/movie.ogg" controls="controls">
            your browser does not support the video tag
          </video>
        </Modal>
        <Card bordered={false}>
          <Form layout="inline">
            <StandardFormRow title="所属区域" block style={{ paddingBottom: 11 }}>
              <FormItem>
                {getFieldDecorator('category')(
                  <TagSelect expandable value={['cat1', 'cat2', 'cat3', 'cat4', 'cat5', 'cat6']}>
                    <TagSelect.Option value="cat1">海曙区</TagSelect.Option>
                    <TagSelect.Option value="cat2">鄞州区</TagSelect.Option>
                    <TagSelect.Option value="cat3">江北区</TagSelect.Option>
                    <TagSelect.Option value="cat4">镇海区</TagSelect.Option>
                    <TagSelect.Option value="cat5">北仑区</TagSelect.Option>
                    <TagSelect.Option value="cat6">奉化区</TagSelect.Option>
                  </TagSelect>
                )}
              </FormItem>
            </StandardFormRow>
            <StandardFormRow title="其它选项" grid last>
              <Row gutter={16}>
                <Col lg={8} md={10} sm={10} xs={24}>
                  <FormItem {...formItemLayout} label="状态">
                    {getFieldDecorator('author', {})(
                      <Select placeholder="不限" style={{ maxWidth: 200, width: '100%' }}>
                        <Option value="2">不限</Option>
                        <Option value="1">开放</Option>
                        <Option value="0">关闭</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </StandardFormRow>
          </Form>
        </Card>
        <div className={styles.cardList}>{cardList}</div>
      </div>
    );
  }
}

export default CoverCardList;
