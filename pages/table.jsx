import React from 'react';

function Table({ theadData, tbodyData }) {
    return (
        <table id='table'>
            <thead>
                <tr>
                    {theadData.map(heading => {
                        return <th key={heading+Date.now}>{heading}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {tbodyData.map((row, index) => {
                    return <tr key={index+Date.now}>
                        {theadData.map((key, index) => {
                            return <td key={row[key]}>{row[key]}</td>
                        })}
                    </tr>;
                })}
            </tbody>
        </table>
    );
}

export default Table