import React, { PureComponent } from 'react';
import {
    Spin
} from 'antd';


class Index extends PureComponent {


    componentDidMount() {
        sessionStorage.setItem("workspace", "1");
    }


    render() {
        return (
          <div>
            <Spin tip="载入中..." size="large" />
          </div>
        );
    }
}

export default Index;
