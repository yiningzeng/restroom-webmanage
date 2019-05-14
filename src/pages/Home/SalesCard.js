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
const { Line } = Guide;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;


const cols = {
  show_time: {alias: '时间',},
  number: {alias: '人数',},
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
                      {(salesData !==undefined) && (
                        <Chart height={280} data={salesData} scale={cols} forceFit>
                          <Axis name="show_time" title={{ offset: 38 }} label={{
                            autoRotate: false,
                            formatter: val => {
                              if(val.includes(':30') || val.includes(':00')) return `${val}`
                            },

                          }}  />
                          <Axis name="number" title={{ offset: 38 }} />
                          <Tooltip
                            crosshairs={{
                              type: "y"
                            }}
                          />
                          <Geom type="interval" position="show_time*number" />
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
                      {(salesData !==undefined) && (
                        <Chart height={280} data={salesData} scale={cols} forceFit>
                          <Axis name="show_time" title={{ offset: 38 }} label={{
                            autoRotate: false,
                            formatter: val => {
                              if(val.includes(':30') || val.includes(':00')) return `${val}`
                            },

                          }}  />
                          <Axis name="number" title={{ offset: 38 }} />
                          <Tooltip
                            crosshairs={{
                              type: "y"
                            }}
                          />
                          <Geom type="interval" position="show_time*number" />
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
                      {(salesData !==undefined) && (<Chart height={280} data={salesData} scale={cols} forceFit>
                        <Axis name="show_time" title={{ offset: 38 }} label={{
                          autoRotate: false,
                          formatter: val => {
                            if(val.includes(':30') || val.includes(':00')) return `${val}`
                          },

                        }}  />
                        <Axis name="number" title={{ offset: 38 }} />
                        <Tooltip
                          crosshairs={{
                            type: "y"
                          }}
                        />
                        <Geom type="interval" position="show_time*number" />
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
                      {(salesData !==undefined) && (<Chart height={280} data={salesData} scale={cols} forceFit>
                        <Axis name="show_time" title={{ offset: 38 }} label={{
                          autoRotate: false,
                          formatter: val => {
                            if(val.includes(':30') || val.includes(':00')) return `${val}`
                          },

                        }}  />
                        <Axis name="number" title={{ offset: 38 }} />
                        <Tooltip
                          crosshairs={{
                            type: "y"
                          }}
                        />
                        <Geom type="interval" position="show_time*number" />
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
                      {(salesData !==undefined) && (<Chart height={280} data={salesData} scale={cols} forceFit>
                        <Axis name="show_time" title={{ offset: 38 }} label={{
                          autoRotate: false,
                          formatter: val => {
                            if(val.includes(':30') || val.includes(':00')) return `${val}`
                          },

                        }}  />
                        <Axis name="number" title={{ offset: 38 }} />
                        <Tooltip
                          crosshairs={{
                            type: "y"
                          }}
                        />
                        <Geom type="interval" position="show_time*number" />
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
                      {(salesData !==undefined) && (<Chart height={280} data={salesData} scale={cols} forceFit>
                        <Axis name="show_time" title={{ offset: 38 }} label={{
                          autoRotate: false,
                          formatter: val => {
                            if(val.includes(':30') || val.includes(':00')) return `${val}`
                          },

                        }}  />
                        <Axis name="number" title={{ offset: 38 }} />
                        <Tooltip
                          crosshairs={{
                            type: "y"
                          }}
                        />
                        <Geom type="interval" position="show_time*number" />
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
                      {(salesData !==undefined) && (<Chart height={280} data={salesData} scale={cols} forceFit>
                        <Axis name="show_time" title={{ offset: 38 }} label={{
                          autoRotate: false,
                          formatter: val => {
                            if(val.includes(':30') || val.includes(':00')) return `${val}`
                          },

                        }}  />
                        <Axis name="number" title={{ offset: 38 }} />
                        <Tooltip
                          crosshairs={{
                            type: "y"
                          }}
                        />
                        <Geom type="interval" position="show_time*number" />
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
                      {(salesData !==undefined) && (<Chart height={280} data={salesData} scale={cols} forceFit>
                        <Axis name="show_time" title={{ offset: 38 }} label={{
                          autoRotate: false,
                          formatter: val => {
                            if(val.includes(':30') || val.includes(':00')) return `${val}`
                          },

                        }}  />
                        <Axis name="number" title={{ offset: 38 }} />
                        <Tooltip
                          crosshairs={{
                            type: "y"
                          }}
                        />
                        <Geom type="interval" position="show_time*number" />
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
                  {(salesData !==undefined) && (<Chart height={280} data={salesData} scale={cols} forceFit>
                    <Axis name="show_time" title={{ offset: 38 }} label={{
                      autoRotate: false,
                      formatter: val => {
                        if(val.includes(':30') || val.includes(':00')) return `${val}`
                      },

                    }}  />
                    <Axis name="number" title={{ offset: 38 }} />
                    <Tooltip
                      crosshairs={{
                        type: "y"
                      }}
                    />
                    <Geom type="interval" position="show_time*number" />
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
