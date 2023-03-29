import React, { useState } from 'react';
import { Card } from 'antd';
import './style.css';
import { CloseOutlined } from '@ant-design/icons';

const TimeLine = ({ data }) => {
    const [isPopup, setPopup] = useState(false);
    const [processInfo, setProcessInfo] = useState({});

    const now = new Date();
    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, now.getHours());

    const hours = [];

    for (let i = 0; i < 24; i++) {
        const hour = new Date(startTime.getTime() + (i * 60 * 60 * 1000));
        hours.push(hour.getHours());
    }

    return (
        <div className='timeline'>
            <table className='timeline__table'>
                <tr className='timeline__tr'>
                    <th className='timeline__td timeline__th'>Process title</th>
                    {
                        hours.map((item, index) => (
                            <th key={index} className='timeline__td timeline__th'>{item}</th>
                        ))
                    }
                </tr>

                {
                    data.map((item) => (
                        <tr key={item.type} className='timeline__tr'>
                            <th className='timeline__td timeline__th'>
                                {item.type}
                            </th>
                            {
                                hours.map((time) => {
                                    const currentHour = new Date(item.start).getHours();
                                    const currentMinute = new Date(item.start).getMinutes();

                                    const widthPx = 33;
                                    const minutes = 60;
                                    const pxInOneMinute = widthPx / minutes;

                                    if (currentHour === time) {
                                        return (
                                            <td key={time} className='timeline__td'>
                                                <div className='timeline__event'
                                                    style={{
                                                        width: pxInOneMinute * item.value,
                                                        left: pxInOneMinute * currentMinute,
                                                        backgroundColor: item.state === 'failed' ? '#F4AAAA' : '#00657f'
                                                    }}
                                                    onMouseUp={() => {
                                                        setPopup(true);
                                                        setProcessInfo(item);
                                                    }}
                                                ></div>
                                            </td>
                                        )
                                    } else {
                                        return <td key={time} className='timeline__td'>&nbsp;</td>
                                    }

                                })
                            }

                        </tr>
                    ))
                }
            </table>
            {isPopup && (
                <Card className='timeline__popup'>
                    <button className='table-block__close-btn' onClick={() => {
                         setPopup(false);
                         setProcessInfo({});
                    }}>
                        <CloseOutlined />
                    </button>
                    {
                        Object.entries(processInfo).map(([key, value], index) => {
                            return (<p key={index} className='table-block__text'><span className='table-block__popup--bold'>{key}: </span>{value}</p>)
                        })
                    }
                </Card>
            )
            }
        </div>
    );
};


export default TimeLine;
