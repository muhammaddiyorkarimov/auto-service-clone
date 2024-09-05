import React from 'react';
import './home.css';  // Import the CSS for styling
import { BiLoader } from 'react-icons/bi';

const TopTableComponent = ({ columns, data, loading, error }) => {
    return (
        <div className="table-container">
            <table className="custom-table">
                {loading ? <BiLoader /> : <>
                    <thead>
                        <tr>
                            {columns?.map((col, index) => (
                                <th key={index}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {error ? <p>{error}</p> : data?.map((row, index) => (
                            <tr key={index}>
                                {Object.values(row).map((value, i) => (
                                    <td key={i}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </>}
            </table>
        </div>
    );
}

export default TopTableComponent;
