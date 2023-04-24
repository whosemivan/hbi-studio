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
        hours.push({ hour: date.getHours(), date: date.getDate() });
    }

    const setTagState = (state) => {
        if (state === 'success') {
            return '#1D8C00';
        } else if (state === 'failed') {
            return 'rgb(255, 120, 117)';
        } else {
            return '#F5CD3E';
        }
    };


    console.log(data);
    const newArr = [];

    data.forEach((el) => {
        const uniqArr = [];

        data.forEach((j) => {
            return el.type === j.type ? uniqArr.push(j) : '';
        });

        newArr.push(uniqArr);
    });

    let set = new Set(newArr.map(JSON.stringify));
    let resultArr = Array.from(set).map(JSON.parse);

    console.log(resultArr);
    console.log(hours);

    return (
        <div className='timeline'>
            <table className='timeline__table'>
                <tr className='timeline__tr'>
                    <th className='timeline__td timeline__td--title timeline__th'>Process title</th>
                    {
                        hours.map((item, index) => (
                            <th key={index} className='timeline__td timeline__td--title'>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span>{item.hour}</span>
                                    <span className='timeline__date'>{item.date}</span>
                                </div>
                            </th>
                        ))
                    }
                </tr>

                {
                    resultArr.map((arr) => {
                        return (
                            <tr>
                                <th className='timeline__td timeline__th'>
                                    {arr[0].type}
                                </th>

                                {
                                    hours.map((time) => {
                                        return <td key={time} className='timeline__td'>
                                            {
                                                arr.map((el) => {

                                                    const currentHour = new Date(el.start).getHours();
                                                    const currentDate = new Date(el.start).getDate();
                                                    const currentMinute = new Date(el.start).getMinutes();

                                                    const widthPx = 33;
                                                    const minutes = 60;
                                                    const pxInOneMinute = widthPx / minutes;

                                                    if (currentHour === time.hour && currentDate === time.date) {
                                                        return (
                                                            <Tooltip title={
                                                                Object.entries(el).map(([key, value], index) => {
                                                                    return (<p key={index} className='table-block__text'><span className='table-block__popup--bold'>{key}: </span>{value}</p>)
                                                                })
                                                            }
                                                                color={setTagState(el.state)}
                                                                placement="topLeft"
                                                            >
                                                                <div className='timeline__event'
                                                                    style={{
                                                                        width: pxInOneMinute * el.value,
                                                                        left: pxInOneMinute * currentMinute,
                                                                        backgroundColor: setTagState(el.state)
                                                                    }}
                                                                ></div>
                                                            </Tooltip>
                                                        )
                                                    }
                                                })
                                            }
                                        </td>
                                    })
                                }
                            </tr>
                        )
                    })
                }
            </table>
        </div>
    );
};


export default TimeLine;
