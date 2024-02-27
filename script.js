// 필요한 변수, 상수 생성하기
// 데이터 생성하기
// 데이터를 이용해서 요소 생성하기 

//14분14초 2번쨰거

const spreadSheetContainer = 
    document.querySelector('#spreadsheet-container');
const exportBtn = 
    document.querySelector('#export-btn');


const ROWS = 10;
const COLS = 10;

const spreadsheet = [];

const alphabets = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"
]


exportBtn.onclick = function(e) {
    console.log(spreadsheet);
    let csv = "";
    for (let i = 0; i < spreadsheet.length; i++){
        if( i=== 0) continue;
        csv +=
            spreadsheet[i]
                .filter((item) => !item.isHeader)
                .map((item) => item.data)
                .join(",") + "\r\n"
    }

    const csvObj = new Blob([csv]);
    const csvUrl = URL.createObjectURL(csvObj);

    const a = document.createElement("a");
    a.href = csvUrl 
    a.download = 'Spreadsheet File.csv';
    a.click();
}

class Cell {
    constructor(isHeader, disabled, data, row, column, rowName, columnName, active = false){
            this.isHeader = isHeader;
            this.disabled = disabled;
            this.data = data;
            this.row = row;
            this.rowName = rowName;
            this.column = column;
            this.columnName = columnName;
            this.active = active;
    }
}



initSpreadsheet();

function initSpreadsheet() {
    for(let i = 0; i < ROWS; i++){
        let spreadsheetRow = []


        for(let j = 0; j < COLS; j++){
            let cellData = '';
            let isHeader = false;
            let disabled = false;

            if(j === 0){
                cellData = i;
                isHeader = true;
                disabled = true;
            }

            if(i === 0){
                cellData = alphabets[j-1];
                isHeader = true;
                disabled = true;
            }
            if(!cellData){
                cellData = "";
            }

            const rowName = i;
            const columnName = alphabets[j-1];

            const cell = new Cell(isHeader, disabled, cellData, i, j, rowName, columnName, false);

            spreadsheetRow.push(cell);
        }
        spreadsheet.push(spreadsheetRow);
    }
    drawSheet();
    console.log(spreadsheet);
}

function createCellEl(cell) {
    const cellEl = document.createElement('input');
    cellEl.className = 'cell';
    cellEl.id = 'cell_' +cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    if(cell.isHeader){
        cellEl.classList.add('header');
    }

    cellEl.onclick = () => handleCellClick(cell);
    cellEl.onchange = (e) => handleOnChange(e.target.value, cell);

    return cellEl;
}

function handleOnChange(data, cell) {
    cell.data = data;
}

function handleCellClick(cell) {    
    clearHeaderActiveStates();
    // console.log('clicked cell', cell);
    // 데이터 가져오기
    const columnHeader = spreadsheet[0][cell.column]; 
    const rowHeader = spreadsheet[cell.row][0];

    // 요소를 가져오기
    const columnHeaderEl =
        getElFromRowCol(columnHeader.row, columnHeader.column);

    const rowHeaderEl =
        getElFromRowCol(rowHeader.row, rowHeader.column);

    columnHeaderEl.classList.add('active');
    rowHeaderEl.classList.add('active');

}

function getElFromRowCol(row, col){
    return document.querySelector("#cell_" + row + col);
}

function clearHeaderActiveStates(){
    const headers = document.querySelectorAll(".header");

    headers.forEach((header) => {
        header.classList.remove('active');
    })
}

function drawSheet() {
    for (let i = 0; i < spreadsheet.length; i++){
        const rowContainerEl = document.createElement('div');
        rowContainerEl.className ="cell-row";

        for(let j = 0; j < spreadsheet[i].length; j++){
            rowContainerEl.append(createCellEl(spreadsheet[i][j]));
        }
        spreadSheetContainer.append(rowContainerEl);
    }    
}