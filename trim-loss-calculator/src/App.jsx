import React, { useState } from "react";
import { useTable, usePagination } from "react-table";
import { CheckCircleIcon, CalculatorIcon } from "@heroicons/react/24/outline";
import "./index.css";
import { calculateTrimLoss } from "./trimLossCalculator";
import MaterialTable from "./RawMaterialTable";


function App() {
  const [cutParts, setCutParts] = useState("4.5, 8, 28, 32, 36.5, 43.5, 45.5, 46.5, 49, 54.5");
  const [cutModal, setCutModal] = useState("200");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10); // Varsayılan sayfa başına veri sayısı
  const [pageInput, setPageInput] = useState(1); // Sayfa numarası girişi
  const [selectedMaterial, setSelectedMaterial] = useState(null); // Seçilen materyal
  const [isButtonClicked, setIsButtonClicked] = useState(false); // Buton tıklanma kontrolü
  const [showTable, setShowTable] = useState(false); // Tabloyu açıp kapama kontrolü


  // Raw Material verileri
  const materialData = {
    material1: [
      { orderLength: 1, patternNumber: 35, rawMaterial: 2 },
      { orderLength: 2, patternNumber: 29, rawMaterial: 2 },
      { orderLength: 2, patternNumber: 32, rawMaterial: 2 },
      { orderLength: 2, patternNumber: 34, rawMaterial: 2 },
      { orderLength: 3, patternNumber: 25, rawMaterial: 2 },
      { orderLength: 4, patternNumber: 25, rawMaterial: 1 },
      { orderLength: 5, patternNumber: 30, rawMaterial: 2 },
      { orderLength: 6, patternNumber: 31, rawMaterial: 2 },
      { orderLength: 7, patternNumber: 26, rawMaterial: 1 },
    ],
    material2: [
      { orderLength: 1, patternNumber: 2, rawMaterial: 2 },
      { orderLength: 2, patternNumber: 4, rawMaterial: 1 },
      { orderLength: 4, patternNumber: 2, rawMaterial: 2 },
      { orderLength: 5, patternNumber: 1, rawMaterial: 2 },
      { orderLength: 6, patternNumber: 5, rawMaterial: 2 },
      { orderLength: 7, patternNumber: 3, rawMaterial: 6 },
    ],
    material3: [
      { orderLength: 1, patternNumber: 402, rawMaterial: 32 },
      { orderLength: 2, patternNumber: 333, rawMaterial: 2 },
      { orderLength: 3, patternNumber: 358, rawMaterial: 6 },
      { orderLength: 4, patternNumber: 418, rawMaterial: 2 },
      { orderLength: 5, patternNumber: 404, rawMaterial: 1 },
      { orderLength: 6, patternNumber: 346, rawMaterial: 2 },
      { orderLength: 7, patternNumber: 481, rawMaterial: 1 },
      { orderLength: 8, patternNumber: 32, rawMaterial: 1 },
      { orderLength: 9, patternNumber: 311, rawMaterial: 2 },
      { orderLength: 10, patternNumber: 391, rawMaterial: 1 },
      { orderLength: 10, patternNumber: 450, rawMaterial: 2 },
    ],
  };

  const materialMapping = {
    material1: [8, 23.5, 24, 36, 41, 42.5, 54.5],
    material2: [52.5, 57, 62.5, 67, 77.5, 81, 82],
    material3: [4.5, 8, 28, 32, 36.5, 43.5, 45.5, 46.5, 49, 54.5],
  };

  // Tabloyu gösterme işlemi
  const handleShowTables = () => {
    const cutPartsArray = cutParts.split(",").map((val) => parseFloat(val.trim()));

    // Girilen `cutParts` değerine uygun olan materyali bul
    const matchedMaterial = Object.keys(materialMapping).find((key) =>
      cutPartsArray.every((part) => materialMapping[key].includes(part)) // Tüm parçaların eşleşmesi şartı
    );

    if (matchedMaterial) {
      setSelectedMaterial({
        title: `Material (${materialMapping[matchedMaterial].join(", ")})`,
        data: materialData[matchedMaterial],
      });
    } else {
      setSelectedMaterial(null);
    }
    setShowTable(!showTable); // Tabloyu açıp kapama işlemi
    setIsButtonClicked(true); // Butonun tıklandığını belirt
  };

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        const partsArray = cutParts.split(",").map((val) => parseFloat(val.trim()));
        const modalArray = cutModal.split(",").map((val) => parseFloat(val.trim()));
        console.log("Parts Array:", partsArray);
        console.log("Modal Array:", modalArray);

        if (partsArray.length === 0 || modalArray.length === 0) {
          throw new Error("Invalid input. Please provide valid numbers.");
        }

        const calculationResults = calculateTrimLoss(partsArray, modalArray);
        console.log("Calculation Results:", calculationResults);

        setResults(calculationResults);
      } catch (error) {
        console.error("Error calculating trim loss:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 2000);
  };


  const columns = React.useMemo(
    () => [
      { Header: "Index", accessor: "index" },
      { Header: "Trim", accessor: "trim" },
      { Header: "Modal", accessor: "modal" },
      { Header: "Amounts", accessor: "amounts" },
    ],
    []
  );

  const data = React.useMemo(
    () =>
      results && results.length > 0
        ? results.map((result) => ({
          index: result.index,
          trim: result.trim,
          modal: result.modal,
          amounts: Object.entries(result.counts)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", "),
        }))
        : [],
    [results]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    gotoPage,
    setPageSize: setPageSizeReactTable,
    pageOptions,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize },
    },
    usePagination
  );

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    setPageSizeReactTable(newSize);
  };

  const handlePageInput = (e) => {
    const newPage = parseInt(e.target.value, 10);
    setPageInput(newPage);
    if (newPage > 0 && newPage <= pageOptions.length) {
      gotoPage(newPage - 1);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: "url('/mobilya.webp')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-5xl bg-white bg-opacity-90 rounded-lg shadow-lg p-6">
        <div className="flex justify-center mb-6">
          <img src="/ergulLogo.png" alt="Ergül Mobilya" className="h-32 w-auto" />
        </div>
        <h1 className="text-4xl font-bold text-center text-bordo mb-6 flex items-center justify-center gap-2">
          <CalculatorIcon className="h-8 w-8 text-bordo-dark" />
          Trim Loss Calculator
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cut Parts</label>
            <input
              type="text"
              value={cutParts}
              onChange={(e) => setCutParts(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-bordo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cut Modal</label>
            <input
              type="text"
              value={cutModal}
              onChange={(e) => setCutModal(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-bordo"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">

          <button
            onClick={handleCalculate}
            className={`w-full bg-bordo text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-bordo-dark"
              }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Calculating...
              </div>
            ) : (
              <>
                <CheckCircleIcon className="h-5 w-5" />
                Calculate
              </>
            )}
          </button>
          <button
            onClick={handleShowTables}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            {showTable ? "Hide Relevant Raw Material Table" : "Show Relevant Raw Material Table"}
          </button>
        </div>


        {showTable && selectedMaterial && (
          <MaterialTable title={"Selected Raw Material Pattern Table"} data={selectedMaterial.data} />
        )}

        {!showTable && isButtonClicked && !selectedMaterial && (
          <p className="text-center text-red-500 mt-4">
            No matching material found for the given cut parts.
          </p>
        )}



        <div className="mt-8">
          {results.length > 0 && !isLoading ? (
            <div className="overflow-x-auto">
              <table
                {...getTableProps()}
                className="table-auto w-full border-collapse border border-gray-200"
              >
                <thead className="bg-bordo text-white">
                  {headerGroups.map((headerGroup, i) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={`header-${i}`}>
                      {headerGroup.headers.map((column, j) => (
                        <th
                          {...column.getHeaderProps()}
                          key={`header-${i}-${j}`}
                          className="border border-gray-300 px-4 py-2 text-left"
                        >
                          {column.render("Header")}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row, i) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} key={`row-${i}`} className="even:bg-gray-50 odd:bg-white">
                        {row.cells.map((cell, j) => (
                          <td
                            {...cell.getCellProps()}
                            key={`cell-${i}-${j}`}
                            className="border border-gray-300 px-4 py-2"
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <label htmlFor="pageSize" className="text-sm">
                    Rows per page:
                  </label>
                  <select
                    id="pageSize"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="border border-gray-300 rounded-lg px-2 py-1"
                  >
                    {[5, 10, 20, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={previousPage}
                    disabled={!canPreviousPage}
                    className="bg-bordo text-white px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <input
                    type="number"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    onBlur={() => handlePageInput({ target: { value: pageInput } })}
                    className="w-16 text-center border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={nextPage}
                    disabled={!canNextPage}
                    className="bg-bordo text-white px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>

                <span>
                  Page {pageIndex + 1} of {pageOptions.length}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">No results to display. Please calculate first.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;