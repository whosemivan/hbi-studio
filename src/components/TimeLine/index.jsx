import React, { useState } from 'react';
import { Tooltip } from 'antd';
import './style.css';

const TimeLine = ({ data }) => {
    const now = new Date();
    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, now.getHours() + 1);

    // const timelineDates = unique()

    const hours = [];

    for (let i = 0; i < 24; i++) {
        const date = new Date(startTime.getTime() + (i * 60 * 60 * 1000));
        hours.push({hour: date.getHours(), date: date.getDate()});
    }

    return (
        <div className='timeline'>
            <table className='timeline__table'>
                <tr className='timeline__tr'>
                    <th className='timeline__td timeline__td--title timeline__th'>Process title</th>
                    {
                        hours.map((item, index) => (
                            <th key={index} className='timeline__td timeline__td--title'>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                <span>{item.hour}</span>
                                <span className='timeline__date'>{item.date}</span>
                                </div>
                            </th>
                        ))
                    }
                </tr>

                {
                    data.sort((a, b) => new Date(a.start) - new Date(b.start)).map((item) => (
                        <tr key={item.type} className='timeline__tr'>
                            <th className='timeline__td timeline__th'>
                                {item.type}
                            </th>
                            {
                                hours.map((time) => {
                                    const currentHour = new Date(item.start).getHours();
                                    const currentDate = new Date(item.start).getDate();
                                    const currentMinute = new Date(item.start).getMinutes();

                                    const widthPx = 33;
                                    const minutes = 60;
                                    const pxInOneMinute = widthPx / minutes;

                                    if (currentHour === time.hour && currentDate === time.date) {
                                        return (
                                            <td key={time} className='timeline__td'>
                                                <Tooltip title={
                                                    Object.entries(item).map(([key, value], index) => {
                                                        return (<p key={index} className='table-block__text'><span className='table-block__popup--bold'>{key}: </span>{value}</p>)
                                                    })
                                                } 
                                                color={item.state === 'failed' ? '#ff7875' : '#00657f'}
                                                placement="topLeft"
                                                >
                                                    <div className='timeline__event'
                                                        style={{
                                                            width: pxInOneMinute * item.value,
                                                            left: pxInOneMinute * currentMinute,
                                                            backgroundColor: item.state === 'failed' ? '#ff7875' : '#00657f'
                                                        }}
                                                    ></div>
                                                </Tooltip>
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
        </div>
    );
};


export default TimeLine;
