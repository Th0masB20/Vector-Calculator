const getVal = (id) => Number(getComputedStyle(cssRoot).getPropertyValue(id));

const matrix1 = getChildrenOf(".matrix1"); 
const matrix2 = getChildrenOf(".matrix2");

let row1 = getVal('--row1');
let row2 = getVal('--row2');
let col1 = getVal("--col1");
let col2 = getVal("--col2");

const warning = getElement("#warning");


function clear(parent)
{
    while(parent.firstChild)
    {
        parent.removeChild(parent.lastChild)
    }
}

function changeOperator(){
    clear(getElement("#displayAnswer"));

    let operator = "";
    const operation = getElement("#selectOption").value;
    const operatorElement = getElement("#operator");
    const description = getElement("#description");

    if (operation === "Addition")
    {
        operator = "+";
        description.innerHTML = "Rows and columns for both matrices must be the same";
    }
    else if (operation === "Subtraction")
    {
        operator = "-";
        description.innerHTML = "Rows and columns for both matrices must be the same";
    }
    else if (operation === "Multiplication")
    {
        operator = "*";
        description.innerHTML = "Rows of the first matrix must be the same as the column of second matrix";
    }
    else if (operation === "rref")
    {
        operator = "";
        description.innerHTML = "Enter Real Numbers";
    }
    
    if(operation === 'rref')
    {
        getElement('#secondMatrix').style.display = 'none';
        getElement('#rowColInput2').style.display = 'none';
        operatorElement.style.display = 'none';
    }
    else 
    {
        getElement('#secondMatrix').style.display = 'flex';
        getElement('#rowColInput2').style.display = 'block';
        operatorElement.style.display = 'block';
    }

    operatorElement.innerHTML = operator;
}

function convertInput(input)
{
    let numbers = input.split('/');
    if(numbers.length > 2)
    {
        warning.style.display = "block";
        warning.innerHTML = "Input Fraction is not right";
    }

    if(numbers.length > 1)
    {
        return (Number(numbers[0]) / Number(numbers[1]));
    }
    else
    {
        return Number(input);
    }
}

function getlowestfraction(x0) {
    var eps = 1.0E-9;
    var h, h1, h2, k, k1, k2, a, x;

    x = x0;
    a = Math.floor(x);
    h1 = 1;
    k1 = 0;
    h = a;
    k = 1;

    while (x-a > eps*k*k) {
        x = 1/(x-a);
        a = Math.floor(x);
        h2 = h1; h1 = h;
        k2 = k1; k1 = k;
        h = h2 + a*h1;
        k = k2 + a*k1;
    }

    return h + "/" + k;
}

function returnFormatedAnswer(answer)
{
    if(Number(answer) % 1 !== 0 ){
       return getlowestfraction(answer);
    }
    else 
    {
        return answer;
    }
}

function addition()
{
    const display = getElement("#displayAnswer");
    clear(display);
    
    if (row1 === row2 && col1 === col2)
    {
        warning.style.display = "none";
        for(let i = 0; i < row1*col1; i++)
        {
            let value = convertInput(matrix1[i].value) + convertInput(matrix2[i].value);
            value = returnFormatedAnswer(value);
            createAnswerNode(value, display,row1,col2);
        }
    }
    else
    {
        warning.innerHTML = "Rows and columns of matrices are not the same";
        warning.style.display = "block";
    }
}

function subtraction()
{
    const display = getElement("#displayAnswer");
    clear(display);
    if (row1 === row2 && col1 === col2)
    {
        warning.style.display = "none";
        for(let i = 0; i < row1 * col1; i++)
        {
            let value = convertInput(matrix1[i].value) - convertInput(matrix2[i].value);
            value = returnFormatedAnswer(value);
            createAnswerNode(value, display,row1,col2);
        }
    }
    else
    {
        warning.innerHTML = "Rows and columns of matrices are not the same";
        warning.style.display = "block";
    }
}


function multiplication()
{
    const display = getElement("#displayAnswer");
    const maxColM2 = getVal("--col2");
    const maxRowM2 = getVal("--row2");

    const maxColM1 = getVal("--col1");
    const maxRowM1 = getVal("--row1");

    let matrix1CurCount = 0;
    let valueOfInput = 0;

    clear(display);
    
    if (maxColM1 === maxRowM2)
    {
        warning.style.display = "none";

        while(matrix1CurCount < maxRowM1)
        {
            for(let col = 0; col < maxColM2; col++)
            {
                for(let r = 0; r < maxRowM2; r++)
                {
                    let M2Index = col + (r * maxColM2);
                    let matrix1Col = r + (matrix1CurCount * maxColM1);
                    valueOfInput += convertInput(getChildrenOf(".matrix2")[M2Index].value) * convertInput(getChildrenOf(".matrix1")[matrix1Col].value);
                }
                valueOfInput = returnFormatedAnswer(valueOfInput);
                createAnswerNode(valueOfInput, display, maxRowM1, maxColM2);
                valueOfInput = 0;
            }
            matrix1CurCount++;
        }
    }
    else
    {
        warning.innerHTML = "Rows of matrix one and columns of matrix two are not the same";
        warning.style.display = "block";
    }
}

function createMatrixArray(id,col)
{
    const arr = [];
    let curRow = 0;
    for(let index = 0; index < getChildrenOf(id).length; index++)
    {
        if(index != 0 && index % col == 0)
        {
            curRow++;
        }
        if(!arr[curRow])
        {
            arr.push([]);
        }
        
        arr[curRow].push(convertInput(getChildrenOf(id)[index].value));
    }
    return arr;
}



function rref()
{
    const display = getElement("#displayAnswer");
    clear(display);
    
    let matrix = createMatrixArray('.matrix1',col1);

    if(row1 == 0 || col1 == 0)
    {
        warning.innerHTML = "You must set a dimention to the matrix"
        warning.style.display = 'block';
        return;
    }
    else{
        warning.style.display = 'none';
    }

    for(let mainRow = 0; mainRow < row1; mainRow++)
    {
        let pivotRow = mainRow;
        let pivotColumn = 0;
        while(matrix[pivotRow][pivotColumn] == 0)
        {
            pivotRow++;

            if(pivotRow == row1)
            {
                pivotRow = mainRow;
                pivotColumn++;
                if(pivotColumn == col1)
                {
                    break;
                }
            }
        }

        let temp = matrix[mainRow];
        matrix[mainRow] = matrix[pivotRow];
        matrix[pivotRow] = temp;  // main row is now pivot row

        //divide entire row by pivot point
        let leadVal = matrix[mainRow][pivotColumn];

        for(let i = pivotColumn; i < col1; i++)
        { 
            matrix[mainRow][i] /= leadVal;
        }

        for(let row = 0; row < row1; row++)
        {
            if(row == mainRow)
            {
                continue;
            }

            let multiple = matrix[row][pivotColumn];
            
            for(let col = 0; col < col1; col++)
            {
                matrix[row][col] = matrix[row][col] - (multiple*matrix[mainRow][col]);
            }
        }
    }

    createAnswerNode(matrix,display,row1,col1,true);
}


function createAnswerNode(value, parent, row, col, isArray=false)
{
    cssRoot.style.setProperty("--rowAnswer", row);
    cssRoot.style.setProperty("--colAnswer", col);

    let v = scaleIncrementVal("--rowAnswer");
    cssRoot.style.setProperty("--scaleAnswer", v);

    if(isArray)
    {
        for(let r = 0; r < row; r++)
        {
            for(let c = 0; c < col; c++)
            {
                if(isNaN(value[r][c]))
                {
                    value[r][c] = 0;
                }
                const div = document.createElement("div");
                const text = document.createElement("p");
                text.innerHTML = returnFormatedAnswer(value[r][c]);
                div.appendChild(text);
                parent.appendChild(div);
            }
        }
    }
    else{
        const div = document.createElement("div");
        const text = document.createElement("p");
        text.innerHTML = value;
        div.appendChild(text);
        parent.appendChild(div);
    }
}
function runFunction()
{
    const operation = getElement("#selectOption").value;
    if(operation === "Addition")
    {
        addition();
    }

    if(operation === "Subtraction")
    {
        subtraction();
    }

    if(operation === "Multiplication")
    {
        multiplication();
    }

    if(operation === "rref")
    {
        rref();
    }
}


getElement("button").addEventListener("click",runFunction);
getElement("#selectOption").addEventListener("input", changeOperator);