// 필요한 변수, 상수 생성하기
// 데이터 생성하기
// 데이터를 이용해서 요소 생성하기 

//14분14초 2번쨰거

const spreadSheetContainer = 
    document.querySelector('#spreadsheet-container');
const exportBtn = 
    document.querySelector('#export-btn');
const importBtn =
    document.querySelector('#import-btn');

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

importBtn.onclick = function(e){
    // 파일 입력 요소 생성
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.onchange = e => {
        const file = e.target.files[0];
        if(!file) return;

        // FileReader로 파일 읽기
        const reader = new FileReader();
        reader.onload = function(e){
            const text = e.target.result;
            // csv를 배열로 변환
            const data = csvToArray(text);
            console.log(data);

            // 스프레드 시트 데이터 업데이트
            updateSpreadsheet(data);

            // 스프레드시트 다시 그리기
            drawSheet();
        };
        reader.readAsText(file);
    };
    fileInput.click();  // 파일 입력 창 열기
   
}

// CSV 문자열을 2차원 배열로 변환하는 함수
function csvToArray(str, delimiter =","){
    return str.split("\n").map(row => row.split(delimiter));
}

// 스프레드시트 데이터를 업데이트 하는 함수
function updateSpreadsheet(data){
     // 데이터로 스프레드시트 업데이트
     data.forEach((row, rowIndex) => {
        row.forEach((cellData, colIndex) => {
            // 실제 데이터를 삽입할 위치 조정 (1행 1열부터 시작)
            let realRowIndex = rowIndex + 1; // 헤더 행을 고려하여 +1
            let realColIndex = colIndex + 1; // 헤더 열을 고려하여 +1

            // 스프레드시트의 범위를 벗어나지 않는지 확인
            if (realRowIndex < ROWS && realColIndex < COLS) {
                // 기존 Cell 객체에 데이터 할당
                const cell = spreadsheet[realRowIndex][realColIndex];
                cell.data = cellData; // 실제 데이터 삽입
            }
        });
    });
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
    // 스프레드시트 컨테이너 내용 초기화
    spreadSheetContainer.innerHTML = '';
    for (let i = 0; i < spreadsheet.length; i++){
        

        const rowContainerEl = document.createElement('div');
        rowContainerEl.className ="cell-row";

        for(let j = 0; j < spreadsheet[i].length; j++){
            rowContainerEl.append(createCellEl(spreadsheet[i][j]));
        }
        spreadSheetContainer.append(rowContainerEl);
    }    
}