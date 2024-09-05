import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BiLoader } from 'react-icons/bi';
import useFetch from './../../hooks/useFetch';
import Statistics from '../../services/landing/statistics';

function ActiveReports() {
    const { data: activeReports, loading, error } = useFetch(Statistics.getActiveReports);
    
    function formatNumberWithCommas(number) {
        return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      }    

    const transformedData = activeReports
        ? [
            { name: "Янв", profit: activeReports.jan },
            { name: "Фев", profit: activeReports.feb },
            { name: "Март", profit: activeReports.mar },
            { name: "Апр", profit: activeReports.apr },
            { name: "Май", profit: activeReports.may },
            { name: "Июн", profit: activeReports.jun },
            { name: "Июл", profit: activeReports.jul },
            { name: "Авг", profit: activeReports.aug },
            { name: "Сен", profit: activeReports.sep },
            { name: "Окт", profit: activeReports.oct },
            { name: "Ноя", profit: activeReports.nov },
            { name: "Дек", profit: activeReports.dec },
        ]
        : [];

    return (
        <div className='active-reports-wrapper'>
            <div className="title">Ежемесячный отчет о продажах</div>
            {loading ? (
                <div className="loader-wrapper">
                    <BiLoader className="loader-icon" />
                </div>
            ) : (
                <ResponsiveContainer width='100%' height={170}>
                    <AreaChart
                        className='active-reports'
                        data={transformedData}
                        margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                            type="monotone" 
                            dataKey="profit" 
                            stroke="#8884d8" 
                            fillOpacity={1} 
                            fill="url(#colorUv)" 
                            isAnimationActive={!loading}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

export default ActiveReports;
