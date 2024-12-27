import React from "react";

const MaterialTable = ({ title, data }) => {
    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold text-center mb-4">{title}</h3>
            <table className="table-auto w-full border-collapse border border-gray-200">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Order Length</th>
                        <th className="border border-gray-300 px-4 py-2">Pattern Number</th>
                        <th className="border border-gray-300 px-4 py-2">Cut Count</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index} className="even:bg-gray-50 odd:bg-white">
                            <td className="border border-gray-300 px-4 py-2">{row.orderLength}</td>
                            <td className="border border-gray-300 px-4 py-2">{row.patternNumber}</td>
                            <td className="border border-gray-300 px-4 py-2">{row.rawMaterial}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MaterialTable;