import React, { useRef, useState, useEffect } from 'react';
import './style.css';
import { Button, Input, Space, Table, Card, message, Tag } from 'antd';
import Api from '../../api';
import { SearchOutlined, ReloadOutlined, CloseOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { unique } from '../../utils';

const AuditsTable = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [auditInfo, setAuditInfo] = useState({});
    const [isPopup, setPopup] = useState(false);
    

    const [messageApi, contextHolder] = message.useMessage();

    let filters = [];
    const [filterValues, setFilterValue] = useState([]);

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Audits updated',
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

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const api = new Api();

    const fetchData = () => {
        setLoading(true);
        api.getAudits(formattedDate)
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setData(data);

                    let arr = [];
                    data.forEach((audit) => {
                        arr.push(audit.obj_group);
                    });
                    const unique = arr.filter((value, index, array) => array.indexOf(value) === index);

                    unique.forEach((el) => {
                        filters.push({
                            text: el, value: el
                        });
                    })
                    setFilterValue(filters)

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

    console.log(filterValues);

    const columns = [
        {
            title: 'AuditDate',
            dataIndex: 'AuditDate',
            key: 'AuditDate',
            sorter: (a, b) => {
                return new Date(a.AuditDate) - new Date(b.AuditDate)
            },
            render: (_, { AuditDate }) => (
                AuditDate.slice(0, 16)
            )
        },
        {
            title: 'obj_group',
            dataIndex: 'obj_group',
            key: 'obj_group',
            filters: filterValues,
            onFilter: (value, record) => record.obj_group.indexOf(value) === 0
        },
        {
            title: 'TableName',
            dataIndex: 'TableName',
            key: 'TableName',
            ...getColumnSearchProps('TableName'),
            render: (_, { TableName }) => (
                TableName.slice(0, 16) + '...'
            )
        },
        {
            title: 'Source',
            dataIndex: 'SourceRows',
            key: 'SourceRows',
            sorter: (a, b) => a.SourceRows - b.SourceRows
        },
        {
            title: 'DWH',
            dataIndex: 'DWHRows',
            key: 'DWHRows',
            sorter: (a, b) => a.DWHRows - b.DWHRows
        },
        {
            title: 'Diff',
            dataIndex: 'DiffRows',
            key: 'DiffRows',
            sorter: (a, b) => a.DiffRows - b.DiffRows,
            render: (_, { DiffRows }) => (
                <>
                    {
                        DiffRows === 0 ? (
                            <Tag color={'green'}>
                                Success
                            </Tag>
                        ) : (
                            <Tag color={'volcano'}>
                                Failed
                            </Tag>
                        )
                    }
                </>
            ),
        },
        {
            title: 'Cnt',
            dataIndex: 'SameResultDaysCnt',
            key: 'SameResultDaysCnt',
            sorter: (a, b) => a.SameResultDaysCnt - b.SameResultDaysCnt
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
            <Table onChange={onChange} bordered={true} loading={loading} className='table-block__table' dataSource={data} columns={columns} size="small" onRow={(record, rowIndex) => {
                return {
                    onClick: event => {
                        setAuditInfo(record);
                        setPopup(true);
                    },
                };
            }} />

            {isPopup && (
                <Card className='table-block__popup'>
                    <button className='table-block__close-btn' onClick={() => {
                        setPopup(false);
                    }}>
                        <CloseOutlined />
                    </button>
                    {
                        Object.entries(auditInfo).map(([key, value], index) => {
                            return (<p key={index} className='table-block__text'><span className='table-block__popup--bold'>{key}: </span>{value}</p>)
                        })
                    }
                </Card>
            )
            }
        </div>
    );
}

export default AuditsTable;
