import React, { useRef, useState, useEffect } from 'react';
import './style.css';
import { Button, Input, Space, Table, Card, message, Tag } from 'antd';
import Api from '../../api';
import { SearchOutlined, ReloadOutlined, CloseOutlined } from '@ant-design/icons';


const RefAcTable = () => {
    // state of requests
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);


    // data messages
    const [messageApi, contextHolder] = message.useMessage();
    
    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'RefAc updated',
        });
    };
    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'Something went wrong ):',
        });
    };

    // api
    const api = new Api();

    const fetchData = () => {
        setLoading(true);
        api.getRefAc()
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data) {
                    setData(data);
                    setLoading(false);
                    success();
                } else {
                    error();
                }
            })
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: 'BK_SourceMediumCode',
            dataIndex: 'BK_SourceMediumCode',
            key: 'BK_SourceMediumCode'
        },
        {
            title: 'startDate',
            dataIndex: 'startDate',
            key: 'startDate',
            sorter: (a, b) => {
                return new Date(a.startDate) - new Date(b.startDate)
            },
        },
        {
            title: 'endDate',
            dataIndex: 'endDate',
            key: 'endDate',
            sorter: (a, b) => {
                return new Date(a.endDate) - new Date(b.endDate)
            },
        },
        {
            title: 'acRate',
            dataIndex: 'acRate',
            key: 'acRate',
            sorter: (a, b) => a.acRate - b.acRate
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
      };

    return (
        <div className='table-block'>
            {contextHolder}
            <Button
                type="primary"
                onClick={() => fetchData()}
                icon={<ReloadOutlined />}
                size="middle"
                className='table-block__button'
            >
                Update audits
            </Button>
            <Table onChange={onChange} bordered={true} loading={loading} className='table-block__table' dataSource={data} columns={columns} size="small" />
        </div>
    );
}

export default RefAcTable;
