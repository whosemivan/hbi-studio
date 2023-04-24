import React, { useRef, useState, useEffect } from 'react';
import './style.css';
import { Button, Input, Space, Table, message, Tag } from 'antd';
import Api from '../../api';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Bar } from '@ant-design/plots';

import TimeLine from '../TimeLine';

const Jobs = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const chartData = [];
    const [chartValues, setChartValues] = useState([]);

    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Dag_run updated',
        });
    };
    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'Something went wrong ):',
        });
    };

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            clearFilters && handleReset(clearFilters);
                            handleSearch(selectedKeys, confirm, dataIndex);
                        }}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const api = new Api();

    const fetchData = () => {
        setLoading(true);
        api.getDagrun()
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setData(data);
                    setLoading(false);

                    data.forEach((item) => {
                        chartData.push({
                            type: item.dag_id,
                            value: item.duration_min,
                            state: item.state,
                            start: item.start_date,
                            end: item.end_date
                        });
                    });

                    setChartValues(chartData);

                    success();
                } else {
                    error();
                }
            })
    };

    useEffect(() => {
        fetchData();
    }, []);

    const setTagState = (state) => {
        if (state === 'success') {
            return (
                <Tag color={'#1D8C00'}>
                    Success
                </Tag>
            );
        } else if (state === 'failed') {
            return (
                <Tag color={'rgb(255, 120, 117)'}>
                    Failed
                </Tag>
            );
        } else {
            return (
                <Tag color={'#F5CD3E'}>
                    Running
                </Tag>
            );
        }
    };

    const columns = [
        {
            title: 'dag_id',
            dataIndex: 'dag_id',
            key: 'dag_id',
            ...getColumnSearchProps('dag_id'),
            render: (_, { dag_id }) => (
                dag_id.slice(0, 16) + '...'
            )
        },
        {
            title: 'startDate',
            dataIndex: 'start_date',
            key: 'start_date',
            sorter: (a, b) => {
                return new Date(a.start_date) - new Date(b.start_date)
            }
        },
        {
            title: 'endDate',
            dataIndex: 'end_date',
            key: 'end_date',
            sorter: (a, b) => {
                return new Date(a.end_date) - new Date(b.end_date)
            }
        },

        {
            title: 'dur(min)',
            dataIndex: 'duration_min',
            key: 'duration_min',
            sorter: (a, b) => a.duration_min - b.duration_min
        },
        {
            title: 'state',
            dataIndex: 'state',
            key: 'state',
            // sort by length of two strings with values = failed and success, temporary solution
            sorter: (a, b) => a.state.length - b.state.length,
            defaultSortOrder: 'ascend',
            render: (_, { state }) => (
                <>
                    {
                       setTagState(state)
                    }
                </>
            ),
        }
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };


    // Chart

    const paletteSemanticRed = '#ff7875';
    const brandColor = '#1D8C00';
    const runningColor = '#F5CD3E';

    const config = {
        data: chartValues,
        xField: 'value',
        yField: 'type',
        seriesField: 'state',
        color: ({ state }) => {

            if (state === 'failed') {
                return paletteSemanticRed;
            };

            if (state === 'running') {
                return runningColor;
            };

            return brandColor;
        },
        legend: {
            position: 'bottom',
        },
        yAxis: false
    };


    return (
        <>
            <div className='main'>
                <div className='table-block'>
                    {contextHolder}
                    <Button
                        type="primary"
                        onClick={() => fetchData()}
                        icon={<ReloadOutlined />}
                        size="middle"
                        className='table-block__button'
                    >
                        Update
                    </Button>
                    <Table pagination={{ defaultPageSize: 20 }} onChange={onChange} bordered={true} loading={loading} className='table-block__table' dataSource={data} columns={columns} size="small" rowKey={() => {
                        return Math.floor((1 + Math.random()) * 0x10000)
                            .toString(16)
                            .substring(1);
                    }} />
                </div>

                <div className='chart-block'>
                    <Bar {...config} />
                </div>
            </div>

            <TimeLine data={chartValues} />
        </>
    );
}

export default Jobs;
