import React, { useState, useEffect } from 'react';
import useFetch from './useFetch';
import Statistics from '../../services/landing/statistics';
import './pieChart.css';
import { Pie, PieChart, Tooltip } from 'recharts';
import { BiLoader, BiPrinter } from 'react-icons/bi'; // Print iconni import qilish

function PieChartC({ startDate, endDate }) {
    const [filteredData, setFilteredData] = useState([]);


    function formatNumberWithCommas(number) {
        return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      }
      
    const { data: pieChartData, loading, error } = useFetch(() =>
        Statistics.pieChart(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')), [startDate, endDate]
    );

    useEffect(() => {
        if (pieChartData) {
            const allZero = Object.values(pieChartData).every(value => value === 0);

            if (allZero) {
                const defaultData = [
                    { name: 'расход отсутствует', users: 100, fill: getRandomColor() },
                ];
                setFilteredData(defaultData);
            } else {
                const chartData = Object.keys(pieChartData).map((key) => ({
                    name: key,
                    users: pieChartData[key],
                    fill: getRandomColor(),
                }));
                setFilteredData(chartData);
            }
        }
    }, [pieChartData]);

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const printContent = `
            <html>
                <head>
                    <style>
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: green;
                            color: white;
                        }
                        td:nth-child(2) {
                            background-color: red;
                            color: white;
                        }
                    </style>
                </head>
                <body>
                    <table>
                        <thead>
                            <tr>
                                <th>категории</th>
                                <th>цена</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredData.map(row => `
                                <tr>
                                    <td>${row.name}</td>
                                    <td>${row.users}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="pie-chart-container">
            <div className="title">Расходы
                <BiPrinter onClick={handlePrint} style={{ cursor: 'pointer', fontSize: '25px', marginLeft: '10px' }} /></div>
            {loading ? <BiLoader /> : error ? <p>{error.message}</p> : (
                <>
                    <PieChart width={400} height={170}>
                        <Pie
                            dataKey="users"
                            isAnimationActive={true}
                            data={filteredData}
                            outerRadius={80}
                            label
                        />
                        <Tooltip />
                    </PieChart>
                </>
            )}
        </div>
    );
}

export default PieChartC;
