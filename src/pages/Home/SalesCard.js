import React, { memo } from 'react';
import { Row, Col, Card, Tabs, DatePicker,message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import numeral from 'numeral';
import styles from './Analysis.less';
import { Bar } from '@/components/Charts';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import moment from './Index';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;


const cols = {
  x: {alias: '时间',},
  temperature: {alias: '指数',},
};



const SalesCard = memo(
  ({ rangePickerValue, salesData, handleRangePickerChange, tabOnClick, loading, selectDate }) => (
    <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
      <div className={styles.salesCard}>
        <Tabs
          tabBarExtraContent={
            <div className={styles.salesExtraWrap}>
              <div className={styles.salesExtra}>
                <a onClick={() => selectDate('today')}>
                  <FormattedMessage id="app.analysis.all-day" defaultMessage="All Day" />
                </a>
                <a onClick={() => selectDate('week')}>
                  <FormattedMessage id="app.analysis.all-week" defaultMessage="All Week" />
                </a>
                <a onClick={() => selectDate('month')}>
                  <FormattedMessage id="app.analysis.all-month" defaultMessage="All Month" />
                </a>
              </div>
              <RangePicker
                value={rangePickerValue}
                onChange={handleRangePickerChange}
                style={{ width: 220 }}
              />
            </div>
          }
          onTabClick={(v)=>tabOnClick(v)}
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane
            tab={<FormattedMessage id="app.analysis.1" defaultMessage="Sales" />}
            key="1"
          >
            <Row>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      {(salesData !==undefined) && (<Chart height={210} data={salesData} scale={cols} forceFit>
                        <Legend/>
                        <Axis name="x" title={{ offset: 38 }}/>
                        <Axis
                          title={{ offset: 38 }}
                          name="temperature"
                          label={{
                            formatter: val => `${val}`
                          }}
                        />
                        <Tooltip
                          crosshairs={{
                            type: "y"
                          }}
                        />
                        <Geom
                          type="line"
                          position="x*temperature"
                          size={2}
                          color="city"
                        />
                        <Geom
                          type="point"
                          position="x*temperature"
                          size={4}
                          shape="circle"
                          color="city"
                          style={{
                            stroke: "#fff",
                            lineWidth: 1
                          }}
                        />
                      </Chart>)
                      }
                    </div>
                  </Col>
                </div>
              </Col>

            </Row>
          </TabPane>
          <TabPane
            tab={<FormattedMessage id="app.analysis.2" defaultMessage="Visits" />}
            key="36"
          >
            <Row>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      {(salesData !==undefined) && (<Chart height={210} data={salesData} scale={cols} forceFit>
                        <Legend/>
                        <Axis name="x" title={{ offset: 38 }}/>
                        <Axis
                          title={{ offset: 38 }}
                          name="temperature"
                          label={{
                            formatter: val => `${val}`
                          }}
                        />
                        <Tooltip
                          crosshairs={{
                            type: "y"
                          }}
                        />
                        <Geom
                          type="line"
                          position="x*temperature"
                          size={2}
                          color="city"
                        />
                        <Geom
                          type="point"
                          position="x*temperature"
                          size={4}
                          shape="circle"
                          color="city"
                          style={{
                            stroke: "#fff",
                            lineWidth: 1
                          }}
                        />
                      </Chart>)
                      }
                    </div>
                  </Col>
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane
            tab={<FormattedMessage id="app.analysis.3" defaultMessage="Visits" />}
            key="32"
          >
            <Row>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      {(salesData !==undefined) && (<Chart height={210} data={salesData} scale={cols} forceFit>
                        <Legend/>
                        <Axis name="x" title={{ offset: 38 }}/>
                        <Axis
                          title={{ offset: 38 }}
                          name="temperature"
                          label={{
                            formatter: val => `${val}`
                          }}
                        />
                        <Tooltip
                          crosshairs={{
                            type: "y"
                          }}
                        />
                        <Geom
                          type="line"
                          position="x*temperature"
                          size={2}
                          color="city"
                        />
                        <Geom
                          type="point"
                          position="x*temperature"
                          size={4}
                          shape="circle"
                          color="city"
                          style={{
                            stroke: "#fff",
                            lineWidth: 1
                          }}
                        />
                      </Chart>)
                      }
                    </div>
                  </Col>
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane
            tab={<FormattedMessage id="app.analysis.4" defaultMessage="Visits" />}
            key="33"
          >
            <Row>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      {(salesData !==undefined) && (<Chart height={210} data={salesData} scale={cols} forceFit>
                        <Legend/>
                        <Axis name="x" title={{ offset: 38 }}/>
                        <Axis
                          title={{ offset: 38 }}
                          name="temperature"
                          label={{
                            formatter: val => `${val}`
                          }}
                        />
                        <Tooltip
                          crosshairs={{
                            type: "y"
                          }}
                        />
                        <Geom
                          type="line"
                          position="x*temperature"
                          size={2}
                          color="city"
                        />
                        <Geom
                          type="point"
                          position="x*temperature"
                          size={4}
                          shape="circle"
                          color="city"
                          style={{
                            stroke: "#fff",
                            lineWidth: 1
                          }}
                        />
                      </Chart>)
                      }
                    </div>
                  </Col>
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane
            tab={<FormattedMessage id="app.analysis.5" defaultMessage="Visits" />}
            key="34"
          >
            <Row>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      {(salesData !==undefined) && (<Chart height={210} data={salesData} scale={cols} forceFit>
                        <Legend/>
                        <Axis name="x" title={{ offset: 38 }}/>
                        <Axis
                          title={{ offset: 38 }}
                          name="temperature"
                          label={{
                            formatter: val => `${val}`
                          }}
                        />
                        <Tooltip
                          crosshairs={{
                            type: "y"
                          }}
                        />
                        <Geom
                          type="line"
                          position="x*temperature"
                          size={2}
                          color="city"
                        />
                        <Geom
                          type="point"
                          position="x*temperature"
                          size={4}
                          shape="circle"
                          color="city"
                          style={{
                            stroke: "#fff",
                            lineWidth: 1
                          }}
                        />
                      </Chart>)
                      }
                    </div>
                  </Col>
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane
            tab={<FormattedMessage id="app.analysis.6" defaultMessage="Visits" />}
            key="35"
          >
            <Row>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      {(salesData !==undefined) && (<Chart height={210} data={salesData} scale={cols} forceFit>
                        <Legend/>
                        <Axis name="x" title={{ offset: 38 }}/>
                        <Axis
                          title={{ offset: 38 }}
                          name="temperature"
                          label={{
                            formatter: val => `${val}`
                          }}
                        />
                        <Tooltip
                          crosshairs={{
                            type: "y"
                          }}
                        />
                        <Geom
                          type="line"
                          position="x*temperature"
                          size={2}
                          color="city"
                        />
                        <Geom
                          type="point"
                          position="x*temperature"
                          size={4}
                          shape="circle"
                          color="city"
                          style={{
                            stroke: "#fff",
                            lineWidth: 1
                          }}
                        />
                      </Chart>)
                      }
                    </div>
                  </Col>
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane
            tab={<FormattedMessage id="app.analysis.7" defaultMessage="Visits" />}
            key="37"
          >
            <Row>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      {(salesData !==undefined) && (<Chart height={210} data={salesData} scale={cols} forceFit>
                        <Legend/>
                        <Axis name="x" title={{ offset: 38 }}/>
                        <Axis
                          title={{ offset: 38 }}
                          name="temperature"
                          label={{
                            formatter: val => `${val}`
                          }}
                        />
                        <Tooltip
                          crosshairs={{
                            type: "y"
                          }}
                        />
                        <Geom
                          type="line"
                          position="x*temperature"
                          size={2}
                          color="city"
                        />
                        <Geom
                          type="point"
                          position="x*temperature"
                          size={4}
                          shape="circle"
                          color="city"
                          style={{
                            stroke: "#fff",
                            lineWidth: 1
                          }}
                        />
                      </Chart>)
                      }
                    </div>
                  </Col>
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane
            tab={<FormattedMessage id="app.analysis.8" defaultMessage="Visits" />}
            key="38"
          >
            <Row>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      {(salesData !==undefined) && (<Chart height={210} data={salesData} scale={cols} forceFit>
                        <Legend/>
                        <Axis name="x" title={{ offset: 38 }}/>
                        <Axis
                          title={{ offset: 38 }}
                          name="temperature"
                          label={{
                            formatter: val => `${val}`
                          }}
                        />
                        <Tooltip
                          crosshairs={{
                            type: "y"
                          }}
                        />
                        <Geom
                          type="line"
                          position="x*temperature"
                          size={2}
                          color="city"
                        />
                        <Geom
                          type="point"
                          position="x*temperature"
                          size={4}
                          shape="circle"
                          color="city"
                          style={{
                            stroke: "#fff",
                            lineWidth: 1
                          }}
                        />
                      </Chart>)
                      }
                    </div>
                  </Col>
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane
            tab={<FormattedMessage id="app.analysis.9" defaultMessage="Visits" />}
            key="39"
          >
            <Row>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  {(salesData !==undefined) && (<Chart height={210} data={salesData} scale={cols} forceFit>
                    <Legend/>
                    <Axis name="x" title={{ offset: 38 }}/>
                    <Axis
                      title={{ offset: 38 }}
                      name="temperature"
                      label={{
                        formatter: val => `${val}`
                      }}
                    />
                    <Tooltip
                      crosshairs={{
                        type: "y"
                      }}
                    />
                    <Geom
                      type="line"
                      position="x*temperature"
                      size={2}
                      color="city"
                    />
                    <Geom
                      type="point"
                      position="x*temperature"
                      size={4}
                      shape="circle"
                      color="city"
                      style={{
                        stroke: "#fff",
                        lineWidth: 1
                      }}
                    />
                  </Chart>)
                  }
                </div>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  )
);

export default SalesCard;
